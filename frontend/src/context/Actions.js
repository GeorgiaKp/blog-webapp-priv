export const LoginStart = (userCredentisals) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
});

export const Logout = () => ({
  type: "LOGOUT",
});

export const DeleteSuccess = () => ({
  type: "DELETE_SUCCESS",
});

export const DeleteFailure = () => ({
  type: "DELETE_FAILURE",
});