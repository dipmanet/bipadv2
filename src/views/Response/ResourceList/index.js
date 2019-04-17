import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';

import CollapsibleView from '#components/CollapsibleView';
import IncidentInfo from '#components/IncidentInfo';
import { iconNames } from '#constants';

import Button from '#rsca/Button';
import Spinner from '#rscz/Spinner';

import healthFacilityIcon from '#resources/icons/health-facility.svg';
import educationIcon from '#resources/icons/Education.svg';
import financeIcon from '#resources/icons/University.svg';
import groupIcon from '#resources/icons/group.svg';

import ResourceGroup from '../ResourceGroup';

import TabularView from './TabularView';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    pending: PropTypes.bool,
    resourceList: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
    className: undefined,
    resourceList: [],
    pending: false,
};

const resourceComponentsProps = {
    health: {
        heading: 'Health facilities',
        icon: healthFacilityIcon,
    },
    volunteer: {
        heading: 'Volunteers',
        icon: groupIcon,
    },
    education: {
        heading: 'Schools',
        icon: educationIcon,
    },
    finance: {
        heading: 'Finance Institutes',
        icon: financeIcon,
    },
};

const Resource = ({ type, ...otherProps }) => (
    <ResourceGroup
        {...resourceComponentsProps[type] || {}}
        {...otherProps}
    />
);

Resource.propTypes = {
    type: PropTypes.string.isRequired,
};

export default class Response extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showResource: true,
            showTabular: false,
        };
    }

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

    handleShowResourceButtonClick = () => {
        const { onExpandChange } = this.props;
        this.setState({ showResource: true });

        if (onExpandChange) {
            onExpandChange(true);
        }
    }

    handleHideResourceButtonClick = () => {
        const { onExpandChange } = this.props;
        this.setState({ showResource: false });

        if (onExpandChange) {
            onExpandChange(false);
        }
    }

    handleExpandButtonClick = () => {
        this.setState({ showTabular: true });
    }

    handleCollapseTabularViewButtonClick = () => {
        this.setState({ showTabular: false });
    }

    render() {
        const {
            className,
            pending,
            resourceList,
            incident,
            wardsMap,
        } = this.props;

        const {
            showResource,
            showTabular,
        } = this.state;

        this.resources = this.getResources(resourceList);
        const resourceKeys = Object.keys(this.resources);

        return (
            <CollapsibleView
                className={_cs(className, styles.leftPane)}
                expanded={showResource}
                collapsedViewContainerClassName={styles.showResourceButtonContainer}
                collapsedView={
                    <React.Fragment>
                        <Button
                            className={styles.showResourceButton}
                            onClick={this.handleShowResourceButtonClick}
                            iconName={iconNames.resource}
                            title="Show Resources"

                        />
                        <Spinner loading={pending} />
                    </React.Fragment>
                }
                expandedViewContainerClassName={styles.resourceContainer}
                expandedView={
                    <CollapsibleView
                        expanded={showTabular}
                        collapsedViewContainerClassName={styles.nonTabularContainer}
                        collapsedView={
                            <div className={styles.resource}>
                                <header className={styles.header}>
                                    <h4 className={styles.heading}>
                                        Incident details
                                    </h4>
                                    <Spinner loading={pending} />
                                    <Button
                                        onClick={this.handleExpandButtonClick}
                                        iconName={iconNames.expand}
                                        title="Show detailed view"
                                        transparent
                                    />
                                    <Button
                                        className={styles.hideResourceButton}
                                        onClick={this.handleHideResourceButtonClick}
                                        iconName={iconNames.chevronUp}
                                        title="Close Resources"
                                        transparent
                                    />
                                </header>
                                <div className={_cs(className, styles.content)}>
                                    <IncidentInfo
                                        className={styles.incidentInfo}
                                        incident={incident}
                                        wardsMap={wardsMap}
                                        hideLink
                                    />
                                    <div className={styles.resourceListContainer}>
                                        <h2 className={styles.heading}>
                                            Resources
                                        </h2>
                                        <ListView
                                            className={styles.resourceList}
                                            data={resourceKeys}
                                            renderer={Resource}
                                            rendererParams={this.getResourceRendererParams}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                        expandedViewContainerClassName={styles.tabularContainer}
                        expandedView={
                            <React.Fragment>
                                <header className={styles.header}>
                                    <h4 className={styles.heading}>
                                        Resources
                                    </h4>
                                    <Spinner loading={pending} />
                                    <Button
                                        className={styles.hideResourceButton}
                                        onClick={this.handleCollapseTabularViewButtonClick}
                                        iconName={iconNames.shrink}
                                        title="Hide detailed view"
                                        transparent
                                    />
                                    <Button
                                        onClick={this.handleHideResourceButtonClick}
                                        iconName={iconNames.chevronUp}
                                        title="Close Resources"
                                        transparent
                                    />
                                </header>
                                <TabularView
                                    resourceList={resourceList}
                                    className={styles.tabularView}
                                />
                            </React.Fragment>
                        }
                    />
                }
            />
        );
    }
}
