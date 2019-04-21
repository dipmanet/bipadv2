import React from 'react';
import { compose } from 'redux';
/*
import {
    mapToList,
    isNotDefined,
} from '@togglecorp/fujs';
*/

import Loading from '#components/Loading';
import Page from '#components/Page';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import ProjectsProfileFilter from './Filter';
import Map from './Map';

import styles from './styles.scss';

/*
const unflat = (nodes, memory = {}) => {
    const mem = memory;
    if (nodes.length <= 0) {
        return mem;
    }

    const [firstItem, ...otherItems] = nodes;
    const { id, parent, flagged } = firstItem;
    if (isNotDefined(parent)) {
        mem[id] = { ...firstItem, children: [] };
        return unflat(otherItems, mem);
    } else if (!mem[parent]) {
        return unflat(
            !flagged ? [...otherItems, { ...firstItem, flagged: true }] : otherItems,
            mem,
        );
    }
    mem[id] = { ...firstItem, children: [] };
    mem[parent].children.push(mem[id]);
    return unflat(otherItems, mem);
};

const unflatten = (nodes) => {
    const value = unflat(nodes);
    const valueList = mapToList(
        value,
        val => val,
    );
    return valueList.filter(val => isNotDefined(val.parent));
};

const items = [
    {
        id: 1000,
        title: 'Chor',
        parent: 101,
    },
    {
        id: 11,
        title: 'Handey',
        parent: null,
    },
    {
        id: 12,
        title: 'Pandey',
        parent: null,
    },
    {
        id: 102,
        title: 'Hari',
        parent: 12,
    },
    {
        id: 101,
        title: 'Shyam',
        parent: 12,
    },
];
*/

const requests = {
    ndrrsapRequest: {
        url: 'http://54.185.195.189/pims/api/v1/ndrrsap',
        onMount: true,
        // TODO: add schema
    },
    drrcycleRequest: {
        url: 'http://54.185.195.189/pims/api/v1/drrcycle',
        onMount: true,
        // TODO: add schema
    },
    categoryRequest: {
        url: 'http://54.185.195.189/pims/api/v1/category',
        onMount: true,
        // TODO: add schema
    },
    organizationRequest: {
        url: 'http://54.185.195.189/pims/api/v1/organization',
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

    render() {
        const {
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.state;

        const {
            requests: {
                ndrrsapRequest: { pending: ndrrsapPending },
                drrcycleRequest: { pending: drrcyclePending },
                categoryRequest: { pending: categoryPending },
                organizationRequest: { pending: organizationPending },
            },
        } = this.props;

        const pending = (
            ndrrsapPending || drrcyclePending || categoryPending || organizationPending
        );

        return (
            <React.Fragment>
                <Loading pending={pending} />
                <Map
                    leftPaneExpanded={leftPaneExpanded}
                    rightPaneExpanded={rightPaneExpanded}
                />
                <Page
                    mainContent={null}
                    leftContentClassName={styles.left}
                    leftContent={null}
                    rightContentClassName={styles.right}
                    rightContent={
                        <ProjectsProfileFilter
                            onExpandChange={this.handleRightPaneExpandChange}
                        />
                    }
                />
            </React.Fragment>
        );
    }
}

export default compose(
    // connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requests),
)(ProjectsProfile);
