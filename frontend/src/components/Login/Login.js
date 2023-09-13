import React, { useState } from "react";
import styles from "./Login.module.css";
import TextInput from "../TextInput/TextInput";
import { useFormik } from "formik";
import loginSchema from "../../Schemas/LoginSchema";
import { login } from "../../api/internal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../store/userSlice";

const Login = () => {
  const dispath = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });
  const handleLogin = async () => {
    const data = {
      username: values.username,
      password: values.password,
    };
    try {
      const response = await login(data);
      if (response.status === 200) {
        const user = {
          _id: response.data.user._id,
          username: response.data.user.username,
          password: response.data.user.password,
          auth: response.data.auth,
        };

        //update store
        dispath(setUser(user));
        //navigate homepage
        navigate("/");
      } else if (response.code === "ERR_BAD_REQUEST") {
        setError(response.response.data.message);
      }
    } catch (error) {
      return error;
    }
  };
  return (
    <div className={styles.login}>
      <h1>login page</h1>
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
        <button className={styles.loginbutton} onClick={handleLogin}>
          Login
        </button>
        <span>
          Don't have an account?
          <button className={styles.register}>Regiseter</button>
        </span>
      </div>
    </div>
  );
};

export default Login;
