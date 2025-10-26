"use client";

import TextArea from "@good-dog/components/base/TextArea";
import TextInput from "@good-dog/components/base/TextInput";
import Checkbox from "@good-dog/components/base/Checkbox";
import Button from "@good-dog/components/base/Button";
import MultiselectDropdown from "@good-dog/components/base/MultiselectDropdown";

export default function Components() {
  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
    { label: "Option 4", value: "option4" },
  ];

  return (
    <div className="flex h-screen items-center justify-center gap-5 flex-row">
      <div className="flex h-screen items-center justify-center gap-5 flex-col">
        <div className="w-full max-w-[250px]">
          <TextInput
            label="First Name"
            placeholder="Your name"
            required
            helperText="This is some helper text"
            value={""}
            onChange={() => {
              console.log("Changed");
            }}
            id="firstname1"
          />
        </div>
        <div className="w-full max-w-[250px]">
          <TextInput
            label="First Name"
            placeholder="Your name"
            helperText="This is some helper text"
            errorText="This is some error text"
            value="test"
            onChange={() => {
              console.log("Changed");
            }}
            id="firstname2"
          />
        </div>
      </div>
      <div className="flex h-screen items-center justify-center gap-5 flex-col">
        <div className="w-full max-w-[250px]">
          <TextArea
            label="First Name"
            placeholder="Your name"
            required
            helperText="This is some helper text"
            value="test"
            onChange={() => {
              console.log("Changed");
            }}
            id="firstname3"
          />
        </div>
        <div className="w-full max-w-[250px]">
          <TextArea
            label="First Name"
            placeholder="Your name"
            required={false}
            helperText="This is some helper text"
            errorText="This is some error text"
            value="test"
            onChange={() => {
              console.log("Changed");
            }}
            id="firstname4"
          />
        </div>
      </div>
      <div className="flex h-screen items-center justify-center gap-5 flex-col">
        <Checkbox label={"Please check this"} id="box1" />
        <Checkbox
          label={"Please check this"}
          required={true}
          errorText="This is some error text"
          id="box2"
        />
      </div>
      <div className="flex h-screen items-center justify-center gap-5 flex-col">
        {/* <RadioGroup
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "maybe", label: "Maybe" },
          ]}
          required={false}
          label={"Please select an option"}
          id="radio1"
        /> */}
        {/* <RadioGroup
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "maybe", label: "Maybe" },
          ]}
          required={true}
          label={"Please select an option"}
          errorText="This is some error text"
          id="radio2"
        /> */}
      </div>
      <div className="flex flex-col gap-4 bg-gray-100 w-[400px]">
        <Button
          variant="contained"
          size="medium"
          label="Click Me"
          shadow
          onClick={() => {
            console.log("hit");
          }}
        />
        <Button
          variant="contained"
          size="large"
          label="Click Me"
          onClick={() => {
            console.log("hit");
          }}
        />
        <Button
          variant="outlined"
          size="medium"
          label="Click Me"
          onClick={() => {
            console.log("hit");
          }}
        />
        <Button
          variant="outlined"
          size="large"
          label="Click Me"
          shadow
          onClick={() => {
            console.log("hit");
          }}
        />
        <Button
          variant="text"
          size="medium"
          label="Click Me"
          onClick={() => {
            console.log("hit");
          }}
        />
        <Button
          variant="text"
          size="large"
          label="Click Me"
          onClick={() => {
            console.log("hit");
          }}
        />
        <Button
          variant="text"
          size="medium"
          label="Click Me"
          displayIcon
          onClick={() => {
            console.log("hit");
          }}
        />
        <Button
          variant="text"
          size="large"
          label="Click Me"
          displayIcon
          onClick={() => {
            console.log("hit");
          }}
        />
        <Button
          variant="contained"
          size="medium"
          displayIcon
          onClick={() => {
            console.log("hit");
          }}
        />
        <Button
          variant="contained"
          size="large"
          displayIcon
          onClick={() => {
            console.log("hit");
          }}
        />
        <Button
          variant="contained"
          size="large"
          fullWidth
          label="Click Me Please"
          onClick={() => {
            console.log("hit");
          }}
        />
      </div>
      <div className="flex flex-col gap-4 bg-gray-100 w-[400px]">
        <MultiselectDropdown
          label={"Dropdown menu"}
          value={""}
          options={options}
          onChange={(newValue) => {
            console.log("Changed", newValue);
          }}
          placeholder={"enter info here"}
          id={"test"}
          variant={"standard"}
        />
        <MultiselectDropdown
          label={"Dropdown menu"}
          value={""}
          options={options}
          onChange={(newValue) => {
            console.log("Changed", newValue);
          }}
          placeholder={"enter info here"}
          id={"test"}
          variant={"hover"}
        />
        <MultiselectDropdown
          label={"Dropdown menu"}
          value={""}
          options={options}
          onChange={(newValue) => {
            console.log("Changed", newValue);
          }}
          placeholder={"enter info here"}
          id={"test"}
          variant={"inactive"}
        />
      </div>
    </div>
  );
}
