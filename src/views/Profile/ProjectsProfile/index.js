import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
    mapToList,
    isNotDefined,
    listToMap,
    getHexFromString,
} from '@togglecorp/fujs';

import {
    regionsSelector,
    regionLevelSelector,
    projectsProfileFiltersSelector,
} from '#selectors';

import Loading from '#components/Loading';
import Page from '#components/Page';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

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
            if (location.province.length > 0) {
                provinces.add(...location.province);
            }
            if (location.district.length > 0) {
                districts.add(...location.district);
            }
            if (location.municipality.length > 0) {
                municipalities.add(...location.municipality);
            }
            if (location.ward.length > 0) {
                wards.add(...location.ward);
            }

            if (category.length > 0) {
                categories.add(...category);
            }
            if (drrcycle.length > 0) {
                drrcycles.add(...drrcycle);
            }
            if (ndrrsap.length > 0) {
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

const wsEndpoint = process.env.REACT_APP_PROJECT_SERVER_URL || 'http://54.185.195.189';

const requests = {
    ndrrsapRequest: {
        url: `${wsEndpoint}/pims/api/v1/ndrrsap`,
        onMount: true,
        // TODO: add schema
    },
    drrcycleRequest: {
        url: `${wsEndpoint}/pims/api/v1/drrcycle`,
        onMount: true,
        // TODO: add schema
    },
    categoryRequest: {
        url: `${wsEndpoint}/pims/api/v1/category`,
        onMount: true,
        // TODO: add schema
    },
    organizationRequest: {
        url: `${wsEndpoint}/pims/api/v1/organization`,
        onMount: true,
        // TODO: add schema
    },
    projectRequest: {
        url: `${wsEndpoint}/pims/api/v1/project`,
        onMount: true,
        // TODO: add schema
    },
};

class ProjectsProfile extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            leftPaneExpanded: true,
            rightPaneExpanded: true,
        };
    }

    handleRightPaneExpandChange = (rightPaneExpanded) => {
        this.setState({ rightPaneExpanded });
    }

    handleLeftPaneExpandChange = (leftPaneExpanded) => {
        this.setState({ leftPaneExpanded });
    }

    render() {
        const {
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.state;
        const {
            regions,
        } = this.props;

        const {
            requests: {
                ndrrsapRequest: {
                    pending: ndrrsapPending,
                    response: {
                        results: ndrrsap = emptyList,
                    } = {},
                },
                drrcycleRequest: {
                    pending: drrcyclePending,
                    response: {
                        results: drrcycle = emptyList,
                    } = {},
                },
                categoryRequest: {
                    pending: categoryPending,
                    response: {
                        results: category = emptyList,
                    } = {},
                },
                organizationRequest: {
                    pending: organizationPending,
                    response: {
                        results: organization = emptyList,
                    } = {},
                },
                projectRequest: {
                    pending: projectPending,
                    response: {
                        results: projects = emptyList,
                    } = {},
                },
            },
            filters: {
                faramValues = emptyObject,
            } = {},
            regionLevel,
        } = this.props;

        const pending = (
            ndrrsapPending
            || drrcyclePending
            || categoryPending
            || organizationPending
            || projectPending
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

        const realProjects = sanitize(projects, regions, ndrrsapMap);
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

        // AGGREGATIONS

        const organizationMap = listToMap(organization, organizationKeySelector, item => item);
        const projectMap = listToMap(projects, projectKeySelector, item => item);
        const drrCycleMap = listToMap(drrcycle, drrCycleKeySelector, item => item);
        const categoryMap = listToMap(category, categoryKeySelector, item => item);

        return (
            <React.Fragment>
                <Loading pending={pending} />
                <Map
                    leftPaneExpanded={leftPaneExpanded}
                    rightPaneExpanded={rightPaneExpanded}
                    projects={filteredProjects}
                    regions={regions}
                    regionLevel={regionLevel}
                />
                <LeftPane
                    className={styles.leftPane}
                    projects={filteredProjects}
                    drrCycleData={drrPieData}
                    categoryData={categoryPieData}
                    drrCycleMap={drrCycleMap}
                    categoryMap={categoryMap}
                    organizationMap={organizationMap}
                    projectMap={projectMap}
                />
                {/*
                    <ProjectsProfileFilter
                        onExpandChange={this.handleRightPaneExpandChange}
                        drrCycleOptions={drrcycle}
                        elementsOptions={category}
                        organizationOptions={organization}
                        priorityOptions={priorityOptions}
                        subPriorityOptions={subPriorityOptions}
                        activityOptions={activityOptions}
                    />
                */}
            </React.Fragment>
        );
    }
}

export default compose(
    connect(mapStateToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requests),
)(ProjectsProfile);
