import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, test } from "bun:test";

import { SignInForm } from "@good-dog/components/registration";

import { MockNextNavigation } from "../mocks/MockNextNavigation";
import { renderWithShell } from "./util";

const mockNavigation = new MockNextNavigation();

beforeAll(async () => {
  await mockNavigation.apply();
});

afterEach(() => {
  mockNavigation.clear();
});

test("Renders the sign in form with email and password fields", () => {
  renderWithShell(<SignInForm />);

  const signInForm = screen.getByTestId("sign-in-form");
  expect(signInForm).toBeInTheDocument();

  const emailField = screen.getByPlaceholderText(/email/i);
  expect(emailField).toBeInTheDocument();

  const passwordField = screen.getByPlaceholderText(/password/i);
  expect(passwordField).toBeInTheDocument();

  const submitButton = screen.getByRole("button", { name: /sign in/i });

  fireEvent.change(emailField, { target: { value: "test@example.com" } });
  fireEvent.change(passwordField, { target: { value: "password123" } });

  expect(emailField).toHaveValue("test@example.com");
  expect(passwordField).toHaveValue("password123");

  fireEvent.click(submitButton);

  // TODO: we need to build out an app shell that allows us to test trpc mutations/queries
});
