import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rsu/../v2/View/ListView';

import { AttributeKey } from '#types';
import Attribute from './Attribute';
import styles from './styles.scss';

interface Props {
    className?: string;
    onAttributeClick: (key: AttributeKey) => void;
    titleShown: boolean;
    activeAttribute: AttributeKey;
}

interface AttributeItem {
    key: AttributeKey;
    title: string;
    description?: string;
    color?: string;
    icon: string;
}

const attributeList: AttributeItem[] = [
    {
        key: 'hazard',
        title: 'Hazard',
        description: 'Hazard is a phenomena or event that has the potential to cause damage/disruption to lives and livelihood',
        color: '#e53935',
        icon: 'H',
    },
    {
        key: 'exposure',
        title: 'Exposure',
        description: 'The situation of people, infrastructure, housing, production capacities and other tangible human assets located in hazard-prone areas',
        color: '#8e24aa',
        icon: 'E',
    },
    {
        key: 'vulnerability',
        title: 'Vulnerability',
        description: 'The conditions determined by physical, social, economics and environmental factors or processes which increase the susceptibility of an individual, a community, assets or systems to the impacts of hazards',
        color: '#7c6200',
        icon: 'V',
    },
    {
        key: 'risk',
        title: 'Risk',
        description: '-',
        color: '#ff8f00',
        icon: 'R',
    },
    {
        key: 'capacity-and-resources',
        title: 'Capacity & resources',
        description: 'The strengths, attributes and resources available within the administrative area to manage and reduce disaster risks and strengthen resilience',
        color: '#1976d2',
        icon: 'CR',
    },
    {
        key: 'climate-change',
        title: 'Climate change',
        description: 'Climate change occurs when changes in Earth\'s climate system result in new weather patterns that last for at least a few decades, and maybe for millions of years.',
        color: '#689f38',
        icon: 'CC',
    },
];

const attributeListKeySelector = (d: AttributeItem) => d.key;

export default class Overview extends React.PureComponent<Props> {
    private getAttributeRendererParams = (_: string, attribute: AttributeItem) => ({
        attributeKey: attribute.key,
        title: attribute.title,
        icon: attribute.icon,
        description: attribute.description,
        onClick: this.props.onAttributeClick,
        className: styles.attribute,
        titleShown: this.props.titleShown,
        isActive: this.props.activeAttribute === attribute.key,
    })

    public render() {
        const {
            className,
        } = this.props;

        return (
            <ListView
                className={_cs(styles.overview, className)}
                data={attributeList}
                renderer={Attribute}
                rendererParams={this.getAttributeRendererParams}
                keySelector={attributeListKeySelector}
            />
        );
    }
}
