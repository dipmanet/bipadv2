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

import { Translation } from 'react-i18next';
import ListView from '#rscv/List/ListView';
import Button from '#rsca/Button';
import StatOutput from '#components/StatOutput';
import { saveChart } from '#utils/common';

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

    handleSaveClick = () => {
        // saveChart('drrCycleData', 'drrCycle');
        // saveChart('categoryData', 'category');
        saveChart('projectOrganizationData', 'projectOrganization');
    }

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
            projectOrganizationPieData,
        } = this.props;
        return (
            <div className={_cs(className, styles.leftPane)}>
                <div className={styles.visualizations}>
                    { projects && projects.length > 0 && (
                        <div className={styles.container}>
                            <Button
                                title="Download Chart"
                                className={styles.chartDownload}
                                transparent
                                onClick={this.handleSaveClick}
                                iconName="download"
                            />
                            <div
                                className={styles.chartContainer}
                            >
                                <div
                                    className={styles.chart}
                                    // id="drrCycleData"
                                    id="projectOrganizationData"
                                >
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                // data={drrCycleData}
                                                data={projectOrganizationPieData}
                                                dataKey="value"
                                                nameKey="label"
                                                innerRadius="60%"
                                                outerRadius="70%"
                                                label
                                            >
                                                {/* { drrCycleData.map(d => (
                                                    <Cell key={d.label} fill={d.color} />
                                                ))} */}
                                                { projectOrganizationPieData.map(d => (
                                                    <Cell key={d.label} fill={d.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend
                                                align="left"
                                                iconSize={10}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* <div
                                    className={styles.chart}
                                    id="categoryData"
                                >
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                dataKey="value"
                                                nameKey="label"
                                                innerRadius="60%"
                                                outerRadius="70%"
                                                label
                                            >
                                                { categoryData.map(d => (
                                                    <Cell key={d.label} fill={d.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend
                                                align="left"
                                                iconSize={10}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div> */}
                            </div>
                        </div>
                    )}
                </div>
                <Translation>
                    {
                        t => (
                            <StatOutput
                                className={styles.stat}
                                label={t('No. of Projects')}
                                value={projects.length}
                            />
                        )
                    }
                </Translation>

                <ListView
                    className={styles.projectsList}
                    data={projects}
                    renderer={Project}
                    keySelector={projectKeySelector}
                    rendererParams={this.projectRendererParams}
                />
            </div>
        );
    }
}

export default ProjectsProfileLeftPane;
