import React from "react";
import style from "./styles.module.scss";

const TabPane = (props) => {
	return <div className={style.resDiv}>{props.childern}</div>;
};
// TabPane.propTypes = {
//     name: PropTypes.string,
// };
export default TabPane;
