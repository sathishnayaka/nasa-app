/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import "@testing-library/jest-dom/extend-expect";
import FormData from "../src/formdata";

jest.mock("node-fetch");

const mockData = {
  name: "3542519",
  nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3542519",
  is_potentially_hazardous_asteroid: false,
};
jest.mock("console", () => ({
  error: jest.fn(),
}));

describe("App", () => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    fetchMock.enableMocks();
  });
  afterEach(() => {
    fetchMock.resetMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    global.fetch = jest.fn();
  });
  jest.mock("console", () => {
    return {
      error: jest.fn(),
    };
  });
  it("renders input and submit button", () => {
    const { getByPlaceholderText, getByText } = render(<FormData />);
    const input = getByPlaceholderText("Enter Asteroid ID");
    const submitButton = getByText("Submit");
    expect(input).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("disables submit button if input is empty", () => {
    const { getByPlaceholderText, getByText } = render(<FormData />);
    const input = getByPlaceholderText("Enter Asteroid ID");
    const submitButton = getByText("Submit");
    expect(submitButton).toBeDisabled();
    fireEvent.change(input, { target: { value: "12345" } });
    expect(submitButton).not.toBeDisabled();
  });

  it("handles form submit and updates with API data", async () => {
    const apiData = {
      name: "(2010 PK9)",
      nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3542519",
      neo_reference_id: "3542519",
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(apiData),
    });

    const { getByText, getByPlaceholderText } = render(<FormData />);
    const textInput = getByPlaceholderText("Enter Asteroid ID");
    const submitButton = getByText("Submit");

    fireEvent.change(textInput, { target: { value: "283728" } });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(getByText(`Name: ${apiData.name}`)).toBeInTheDocument();
    });
  });

  it("click on randam button and get the data", async () => {
    const apiData = {
      name: "(2010 PK9)",
      nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3542519",
      neo_reference_id: "3542519",
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(apiData),
    });

    const { getByText } = render(<FormData />);
    const submitButton = getByText("Generate Random");
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(getByText(`Name: ${apiData.name}`)).toBeInTheDocument();
    });
  });

  it("handles API errors", async () => {
    const apiError = new Error("API error");
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(apiError);
    jest.spyOn(window, "alert").mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(<FormData />);
    const textInput = getByPlaceholderText("Enter Asteroid ID");
    const submitButton = getByText("Submit");

    fireEvent.change(textInput, { target: { value: "283728" } });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(window.alert).toHaveBeenCalledWith(apiError.message);
    });
  });
});
