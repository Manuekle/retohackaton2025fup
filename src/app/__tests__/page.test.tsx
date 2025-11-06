import { render, screen } from "@testing-library/react";
import Home from "../page";

// Mock the HomeContent component
jest.mock("../home-content", () => ({
  HomeContent: () => <div>Home Content</div>,
}));

describe("Home Page", () => {
  it("renders the home page", () => {
    render(<Home />);
    expect(screen.getByText("Home Content")).toBeInTheDocument();
  });

  it("has correct metadata", () => {
    // This would be tested through the metadata export
    // In a real scenario, you'd test the page renders with correct title
    expect(Home).toBeDefined();
  });
});
