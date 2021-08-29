import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Posts from "../components/posts/Posts";
const mockPostList = require("./mockdata/posts.json");

test("every child component is rendered", () => {
  const { getByText } = render(
    <MemoryRouter>
      <Posts posts={mockPostList} />
    </MemoryRouter>
  );
  mockPostList.forEach((p) => expect(getByText(p.title)).toBeInTheDocument());
});
