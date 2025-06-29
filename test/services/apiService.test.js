import { describe, beforeEach, afterEach, test, expect, vi } from "vitest";
import axios from "axios";
import {
  getAllExperiences,
  searchExperiences,
  getExperiencesById,
  createExperiences,
  updateExperiences,
  deleteExperiences,
  getCategories,
  getCountries,
} from "../../src/service/apiService";

vi.mock("axios");

describe("API Service Tests", () => {
  beforeEach(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "test-user-id",
        token: "test-token",
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("getAllExperiences fetches experiences successfully", async () => {
    const mockExperiences = [
      { id: 1, title: "Experience 1" },
      { id: 2, title: "Experience 2" },
    ];
    axios.get.mockResolvedValueOnce({ data: mockExperiences });

    const result = await getAllExperiences();

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/experiences",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
          "X-User-ID": "test-user-id",
        }),
      })
    );
    expect(result).toEqual(mockExperiences);
  });

  test("searchExperiences searches experiences by term", async () => {
    const searchTerm = "beach";
    const mockResults = [{ id: 1, title: "Beach Experience" }];
    axios.get.mockResolvedValueOnce({ data: mockResults });

    const result = await searchExperiences(searchTerm);

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/experiences/search",
      expect.objectContaining({
        params: { title: searchTerm },
      })
    );
    expect(result).toEqual(mockResults);
  });

  test("getExperiencesById fetches specific experience", async () => {
    const experienceId = 1;
    const mockExperience = { id: experienceId, title: "Test Experience" };
    axios.get.mockResolvedValueOnce({ data: mockExperience });

    const result = await getExperiencesById(experienceId);

    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:8080/api/experiences/${experienceId}`,
      expect.any(Object)
    );
    expect(result).toEqual(mockExperience);
  });

  test("createExperiences creates new experience", async () => {
    const newExperience = { title: "New Experience", description: "Test" };
    const mockResponse = { ...newExperience, id: 1 };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await createExperiences(newExperience);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8080/api/experiences",
      newExperience,
      expect.any(Object)
    );
    expect(result).toEqual(mockResponse);
  });

  test("updateExperiences updates existing experience", async () => {
    const id = "1";
    const updatedData = { title: "Updated Experience" };
    const mockResponse = { ...updatedData, id };
    axios.put.mockResolvedValueOnce({ data: mockResponse });

    const result = await updateExperiences(id, updatedData);

    expect(axios.put).toHaveBeenCalledWith(
      `http://localhost:8080/api/experiences/${id}`,
      updatedData,
      expect.any(Object)
    );
    expect(result).toEqual(mockResponse);
  });

  test("deleteExperiences deletes experience", async () => {
    const id = "1";
    axios.delete.mockResolvedValueOnce({ status: 204 });

    const result = await deleteExperiences(id);

    expect(axios.delete).toHaveBeenCalledWith(
      `http://localhost:8080/api/experiences/${id}`,
      expect.any(Object)
    );
    expect(result).toBe(true);
  });

  test("getCategories fetches all categories", async () => {
    const mockCategories = ["Adventure", "Culture", "Food"];
    axios.get.mockResolvedValueOnce({ data: mockCategories });

    const result = await getCategories();

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/categories/all",
      expect.any(Object)
    );
    expect(result).toEqual(mockCategories);
  });

  test("getCountries fetches all countries", async () => {
    const mockCountries = ["Spain", "France", "Italy"];
    axios.get.mockResolvedValueOnce({ data: mockCountries });

    const result = await getCountries();

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/countries/all",
      expect.any(Object)
    );
    expect(result).toEqual(mockCountries);
  });

  test("handles API errors properly", async () => {
    axios.get.mockRejectedValueOnce(new Error("API Error"));

    await expect(getAllExperiences()).rejects.toThrow("API Error");
  });
});
