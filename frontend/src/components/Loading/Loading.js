import React from "react";
import { ColorRing } from "react-loader-spinner";
import styles from "./Loading.module.css";

const Loading = ({ text }) => {
  return (
    <div className={styles.loader}>
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
      <h1>{text}</h1>
    </div>
  );
};

export default Loading;
