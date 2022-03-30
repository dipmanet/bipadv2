import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import CommonMap from '#components/CommonMap';
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
                    <Translation>
                        {
                            t => (
                                <h2 className={styles.heading}>
                                    {t('Loss by year')}
                                </h2>
                            )
                        }
                    </Translation>

                </header>
                <div className={styles.content}>
                    <CommonMap
                        sourceKey="profile-disaster"
                    />
                    {attributeKeyList.map(key => (
                        <Translation>
                            {
                                t => (
                                    <Chart
                                        key={key}
                                        attributeKey={key}
                                        attributeName={t(attributes[key])}
                                        data={data}
                                    />
                                )
                            }
                        </Translation>

                    ))}
                </div>
            </div>
        );
    }
}

export default Disasters;
