import React from 'react';
import style from './styles.scss';

// eslint-disable-next-line arrow-body-style
const TabPane = (props) => {
    return <div className={style.resDiv}>{props.childern}</div>;
};
// TabPane.propTypes = {
//     name: PropTypes.string,
// };
export default TabPane;
