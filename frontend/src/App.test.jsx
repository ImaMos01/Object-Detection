// testing using vitest and jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App.jsx";

//unit test
describe("Main Page", () => {
  //before a test, it renders the component
  beforeEach(() => {
    render(<App />);
  });

  test("should not show the image if the input file is empty", () => {
    const button = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(button);
    expect(screen.queryByText(/content/i)).toBeNull();
  });
});
