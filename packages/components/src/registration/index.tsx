import OnboardingFormSwitcher from "./onboarding/OnboardingFormSwitcher";
import SignUpForm from "./SignUpForm";

// The verify modal is not exported from the registration barrel file,
// because it is only used in the SignUpForm component.
export { SignUpForm, OnboardingFormSwitcher };
