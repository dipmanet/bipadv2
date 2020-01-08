import React from 'react';
import { _cs } from '@togglecorp/fujs';

import MultiViewContainer from '#rscv/MultiViewContainer';

import Hazard from './Hazard';
import Exposure from './Exposure';
import Vulnerability from './Vulnerability';
import Risk from './Risk';
import CapacityAndResources from './CapacityAndResources';
import ClimateChange from './ClimateChange';
import { LayerMap, LayerGroup } from '#store/atom/page/types';
import { AttributeKey } from '#types';

import styles from './styles.scss';

interface Props {
    className?: string;
    layerMap: LayerMap;
    layerGroupList: LayerGroup[];
    attribute?: AttributeKey;
}

interface State {
}

export default class Details extends React.PureComponent<Props, State> {
    private views = {
        hazard: {
            title: 'Hazard',
            component: Hazard,
            rendererParams: () => ({
                className: styles.content,
                layerList: this.props.layerMap.hazard || [],
                layerGroupList: this.props.layerGroupList,
            }),
        },
        exposure: {
            title: 'Exposure',
            component: Exposure,
            rendererParams: () => ({
                className: styles.content,
                layerList: this.props.layerMap.exposure || [],
                layerGroupList: this.props.layerGroupList,
            }),
        },
        vulnerability: {
            title: 'Vulnerability',
            component: Vulnerability,
            rendererParams: () => ({
                className: styles.content,
                layerList: this.props.layerMap.vulnerability || [],
                layerGroupList: this.props.layerGroupList,
            }),
        },
        risk: {
            title: 'Risk',
            component: Risk,
            rendererParams: () => ({
                className: styles.content,
                layerList: this.props.layerMap.risk || [],
                layerGroupList: this.props.layerGroupList,
            }),
        },
        'capacity-and-resources': {
            title: 'Capacity & resources',
            component: CapacityAndResources,
            rendererParams: () => ({
                className: styles.content,
                layerList: this.props.layerMap.capacity_resource || [],
                layerGroupList: this.props.layerGroupList.filter(group => group.category === 'capacity_resource'),
            }),
        },
        'climate-change': {
            title: 'Climate change',
            component: ClimateChange,
            rendererParams: () => ({
                className: styles.content,
                layerList: this.props.layerMap.climate || [],
                layerGroupList: this.props.layerGroupList,
            }),
        },
    }

    public render() {
        const {
            className,
            attribute,
        } = this.props;

        // const headingText = this.views[attribute].title;

        return (
            <div className={_cs(styles.details, className)}>
                <MultiViewContainer
                    views={this.views}
                    active={attribute}
                />
            </div>
        );
    }
}
