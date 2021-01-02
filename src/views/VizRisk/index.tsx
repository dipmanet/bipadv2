import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Page from '#components/Page';

import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';

import CommonMap from '#components/CommonMap';
import * as PageTypes from '#store/atom/page/types';
import { AppState } from '#store/types';

import LayerSwitch from '#components/LayerSwitch';
import LayerToggle from '#components/LayerToggle';

import {
    MapStateElement,
    AlertElement,
    EventElement,
    FiltersElement,
    DataDateRangeValueElement,
} from '#types';
import MapDownloadButton from '#components/MapDownloadButton';

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

interface State {
    hoveredAlertId: AlertElement['id'] | undefined;
    hoveredEventId: EventElement['id'] | undefined;
    hazardTypes: PageTypes.HazardType[] | undefined;
}

interface Params {
    triggerAlertRequest: (timeout: number) => void;
    triggerEventRequest: (timeout: number) => void;
}
interface ComponentProps {}
interface PropsFromAppState {
    alertList: PageTypes.Alert[];
    eventList: PageTypes.Event[];
    hazardTypes: Obj<PageTypes.HazardType>;
    filters: FiltersElement;
}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;


const mapStateToProps = state => ({
    mapStyle: mapStyleSelector(state),
    regions: regionsSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    hazardTypes: hazardTypesSelector(state),
});

class VizRisk extends React.PureComponent<Props, State> {
    public render() {
        const {
            mapStyle,
        } = this.props;
        console.log('mapstyle', mapStyle);
        return (
            <React.Fragment>
                <Map
                    mapStyle={mapStyle}
                    mapOptions={{
                        logoPosition: 'top-left',
                        minZoom: 5,
                    }}
                                        // debug

                    scaleControlShown
                    scaleControlPosition="bottom-right"

                    navControlShown
                    navControlPosition="bottom-right"
                >
                    <MapContainer className={styles.map2} />
                    <CommonMap
                        sourceKey="viz-risk-test"
                        region={{ adminLevel: 1, geoarea: 3 }}
                    />
                    <LayerSwitch
                        className={styles.layerSwitch}
                    />
                    <LayerToggle />
                </Map>

                <Page
                    hideMap
                    hideFilter
                />
                <div className={styles.vrSideBar}>
                    <h1> Sidebar Title </h1>
                    <p> Descriptions go here</p>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(VizRisk);
