import { describe, beforeEach, afterEach, test, expect, vi } from "vitest";
import { login, register, logout } from "../../src/service/AuthService";
import axios from "axios";

vi.mock("axios");

describe("Auth Service Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("login stores user and returns data when token exists", async () => {
    const credentials = { email: "test@test.com", password: "12345678" };
    const mockResponse = {
      data: { token: "abc123", user: { name: "Test" } },
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await login(credentials);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8080/api/auth/login",
      credentials
    );
    expect(localStorage.getItem("user")).toEqual(
      JSON.stringify(mockResponse.data)
    );
    expect(result).toEqual(mockResponse.data);
  });

  test("login returns null if no token", async () => {
    const credentials = { email: "test@test.com", password: "12345678" };
    const mockResponse = { data: {} };
    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await login(credentials);

    expect(result).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  test("login handles API errors", async () => {
    const credentials = { email: "test@test.com", password: "12345678" };
    const errorMessage = "Invalid credentials";
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await expect(login(credentials)).rejects.toThrow(errorMessage);
  });

  test("register posts user data and returns response", async () => {
    const userData = {
      name: "Test User",
      email: "test@test.com",
      password: "12345678",
    };
    const mockResponse = { data: { success: true } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await register(userData);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8080/api/auth/register",
      {
        ...userData,
        countryCode: "ES",
      }
    );
    expect(result).toEqual({ success: true });
  });

  test("register with custom countryCode", async () => {
    const userData = {
      name: "Test User",
      email: "test@test.com",
      password: "12345678",
      countryCode: "US",
    };
    const mockResponse = { data: { success: true } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await register(userData);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8080/api/auth/register",
      userData
    );
    expect(result).toEqual({ success: true });
  });

  test("register handles API errors", async () => {
    const userData = {
      name: "Test User",
      email: "test@test.com",
      password: "12345678",
    };
    const errorMessage = "Email already exists";
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await expect(register(userData)).rejects.toThrow(errorMessage);
  });

  test("logout removes user from localStorage", () => {
    localStorage.setItem("user", JSON.stringify({ token: "abc123" }));

    logout();

    expect(localStorage.getItem("user")).toBeNull();
  });
});
