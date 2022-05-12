import React, { useEffect, useState } from 'react';
import Loader from 'react-loader';
import styles from './styles.scss';

interface Props {
    mainType: string;
    data: any;
    houseId: number;
}

const PopupOnMapClick = (props: Props) => {
    const { mainType, data, houseId } = props;
    const [houseData, setHouseData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHouseData = async () => {
            const housedata = await fetch(
                `${process.env.REACT_APP_API_SERVER_URL}/vizrisk-household/${houseId}/?meta=true`,
            ).then(res => res.json());
            setHouseData(housedata);
            setLoading(false);
        };
        fetchHouseData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    console.log('houseData', houseData);

    return (
        <div
            className={styles.popupOnMapClick}
            id="mainPopUp"
            style={{ border: `1px solid ${data.color}` }}
        >
            {
                loading ? (
                    <div style={{
                        display: 'flex',
                        height: 150,
                        width: 240,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    >
                        <Loader />
                    </div>
                ) : (
                    <>
                        <h2 className={styles.titleType}>
                            House ID :
                            {data.id}
                        </h2>
                        <div className={styles.mainContents}>
                            <h3
                                style={{ color: data.color }}
                                className={styles.mainTitle}
                            >
                                {mainType}

                            </h3>
                            <h3 style={{ color: data.color }} className={styles.mainStatus}>
                                {
                                    data.value
                                }

                            </h3>
                        </div>
                        <div className={styles.mainContents}>
                            <h3 className={styles.mainTitle}>Building Condition</h3>
                            <h3 className={styles.mainStatus}>
                                {houseData.metadata.houseCondition}

                            </h3>
                        </div>
                        <div className={styles.mainContents}>
                            <h3 className={styles.mainTitle}>Storeys</h3>
                            <h3 className={styles.mainStatus}>
                                {houseData.metadata.houseStoreys}

                            </h3>
                        </div>
                        <div className={styles.mainContents}>
                            <h3 className={styles.mainTitle}>Ground Surface</h3>
                            <h3 className={styles.mainStatus}>
                                {houseData.metadata.houseGroundSurface}

                            </h3>
                        </div>
                        <div className={styles.mainContents}>
                            <h3 className={styles.mainTitle}>Foundation Type</h3>
                            <h3 className={styles.mainStatus}>
                                {houseData.metadata.houseFoundationType}

                            </h3>
                        </div>
                        <div className={styles.mainContents}>
                            <h3 className={styles.mainTitle}>Roof</h3>
                            <h3 className={styles.mainStatus}>
                                {houseData.metadata.houseRoofType}

                            </h3>
                        </div>
                        <div className={styles.dummyBlankSpace} />
                    </>
                )
            }

        </div>
    );
};

export default PopupOnMapClick;
