import React from "react";
import axios from "axios";
import { MemoryRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import { render, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import Sidebar from "../components/sidebar/Sidebar";
import mockCatList from "./mockdata/mockCategories.json";

jest.mock("axios");

test.only("Sidebar renders with correct titles and image", () => {
  const { getByText, getByAltText } = render(<Sidebar />);
  const image = getByAltText("catimg");
  expect(getByText(/about me/i)).toBeInTheDocument();
  expect(getByText(/categories/i)).toBeInTheDocument();
  expect(image).toHaveAttribute(
    "src",
    "https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/is_my_cat_normal_slideshow/1800x1200_is_my_cat_normal_slideshow.jpg"
  );
  expect(image).toHaveAttribute("alt", "catimg");
});

test.only("category title routes when clicked to posts in that category", () => {
  const mockCategories = ["Food", "Dog"];
  const history = createMemoryHistory();
  history.push = jest.fn();
  const { getByText } = render(
    <Router history={history}>
      <Sidebar />
    </Router>
  );
  userEvent.click(getByText(mockCategories[1]));
  expect(history.push).toHaveBeenCalledWith(`/?cat=${mockCategories[0]}`);
});

test("axios responds with correct categories", async () => {
  const resp = { data: mockCatList };
  axios.get.mockResolvedValue(resp);
  const { getAllByTestId } = render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>
  );
  const rowValues = await waitFor(() =>
    getAllByTestId("row").map((row) => row.textContent)
  );
  expect(rowValues).toEqual(["Food", "Dog"]);
  expect(axios.get).toHaveBeenCalledWith("/categories");
  expect(axios.get).toHaveBeenCalledTimes(1);
});
