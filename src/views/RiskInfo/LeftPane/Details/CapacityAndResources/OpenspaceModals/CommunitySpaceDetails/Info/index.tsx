import React, { Component } from 'react';
import styles from './styles.scss';

interface Props {
    openspaceId?: any;
    allData: any;
}

class Info extends React.PureComponent<Props> {
    public render() {
        const { usableArea, totalArea, description } = this.props.allData;

        return (
            <div className={styles.infoContainer}>
                <div className={styles.areaInfo}>
                    <div className={styles.areaUnit}>
                        <div className={styles.upper}>
                            {totalArea || 'N/A'}
                            sq.m
                        </div>
                        <div className={styles.lower}> Total Area</div>
                    </div>
                    <div className={styles.areaUnit}>
                        <div className={styles.upper}>
                            {usableArea || 'N/A'}
                            sq.m
                        </div>
                        <div className={styles.lower}> Usable Area</div>
                    </div>
                    <div className={styles.areaUnit}>
                        <div className={styles.upper}>
                            {(totalArea / 5).toFixed(0)}
                            persons
                        </div>
                        <div className={styles.lower}> Capacity</div>
                    </div>
                </div>

                <div className={styles.description}>{description}</div>
            </div>
        );
    }
}

export default Info;
