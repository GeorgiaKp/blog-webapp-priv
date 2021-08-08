import React from "react";
import { render, screen } from "@testing-library/react";
import { toHaveAttribute } from "@testing-library/jest-dom";
import Header from "../components/header/Header";

test("Header renders with correct titles and image", () => {
  render(<Header />);
  const headerSm = screen.getByText(/React & node/i);
  const headerLg = screen.getByText(/Blogg/i);
  const image = screen.getByAltText("background");

  expect(headerSm.textContent).toEqual("React & node");
  expect(headerLg.textContent).toEqual("Blogg");
  expect(image).toHaveAttribute(
    "src",
    "https://www.enjpg.com/img/2020/tall-mountain-6.jpg"
  );
  expect(image).toHaveAttribute("alt", "background");
});
