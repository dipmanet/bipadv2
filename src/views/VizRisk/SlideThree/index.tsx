import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';

import * as PageTypes from '#store/atom/page/types';
import VizriskMap from '#components/VizriskMap';
import RightPane from './RightPane';
import {
    FiltersElement,
} from '#types';
import VRLegend from '../VRLegend';

import {
    mapStyleSelector,
    regionsSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    hazardTypesSelector,
} from '#selectors';
import Icon from '#rscg/Icon';

import styles from './styles.scss';
import demographicsData from '../demographicsData';

interface ComponentProps {}
interface PropsFromAppState {
    alertList: PageTypes.Alert[];
    eventList: PageTypes.Event[];
    hazardTypes: Obj<PageTypes.HazardType>;
    filters: FiltersElement;
}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const colorGrade = [
    '#fc4e2a',
    '#fed976',
    '#bd0026',
    '#e31a1c',
    '#feb24c',
    '#fdfdd4',
    '#fd8d3c',
    '#ffeda0',
    '#ffffcc',
    '#800026',
];

const mapStateToProps = state => ({
    mapStyle: mapStyleSelector(state),
    regions: regionsSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    hazardTypes: hazardTypesSelector(state),
});

class SlideThree extends React.PureComponent<Props, State> {
    public generateColor = memoize((maxValue, minValue, colorMapping) => {
        const newColor = [];
        const { length } = colorMapping;
        const range = maxValue - minValue;
        colorMapping.forEach((color, i) => {
            const val = minValue + ((i * range) / (length - 1));
            newColor.push(val);
            newColor.push(color);
        });
        return newColor;
    });

    public generatePaint = memoize(color => ({
        'fill-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'value'],
            ...color,
        ],
        'fill-opacity': 1,
    }))

    public render() {
        const {
            wards,
        } = this.props;

        const mapping = [];
        const selectWards = [];
        let hilightValue = 0;

        if (wards) {
            wards.map((item) => {
                const { id } = item;
                if (item.municipality === 58007) {
                    mapping.push({ id, value: parseFloat(hilightValue.toFixed(2)) });
                    hilightValue += 0.1;
                    selectWards.push(item);
                }
                return null;
            });
        }
        const color = this.generateColor(1, 0, colorGrade);
        const colorPaint = this.generatePaint(color);

        // const mapStyle = 'mapbox://styles/mapbox/dark-v10';
        const mapStyle = 'mapbox://styles/ankur20/ckkwdvg544to217orazo712ra';

        return (
            <div className={styles.vzMainContainer}>
                <Map
                    mapStyle={mapStyle}
                    mapOptions={{
                        logoPosition: 'top-left',
                        minZoom: 5,
                    }}
                    scaleControlShown
                    scaleControlPosition="bottom-right"

                    navControlShown
                    navControlPosition="bottom-right"
                >
                    <MapContainer className={styles.map2} />

                    <VizriskMap
                        paint={colorPaint}
                        sourceKey={'vizrisk'}
                        region={{ adminLevel: 3, geoarea: 58007 }}
                        mapState={mapping}
                        selectWards={selectWards}
                        demographicsData={demographicsData.demographicsData}
                        showTooltip

                    />
                </Map>
                <VRLegend>
                    <h2>POPULATION</h2>
                    <div className={styles.legendContainer}>
                        <div className={styles.populationLegend} />
                        <div className={styles.populationText}>
                            <p>High</p>
                            <p>Low</p>
                        </div>
                    </div>
                    <div className={styles.legendContainer}>
                        <p className={styles.riverIconContainer}>
                            <span className={styles.riverIcon}>
                                ___
                            </span>
                            River
                        </p>
                    </div>
                </VRLegend>
                <RightPane />
            </div>
        );
    }
}

export default connect(mapStateToProps)(SlideThree);
