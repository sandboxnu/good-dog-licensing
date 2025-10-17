import Checkbox from "@good-dog/components/base/Checkbox";
import RadioGroup from "@good-dog/components/base/RadioGroup";
import TextArea from "@good-dog/components/base/TextArea";
import TextInput from "@good-dog/components/base/TextInput";

export default function Components() {
  return (
    <div className="flex h-screen flex-row items-center justify-center gap-5">
      <div className="flex h-screen flex-col items-center justify-center gap-5">
        <div className="w-full max-w-[250px]">
          <TextInput
            label="First Name"
            placeholder="Your name"
            required
            helperText="This is some helper text"
            value="test"
            onChange={() => {
              console.log("Changed");
            }}
          />
        </div>
        <div className="w-full max-w-[250px]">
          <TextInput
            label="First Name"
            placeholder="Your name"
            required={false}
            helperText="This is some helper text"
            errorText="This is some error text"
            value="test"
            onChange={() => {
              console.log("Changed");
            }}
          />
        </div>
      </div>
      <div className="flex h-screen flex-col items-center justify-center gap-5">
        <div className="w-full max-w-[250px]">
          <TextArea
            label="First Name"
            placeholder="Your name"
            required
            helperText="This is some helper text"
          />
        </div>
        <div className="w-full max-w-[250px]">
          <TextArea
            label="First Name"
            placeholder="Your name"
            required={false}
            helperText="This is some helper text"
            errorText="This is some error text"
          />
        </div>
      </div>
      <div className="flex h-screen flex-col items-center justify-center gap-5">
        <Checkbox label={"Please check this"} required={false} />
        <Checkbox
          label={"Please check this"}
          required={true}
          errorText="This is some error text"
        />
      </div>
      <div className="flex h-screen flex-col items-center justify-center gap-5">
        <RadioGroup
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "maybe", label: "Maybe" },
          ]}
          required={false}
          label={"Please select an option"}
        />
        <RadioGroup
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "maybe", label: "Maybe" },
          ]}
          required={true}
          label={"Please select an option"}
          errorText="This is some error text"
        />
      </div>
    </div>
  );
}
