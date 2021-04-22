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

// NOTE: private function
const unflat = (nodes, memory = {}, idSelector, parentSelector) => {
    const mem = memory;
    if (nodes.length <= 0) {
        return mem;
    }

    const [firstItem, ...otherItems] = nodes;
    const id = idSelector(firstItem);
    const parent = parentSelector(firstItem);
    const { $flagged } = firstItem;
    if (isNotDefined(parent)) {
        mem[id] = { ...firstItem, children: [] };
        return unflat(otherItems, mem, idSelector, parentSelector);
    }

    if (!mem[parent]) {
        return unflat(
            !$flagged ? [...otherItems, { ...firstItem, $flagged: true }] : otherItems,
            mem,
            idSelector,
            parentSelector,
        );
    }
    mem[id] = { ...firstItem, children: [] };
    mem[parent].children.push(mem[id]);
    return unflat(otherItems, mem, idSelector, parentSelector);
};

const unflatten = (nodes, idSelector, parentSelector) => {
    const value = unflat(nodes, {}, idSelector, parentSelector);
    const valueList = mapToList(
        value,
        val => val,
    );
    return valueList.filter(val => isNotDefined(parentSelector(val)));
};

const emptyObject = {};

const ndrrsapKeySelector = item => item.ndrrsapid;
const ndrrsapParentSelector = item => item.parent;
const organizationKeySelector = item => item.oid;
const projectKeySelector = item => item.pid;
const drrCycleKeySelector = item => item.drrcycleid;

const drrCyclesLabelSelector = item => item.title;
const drrCyclesKeySelector = item => item.drrcycleid;

const categoryLabelSelector = item => item.title;
const categoryKeySelector = item => item.categoryid;

const sanitize = (projectList, regions, ndrrsapMap) => {
    const mapped = projectList.map((project) => {
        // get locations for project
        const {
            location: { province, district, municipality, ward },
            output,
            oid,
            donor,
            partner,
        } = project;
        const provinces = new Set(province);
        const districts = new Set(district);
        const municipalities = new Set(municipality);
        const wards = new Set(ward);

        const categories = new Set();
        const drrcycles = new Set();
        const ndrrsaps = new Set();

        // NOTE: donor, partner and owner organization
        const organizations = new Set([oid]);
        if (donor.length > 0) {
            organizations.add(...donor);
        }
        if (partner.length > 0) {
            organizations.add(...partner);
        }

        // union locations from output
        output.forEach((item) => {
            const {
                location,
                category,
                drrcycle,
                ndrrsap,
            } = item;
            if (location && location.province.length > 0) {
                provinces.add(...location.province);
            }
            if (location && location.district.length > 0) {
                districts.add(...location.district);
            }
            if (location && location.municipality.length > 0) {
                municipalities.add(...location.municipality);
            }
            if (location && location.ward.length > 0) {
                wards.add(...location.ward);
            }
            // todo: 'category' data not available. check if this can be removed.
            if (category && category.length > 0) {
                categories.add(...category);
            }
            if (drrcycle && drrcycle.length > 0) {
                drrcycles.add(...drrcycle);
            }
            if (ndrrsap && ndrrsap.length > 0) {
                // Add all parent to ndrrsaps
                ndrrsap.forEach((id) => {
                    let child = id;
                    while (child) {
                        ndrrsaps.add(child);
                        const parent = ndrrsapParentSelector(ndrrsapMap[child] || {});
                        if (parent) {
                            child = parent;
                        } else {
                            child = undefined;
                        }
                    }
                });
            }
        });

        // Bubble up
        wards.forEach((id) => {
            if (regions.wards[id]) {
                municipalities.add(regions.wards[id].municipality);
            }
        });
        municipalities.forEach((id) => {
            if (regions.municipalities[id]) {
                districts.add(regions.municipalities[id].district);
            }
        });
        districts.forEach((id) => {
            if (regions.districts[id]) {
                provinces.add(regions.districts[id].province);
            }
        });

        // TODO: Bubble down

        return {
            ...project,
            province: listToMap([...provinces], item => item, () => true),
            district: listToMap([...districts], item => item, () => true),
            municipality: listToMap([...municipalities], item => item, () => true),
            ward: listToMap([...wards], item => item, () => true),

            category: listToMap([...categories], item => item, () => true),
            drrcycle: listToMap([...drrcycles], item => item, () => true),
            ndrrsap: listToMap([...ndrrsaps], item => item, () => true),
            organization: listToMap([...organizations], item => item, () => true),
        };
    });
    return mapped;
};

const isValidRegion = (region, project) => {
    if (!region || !region.adminLevel) {
        return true;
    }
    const { adminLevel, geoarea } = region;
    if (adminLevel === 1) {
        return project.province[geoarea];
    }
    if (adminLevel === 2) {
        return project.district[geoarea];
    }
    if (adminLevel === 3) {
        return project.municipality[geoarea];
    }
    if (adminLevel === 4) {
        return project.ward[geoarea];
    }
    return false;
};

const isValidNdrrsap = (priority, subPriority, activity, project) => (
    !(
        (activity && !project.ndrrsap[activity])
        || (subPriority && !project.ndrrsap[subPriority])
        || (priority && !project.ndrrsap[priority])
    )
);

const isValidOrganization = (organization, project) => {
    if (!organization || organization.length <= 0) {
        return true;
    }
    return organization.some(id => project.organization[id]);
};

const isValidCategory = (category, project) => {
    if (!category || category.length <= 0) {
        return true;
    }
    return category.some(id => project.category[id]);
};

const isValidDrrCycle = (drrCycle, project) => {
    if (!drrCycle || drrCycle.length <= 0) {
        return true;
    }
    return drrCycle.some(id => project.drrcycle[id]);
};

const filter = (projectList, filters) => projectList.filter(project => (
    isValidRegion(filters.region, project)
    && isValidNdrrsap(filters.priority, filters.subPriority, filters.activity, project)
    && isValidOrganization(filters.organizations, project)
    && isValidCategory(filters.elements, project)
    && isValidDrrCycle(filters.drrCycles, project)
));

const mapStateToProps = (state, props) => ({
    regions: regionsSelector(state),
    regionLevel: regionLevelSelector(state, props),
    filters: projectsProfileFiltersSelector(state),
});

const wsEndpoint = process.env.REACT_APP_PROJECT_SERVER_URL || 'http://165.22.215.64/pims';

const requestOptions = {
    ndrrsapRequest: {
        url: `${wsEndpoint}/api/v1/ndrrsap`,
        onMount: true,
    },
    drrcycleRequest: {
        url: `${wsEndpoint}/api/v1/drrcycle`,
        onMount: true,
    },
    categoryRequest: {
        url: `${wsEndpoint}/api/v1/category`,
        onMount: true,
    },
    organizationRequest: {
        url: `${wsEndpoint}/api/v1/organization`,
        onMount: true,
    },
    projectRequest: {
        url: `${wsEndpoint}/api/v1/project`,
        onMount: true,
    },
};

const combineEntities = (projects, organizations) => {
    const tempProjects = [...projects];
    const tempOrganizations = [...organizations];

    const combined = tempProjects.map((tempProject) => {
        tempOrganizations.forEach((tempOrganization) => {
            const { oname } = tempOrganization;
            if (tempProject.oid === tempOrganization.oid) {
                Object.assign(tempProject, { oname });
            }
        });
        return tempProject;
    });
    return combined;
};
class ProjectsProfile extends React.PureComponent {
    render() {
        const {
            regions,
            requests,
            filters: { faramValues = emptyObject } = {},
            regionLevel,
            className,
            showFilterOnly,
            getSelectedOption,
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


        console.log('priority options', priorityOptions);
        console.log('subPriorityOptions options', subPriorityOptions);
        console.log('activityOptions options', activityOptions);


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

                            { !showFilterOnly
                            && (
                                <>
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
                                </>
                            )
                            }
                            <ProjectsProfileFilter
                                drrCycleOptions={drrcycle}
                                elementsOptions={category}
                                organizationOptions={organization}
                                priorityOptions={priorityOptions}
                                subPriorityOptions={subPriorityOptions}
                                activityOptions={activityOptions}
                                showFilterOnly
                                getSelectedOption={getSelectedOption}
                            />


                        </React.Fragment>
                    );
                }}
            </TitleContext.Consumer>
        );
    }
}

ProjectsProfile.contextType = PageContext;

export default compose(
    connect(mapStateToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requestOptions),
)(ProjectsProfile);
