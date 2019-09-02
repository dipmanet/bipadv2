import React from 'react';

import Page from '#components/Page';

import styles from './styles.scss';

interface Props {
}

interface State {
}

export default class RiskInfo extends React.PureComponent {
    private previousMapControlDisplay: string | null = null;

    public componentDidMount() {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0] as HTMLElement;

        if (mapControls) {
            this.previousMapControlDisplay = mapControls.style.display;
            mapControls.style.display = 'none';
        }
    }

    public componentWillUnmount() {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0] as HTMLElement;

        if (mapControls) {
            mapControls.style.display = this.previousMapControlDisplay;
        }
    }

    public render() {
        return (
            <Page
                className={styles.riskInfo}
                mainContentClassName={styles.main}
                mainContent={(
                    <div>
                        Hello world
                    </div>
                )}
            />
        );
    }
}
