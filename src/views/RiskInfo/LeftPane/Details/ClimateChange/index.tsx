import React from 'react';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import { AppState } from '#store/types';
import SegmentInput from '#rsci/SegmentInput';
import SelectInput from '#rsci/SelectInput';

import {
    Province,
    District,
    Municipality,
    Ward,
} from '#store/atom/page/types';

import chartImage from '#resources/images/mean-anual-precipitation-chart.png';
import legendImage from '#resources/images/mean-anual-precipitation-legend.png';

import {
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
} from '#selectors';

import Map from './Map';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
}

interface PropsFromAppState {
    provinces: Province[];
    districts: District[];
    municipalities: Municipality[];
    ward: Ward[];
}

interface PropsFromDispatch {
}

type Props = OwnProps & PropsFromAppState;

interface State {
}

const mapStateToProps = (state: AppState) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
});

const measurementOptions = [
    { key: 'temperature', label: 'Temperature' },
    { key: 'precipitation', label: 'Precipitation' },
];

const timePeriodOptions = [
    { key: 'reference-period', label: 'Reference period (1981-2010)' },
    { key: 'medium-term', label: 'Medium term (2016-2065)' },
    { key: 'long-term', label: 'Long Term (2036-2065)' },
];

const scenarioOptions = [
    { key: 'rcp-45', label: 'RCP 4.5' },
    { key: 'rcp-85', label: 'RCP 8.5' },
];

class ClimateChange extends React.PureComponent<Props, State> {
    public render() {
        const {
            districts,
            className,
        } = this.props;

        return (
            <>
                <Map
                    districts={districts}
                />
                <div className={_cs(styles.climateChange, className)}>
                    <div className={styles.top}>
                        <SegmentInput
                            className={styles.measurementTypeInput}
                            label="Measurement"
                            options={measurementOptions}
                            value="temperature"
                        />
                        <SelectInput
                            label="Time period"
                            className={styles.timePeriodInput}
                            options={timePeriodOptions}
                            value="medium-term"
                        />
                        <SegmentInput
                            className={styles.scenarioInput}
                            label="Scenario"
                            options={scenarioOptions}
                            value="rcp-45"
                        />
                    </div>
                    <div className={styles.bottom}>
                        <img
                            className={styles.chart}
                            src={chartImage}
                            alt="chart"
                        />
                        <img
                            className={styles.legend}
                            src={legendImage}
                            alt="legend"
                        />
                    </div>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps)(
    ClimateChange,
);
