// Output DTOs (response contracts) for tRPC procedures, organized by domain.
//
// Every procedure MUST declare `.output(...)` using a schema from here (or
// composed from these building blocks) so that the shape sent to the client
// is an explicit allow-list rather than whatever the resolver happens to
// return. This is enforced by a custom eslint rule - see eslint.config.js.
//
// Rule of thumb when adding a new one: never spread/include a raw `User`
// (or any relation that resolves to one) into an output schema. Attach
// `zUserNameOutput` or `zUserSummaryOutput` instead, and only widen that if
// a screen genuinely needs more of the profile.
export * from "./common";
export * from "./contract";
export * from "./match";
export * from "./music";
export * from "./project";
export * from "./user";
