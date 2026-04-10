I need you to rewrite `./lint.js` so it becomes a config-driven CLI instead of a single-file hardcoded wrapper.

The implementation must follow these requirements exactly.

## Goal

Turn `lint.js` into a CLI that:

- loads lint configuration from `eslint.config.js` in the current working directory
- accepts zero or one positional pathname argument
- resolves files to lint by recursively walking that pathname
- matches each discovered file against the config array
- deep-merges all matching config objects from right to left
- runs `lintText()` once per matched file using the merged options
- prints grouped lint results to `stderr`
- exits non-zero when any lint error occurs or when CLI/config loading fails

Do not add glob support. `files` and `ignores` entries are plain file or directory pathnames only.

## Existing project context

Please inspect these files before editing:

- `./lint.js`
- `./lib/linter.js`
- `./eslint.config.js`
- `./README.md`

`lintText()` currently expects this shape:

```js
lintText(
    { name: filePath, text: sourceText },
    rules,
    languageOptions
);
```

That means `lint.js` should adapt config objects into:

- `rules`: the merged `rules` object
- `languageOptions`: the merged `languageOptions` object

Any additional supported top-level linter options from the config should be passed through only if `lintText()` can consume them. Do not invent new linter behavior inside `lint.js`. If a config property is only relevant for CLI file selection, keep it in the CLI layer and do not pass it into `lintText()`.

## CLI behavior

### Positional argument handling

- Accept at most one positional CLI argument.
- If more than one positional argument is provided, print a short usage error to `stderr` and exit with code `1`.
- If no positional argument is provided, use the current working directory as the target path.
- If one positional argument is provided, treat it as a pathname relative to the current working directory.
- Resolve the target to an absolute path before processing it.

### Config file handling

- Assume the config file is named `eslint.config.js` and must exist in the current working directory.
- If it does not exist, print a useful error like: `Could not find eslint.config.js in <cwd>` and exit `1`.
- Load it with dynamic `import()`.
- Treat the loaded module as a JavaScript module whose config is the module default export.
- Validate that the default export is an array of configuration objects.
- If import fails or the export shape is invalid, print a useful error to `stderr` and exit `1`.

Use a file URL when importing the config module so absolute filesystem paths work reliably with ESM.

## File discovery

The single pathname argument may point to:

- a single file
- a directory

Behavior:

- If the target path does not exist, print an error to `stderr` and exit `1`.
- If the target path is a file, lint only that file.
- If the target path is a directory, recursively walk it and collect files.
- Do not lint directories directly.

Keep path handling deterministic:

- compare using normalized relative paths
- resolve discovered files relative to the target root used by the CLI
- interpret config path entries relative to the CLI target path, not relative to the config file

Example:

- running `node lint.js src`
- config entry `files: ["nested"]`
- means “match files inside `src/nested`”

When no CLI argument is provided and the target root is the current working directory, config paths are therefore relative to the current working directory.

## Config matching semantics

The config file exports an array of objects.

Each object may include:

- `files`: array of file or directory pathnames to include
- `ignores`: array of file or directory pathnames to exclude
- other linter options such as `rules` and `languageOptions`

No globbing is supported. Every `files` or `ignores` entry is a literal path segment sequence.

### Path matching rules

For every discovered file, compute its path relative to the CLI target root.

An entry in `files` or `ignores` matches when:

- it exactly equals the relative file path, or
- it names an ancestor directory of that relative file path

Examples:

- config entry `src/a.js` matches `src/a.js`
- config entry `src/utils` matches `src/utils/math.js`
- config entry `src/utils/` should behave the same as `src/utils`

Normalize leading `./` and trailing `/` when comparing.

### Global ignores

If a config object contains `ignores` and no other keys, then it is a global ignore object.

Global ignore behavior:

- collect all such `ignores` entries across the config array before matching other config objects
- exclude matching files from every config object
- files excluded by a global ignore should not be linted at all

### Per-object matching

For non-global-ignore objects:

- if `files` is present, the object only applies when the file matches at least one `files` entry
- if `ignores` is present, the object does not apply when the file matches any `ignores` entry
- if `files` is absent, the object applies to any file matched by at least one other non-global-ignore object

That last rule matters. Objects without `files` are not unconditional roots by themselves. They attach to the match set established by objects with `files`, or by the “all files” case if no config object uses `files`.

Implement this explicitly so behavior is predictable:

1. Separate config objects into:
   - global ignore objects
   - regular config objects
2. Determine whether the config array contains any regular object with a `files` property.
3. For each candidate file:
   - drop it immediately if it matches a global ignore
   - evaluate each regular object in array order
   - if an object has `files`, it is eligible only when the file matches one of them
   - if an object has no `files`:
     - it is eligible for all files when no regular config object has `files`
     - otherwise it is eligible only if the file matched at least one other regular config object
   - if an eligible object’s `ignores` matches the file, exclude that object for that file

This produces the set of config objects that apply to a file.

## Merge behavior

If a file matches more than one regular config object, merge them from right to left before linting.

Be precise here:

- clone the matching objects first so the original loaded config is never mutated
- remove CLI-only keys before passing the merged result to the linter:
  - `files`
  - `ignores`
- deep-merge plain objects recursively
- for non-object values, the leftmost value in the final merged result should win because merging happens from right to left
- arrays should be replaced, not concatenated, unless there is an existing project convention proving otherwise

Implementation suggestion:

- start with an empty object
- iterate the matching config objects from the end of the array to the beginning
- deep-merge each object into the accumulator

That gives later config entries lower precedence and earlier config entries higher precedence, which is what “merge from right to left” means here.

After merging:

- `merged.rules` becomes the second argument to `lintText()`
- `merged.languageOptions ?? {}` becomes the third argument to `lintText()`

If needed, safely ignore unsupported merged top-level properties rather than trying to force them into `lintText()`.

## Lint execution

For each file that survives filtering and has at least one matching regular config object:

1. Read the file as UTF-8.
2. Build the merged config for that file.
3. Call:

```js
lintText(
    { name: absoluteFilePath, text: sourceText },
    merged.rules ?? {},
    merged.languageOptions ?? {}
);
```

If a discovered file matches no regular config objects, skip it silently.

## Output requirements

Lint messages must be grouped by file path and written to `stderr`.

Suggested format:

```text
path/to/file.js
  12:4  error  Unexpected console statement  (no-console)
  18:9  warn   Unexpected TODO comment       (no-warning-comments)
```

Rules:

- emit one file header per file that has messages
- print that file’s messages immediately under it
- severity label mapping:
  - `1 -> warn`
  - `2 -> error`
- use `parse-error` when `ruleId` is null
- if there are no messages for any linted file, produce no output

All diagnostics and CLI/config/runtime errors should go to `stderr`.

## Exit codes

- exit `1` if CLI usage is invalid
- exit `1` if the target path is missing
- exit `1` if `eslint.config.js` is missing
- exit `1` if the config import fails or the export is invalid
- exit `1` if any lint result contains one or more errors
- otherwise exit `0`

Warnings alone should not force a non-zero exit code.

## Recommended structure inside `lint.js`

Keep the script small and explicit. Helper functions inside `lint.js` are fine.

Suggested helpers:

- `parseCliArgv(argv)`
- `loadConfig(cwd)`
- `collectFiles(targetPath)`
- `toRelativeTargetPath(targetRoot, absoluteFilePath)`
- `normalizeConfigPath(pathname)`
- `matchesPathEntry(relativeFilePath, configEntry)`
- `isGlobalIgnoreObject(configObject)`
- `findMatchingConfigs(relativeFilePath, regularConfigs, hasFilesSelectors, globalIgnoreEntries)`
- `deepMergeConfigs(base, incoming)`
- `formatMessages(result)`

Do not create a large abstraction layer unless it clearly simplifies correctness.

## Edge cases to cover

- target path is a single file
- target path is a directory
- default target path is current working directory
- config file missing
- config module throws during import
- config default export is not an array
- config object is not a plain object
- empty config array
- only global ignore objects are present
- `files` path matches a directory prefix
- `ignores` path suppresses one matching object but not another
- global ignore suppresses linting entirely
- multiple matching objects merge correctly
- arrays replace rather than concatenate during deep merge
- file with parse errors still reports grouped output

## Testing expectations

Add or update tests for the CLI behavior. Prefer focused tests around helper behavior if there is already a CLI testing pattern in the repo.

At minimum, cover:

- missing config file
- config import success
- default cwd target
- explicit file target
- explicit directory target
- `files` matching
- per-object `ignores`
- global ignores
- right-to-left deep merge behavior
- grouped stderr output
- exit code `1` on lint errors
- exit code `0` on warnings-only

## Constraints

- Keep the implementation in JavaScript.
- Do not add globbing.
- Do not change `lintText()` semantics unless absolutely required by the new CLI behavior.
- Do not silently fall back to a built-in hardcoded ruleset.
- Do not mutate the imported config objects.

When finished, summarize:

- how config discovery works
- how matching and right-to-left merging works
- how files are selected and ignored
- what tests were added
