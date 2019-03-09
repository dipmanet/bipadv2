import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';

import Health from './resources/Health';
import Volunteer from './resources/Volunteer';
import Education from './resources/Education';
import Finance from './resources/Finance';
import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

const resourceComponents = {
    health: Health,
    volunteer: Volunteer,
    education: Education,
    finance: Finance,
};

const resourceKeySelector = d => d.id;

const Resource = ({
    type,
    ...otherProps
}) => {
    const ResourceComponent = resourceComponents[type];
    return (
        <ResourceComponent {...otherProps} />
    );
};

export default class Response extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    getResourceRendererParams = d => ({
        type: d,
        data: this.resources[d],
    })

    getResources = (resourceList) => {
        const resources = {
            health: [],
            volunteer: [],
            education: [],
            finance: [],
        };

        resourceList.forEach((r) => {
            resources[r.resourceType].push(r);
        });

        return resources;
    }

    render() {
        const {
            className,
            resourceList,
        } = this.props;

        this.resources = this.getResources(resourceList);
        const resourceKeys = Object.keys(this.resources);

        return (
            <div className={_cs(className, styles.resourceList)}>
                <ListView
                    data={resourceKeys}
                    renderer={Resource}
                    rendererParams={this.getResourceRendererParams}
                />
            </div>
        );
    }
}
