import React from 'react';
import styles from './styles.scss';

interface Props {
    openspaceId?: any;
    allData: any;
}

class Info extends React.PureComponent<Props> {
    public render() {
        // eslint-disable-next-line react/destructuring-assignment
        const { totalArea, description, elevation } = this.props.allData;

        return (
            <div className={styles.infoContainer}>
                <div className={styles.areaInfo}>
                    <div className={styles.areaUnit}>
                        <div className={styles.upper}>
                            {totalArea || 'N/A'}
                            <span style={{ marginLeft: '3px' }}>sq.m </span>

                        </div>
                        <div className={styles.lower}> Total Area</div>
                    </div>
                    <div className={styles.areaUnit}>
                        <div className={styles.upper}>
                            {elevation || 'N/A'}
                            <span style={{ marginLeft: '3px' }}>m </span>

                        </div>
                        <div className={styles.lower}> Elevation</div>
                    </div>
                    {/*   <div className={styles.areaUnit}>
                        <div className={styles.upper}>
                            {(totalArea / 5).toFixed(0)}
                            persons
                        </div>
                        <div className={styles.lower}> Capacity</div>
                    </div> */}
                </div>

                <div className={styles.description}>{description}</div>
            </div>
        );
    }
}

export default Info;
