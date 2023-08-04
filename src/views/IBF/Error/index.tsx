import React from 'react';
import style from 'styles.scss';

const Error = props => (
    <>
        { props.error
            ? <div className={style.error}>{props.message}</div>
            : ''}
    </>
);

export default Error;
