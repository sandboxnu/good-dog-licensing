/**
 * Every tRPC procedure must declare `.output(...)`.
 *
 * Without it, whatever a resolver happens to `return` becomes the response
 * type - which makes it trivially easy to leak a raw Prisma row (and fields
 * like `hashedPassword`) to the client. Requiring `.output(...)` everywhere
 * turns "remember not to leak sensitive fields" into a mechanical, always-on
 * check: the schema is an allow-list, so zod strips anything not declared
 * in it before it goes over the wire.
 *
 * @see packages/trpc/src/dto for the shared output schemas.
 */

/** @param {import('estree').Node} node */
function chainIncludesOutputCall(node) {
  let current = node;
  while (
    current &&
    current.type === "CallExpression" &&
    current.callee.type === "MemberExpression"
  ) {
    const { property } = current.callee;
    if (property.type === "Identifier" && property.name === "output") {
      return true;
    }
    current = current.callee.object;
  }
  return false;
}

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  rules: {
    "require-output-schema": {
      meta: {
        type: "problem",
        docs: {
          description: "Require every tRPC procedure to declare `.output(...)`",
        },
        schema: [],
        messages: {
          missingOutput:
            "This tRPC procedure is missing `.output(...)`. Every procedure must declare an explicit output schema (see packages/trpc/src/dto) so fields like hashedPassword can never be returned by accident.",
        },
      },
      create(context) {
        return {
          CallExpression(node) {
            const { callee } = node;
            if (
              callee.type === "MemberExpression" &&
              callee.property.type === "Identifier" &&
              (callee.property.name === "query" ||
                callee.property.name === "mutation") &&
              !chainIncludesOutputCall(callee.object)
            ) {
              context.report({ node, messageId: "missingOutput" });
            }
          },
        };
      },
    },
  },
};

export default plugin;
