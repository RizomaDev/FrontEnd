import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../../src/components/Header/Header";


describe("Header integration", () => {
  test("renders the app name/logo", () => {
    render(<Header />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Travel4Real/i)).toBeInTheDocument();
  });

  test("renders navigation buttons", () => {
    render(<Header />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Travel4Real/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Login/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Register/i)[0]).toBeInTheDocument();
  });

  test("shows dropdown menu links when menu button is clicked", () => {
    render(<Header />, { wrapper: MemoryRouter });
    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    
    expect(screen.getAllByText(/Login/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Register/i).length).toBeGreaterThanOrEqual(1);
  });
});
