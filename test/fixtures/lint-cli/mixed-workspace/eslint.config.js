export default [
    { ignores: ["ignored", "src/globally-ignored.js", "notes"] },
    { files: ["src/merged.js"], rules: { "no-console": ["warn"] } },
    { files: ["src"], rules: { "no-console": ["error"] } },
    { files: ["single-file-target.js"], rules: { "no-console": ["error"] } },
    {
        files: ["src"],
        ignores: ["src/ignored-by-object.js"],
        rules: {
            "no-warning-comments": ["warn", { terms: ["todo"], location: "anywhere" }],
        },
    },
];
