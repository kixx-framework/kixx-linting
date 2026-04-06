export default {
	valid: [
		`try {
        throw new Error("Original error");
    } catch (error) {
        throw new Error("Failed to perform error prone operations", { cause: error });
    }`,
		`try {
		doSomething();
	} catch (error) {
		throw new Error("Something failed", { 'cause': error });
	}`,
		`try {
		doSomething();
	} catch (error) {
		throw new Error("Something failed", { "cause": error });
	}`,
		`try {
		doSomething();
	} catch (error) {
		throw new Error("Something failed", { ['cause']: error });
	}`,
		`try {
		doSomething();
	} catch (error) {
		throw new Error("Something failed", { ["cause"]: error });
	}`,
		`try {
		doSomething();
	} catch (error) {
		throw new Error("Something failed", { [\`cause\`]: error });
	}`,
		/* No throw inside catch */
		`try {
        doSomething();
    } catch (e) {
        console.error(e);
    }`,
		`try {
        doSomething();
    } catch (err) {
        throw new Error("Failed", { cause: err, extra: 42 });
    }`,
		`try {
        doSomething();
    } catch (error) {
        switch (error.code) {
            case "A":
                throw new Error("Type A", { cause: error });
            case "B":
                throw new Error("Type B", { cause: error });
            default:
                throw new Error("Other", { cause: error });
        }
    }`,
		/* When the error options are too complicated to be properly analyzed/fixed */
		`try {
		// ...
	} catch (err) {
		const opts = { cause: err }
		throw new Error("msg", { ...opts });
	}
	`,
		/* When the thrown error is part of a function defined in catch block, the caught error is not directly related to that throw */
		`try {
	} catch (error) {
		foo = {
			bar() {
				throw new Error();
			}
		};
	}`,
		/* 19. When there is a `SpreadStatement` argument passed to the Error constructor, we can't provide an accurate suggestion. */
		`try {
				doSomething();
			} catch (error) {
				const args = [];
				throw new Error(...args);
		}`,
		/* Do not report instances where thrown error is an instance of a custom error type that shadows built-in class. */
		`import { Error } from "./my-custom-error.js";
			try {
				doSomething();
			} catch (error) {
				throw Error("Failed to perform error prone operations");
			}`,
		/* It's valid to discard the caught error at parameter level of catch block `requireCatchParameter` is set to `false` (default behavior) */
		{
			code: `try {
		doSomething();
	} catch {
		throw new Error("Something went wrong");
	}`,
			options: [{ requireCatchParameter: false }],
		},
		/* Multiple cause properties are present and the last one is the expected caught error value. */
		`try {
			doSomething();
		} catch (error) {
			throw new Error("Something failed", { cause: anotherError, cause: error });
		}`,
		`try {
			doSomething();
		} catch (error) {
			throw new Error("Something failed", { "cause": anotherError, "cause": error });
		}`,
		`try {
			doSomething();
		} catch (error) {
			throw new Error("Something failed", { cause: anotherError, "cause": error });
		}`,
	],
	invalid: [
		/* 1. Throws a new Error without cause, even though an error was caught */
		{
			code: `try {
            doSomething();
        } catch (err) {
            throw new Error("Something failed");
        }`,
		},
		/* 2. Throwing a new Error with unrelated cause */
		{
			code: `try {
            doSomething();
        } catch (err) {
            const unrelated = new Error("other");
            throw new Error("Something failed", { cause: unrelated });
        }`,
		},
		{
			code: `try {
            doSomething();
        } catch (err) {
            const unrelated = new Error("other");
            throw new Error("Something failed", { "cause": unrelated });
        }`,
		},
		/* 3. Throws a new Error, cause property is present but value is a different identifier */
		/*    Note: This should actually be a valid case since e === err, but still reporting as it's hard to track. */
		{
			code: `try {
            doSomething();
        } catch (err) {
            const e = err;
            throw new Error("Failed", { cause: e });
        }`,
		},
		/* 4. Throws a new Error, but not using the full caught error as the cause of the symptom error */
		{
			code: `try {
            doSomething();
        } catch (error) {
            throw new Error("Failed", { cause: error.message });
        }`,
		},
		/* 5. Throw in a heavily nested catch block */
		{
			code: `try {
            doSomething();
        } catch (error) {
            if (shouldThrow) {
                while (true) {
                    if (Math.random() > 0.5) {
                        throw new Error("Failed without cause");
                    }
                }
            }
        }`,
		},
		/* 6. Throw deep inside a switch statement */
		{
			code: `try {
            doSomething();
        } catch (error) {
            switch (error.code) {
                case "A":
                    throw new Error("Type A");
                case "B":
                    throw new Error("Type B", { cause: error });
                default:
                    throw new Error("Other", { cause: error });
            }
        }`,
		},
		/* 7. Throw statement with a template literal error message */
		{
			code: `try {
            doSomething();
        } catch (error) {
            throw new Error(\`The certificate key "\${chalk.yellow(keyFile)}" is invalid.\n\${err.message}\`);
        }`,
		},
		/* 8. Throw statement with a variable error message */
		{
			code: `try {
            doSomething();
        } catch (error) {
            const errorMessage = "Operation failed";
            throw new Error(errorMessage);
        }`,
		},
		/* 9. Existing error options should be preserved. */
		{
			code: `try {
            doSomething();
        } catch (error) {
            const errorMessage = "Operation failed";
            throw new Error(errorMessage, { existingOption: true, complexOption: { moreOptions: {} } });
        }`,
		},
		/* 10. Multiple Throw statements within a single catch block */
		{
			code: `try {
            doSomething();
        } catch (err) {
            if (err.code === "A") {
                throw new Error("Type A");
            }
            throw new TypeError("Fallback error");
        }`,
			// This should have multiple errors
		},
		/* 11. When an Error is created without `new` keyword */
		{
			code: `try {
            doSomething();
        } catch (err) {
            throw Error("Something failed");
        }`,
		},
		/* 12. Miscellaneous constructs */
		{
			code: `try {
        } catch (err) {
            my_label:
            throw new Error("Failed without cause");
        }`,
		},
		{
			code: `try {
        } catch (err) {
            {
                throw new Error("Something went wrong");
            }
        }`,
		},
		/* 13. When the throw Error constructor has no message argument. */
		{
			code: `try {
        } catch (err) {
            {
                throw new Error();
            }
        }`,
		},
		/* 14. AggregateError accepts options as the third argument.  */
		{
			code: `try {
        } catch (err) {
            {
                throw new AggregateError([], "Lorem ipsum");
            }
        }`,
		},
		/* 15. `AggregateError` with no arguments.  */
		{
			code: `try {
        } catch (err) {
            {
                throw new AggregateError();
            }
        }`,
		},
		/* 16. `AggregateError` with just `errors` argument.  */
		{
			code: `try {
        } catch (err) {
            {
                throw new AggregateError([]);
            }
        }`,
		},
		/* 17. Disallow discarding caught errors when `requireCatchParameter` is set to `true` */
		{
			code: `try {
			doSomething();
		} catch {
			throw new Error("Something went wrong");
		}`,
			options: [{ requireCatchParameter: true }],
		},
		/* 18. Throwing a new Error with unrelated cause, and complex fix is needed. */
		{
			code: `try {
            doSomething();
        } catch (err) {
            throw new Error("Something failed", { cause });
        }`,
		},
		/* 19. When the caught error is being partially lost. */
		{
			code: `try {
				doSomething();
			} catch ({ message }) {
				throw new Error(message);
			}`,
		},
		{
			code: `try {
				doSomethingElse();
			} catch ({ ...error }) {
				throw new Error(error.message);
			}`,
		},
		/* 20. When the caught error is shadowed by a closer scoped redeclaration. */
		{
			code: `try {
				doSomething();
			} catch (error) {
				if (whatever) {
					const error = anotherError;
					throw new Error("Something went wrong", { cause: error });
				}
			}`,
		},
		/* 21. Make sure comments are preserved when fixing missing cause. */
		{
			code: `try {
				doSomething();
			} catch (error) {
				throw new Error(
					"Something went wrong" // some comments
				);
			}`,
		},
		/* 22. Adding `cause` to an empty existing options object. */
		{
			code: `try {
				doSomething();
			} catch (err) {
				throw new Error("Something failed", {});
			}`,
		},
		/* 23. There is no easy way to check for `cause` existence when property is computed. */
		{
			code: `try {
			doSomething();
		} catch (error) {
			const cause = "desc";
			throw new Error("Something failed", { [cause]: "Some error" });
		}`,
		},
		/* 24. When an incorrect cause is attached as a shorthand method. */
		{
			code: `try {
			doSomething();
			} catch (error) {
			throw new Error("Something failed", { cause() { /* do something */ }  });
			}`,
		},
		/* 25. When multiple `cause` properties are present. */
		{
			code: `try {} catch (error) {
				throw new Error("Something failed", { cause: error, cause: anotherError });
			}`,
		},
		{
			code: `try {} catch (error) {
				throw new Error("Something failed", { cause: error, "cause": anotherError });
			}`,
		},
		/* 26. Getters and setters as `cause`. */
		{
			code: `try {} catch (error) {
				throw new Error("Something failed", { get cause() { } });
			}`,
		},
		{
			code: `try {} catch (error) {
				throw new Error("Something failed", { set cause(value) { } });
			}`,
		},
		{
			code: `try {} catch (error) {
				throw new Error("Something failed", {
					get cause() { return error; },
					set cause(value) { error = value; },
				});
			}`,
		},
	],
};
