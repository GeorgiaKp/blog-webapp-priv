import React from "react";
import { MemoryRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import TopBar from "../components/topbar/TopBar";
import { Context } from "../context/Context";
const mockUserList = require("./mockdata/users.json");


test("when user has profile pic, don't show the default one", () => {
  let user = mockUserList[0];
  const mockDispatch = jest.fn();
  const { getByAltText } = render(
    <Context.Provider value={{
        user: mockUserList[0],
        isFetching: false,
        error: false,
        mockDispatch,
      }}
    >
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    </Context.Provider>
  );
  const imgsrc = `http://localhost:13371/images/${mockUserList[0].profilePic}`;
  expect(user.profilePic).toBeTruthy();
  const image = getByAltText("profileImg");
  expect(image).toHaveAttribute("src", imgsrc);
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
