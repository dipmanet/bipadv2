import React from 'react';
import { _cs } from '@togglecorp/fujs';

import MultiViewContainer from '#rscv/MultiViewContainer';
import FixedTabs from '#rscv/FixedTabs';

import DisasterProfile from './DisasterProfile';
import ProjectsProfile from './ProjectsProfile';
import Indicator from './Indicator';
import Contact from './Contact';

import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

export default class Profile extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.tabs = {
            summary: 'Summary',
            projectsProfile: 'Projects',
            contact: 'Contact',
            indicator: 'Indicator',
        };

        this.views = {
            summary: {
                component: DisasterProfile,
            },
            projectsProfile: {
                component: ProjectsProfile,
            },
            contact: {
                component: Contact,
            },
            indicator: {
                component: Indicator,
            },
        };
    }

    render() {
        return (
            <React.Fragment>
                <FixedTabs
                    className={_cs(
                        styles.tabs,
                    )}
                    tabs={this.tabs}
                    useHash
                    onHashChange={this.handleHashChange}
                />
                <MultiViewContainer
                    views={this.views}
                    useHash
                />
            </React.Fragment>
        );
    }
}
