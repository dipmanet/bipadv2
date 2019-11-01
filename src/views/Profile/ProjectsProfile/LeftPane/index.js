import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import ListView from '#rscv/List/ListView';
import DonutChart from '#rscz/DonutChart';
import Legend from '#rscz/Legend';

import TextOutput from '#components/TextOutput';
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

    handleExpand = () => {
        this.props.onExpandChange(true);
    }

    handleContract = () => {
        this.props.onExpandChange(false);
    }

    projectRendererParams = (projectId, project) => {
        const {
            projectMap,
            organizationMap,
            drrCycleMap,
            categoryMap,
        } = this.props;

        return ({
            title: project.ptitle,
            start: project.pdurfrom,
            end: project.pdurto,
            budget: project.budget_local,
            projectId,
            ...projectMap[projectId],
            organizationMap,
            drrCycleMap,
            categoryMap,
        });
    }

    render() {
        const {
            leftPaneExpanded,
            projects,
            drrCycleData,
            categoryData,
            projectMap,
            className,
        } = this.props;

        return (
            <div className={_cs(className, styles.leftPane)}>
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
        );
    }
}

export default ProjectsProfileLeftPane;
