import React from "react";
import styles from "./TextInput.module.css";

const TextInput = (props) => {
  return (
    <div className={styles.main}>
      <input {...props} />
      {props.error && <p>{props.errormessage}</p>}
    </div>
  );
};

export default TextInput;
