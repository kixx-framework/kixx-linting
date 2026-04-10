export default [
    {
        files: ["src"],
        rules: {
            "no-warning-comments": ["warn", { terms: ["todo"], location: "anywhere" }],
        },
    },
];
