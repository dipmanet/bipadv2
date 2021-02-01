import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import VizRiskContext, { VizRiskContextProps } from '#components/VizRiskContext';

import * as PageTypes from '#store/atom/page/types';
import VizriskMap from '#components/VizriskMap';
import {
    FiltersElement,
} from '#types';

import {
    mapStyleSelector,
    regionsSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    hazardTypesSelector,
} from '#selectors';


import styles from './styles.scss';

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
    '#6472cb',
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

class SlideFourMap extends React.PureComponent<Props, State> {
    public static contextType = VizRiskContext;

    // public constructor(p: Props) {
    //     super(p);

    //     this.state = {
    //         showFirstLayer: false,
    //     };
    // }

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

    // public handleLegendsClick = (showFirstLayer) => {
    //     this.setState({ showFirstLayer });
    // }

    public render() {
        const {
            wards,
            showFirstLayer,
        } = this.props;
        const mapping = [];
        if (wards) {
            wards.map((item) => {
                const { id } = item;
                if (item.municipality === 58007) {
                    mapping.push({ id, value: 1 });
                }
                return null;
            });
        }
        const color = this.generateColor(1, 0, colorGrade);
        const colorPaint = this.generatePaint(color);

        // const mapStyle = 'mapbox://styles/mapbox/dark-v10';
        console.log(mapping);
        console.log(colorPaint);
        return (
            // <div className={styles.vzMainContainer}>
            <VizriskMap
                paint={colorPaint}
                sourceKey={'vizrisk'}
                region={{ adminLevel: 3, geoarea: 58007 }}
                mapState={mapping}
                showFirstLayer={showFirstLayer}
            />
            // </div>
        );
    }
}

export default connect(mapStateToProps)(SlideFourMap);
