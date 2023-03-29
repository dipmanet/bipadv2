import React from 'react';
import { connect } from 'react-redux';
import {
    _cs,
    getHexFromString,
    isNotDefined,
    listToMap,
    mapToList,
} from '@togglecorp/fujs';
import { compose } from 'redux';

import LeftPane from './LeftPane';
import Map from './Map';

import styles from './styles.scss';

import Loading from '#components/Loading';
import PageContext from '#components/PageContext';
import { TitleContext } from '#components/TitleContext';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';
import {
    projectsProfileFiltersSelector,
    regionLevelSelector,
    regionsSelector,
} from '#selectors';
import { groupList } from '#utils/common';
import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';
import ProjectsProfileFilter from './Filter';

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
        } = this.props;


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
                }}
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
