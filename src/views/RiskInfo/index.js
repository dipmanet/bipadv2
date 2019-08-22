import React from 'react';

import Page from '#components/Page';

import styles from './styles.scss';

// eslint-disable-next-line react/prefer-stateless-function
export default class RiskInfo extends React.PureComponent {
    componentDidMount() {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];

        if (mapControls) {
            this.previousMapControlDisplay = mapControls.style.display;
            mapControls.style.display = 'none';
        }
    }

    componentWillUnmount() {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];

        if (mapControls) {
            mapControls.style.display = this.previousMapControlDisplay;
        }
    }

    render() {
        return (
            <Page
                className={styles.riskInfo}
                mainContentClassName={styles.main}
                mainContent={(
                    <iframe
                        title="Risk information"
                        src="https://bipad.naxa.com.np"
                    />
                )}
            />
        );
    }
}
