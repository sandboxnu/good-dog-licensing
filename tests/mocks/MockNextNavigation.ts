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
    this.mockRouter.clear();
  }

  readonly mockRouter = new MockRouter();

  readonly useSearchParams = mock();
  readonly usePathname = mock();
  readonly useRouter = () => this.mockRouter;
  readonly useParams = mock();
}

class MockRouter {
  clear() {
    this.push.mockClear();
  }

  readonly push = mock();
}
