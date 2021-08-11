import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../components/header/Header";

test("Header renders with correct titles and image", () => {
  const { getByText, getByAltText } = render(<Header />);
  const image = getByAltText("background");
  expect(getByText(/React & node/i)).toBeInTheDocument();
  expect(getByText(/Blogg/i)).toBeInTheDocument();
  expect(image).toHaveAttribute(
    "src",
    "https://www.enjpg.com/img/2020/tall-mountain-6.jpg"
  );
});
