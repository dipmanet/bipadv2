import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Page from '#components/Page';

import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';

import CommonMap from '#components/CommonMap';
import * as PageTypes from '#store/atom/page/types';
import { AppState } from '#store/types';

import {
    MapStateElement,
    AlertElement,
    EventElement,
    FiltersElement,
    DataDateRangeValueElement,
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
interface PropsFromDispatch {
    setEventList: typeof setEventListAction;
    setAlertList: typeof setAlertListActionDP;
    setDashboardHazardTypes: typeof setDashboardHazardTypesAction;
    setHazardTypes: typeof setHazardTypesAction;
    setFilters: typeof setFiltersAction;
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

class VizRisk extends PureComponent<Props, State> {
    public render() {
        return (
            <div className="vrMainContainer">
                <h1>Viz Risk module</h1>
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
                        sourceKey="comparative-second"
                        region={faramValues.region2}
                        debug
                    />
                </Map>
                <Page
                    hideMap
                    hideFilter
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(VizRisk);
