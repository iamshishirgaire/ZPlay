export const setCookie = (res, name, value) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const deleteCookie = (res, name) => {
  res.cookie(name, "", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
  });
};
