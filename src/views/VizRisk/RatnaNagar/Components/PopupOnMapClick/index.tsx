/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-tabs */
import React, { useContext } from 'react';
import { MainPageDataContext } from '../../context';
import styles from './styles.scss';

interface Props {
    mainType: string;
    data: any;
}

const PopupOnMapClick = (props: Props) => {
    const {
        leftElement,
    } = useContext(MainPageDataContext);
    const { mainType, data } = props;
    console.log('data is', leftElement, data);

    return (
        <div className={styles.popupOnMapClick} id="mainPopUp" style={{ border: `1px solid ${data.color}` }}>
            <h2 className={styles.titleType}>
                House ID :
                {data.id}
            </h2>
            <div className={styles.mainContents}>
                <h3 style={{ color: data.color }} className={styles.mainTitle}>{mainType}</h3>
                <h3 style={{ color: data.color }} className={styles.mainStatus}>
                    {
                        data.value
                    }

                </h3>
            </div>
            <div className={styles.mainContents}>
                <h3 className={styles.mainTitle}>Building Condition</h3>
                <h3 className={styles.mainStatus}>Stacked</h3>
            </div>
            <div className={styles.mainContents}>
                <h3 className={styles.mainTitle}>Storeys</h3>
                <h3 className={styles.mainStatus}>3</h3>
            </div>
            <div className={styles.mainContents}>
                <h3 className={styles.mainTitle}>Ground Surface</h3>
                <h3 className={styles.mainStatus}>Flat</h3>
            </div>
            <div className={styles.mainContents}>
                <h3 className={styles.mainTitle}>Foundation Type</h3>
                <h3 className={styles.mainStatus}>Stone in mud</h3>
            </div>
            <div className={styles.mainContents}>
                <h3 className={styles.mainTitle}>Roof</h3>
                <h3 className={styles.mainStatus}>Tile/Slate</h3>
            </div>
            <div className={styles.dummyBlankSpace} />
        </div>
    );
};

export default PopupOnMapClick;
