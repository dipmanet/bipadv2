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
        const mapControlsBottomRight = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];
        const mapControlsTopLeft = document.getElementsByClassName('mapboxgl-ctrl-top-left')[0];

        if (mapControlsBottomRight) {
            this.mapControlsBottomRight = mapControlsBottomRight;
            this.previousMapControlBottomRightDisplay = mapControlsBottomRight.style.display;
            mapControlsBottomRight.style.display = 'none';
        }

        if (mapControlsTopLeft) {
            this.mapControlsTopLeft = mapControlsTopLeft;
            this.previousMapControlTopLeftDisplay = mapControlsTopLeft.style.display;
            mapControlsTopLeft.style.display = 'none';
        }
    }

    componentWillUnmount() {
        if (this.mapControlsBottomRight) {
            this.mapControlsBottomRight.style.display = this.previousMapControlBottomRightDisplay;
        }

        if (this.mapControlsTopLeft) {
            this.mapControlsTopLeft.style.display = this.previousMapControlTopLeftDisplay;
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
