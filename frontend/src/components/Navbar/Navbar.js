import React from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { resetUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../api/internal";

const Navbar = () => {
  const isAuth = useSelector((state) => state.user.auth);
  const dispath = useDispatch();
  const navigate = useNavigate();

  const handlesignout = async () => {
    await signOut();
    dispath(resetUser());
    navigate("/");
  };
  return (
    <div className={styles.main}>
      <h1>MULTI</h1>
      <div className={styles.menu}>
        <NavLink to="/">HOME</NavLink>
        <NavLink to="crypto">CRYPTO</NavLink>
        <NavLink to="blog">BLOG</NavLink>
        <NavLink to="submit">SUBMITBLOG</NavLink>
      </div>
      <div className={styles.button}>
        {isAuth ? (
          <div>
            {" "}
            <NavLink>
              <button className={styles.signout} onClick={handlesignout}>
                SignOut
              </button>
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink to="login">
              <button className={styles.login}>Login</button>
            </NavLink>
            <NavLink to="signup">
              <button className={styles.signup}>SignUp</button>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
