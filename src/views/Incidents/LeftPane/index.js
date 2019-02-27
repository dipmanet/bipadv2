import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';
import Button from '#rsca/Button';

import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';

import IncidentItem from '../IncidentItem';
import TabularView from './TabularView';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: undefined,
};

const incidentKeySelector = d => d.id;

export default class LeftPane extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showIncidents: true,
            showTabular: false,
        };
    }

    getIncidentRendererParams = (_, d) => ({
        data: d,
        className: styles.incident,
    });

    handleCollapseTabularViewButtonClick = () => {
        this.setState({ showTabular: false });
    }

    handleExpandButtonClick = () => {
        this.setState({ showTabular: true });
    }


    handleShowIncidentsButtonClick = () => {
        this.setState({ showIncidents: true });
    }

    handleHideIncidentsButtonClick = () => {
        this.setState({ showIncidents: false });
    }

    render() {
        const {
            className,
            incidentList,
        } = this.props;

        const {
            showIncidents,
            showTabular,
        } = this.state;

        return (
            <CollapsibleView
                className={_cs(className, styles.leftPane)}
                expanded={showIncidents}
                collapsedViewContainerClassName={styles.showIncidentsButtonContainer}
                collapsedView={
                    <Button
                        className={styles.showIncidentsButton}
                        onClick={this.handleShowIncidentsButtonClick}
                        iconName={iconNames.incident}
                        title="Show alerts"
                    />
                }
                expandedViewContainerClassName={styles.incidentListContainer}
                expandedView={
                    <CollapsibleView
                        expanded={showTabular}
                        collapsedViewContainerClassName={styles.nonTabularContainer}
                        collapsedView={
                            <React.Fragment>
                                <header className={styles.header}>
                                    <h4 className={styles.heading}>
                                        Incidents
                                    </h4>
                                    <Button
                                        className={styles.expandTabularViewButton}
                                        onClick={this.handleExpandButtonClick}
                                        iconName={iconNames.expand}
                                        title="Show detailed view"
                                        transparent
                                    />
                                    <Button
                                        className={styles.hideIncidentsButton}
                                        onClick={this.handleHideIncidentsButtonClick}
                                        iconName={iconNames.chevronUp}
                                        title="Hide Incidents"
                                        transparent
                                    />
                                </header>
                                <ListView
                                    className={styles.incidentList}
                                    data={incidentList}
                                    renderer={IncidentItem}
                                    rendererParams={this.getIncidentRendererParams}
                                    keySelector={incidentKeySelector}
                                />
                            </React.Fragment>
                        }
                        expandedViewContainerClassName={styles.tabularContainer}
                        expandedView={
                            <React.Fragment>
                                <header className={styles.header}>
                                    <Button
                                        className={styles.collapseTabularViewButton}
                                        onClick={this.handleCollapseTabularViewButtonClick}
                                        iconName={iconNames.shrink}
                                        title="Hide detailed view"
                                        transparent
                                    />
                                    <Button
                                        className={styles.hideIncidentsButton}
                                        onClick={this.handleHideIncidentsButtonClick}
                                        iconName={iconNames.chevronUp}
                                        title="Hide Incidents"
                                        transparent
                                    />
                                </header>
                                <TabularView
                                    incidentList={incidentList}
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

