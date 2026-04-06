/*
 * Copyright OpenJS Foundation and other contributors, <www.openjsf.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

export default {
	valid: [
		'import os from "os";\nimport fs from "fs";',
		'import { merge } from "lodash-es";',
		'import _, { merge } from "lodash-es";',
		'import * as Foobar from "async";',
		'import "foo"',
		'import os from "os";\nexport { something } from "os";',
		'import * as bar from "os";\nimport { baz } from "os";',
		'import foo, * as bar from "os";\nimport { baz } from "os";',
		'import foo, { bar } from "os";\nimport * as baz from "os";',
		{
			code: 'import os from "os";\nexport { hello } from "hello";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import os from "os";\nexport * from "hello";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import os from "os";\nexport { hello as hi } from "hello";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import os from "os";\nexport default function(){};',
			options: [{ includeExports: true }],
		},
		{
			code: 'import { merge } from "lodash-es";\nexport { merge as lodashMerge }',
			options: [{ includeExports: true }],
		},
		{
			code: 'export { something } from "os";\nexport * as os from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import { something } from "os";\nexport * as os from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import * as os from "os";\nexport { something } from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import os from "os";\nexport * from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'export { something } from "os";\nexport * from "os";',
			options: [{ includeExports: true }],
		},
	],
	invalid: [
		{
			code: 'import "fs";\nimport "fs"',
		},
		{
			code: 'import { merge } from "lodash-es";\nimport { find } from "lodash-es";',
		},
		{
			code: 'import { merge } from "lodash-es";\nimport _ from "lodash-es";',
		},
		{
			code: 'import os from "os";\nimport { something } from "os";\nimport * as foobar from "os";',
		},
		{
			code: 'import * as modns from "lodash-es";\nimport { merge } from "lodash-es";\nimport { baz } from "lodash-es";',
		},
		{
			code: 'export { os } from "os";\nexport { something } from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import os from "os";\nexport { os as foobar } from "os";\nexport { something } from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import os from "os";\nexport { something } from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import os from "os";\nexport * as os from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'export * as os from "os";\nimport os from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import * as modns from "mod";\nexport * as  modns from "mod";',
			options: [{ includeExports: true }],
		},
		{
			code: 'export * from "os";\nexport * from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import "os";\nexport * from "os";',
			options: [{ includeExports: true }],
		},
	],
};
