"use strict";

function noop() {}

module.exports = {
	enabled: false,
	dump: noop,
	dumpState: noop,
	dumpDot: noop,
	makeDotArrows() {
		return "";
	},
};
