import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';
import ListView from '#rscv/List/ListView';

import { RiskElement } from '#types';

import RiskItem from './RiskItem';

interface Props {
    className?: string;
}

interface State {
}

const riskList: RiskElement[] = [
    {
        key: 1,
        title: 'Durham Earthquake Risk Data',
        description: 'durham earthquake risk data desc durham earthquake risk data desc',
    },
    {
        key: 2,
        title: 'Durham Landslide Risk Data',
        description: 'durham landslide risk data desc',
    },
];

const riskListKeySelector = (d: RiskElement) => d.key;

export default class Risk extends React.PureComponent<Props, State> {
    private getRiskItemRendererParams = (_: number, item: RiskElement) => ({
        title: item.title,
        description: item.description,
        className: styles.item,
    });

    public render() {
        const {
            className,
        } = this.props;

        return (
            <div className={_cs(styles.risk, className)}>
                <ListView
                    data={riskList}
                    className={styles.riskList}
                    keySelector={riskListKeySelector}
                    rendererParams={this.getRiskItemRendererParams}
                    renderer={RiskItem}
                />
            </div>
        );
    }
}
