import { mock } from "bun:test";

// Mocks the next/navigation module
export class MockNextNavigation {
  async apply() {
    await mock.module("next/navigation", () => this);
  }

  clear() {
    this.useParams.mockClear();
    this.usePathname.mockClear();
    this.useSearchParams.mockClear();
    this.useRouter.mockClear();
  }

  readonly useSearchParams = mock();
  readonly usePathname = mock();
  readonly useRouter = mock();
  readonly useParams = mock();
}
