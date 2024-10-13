# Tests

## Mocks

### MockNextCookies

This is a mock for the cookies function in next/headers. In your tests, just instantiate
a new MockNextCookies object and set whichever cookies you like. The rest is handled by the mock.

Example usage:

<pre>const cookies = new MockNextCookies();
cookies.set("myKey", "myValue");
... rest of your test</pre>
