/**
 * clean.js — a valid JavaScript file that should produce zero lint messages
 * when run against the full rule set.
 */

const MAX_ITEMS = 10;

function processItems(items) {
    const results = [];
    for (const item of items) {
        if (typeof item !== "string") {
            continue;
        }
        results.push(item.trim());
    }
    return results;
}

async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

class DataProcessor {
    #items;

    constructor(items) {
        this.#items = items;
    }

    get count() {
        return this.#items.length;
    }

    set limit(value) {
        if (typeof value !== "number") {
            throw new TypeError("limit must be a number");
        }
        this.#items = this.#items.slice(0, value);
    }

    process() {
        return processItems(this.#items);
    }
}

class ExtendedProcessor extends DataProcessor {
    #label;

    constructor(items, label) {
        super(items);
        this.#label = label;
    }

    get label() {
        return this.#label;
    }

    format() {
        return `${this.#label}: ${this.count}`;
    }
}

function* generateItems(count) {
    for (let i = 0; i < count; i += 1) {
        yield i;
    }
}

function isValid(value) {
    if (value === null || value === undefined) {
        return false;
    }
    return typeof value === "string" || typeof value === "number";
}

const CONSTANTS = Object.freeze({
    DEFAULT: "default",
    MAX: MAX_ITEMS,
});

export {
    DataProcessor,
    ExtendedProcessor,
    CONSTANTS,
    fetchData,
    generateItems,
    isValid,
    processItems,
};
