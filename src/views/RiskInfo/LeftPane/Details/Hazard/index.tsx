import React from 'react';
import { _cs } from '@togglecorp/fujs';

import SegmentInput from '#rsci/SegmentInput';
import Icon from '#rscg/Icon';
import ScrollTabs from '#rscv/ScrollTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';

import NewRadioInput from '#components/NewRadioInput';

import styles from './styles.scss';

interface Props {
    className?: string;
}

interface State {
    activeTab: string;
    floodMapValue: string | undefined;
}

interface FloodMap {
    key: string;
    title: string;
    returnPeriodOptions: number[];
}

const floodMaps: FloodMap[] = [
    {
        key: 'meteor',
        title: 'METEOR hazard map',
        returnPeriodOptions: [5, 10, 20, 50, 100, 200, 250, 500, 1000],
    },
    {
        key: 'west-rapti',
        title: 'West rapti (Nepal government)',
        returnPeriodOptions: [2, 5, 10, 25, 50, 100],
    },
    {
        key: 'narayani',
        title: 'Narayani (Nepal government)',
        returnPeriodOptions: [2, 5, 10, 25, 50, 100],
    },
    {
        key: 'kankai',
        title: 'Kankai',
        returnPeriodOptions: [2, 5, 10, 25, 50, 100],
    },
    {
        key: 'jalad',
        title: 'Jalad',
        returnPeriodOptions: [2, 5, 10, 25, 50, 100],
    },
    {
        key: 'gagan',
        title: 'Gagan',
        returnPeriodOptions: [2, 5, 10, 25, 50, 100],
    },
    {
        key: 'east-rapti',
        title: 'East rapti',
        returnPeriodOptions: [2, 5, 10, 25, 50, 100],
    },
    {
        key: 'biring',
        title: 'Biring',
        returnPeriodOptions: [2, 5, 10, 25, 50, 100],
    },
    {
        key: 'bakraha',
        title: 'Bakraha',
        returnPeriodOptions: [2, 5, 10, 25, 50, 100],
    },
    {
        key: 'banganga',
        title: 'Banganga',
        returnPeriodOptions: [2, 5, 10, 25, 50, 100],
    },
    {
        key: 'aurahi',
        title: 'Aurahi',
        returnPeriodOptions: [2, 5, 10, 25, 50, 100],
    },
    {
        key: 'karnali',
        title: 'Karnali',
        returnPeriodOptions: [2, 5, 10, 25, 50, 100],
    },
];

const returnPeriodOptions = [
    { key: 2, label: '2y' },
    { key: 5, label: '5y' },
    { key: 10, label: '10y' },
    { key: 20, label: '20y' },
    { key: 25, label: '25y' },
    { key: 50, label: '50y' },
    { key: 100, label: '100y' },
    { key: 200, label: '200y' },
    { key: 250, label: '250y' },
    { key: 500, label: '500y' },
    { key: 1000, label: '1000y' },
];


export default class Hazard extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeTab: 'flood',
            floodMapValue: undefined,
        };
    }

    private tabs = {
        flood: 'Flood',
        earthquake: 'Earthquake',
        landslide: 'Landslide',
    };

    private renderFloodMap = ({ data }: { data: FloodMap }) => (
        <div className={styles.floodMap}>
            <div className={styles.title}>
                { data.title }
            </div>
        </div>
    )

    private views ={
        flood: {
            component: ({ data }) => (
                <>
                    <NewRadioInput
                        className={styles.floodMapRadioInput}
                        hideLabel
                        optionKeySelector={d => d.key}
                        optionLabelSelector={d => d.title}
                        options={floodMaps}
                        onChange={this.handleFloodMapChange}
                        value={this.state.floodMapValue}
                    />
                    <div className={styles.bottom}>
                        <SegmentInput
                            label="Select a return period"
                            className={styles.returnPeriodInput}
                            options={returnPeriodOptions}
                        />
                        <div className={styles.info}>
                            <Icon
                                name="info"
                                className={styles.icon}
                            />
                            <div className={styles.text}>
                                A return period is an average time or an estimated
                                average time between events such as earthquakes,
                                floods, landslides, droughts, or a river discharge flows to occur.
                            </div>
                        </div>
                    </div>
                </>
            ),
        },
        earthquake: {
            component: () => null,
        },
        landslide: {
            component: () => null,
        },
    }

    private handleFloodMapChange = (newFloodMapValue) => {
        this.setState({ floodMapValue: newFloodMapValue });
    }

    private handleTabClick = (tab: string) => {
        this.setState({ activeTab: tab });
    }

    public render() {
        const {
            className,
        } = this.props;

        const {
            activeTab,
        } = this.state;

        return (
            <div className={_cs(styles.hazard, className)}>
                <ScrollTabs
                    className={styles.tabs}
                    active={activeTab}
                    tabs={this.tabs}
                    onClick={this.handleTabClick}
                />
                <MultiViewContainer
                    views={this.views}
                    active={activeTab}
                />
            </div>
        );
    }
}
