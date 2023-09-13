import * as yup from "yup";

const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
const signupSchema = yup.object().shape({
  name: yup.string().max(30).required("name is required!"),
  username: yup.string().min(5).max(30).required("username is required!"),
  email: yup
    .string()
    .email("please enter a valid email")
    .required("email is required!"),
  password: yup
    .string()
    .matches(passwordPattren, {
      message: "atleast 1lowercase ,uppercase and digit",
    })
    .required("password is required!!"),
});

export default signupSchema;
