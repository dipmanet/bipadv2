import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Chart from '../Chart';

import styles from './styles.scss';

interface Props {
    className?: string;
}

interface Params {}

const attributes = {
    estimatedTotalLoss: 'Estimated loss',
    incidentCount: 'Incidents',
    livestockDestroyedCount: 'Livestock destroyed',
    peopleDeathCount: 'Death',
    peopleInjuredCount: 'Injury',
    peopleMissingCount: 'Missing',
    totalInfrastructureDestroyedCount: 'Infrastructures destroyed',
};

const attributeKeyList = Object.keys(attributes);

class Disasters extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            data,
        } = this.props;

        return (
            <div className={_cs(styles.disasters, className)}>
                <header className={styles.header}>
                    <h2 className={styles.heading}>
                        Loss by year
                    </h2>
                </header>
                <div className={styles.content}>
                    {attributeKeyList.map(key => (
                        <Chart
                            key={key}
                            attributeKey={key}
                            attributeName={attributes[key]}
                            data={data}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default Disasters;
