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
