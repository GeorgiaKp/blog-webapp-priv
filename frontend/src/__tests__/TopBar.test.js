import React from "react";
import { MemoryRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import TopBar from "../components/topbar/TopBar";
import { ContextProvider } from "../context/Context";
const mockUserList = require("./mockdata/users.json");

test("when user doesn't have profile pic, show the default one", () => {
  const user = mockUserList[1];
  const mockDispatch = jest.fn();
  const { getByAltText } = render(
    <ContextProvider value={{
        user: true,
        isFetching: false,
        error: false,
        mockDispatch,
      }}
    >
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    </ContextProvider>
  );
  const imgsrc = "http://localhost:13371/images/default.jpeg";
  expect(user.profilePic).toBeFalsy();
  const image = getByAltText("profileImg");
  expect(image).toHaveAttribute("src", imgsrc);
  expect(image).toHaveAttribute("alt", "profileImg");
});


test("login, register links route when clicked", () => {
  const history = createMemoryHistory();
  history.push = jest.fn();
  const { getByText } = render(
    <Router history={history}>
      <TopBar />
    </Router>
  );
  userEvent.click(getByText(/login/i));
  expect(history.push).toHaveBeenCalledWith("/login");
  userEvent.click(getByText(/register/i));
  expect(history.push).toHaveBeenCalledWith("/register");
});
