import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import PrimaryButton from '#rsca/Button/PrimaryButton';
import TextOutput from '#components/TextOutput';
import Button from '#rsca/Button';
import ListView from '#rscv/List/ListView';
import DonutChart from '#rscz/DonutChart';
import CollapsibleView from '#components/CollapsibleView';
import Legend from '#rscz/Legend';
import { iconNames } from '#constants';

import Project from './ProjectItem';
import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

const testProjects = [
    {
        key: 1,
        title: 'Project 1',
    },
    {
        key: 2,
        title: 'Project 2',
    },
    {
        key: 3,
        title: 'Project 3',
    },
];

const testDrrCyclesData = [
    {
        key: 1,
        label: 'Cycle 1',
        value: 22,
        color: '#a6cee3',
    },
    {
        key: 2,
        label: 'Cycle 2',
        value: 12,
        color: '#1f78b4',
    },
    {
        key: 3,
        label: 'Cycle 3',
        value: 9,
        color: '#b2df8a',
    },
];

const itemSelector = d => d.label;
const legendColorSelector = d => d.color;
const legendLabelSelector = d => d.label;

const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;
const donutChartColorSelector = d => d.color;

const projectKeySelector = p => p.key;

class ProjectsProfileLeftPane extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {};
    }

    handleExpand = () => {
        this.props.onExpandChange(true);
    }

    handleContract = () => {
        this.props.onExpandChange(false);
    }

    projectRendererParams = (projectId, project) => ({
        title: project.title,
        projectId,
    });

    render() {
        const {
            leftPaneExpanded,
        } = this.props;

        return (
            <CollapsibleView
                className={styles.legend}
                expanded={leftPaneExpanded}
                collapsedViewContainerClassName={styles.showLegendButtonContainer}
                collapsedView={
                    <PrimaryButton
                        onClick={this.handleExpand}
                        title="Show filters"
                    >
                        Show Summary
                    </PrimaryButton>
                }
                expandedViewContainerClassName={styles.summary}
                expandedView={
                    <React.Fragment>
                        <header className={styles.header}>
                            <h4>Summary</h4>
                            <Button
                                onClick={this.handleContract}
                                iconName={iconNames.chevronUp}
                                title="Hide Filters"
                                transparent
                            />
                        </header>
                        <div className={styles.content}>
                            <div className={styles.statsContainer}>
                                <TextOutput
                                    type="block"
                                    label="No. of Projects"
                                    value={testProjects.length}
                                    isNumericValue
                                />
                                <DonutChart
                                    sideLengthRatio={0.5}
                                    className={styles.chart}
                                    data={testDrrCyclesData}
                                    labelSelector={donutChartLabelSelector}
                                    valueSelector={donutChartValueSelector}
                                    colorSelector={donutChartColorSelector}
                                />
                                <Legend
                                    className={styles.legend}
                                    data={testDrrCyclesData}
                                    itemClassName={styles.legendItem}
                                    keySelector={itemSelector}
                                    labelSelector={legendLabelSelector}
                                    colorSelector={legendColorSelector}
                                />
                            </div>
                            <div className={styles.projectsList}>
                                <h3 className={styles.heading}>
                                    Projects
                                </h3>
                                <ListView
                                    data={testProjects}
                                    renderer={Project}
                                    keySelector={projectKeySelector}
                                    rendererParams={this.projectRendererParams}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                }
            />
        );
    }
}

export default ProjectsProfileLeftPane;
