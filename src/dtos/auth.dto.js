import { object } from "yup";
import { string } from "yup";

const registerSchema = object({
  body: object({
    fullName: string().required("Name is required"),
    email: string().email().required("Email is required"),
    userName: string().required("User name is required"),
    password: string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  }),
});

const logInSchema = object({
  body: object({
    email: string().email().required("Email is required"),
    password: string().required("Password is required"),
  }),
});

const refreshTokenSchema = object({
  body: object({
    refreshToken: string().required("Refresh token is required"),
  }),
});

export { registerSchema, logInSchema, refreshTokenSchema };
