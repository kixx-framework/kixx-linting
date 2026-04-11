This project is a lightweight JavaScript linter implemented in JavaScript.

See @README.md for project overview and command line development commands for this project.

## Linting

Run linting with:

```bash
node lint.js <pathname>
```

The `<pathname>` argument is optional. If omitted, the CLI uses the current working directory.

`lint.js` always loads `eslint.config.js` from the current working directory.

**Disabling lint rules**

This project supports a small subset of ESLint-style inline disabling comments.

Supported forms:

```js
console.log(value); // eslint-disable-line no-console
console.log(value); /* eslint-disable-line no-console */

// eslint-disable-next-line no-console
console.log(value);

/* eslint-disable-next-line no-console, no-debugger */
console.log(value); debugger;

/* eslint-disable-next-line no-console,
   no-debugger */
console.log(value); debugger;

/* eslint-disable */
console.log(value);
debugger;
/* eslint-enable */

/* eslint-disable no-console, no-debugger */
console.log(value);
debugger;
/* eslint-enable no-console, no-debugger */

/* eslint-disable no-console */
console.log(value);
```

When you are asked to fix lint problems, keep in mind that it is sometimes better to disable a rule with a comment than to overengineer a workaround.

## Code Style

**Arrow functions style:**

When an arrow function body is small and a single statement, prefer to write it on a single line:

```javascript
[1,2,3].map(n => n * 10);
```

When the function body becomes large or contains more than one statement, then use a multiline arrow function body in a block:

```javascript
const isConst = variable.defs.some((def) => {
    return def.type === "Variable" &&
        def.parent &&
        def.parent.kind === "const";
});
```

**Do not use the `process` global in Node.js**

Instead of using the `process` global in Node.js, import it like this:

```javascript
import process from 'node:process';
```
