import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';

import Attribute from './Attribute';
import styles from './styles.scss';

type AttributeKey = 'hazard' | 'exposure' | 'vulnerability' | 'risk' | 'capacity-and-resources';

interface Props {
    className?: string;
    onAttributeClick: (key: AttributeKey) => void;
}

interface State {
}

interface AttributeItem {
    key: AttributeKey;
    title: string;
    description?: string;
}

const attributeList: AttributeItem[] = [
    {
        key: 'hazard',
        title: 'Hazard',
        description: 'Hazard is a phenomena or event that has the potential to cause damage/disruption to lives and livelihood',
    },
    {
        key: 'exposure',
        title: 'Exposure',
        description: 'The situation of people, infrastructure, housing, production capacities and other tangible human assets located in hazard-prone areas',
    },
    {
        key: 'vulnerability',
        title: 'Vulnerability',
        description: 'The conditions determined by physical, social, economics and environmental factors or processes which increase the susceptibility of an individual, a community, assets or systems to the impacts of hazards',
    },
    {
        key: 'risk',
        title: 'Risk',
        description: '-',
    },
    {
        key: 'capacity-and-resources',
        title: 'Capacity & resources',
        description: 'The strengths, attributes and resources available within the administrative area to manage and reduce disaster risks and strengthen resilience',
    },
];

const attributeListKeySelector = (d: AttributeItem) => d.key;

export default class Overview extends React.PureComponent<Props, State> {
    private getAttributeRendererParams = (_: string, attribute: AttributeItem) => ({
        attributeKey: attribute.key,
        title: attribute.title,
        description: attribute.description,
        onClick: this.props.onAttributeClick,
    })

    public render() {
        const {
            className,
        } = this.props;

        return (
            <div className={_cs(styles.overview, className)}>
                <header className={styles.header}>
                    Select an attribute to get started
                </header>
                <ListView
                    className={styles.content}
                    data={attributeList}
                    renderer={Attribute}
                    rendererParams={this.getAttributeRendererParams}
                    keySelector={attributeListKeySelector}
                />
            </div>
        );
    }
}
