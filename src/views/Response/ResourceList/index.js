import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';

import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';

import Button from '#rsca/Button';
import Spinner from '#rscz/Spinner';

import TabularView from './TabularView';

import Health from './resources/Health';
import Volunteer from './resources/Volunteer';
import Education from './resources/Education';
import Finance from './resources/Finance';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    pending: PropTypes.bool,
};

const defaultProps = {
    className: undefined,
    pending: false,
};

const resourceComponents = {
    health: Health,
    volunteer: Volunteer,
    education: Education,
    finance: Finance,
};

const Resource = ({
    type,
    ...otherProps
}) => {
    const ResourceComponent = resourceComponents[type];
    return (
        <ResourceComponent {...otherProps} />
    );
};
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
        this.setState({ showResource: true });
    }

    handleExpandButtonClick = () => {
        this.setState({ showTabular: true });
    }

    handleCollapseTabularViewButtonClick = () => {
        this.setState({ showTabular: false });
    }

    handleHideResourceButtonClick = () => {
        this.setState({ showResource: false });
    }

    render() {
        const {
            className,
            pending,
            resourceList,
        } = this.props;

        const {
            showResource,
            showTabular,
        } = this.state;


        this.resources = this.getResources(resourceList);
        const resourceKeys = Object.keys(this.resources);

        return (
            <CollapsibleView
                className={_cs(className, styles.rightPane)}
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
                                        Resources
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
                                <div className={_cs(className, styles.resourceList)}>
                                    <ListView
                                        data={resourceKeys}
                                        renderer={Resource}
                                        rendererParams={this.getResourceRendererParams}
                                    />
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
