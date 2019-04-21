import React from 'react';

import PrimaryButton from '#rsca/Button/PrimaryButton';
import Button from '#rsca/Button';
import ListView from '#rscv/List/ListView';
import DonutChart from '#rscz/DonutChart';
import Legend from '#rscz/Legend';

import TextOutput from '#components/TextOutput';
import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';

import Project from './ProjectItem';
import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

const itemSelector = d => d.label;
const legendColorSelector = d => d.color;
const legendLabelSelector = d => d.label;

const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;
const donutChartColorSelector = d => d.color;

const projectKeySelector = p => p.pid;

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
        title: project.ptitle,
        start: project.pdurfrom,
        end: project.pdurto,
        budget: project.budget_local,
        projectId,
    });

    render() {
        const {
            leftPaneExpanded,
            projects,
            drrCycleData,
            categoryData,
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
                                    value={projects.length}
                                    isNumericValue
                                />
                                <DonutChart
                                    sideLengthRatio={0.5}
                                    className={styles.chart}
                                    data={drrCycleData}
                                    labelSelector={donutChartLabelSelector}
                                    valueSelector={donutChartValueSelector}
                                    colorSelector={donutChartColorSelector}
                                />
                                <Legend
                                    className={styles.legend}
                                    data={drrCycleData}
                                    itemClassName={styles.legendItem}
                                    keySelector={itemSelector}
                                    labelSelector={legendLabelSelector}
                                    valueSelector={donutChartValueSelector}
                                    colorSelector={legendColorSelector}
                                />
                                <DonutChart
                                    sideLengthRatio={0.5}
                                    className={styles.chart}
                                    data={categoryData}
                                    labelSelector={donutChartLabelSelector}
                                    valueSelector={donutChartValueSelector}
                                    colorSelector={donutChartColorSelector}
                                />
                                <Legend
                                    className={styles.legend}
                                    data={categoryData}
                                    itemClassName={styles.legendItem}
                                    keySelector={itemSelector}
                                    labelSelector={legendLabelSelector}
                                    valueSelector={donutChartValueSelector}
                                    colorSelector={legendColorSelector}
                                />
                            </div>
                            <div className={styles.projectsList}>
                                <h3 className={styles.heading}>
                                    Projects
                                </h3>
                                <ListView
                                    data={projects}
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
