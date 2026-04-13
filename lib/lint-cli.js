import fsp from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { lintText } from "./linter.js";

export async function runLintCli(args) {
    const {
        argv = [],
        cwd = process.cwd(),
        stderr = process.stderr,
    } = args ?? {};

    try {
        const { targetPath } = await parseCliArgv(argv, cwd);
        const configObjects = await loadConfig(cwd);
        const discoveredFiles = await collectFiles(targetPath);
        const targetRoot = cwd;
        const globalIgnoreEntries = [];
        const regularConfigs = [];
        const lintResults = [];
        let hasErrors = false;
        let anyHasFiles = false;

        for (const configObject of configObjects) {
            if (isGlobalIgnoreObject(configObject)) {
                for (const entry of configObject.ignores) {
                    globalIgnoreEntries.push(entry);
                }
                continue;
            }

            regularConfigs.push(configObject);
            if (Array.isArray(configObject.files)) {
                anyHasFiles = true;
            }
        }

        for (const filePath of discoveredFiles) {
            const relativePath = toRelativeTargetPath(targetRoot, filePath);
            const matchingConfigs = findMatchingConfigs(
                relativePath,
                regularConfigs,
                anyHasFiles,
                globalIgnoreEntries,
            );
            if (matchingConfigs.length === 0) {
                continue;
            }

            const mergedConfig = mergeMatchingConfigs(matchingConfigs);
            let sourceText;
            try {
                // eslint-disable-next-line no-await-in-loop
                sourceText = await fsp.readFile(filePath, "utf8");
            } catch (error) {
                writeErrorLine(stderr, `Error reading file: ${ filePath } (${ error.message })`);
                hasErrors = true;
                continue;
            }

            const lintResult = lintText(
                { name: filePath, text: sourceText },
                mergedConfig.rules ?? {},
                mergedConfig.languageOptions ?? {},
            );
            if (lintResult.messages.length > 0) {
                lintResults.push(lintResult);
            }
            if (lintResult.errorCount > 0) {
                hasErrors = true;
            }
        }

        if (lintResults.length > 0) {
            writeLintResults(stderr, lintResults);
        }

        return hasErrors ? 1 : 0;
    } catch (error) {
        writeErrorLine(stderr, error.message);
        return 1;
    }
}

export async function parseCliArgv(argv, cwd) {
    if (!Array.isArray(argv)) {
        throw new Error("Invalid argv input. Expected an array.");
    }

    if (argv.length > 1) {
        throw new Error("Expected zero or one positional path argument.");
    }

    const positional = argv[0] ?? ".";
    const targetPath = path.resolve(cwd, positional);

    let targetStats;
    try {
        targetStats = await fsp.stat(targetPath);
    } catch (error) {
        if (error.code === "ENOENT") {
            throw new Error(`Target path does not exist: ${ positional }`, { cause: error });
        }
        throw error;
    }

    if (!targetStats.isFile() && !targetStats.isDirectory()) {
        throw new Error(`Target path must be a file or directory: ${ positional }`);
    }

    return { targetPath };
}

export async function loadConfig(cwd) {
    const configPath = path.resolve(cwd, "eslint.config.js");

    try {
        await fsp.access(configPath);
    } catch (error) {
        if (error.code === "ENOENT") {
            throw new Error(`Missing config file: ${ configPath }`, { cause: error });
        }
        throw error;
    }

    let moduleNamespace;
    try {
        moduleNamespace = await import(pathToFileURL(configPath).href);
    } catch (error) {
        throw new Error(`Failed to import eslint.config.js: ${ error.message }`, { cause: error });
    }

    const config = moduleNamespace.default;
    if (!Array.isArray(config)) {
        throw new Error("eslint.config.js must default-export an array.");
    }

    for (const [ index, configObject ] of config.entries()) {
        if (!isPlainObject(configObject)) {
            throw new Error(`eslint.config.js entry at index ${ index } must be a plain object.`);
        }
    }

    return config;
}

export async function collectFiles(targetPath) {
    const targetStats = await fsp.stat(targetPath);
    if (targetStats.isFile()) {
        return [targetPath];
    }

    if (!targetStats.isDirectory()) {
        return [];
    }

    const files = [];
    await collectFilesFromDirectory(targetPath, files);
    files.sort();
    return files;
}

export function toRelativeTargetPath(targetRoot, absoluteFilePath) {
    const relativePath = path.relative(targetRoot, absoluteFilePath);
    const normalizedPath = relativePath.split(path.sep).join("/");
    const withoutLeadingDot = normalizedPath.replace(/^\.\/+/, "");
    const withoutTrailingSlash = withoutLeadingDot.replace(/\/+$/, "");

    if (withoutTrailingSlash.length === 0) {
        return path.basename(absoluteFilePath);
    }

    return withoutTrailingSlash;
}

export function normalizeConfigPath(configPath) {
    if (typeof configPath !== "string") {
        return "";
    }

    const normalized = configPath.replace(/\\/g, "/");
    const withoutLeadingDot = normalized.replace(/^\.\/+/, "");
    return withoutLeadingDot.replace(/\/+$/, "");
}

export function matchesPathEntry(relativePath, entry) {
    const normalizedPath = normalizeConfigPath(relativePath);
    const normalizedEntry = normalizeConfigPath(entry);

    if (!normalizedEntry) {
        return false;
    }

    return normalizedPath === normalizedEntry
        || normalizedPath.startsWith(`${ normalizedEntry }/`);
}

export function isGlobalIgnoreObject(configObject) {
    if (!isPlainObject(configObject)) {
        return false;
    }

    const keys = Object.keys(configObject);
    return keys.length === 1 && keys[0] === "ignores" && Array.isArray(configObject.ignores);
}

export function findMatchingConfigs(
    relativePath,
    regularConfigs,
    anyHasFiles,
    globalIgnoreEntries,
) {
    for (const ignoreEntry of globalIgnoreEntries) {
        if (matchesPathEntry(relativePath, ignoreEntry)) {
            return [];
        }
    }

    const withFiles = [];
    const withoutFiles = [];

    for (const configObject of regularConfigs) {
        const fileEntries = Array.isArray(configObject.files) ? configObject.files : null;
        const ignoreEntries = Array.isArray(configObject.ignores) ? configObject.ignores : [];

        const ignoredByObject = ignoreEntries.some((entry) => {
            return matchesPathEntry(relativePath, entry);
        });
        if (ignoredByObject) {
            continue;
        }

        if (fileEntries) {
            const matchesFiles = fileEntries.some((entry) => {
                return matchesPathEntry(relativePath, entry);
            });
            if (matchesFiles) {
                withFiles.push(configObject);
            }
            continue;
        }

        withoutFiles.push(configObject);
    }

    if (!anyHasFiles) {
        return withoutFiles;
    }

    if (withFiles.length === 0) {
        return [];
    }

    return withFiles.concat(withoutFiles);
}

export function deepMergeConfigs(base, incoming) {
    const output = cloneConfigValue(base);

    for (const [ key, incomingValue ] of Object.entries(incoming)) {
        if (Array.isArray(incomingValue)) {
            output[key] = incomingValue.map((item) => cloneConfigValue(item));
            continue;
        }

        if (isPlainObject(incomingValue)) {
            const baseValue = isPlainObject(output[key]) ? output[key] : {};
            output[key] = deepMergeConfigs(baseValue, incomingValue);
            continue;
        }

        output[key] = incomingValue;
    }

    return output;
}

function isPlainObject(value) {
    if (!value || typeof value !== "object") {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}

function writeErrorLine(stderr, message) {
    stderr.write(`${ message }\n`);
}

function mergeMatchingConfigs(matchingConfigs) {
    const merged = {};

    for (let index = matchingConfigs.length - 1; index >= 0; index -= 1) {
        const configObject = cloneConfigValue(matchingConfigs[index]);
        delete configObject.files;
        delete configObject.ignores;
        Object.assign(merged, deepMergeConfigs(merged, configObject));
    }

    return merged;
}

function writeLintResults(stderr, lintResults) {
    for (const lintResult of lintResults) {
        stderr.write(`${ lintResult.filePath }\n`);

        for (const message of lintResult.messages) {
            const line = message.line ?? 0;
            const column = message.column ?? 0;
            const severityLabel = message.severity === 1 ? "warn" : "error";
            const ruleLabel = message.ruleId ?? "parse-error";

            stderr.write(
                `  ${ line }:${ column }  ${ severityLabel }  ${ message.message }  (${ ruleLabel })\n`,
            );
        }
    }
}

async function collectFilesFromDirectory(directoryPath, files) {
    const entries = await fsp.readdir(directoryPath);

    for (const entry of entries) {
        const entryPath = path.join(directoryPath, entry);
        const entryStats = await fsp.lstat(entryPath);

        if (entryStats.isSymbolicLink()) {
            continue;
        }

        if (entryStats.isDirectory()) {
            // eslint-disable-next-line no-await-in-loop
            await collectFilesFromDirectory(entryPath, files);
            continue;
        }

        if (entryStats.isFile() && path.extname(entryPath) === ".js") {
            files.push(entryPath);
        }
    }
}

function cloneConfigValue(value) {
    if (Array.isArray(value)) {
        return value.map((item) => cloneConfigValue(item));
    }

    if (isPlainObject(value)) {
        const clonedObject = {};
        for (const [ key, nestedValue ] of Object.entries(value)) {
            clonedObject[key] = cloneConfigValue(nestedValue);
        }
        return clonedObject;
    }

    return value;
}
