import { Button } from "@good-dog/ui/button";

import { User } from "./User";

export default function Home() {
  return (
    <main>
      <h1>Home Page</h1>
      <Button>Click me</Button>
      <User />
    </main>
  );
}
