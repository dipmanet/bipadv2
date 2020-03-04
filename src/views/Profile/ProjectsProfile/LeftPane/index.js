import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    ResponsiveContainer,
    Tooltip,
    Legend,
    Pie,
    Cell,
    PieChart,
} from 'recharts';

import ListView from '#rscv/List/ListView';

import StatOutput from '#components/StatOutput';

import Project from './ProjectItem';
import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

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
                    <StatOutput
                        label="No. of Projects"
                        value={projects.length}
                    />
                    { projects && projects.length > 0 && (
                        <div>
                            <div className={styles.chart}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={drrCycleData}
                                            dataKey="value"
                                            nameKey="label"
                                            innerRadius="60%"
                                            outerRadisu="90%"
                                            label
                                        >
                                            { drrCycleData.map(d => (
                                                <Cell key={d.label} fill={d.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={styles.chart}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            dataKey="value"
                                            nameKey="label"
                                            innerRadius="60%"
                                            outerRadisu="90%"
                                            label
                                        >
                                            { categoryData.map(d => (
                                                <Cell key={d.label} fill={d.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
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
