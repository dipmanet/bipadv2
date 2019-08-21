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
            projectsProfile: 'Projects',
            disasterProfile: 'Disaster',
            contact: 'Contact',
            indicator: 'Indicator',
        };

        this.views = {
            disasterProfile: {
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

        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];

        if (mapControls) {
            this.mapControls = mapControls;
            this.previousMapControlDisplay = mapControls.style.display;
        }
    }

    componentWillUnmount() {
        if (this.mapControls) {
            this.mapControls.style.display = this.previousMapControlDisplay;
        }
    }

    setMapControlDisplay = (currentPage) => {
        if (window.location.hash.substring(2) === 'projectsProfile') {
            this.mapControls.style.display = 'block';
        } else {
            this.mapControls.style.display = 'none';
        }
    }

    handleHashChange = (hash) => {
        this.setMapControlDisplay(hash);
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
