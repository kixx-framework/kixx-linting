"use strict";

const CodePath = require("./code-path.js");
const CodePathAnalyzer = require("./code-path-analyzer.js");

if (!Object.getOwnPropertyDescriptor(CodePath.prototype, "currentSegment")) {
	Object.defineProperty(CodePath.prototype, "currentSegment", {
		configurable: true,
		enumerable: false,
		get() {
			return this.internal.currentSegments[0] || null;
		},
	});
}

module.exports = CodePathAnalyzer;
