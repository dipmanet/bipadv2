/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import style from "./styles.module.scss";

const TextInput = ({
  type,
  placeholder,
  label,
  htmlForId,
  value,
  name,
  onChangeHandler,
  errorMessage,
}) => (
  <div className={style.container}>
    <div className={style.inputContainer}>
      <label htmlFor={htmlForId}>{label}</label>
      <input
        type={type}
        id={htmlForId}
        name={name}
        value={value}
        onChange={onChangeHandler}
        placeholder={placeholder}
      />
    </div>
    {errorMessage ? <p className={style.inputError}>{errorMessage}</p> : ""}
  </div>
);
export default TextInput;
