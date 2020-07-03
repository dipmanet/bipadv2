import React from 'react';
import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

interface Props {
    earthquakeList: PageType.RealTimeEarthquake[];
    chosenOption: Options;
}
class EarthquakeMap extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private magnitudeClassSelector = (magnitude: number): string => {
        if (magnitude < 4) {
            return styles.minor;
        }
        if (magnitude < 5) {
            return styles.light;
        }
        if (magnitude < 6) {
            return styles.moderate;
        }
        if (magnitude < 7) {
            return styles.strong;
        }
        if (magnitude < 8) {
            return styles.major;
        }
        if (magnitude >= 8) {
            return styles.great;
        }
        return styles.good;
    }

    private earthquakeTooltipRenderer = ({ address, description, eventOn, magnitude }:
    {address: string; description: string; eventOn: string; magnitude: number}) => (
        <div className={styles.tooltip}>
            <div className={styles.header}>
                <h3>{ address }</h3>
                <span className={this.magnitudeClassSelector(magnitude)}>
                    { magnitude }
                    {' '}
                        ML
                </span>
            </div>

            <div className={styles.description}>
                <div className={styles.key}>Description:</div>
                <div className={styles.value}>{ description }</div>
            </div>

            <div className={styles.eventOn}>
                <div className={styles.key}>Event On:</div>
                <div className={styles.value}>
                    <FormattedDate
                        value={eventOn}
                        mode="yyyy-MM-dd hh:mm"
                    />
                </div>
            </div>
        </div>
    )

    private handleTooltipClose = () => {
        this.setState({
            tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
        });
    }

    public render() {
        return (
            <div>
                EarthquakeMap
            </div>
        );
    }
}

export default EarthquakeMap;
