import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';


import CollapsibleView from '#components/CollapsibleView';
import IncidentInfo from '#components/IncidentInfo';
import { iconNames } from '#constants';

import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';

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

export default class ResourceList extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showResource: true,
            showTabular: false,
        };
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
            incident,
            pending,
            resourceList,
            wardsMap,
            provincesMap,
            districtsMap,
            municipalitiesMap,
        } = this.props;

        const {
            showResource,
            showTabular,
        } = this.state;

        return (
            <CollapsibleView
                className={_cs(className, styles.leftPane)}
                expanded={showResource}
                collapsedViewContainerClassName={styles.showResourceButtonContainer}
                collapsedView={
                    <React.Fragment>
                        <PrimaryButton
                            onClick={this.handleShowResourceButtonClick}
                            title="Show details"
                        >
                            Show details
                        </PrimaryButton>
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
                                        title="Hide details"
                                        transparent
                                    />
                                </header>
                                <div className={_cs(className, styles.content)}>
                                    <IncidentInfo
                                        className={styles.incidentInfo}
                                        incident={incident}
                                        wardsMap={wardsMap}
                                        provincesMap={provincesMap}
                                        districtsMap={districtsMap}
                                        municipalitiesMap={municipalitiesMap}
                                        hideLink
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
                                    <Button
                                        className={styles.hideResourceButton}
                                        onClick={this.handleCollapseTabularViewButtonClick}
                                        iconName={iconNames.chevronUp}
                                        title="Hide detailed view"
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
