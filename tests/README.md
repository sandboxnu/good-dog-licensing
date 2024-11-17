# Tests

## Mocks

### MockNextCookies

This is a mock for the cookies function in next/headers. In your tests, just instantiate
a new MockNextCookies object, set the cookies you would like, and run the apply() method
on the newly created object.

Example usage:

<pre>const cookies = new MockNextCookies();
cookies.set("myKey", "myValue");
cookies.apply();
... rest of your test</pre>

## Running Tests

You can run the entire test suite using `bun test` or run the tests for a specific entrypoint, `bun test <file-path>`. To filter tests by name, use `bun test <file-path> -t <test-name>`. For example, to run all tests for the `frontend` folder, you can run `bun test frontend`.
