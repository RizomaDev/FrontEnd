import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from '../../src/components/Footer/Footer';

describe("Footer unit", () => {
  test("renders navigation links", () => {
    render(<Footer />, { wrapper: MemoryRouter });
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  test("renders copyright text with current year", () => {
    render(<Footer />, { wrapper: MemoryRouter });
    const year = new Date().getFullYear();
    expect(
      screen.getByText(`Travel4Real © ${year} All rights reserved`)
    ).toBeInTheDocument();
  });

  test("renders social icons with correct links", () => {
    render(<Footer />, { wrapper: MemoryRouter });
    expect(screen.getByRole("link", { name: /youtube/i })).toHaveAttribute(
      "href",
      "https://www.youtube.com/"
    );
    expect(screen.getByRole("link", { name: /instagram/i })).toHaveAttribute(
      "href",
      "https://www.instagram.com/"
    );
    expect(screen.getByRole("link", { name: /facebook/i })).toHaveAttribute(
      "href",
      "https://www.facebook.com/"
    );
  });
});