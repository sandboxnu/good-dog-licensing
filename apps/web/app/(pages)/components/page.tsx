"use client";

import TextInput from "@good-dog/components/base/TextInput";

export default function Components() {
  return (
    <div className="flex h-screen items-center justify-center gap-5 flex-col">
      <div className="w-full max-w-[250px]">
        <TextInput
          label="First Name"
          placeholder="Your name"
          required
          helperText="This is some helper text"
        />
      </div>
      <div className="w-full max-w-[250px]">
        <TextInput
          label="First Name"
          placeholder="Your name"
          required={false}
          helperText="This is some helper text"
          errorText="This is some error text"
        />
      </div>
    </div>
  );
}
