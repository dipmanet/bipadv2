import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
    mapToList,
    isNotDefined,
    listToMap,
    getHexFromString,
    _cs,
} from '@togglecorp/fujs';
import { groupList } from '#utils/common';

import {
    regionsSelector,
    regionLevelSelector,
    projectsProfileFiltersSelector,
} from '#selectors';

import Loading from '#components/Loading';
import PageContext from '#components/PageContext';
import { TitleContext } from '#components/TitleContext';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';
import {
    isAnyRequestPending,
    getResults,
} from '#utils/request';

import ProjectsProfileFilter from './Filter';
import LeftPane from './LeftPane';
import Map from './Map';

import styles from './styles.scss';

const emptyList = [];


class ProjectsProfile extends React.PureComponent {
    render() {
        const {
            regions,
            regionLevel,
            className,
            filteredProjects,
            drrPieData,
            categoryPieData,
            drrCycleMap,
            categoryMap,
            organizationMap,
            projectMap,
            projectOrganizationPieData,
            pending,
            showFilterOnly,
            getSelectedOption,
            getPriorityOptions,
            getSubPriorityAction,
            getPriorityActivity,
        } = this.props;


        const ndrrsap = getResults(requests, 'ndrrsapRequest');
        const drrcycle = getResults(requests, 'drrcycleRequest');
        const category = getResults(requests, 'categoryRequest');
        const organization = getResults(requests, 'organizationRequest');
        const projects = getResults(requests, 'projectRequest');
        const pending = isAnyRequestPending(requests);
        const projectsWithOrganizationName = combineEntities(projects, organization);
        const projectOrganizationGrouped = groupList(
            projectsWithOrganizationName.filter(e => e.oname),
            project => project.oname,
        );
        // NDRRSAP

        const ndrrsapMap = listToMap(ndrrsap, ndrrsapKeySelector, item => item);
        const priorityOptions = unflatten(ndrrsap, ndrrsapKeySelector, ndrrsapParentSelector);
        if (getSubPriorityAction) {
            getSubPriorityAction(ndrrsap);
        }

        let subPriorityOptions = emptyList;
        const selectedPriority = priorityOptions.find(
            item => ndrrsapKeySelector(item) === faramValues.priority,
        );
        if (selectedPriority) {
            subPriorityOptions = selectedPriority.children;
        }

        let activityOptions = emptyList;
        const selectedSubPriority = subPriorityOptions.find(
            item => ndrrsapKeySelector(item) === faramValues.subPriority,
        );
        if (selectedSubPriority) {
            activityOptions = selectedSubPriority.children;
        }

        // PROJECTS

        // const realProjects = sanitize(projects, regions, ndrrsapMap);
        const realProjects = sanitize(projectsWithOrganizationName, regions, ndrrsapMap);
        const filteredProjects = filter(realProjects, faramValues);

        const drrPieData = drrcycle.map(item => ({
            key: drrCyclesKeySelector(item),
            label: drrCyclesLabelSelector(item),
            value: filteredProjects.filter(p => p.drrcycle[drrCyclesKeySelector(item)]).length,
            color: getHexFromString(drrCyclesLabelSelector(item)),
        }));

        const categoryPieData = category.map(item => ({
            key: categoryKeySelector(item),
            label: categoryLabelSelector(item),
            value: filteredProjects.filter(p => p.category[categoryKeySelector(item)]).length,
            color: getHexFromString(categoryLabelSelector(item)),
        }));

        const projectOrganizationPieData = projectOrganizationGrouped.map(item => ({
            key: item.key,
            label: item.key,
            value: filteredProjects.filter(p => p.oname === item.key).length,
            color: getHexFromString(item.key),
        })).filter(data => data.value !== 0);

        // AGGREGATIONS
        const organizationMap = listToMap(organization, organizationKeySelector, item => item);
        const projectMap = listToMap(projects, projectKeySelector, item => item);
        const drrCycleMap = listToMap(drrcycle, drrCycleKeySelector, item => item);
        const categoryMap = listToMap(category, categoryKeySelector, item => item);

        return (
            <TitleContext.Consumer>
                {(titleContext) => {
                    const { setProfile } = titleContext;

                    if (setProfile) {
                        setProfile((prevProfile) => {
                            if (prevProfile.mainModule !== 'Projects') {
                                return { ...prevProfile, mainModule: 'Projects' };
                            }
                            return prevProfile;
                        });
                    }
                    return (
                        <React.Fragment>
                            <Loading pending={pending} />
                            <Map
                                projects={filteredProjects}
                                regions={regions}
                                regionLevel={regionLevel}
                            />
                            <LeftPane
                                className={_cs(styles.leftPane, className)}
                                projects={filteredProjects}
                                drrCycleData={drrPieData}
                                categoryData={categoryPieData}
                                drrCycleMap={drrCycleMap}
                                categoryMap={categoryMap}
                                organizationMap={organizationMap}
                                projectMap={projectMap}
                                projectOrganizationPieData={projectOrganizationPieData}


                            />
                            {/* <ProjectsProfileFilter
                                drrCycleOptions={drrcycle}
                                elementsOptions={category}
                                organizationOptions={organization}
                                priorityOptions={priorityOptions}
                                subPriorityOptions={subPriorityOptions}
                                activityOptions={activityOptions}
                                showFilterOnly
                                getSelectedOption={getSelectedOption}
                            />


                            /> */}
                        </React.Fragment>
                    );
                }
                }
            </TitleContext.Consumer>
        );
    }
}

ProjectsProfile.contextType = PageContext;

export default compose(
    connect(),
    createConnectedRequestCoordinator(),
    createRequestClient(),
)(ProjectsProfile);
