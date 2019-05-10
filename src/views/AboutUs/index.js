import React from 'react';
import { _cs } from '@togglecorp/fujs';

import MultiViewContainer from '#rscv/MultiViewContainer';
import FixedTabs from '#rscv/FixedTabs';

import About from './About';
import PrivacyPolicy from './PrivacyPolicy';
import Metadata from './Metadata';
import Disclaimer from './Disclaimer';

import styles from './styles.scss';

export default class AboutUs extends React.PureComponent {
    constructor(props) {
        super(props);

        this.tabs = {
            about: 'About',
            privacyPolicy: 'Privacy policy',
            metadata: 'Metadata',
            disclaimer: 'Disclaimer',
        };

        const rendererParams = () => ({ className: styles.content });

        this.views = {
            about: {
                component: About,
                rendererParams,
            },
            privacyPolicy: {
                component: PrivacyPolicy,
                rendererParams,
            },
            metadata: {
                component: Metadata,
                rendererParams,
            },
            disclaimer: {
                component: Disclaimer,
                rendererParams,
            },
        };
    }

    componentDidMount() {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];

        if (mapControls) {
            this.mapControls = mapControls;
            this.previousMapControlDisplay = mapControls.style.display;
            mapControls.style.display = 'none';
        }
    }

    componentWillUnmount() {
        if (this.mapControls) {
            this.mapControls.style.display = this.previousMapControlDisplay;
        }
    }

    render() {
        const { className } = this.props;

        return (
            <div className={_cs(styles.aboutUs, className)}>
                <div className={styles.content}>
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
                </div>
                {/*
                <div className={styles.right}>
                    <div className={styles.platformName}>
                        <div className={styles.abbr}>
                            BIPAD
                        </div>
                        <div className={styles.fullForm}>
                            Building Information Platform Against Disaster
                        </div>
                    </div>
                </div>
                */}
            </div>
        );
    }
}
