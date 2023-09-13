import React from "react";
import styles from "./Signup.module.css";
import TextInput from "../TextInput/TextInput";
import { useFormik } from "formik";
import signupSchema from "../../Schemas/SignupSchema";
import { signup } from "../../api/internal";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const dispath = useDispatch();
  const [error, setError] = useState();
  const navigate = useNavigate();
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
    validationSchema: signupSchema,
  });

  const handleSignup = async () => {
    const data = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
    };
    const response = await signup(data);
    if (response.status === 201) {
      const user = {
        _id: response.data.user._id,
        username: response.data.user.username,
        password: response.data.user.password,
        auth: response.data.auth,
      };
      //update the state
      dispath(setUser(user));
      //navigate to home page
      navigate("/");
    } else if (response.code === "ERR_BAD_REQUEST") {
      setError(response.response.data.message);
    }
  };
  return (
    <div className={styles.signup}>
      <h1>Register</h1>
      <TextInput
        type="text"
        name="name"
        placeholder="name"
        value={values.name}
        onBlur={handleBlur}
        onChange={handleChange}
        error={errors.name && touched.name ? 1 : undefined}
        errormessage={errors.name}
      />
      <TextInput
        type="text"
        name="username"
        placeholder="username"
        value={values.username}
        onBlur={handleBlur}
        onChange={handleChange}
        error={errors.username && touched.username ? 1 : undefined}
        errormessage={errors.username}
      />
      <TextInput
        type="email"
        name="email"
        placeholder="email"
        value={values.email}
        onBlur={handleBlur}
        onChange={handleChange}
        error={errors.email && touched.email ? 1 : undefined}
        errormessage={errors.email}
      />
      <TextInput
        type="password"
        name="password"
        placeholder="password"
        value={values.password}
        onBlur={handleBlur}
        onChange={handleChange}
        error={errors.password && touched.password ? 1 : undefined}
        errormessage={errors.password}
      />
      <div className={styles.button}>
        <button className={styles.signupbutton} onClick={handleSignup}>
          Signup
        </button>
        <span>
          Already have an account?
          <button className={styles.login}>Login</button>
        </span>
      </div>
    </div>
  );
};

export default Signup;
