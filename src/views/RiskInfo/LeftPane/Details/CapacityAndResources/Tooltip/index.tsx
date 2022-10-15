/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef } from 'react';
import styles from './styles.scss';

const InfoBox = (props) => {
    const ref = useRef(null);
    const { onClickOutside } = props;
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClickOutside && onClickOutside();
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [onClickOutside]);

    if (!props.show) { return null; }

    return (
        <>
            <div ref={ref} className={styles.infoBox}>
                {props.message}
            </div>
        </>
    );
};


export default InfoBox;
