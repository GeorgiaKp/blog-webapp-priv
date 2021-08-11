import React from "react";
import { MemoryRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Post from "../components/post/Post";
const mockPostList = require("./mockdata/posts.json");

test("Post renders with correct image and description", () => {
  const { getByText, getByAltText } = render(<Post post={mockPostList[0]} />, {
    wrapper: MemoryRouter,
  });
  const imgsrc = "http://localhost:13371/images/" + mockPostList[0].photo;
  const image = getByAltText("postimg");
  expect(image).toHaveAttribute("src", imgsrc);
  expect(getByText(mockPostList[0].desc)).toBeInTheDocument();
});

test("post title routes when clicked to singlePost", () => {
  const history = createMemoryHistory();
  history.push = jest.fn();
  const { getByText } = render(
    <Router history={history}>
      <Post post={mockPostList[0]} />,
    </Router>
  );
  userEvent.click(getByText(mockPostList[0].title));
  expect(history.push).toHaveBeenCalledWith(`/post/${mockPostList[0]._id}`);
});
