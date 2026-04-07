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

import {
    describe,
    assertEqual,
    assertNonEmptyString,
} from '../../deps.js';

import { lintText } from '../../../mod.js';

const valid = [
    // test if '++', '--'
    "for(var i = 0; i < 10; i++){}",
    "for(var i = 0; i <= 10; i++){}",
    "for(var i = 10; i > 0; i--){}",
    "for(var i = 10; i >= 0; i--){}",

    // test if '++', '--' with counter 'i' on the right side of test condition
    "for(var i = 0; 10 > i; i++){}",
    "for(var i = 0; 10 >= i; i++){}",
    "for(var i = 10; 0 < i; i--){}",
    "for(var i = 10; 0 <= i; i--){}",

    /*
     * loops where the condition is statically false from the start (dead code),
     * but the direction is consistent, so the rule does not report them
     */
    "for(var i = 0; i < 0; i++){}",
    "for(var i = 0; 0 > i; i++){}",

    // test if '+=', '-=',
    "for(var i = 0; i < 10; i+=1){}",
    "for(var i = 0; i <= 10; i+=1){}",
    "for(var i = 0; i < 10; i-=-1){}",
    "for(var i = 0; i <= 10; i-=-1){}",
    "for(var i = 10; i > 0; i-=1){}",
    "for(var i = 10; i >= 0; i-=1){}",
    "for(var i = 10; i > 0; i+=-1){}",
    "for(var i = 10; i >= 0; i+=-1){}",
    "for(var i = 0n; i > l; i-=1n){}",
    "for(var i = 0n; i < l; i-=-1n){}",
    "for(var i = MIN; i <= MAX; i+=true){}",
    "for(var i = 0; i < 10; i+=+5e-7){}",
    "for(var i = 0; i < MAX; i -= ~2);",
    "for(var i = 0, n = -1; i < MAX; i += -n);",

    // test if '+=', '-=' with counter 'i' on the right side of test condition
    "for(var i = 0; 10 > i; i+=1){}",

    // test if no update.
    "for(var i = 10; i > 0;){}",
    "for(var i = 10; i >= 0;){}",
    "for(var i = 10; i < 0;){}",
    "for(var i = 10; i <= 0;){}",
    "for(var i = 10; i <= 0; j++){}",
    "for(var i = 10; i <= 0; j--){}",
    "for(var i = 10; i >= 0; j++){}",
    "for(var i = 10; i >= 0; j--){}",
    "for(var i = 10; i >= 0; j += 2){}",
    "for(var i = 10; i >= 0; j -= 2){}",
    "for(var i = 10; i >= 0; i |= 2){}",
    "for(var i = 10; i >= 0; i %= 2){}",
    "for(var i = 0; i < MAX; i += STEP_SIZE);",
    "for(var i = 0; i < MAX; i -= STEP_SIZE);",
    "for(var i = 10; i > 0; i += STEP_SIZE);",
    "for(var i = 10; i >= 0; i += 0);",
    "for(var i = 10n; i >= 0n; i += 0n);",
    "for(var i = 10; i >= 0; i += this.step);",
    "for(var i = 10; i >= 0; i += 'foo');",
    "for(var i = 10; i > 0; i += !foo);",
    "for(var i = MIN; i <= MAX; i -= false);",
    "for(var i = MIN; i <= MAX; i -= 0/0);",

    // other cond-expressions.
    "for(var i = 0; i !== 10; i+=1){}",
    "for(var i = 0; i === 10; i+=1){}",
    "for(var i = 0; i == 10; i+=1){}",
    "for(var i = 0; i != 10; i+=1){}",
];

const invalid = [
    // test if '++', '--'
    "for(var i = 0; i < 10; i--){}",
    "for(var i = 0; i <= 10; i--){}",
    "for(var i = 10; i > 10; i++){}",
    "for(var i = 10; i >= 0; i++){}",

    // test if '++', '--' with counter 'i' on the right side of test condition
    "for(var i = 0; 10 > i; i--){}",
    "for(var i = 0; 10 >= i; i--){}",
    "for(var i = 10; 10 < i; i++){}",
    "for(var i = 10; 0 <= i; i++){}",

    // test if '+=', '-='
    "for(var i = 0; i < 10; i-=1){}",
    "for(var i = 0; i <= 10; i-=1){}",
    "for(var i = 10; i > 10; i+=1){}",
    "for(var i = 10; i >= 0; i+=1){}",
    "for(var i = 0; i < 10; i+=-1){}",
    "for(var i = 0; i <= 10; i+=-1){}",
    "for(var i = 10; i > 10; i-=-1){}",
    "for(var i = 10; i >= 0; i-=-1){}",
    "for(var i = 0n; i > l; i+=1n){}",
    "for(var i = 0n; i < l; i+=-1n){}",
    "for(var i = MIN; i <= MAX; i-=true){}",
    "for(var i = 0; i < 10; i-=+5e-7){}",
    "for(var i = 0; i < MAX; i += (2 - 3));",
    // "var n = -2; for(var i = 0; i < 10; i += n);" -- requires cross-statement variable tracking

    // test if '+=', '-=' with counter 'i' on the right side of test condition
    "for(var i = 0; 10 > i; i-=1){}",
];

describe('for-direction', ({ describe }) => {

    const rules = { 'for-direction': [ 'error' ] };

    describe('valid code', ({ it }) => {
        it('has expected outcomes', () => {
            valid.forEach((text, i) => {
                const file = { text };
                const res = lintText(file, rules);

                if (res.errorCount > 0 || res.warningCount > 0) {
                    console.error(res);
                }

                assertEqual(0, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });

    describe('invalid code', ({ it }) => {
        it('has expected outcomes', () => {
            invalid.forEach((text, i) => {
                const file = { text };
                const res = lintText(file, rules);

                assertEqual(1, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [ message ] = res.messages;

                assertEqual('for-direction', message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });
});
