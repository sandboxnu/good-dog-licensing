import { mock } from "bun:test";

// Mocks the next/cache module
export class MockNextCache {
  async apply() {
    await mock.module("next/cache", () => this);
  }

  clear() {
    this.revalidatePath.mockClear();
  }

  readonly revalidatePath =
    mock<(originalPath: string, type?: "layout" | "page") => void>();
}
