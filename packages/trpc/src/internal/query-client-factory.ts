import React from "react";
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export class QueryClientFactory {
  static createNew() {
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30 * 1000,
        },
        dehydrate: {
          serializeData: SuperJSON.serialize,
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) ||
            query.state.status === "pending",
        },
        hydrate: {
          deserializeData: SuperJSON.deserialize,
        },
      },
    });
    this._singleton = qc;
    return qc;
  }

  private static _singleton: QueryClient | null = null;
  static get singleton() {
    return (this._singleton ??= this.createNew());
  }

  // IMPORTANT: Create a stable getter for the query client that
  // will return the same client during the same request.
  static stable = React.cache(() => this.createNew());
}
