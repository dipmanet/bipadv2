import Loadable from 'react-loadable';
import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Router } from '@reach/router';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import Map from '#rscz/Map';
import MapContainer from '#rscz/Map/MapContainer';
import { District, Province, Municipality, Region } from '#store/atom/page/types';

import DangerButton from '#rsca/Button/DangerButton';
import Loading from '#components/Loading';
import Navbar from '#components/Navbar';
import { routeSettings } from '#constants';
import { AppState } from '#store/types';

import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    filtersSelectorDP,
} from '#selectors';
import {
    setInitialPopupHiddenAction,
    setRegionAction,
    setFiltersActionDP,
} from '#actionCreators';

import authRoute from '#components/authRoute';
import errorBound from '../errorBound';
import helmetify from '../helmetify';

import styles from './styles.scss';

const loadingStyle: React.CSSProperties = {
    zIndex: 1111,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    padding: 10,
    textAlign: 'center',
    alignItems: 'baseline',
    justifyContent: 'center',
    fontSize: '18px',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(255, 0, 0, 0.2)',
    borderRadius: '3px',
};

function reloadPage() {
    window.location.reload(false);
}

const ErrorInPage = () => (
    <div style={loadingStyle}>
        Some problem occured.
        <DangerButton
            transparent
            onClick={reloadPage}
        >
            Reload
        </DangerButton>
    </div>
);

const RetryableErrorInPage = ({ error, retry }: LoadOptions) => (
    <div style={loadingStyle}>
        Some problem occured.
        <DangerButton
            onClick={retry}
            transparent
        >
            Reload
        </DangerButton>
    </div>
);

interface LoadOptions {
    error: string;
    retry: () => void;
}

const LoadingPage = ({ error, retry }: LoadOptions) => {
    if (error) {
        // NOTE: show error while loading page
        console.error(error);
        return (
            <RetryableErrorInPage
                error={error}
                retry={retry}
            />
        );
    }
    return (
        <Loading
            text="Loading Page"
            pending
        />
    );
};

const routes = routeSettings.map(({ load, ...settings }) => {
    const Com = authRoute<typeof settings>()(
        helmetify(
            Loadable({
                loader: load,
                loading: LoadingPage,
            }),
        ),
    );

    const Component = errorBound<typeof settings>(ErrorInPage)(Com);

    return (
        <Component
            key={settings.name}
            {...settings}
        />
    );
});

// MULTIPLEXER

const domain = process.env.REACT_APP_DOMAIN;

interface State {
}
interface OwnProps {
    pending: boolean;
    hasError: boolean;
    mapStyle: string;
}

interface PropsFromState {
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
}

interface PropsFromState {
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
    filters: {
        faramValues: {
            region: Region;
        };
        faramErrors: {};
    };
}

interface PropsFromDispatch {
    setInitialPopupHidden: typeof setInitialPopupHiddenAction;
    setRegion: typeof setRegionAction;
    setFilters: typeof setFiltersActionDP;
}

interface Coords {
    coords: {
        latitude: number;
        longitude: number;
    };
}

interface OwnProps {}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

const mapStateToProps = (state: AppState): PropsFromState => ({
    filters: filtersSelectorDP(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setInitialPopupHidden: params => dispatch(setInitialPopupHiddenAction(params)),
    setRegion: params => dispatch(setRegionAction(params)),
    setFilters: params => dispatch(setFiltersActionDP(params)),
});

const getMatchingRegion = (
    subdomain: string | undefined,
    provinces: Province[],
    districts: District[],
    municipalities: Municipality[],
): Region => {
    if (!subdomain) {
        return {};
    }

    const province = provinces.find(p => p.code === subdomain);
    if (province) {
        return {
            adminLevel: 1,
            geoarea: province.id,
        };
    }

    const district = districts.find(p => p.code === subdomain);
    if (district) {
        return {
            adminLevel: 2,
            geoarea: district.id,
        };
    }

    const municipality = municipalities.find(p => p.code === subdomain);
    if (municipality) {
        return {
            adminLevel: 3,
            geoarea: municipality.id,
        };
    }

    return {};
};

const getMatchingSubdomain = (
    region: Region,
    provinces: Province[],
    districts: District[],
    municipalities: Municipality[],
): string | undefined => {
    if (!region.adminLevel || !region.geoarea) {
        return undefined;
    }

    switch (region.adminLevel) {
        case 1: {
            const province = provinces.find(p => p.id === region.geoarea);
            return province ? province.code : undefined;
        } case 2: {
            const district = districts.find(p => p.id === region.geoarea);
            return district ? district.code : undefined;
        } case 3: {
            const municipality = municipalities.find(p => p.id === region.geoarea);
            return municipality ? municipality.code : undefined;
        } default:
            return undefined;
    }
};

class Multiplexer extends React.PureComponent<Props, State> {
    private filtersSetFromUrl = false;

    // NOTE: this isn't used currently
    private setUrlFromFilter = memoize((
        region,
        provinces,
        districts,
        municipalities,
    ) => {
        if (!domain) {
            return;
        }

        const subdomain = getMatchingSubdomain(
            region,
            provinces,
            districts,
            municipalities,
        );

        if (subdomain) {
            const { href } = window.location;
            const escapedDomain = domain.replace(/\./g, '\\.');

            const newUrl = href.replace(new RegExp(`(?:\\w+\\.)+${escapedDomain}`), `${subdomain}.${domain}`);
            if (newUrl !== href) {
                window.location.href = newUrl;
            }
        } else {
            const { href } = window.location;
            const escapedDomain = domain.replace(/\./g, '\\.');
            const newUrl = href.replace(new RegExp(`(?:\\w+\\.)+${escapedDomain}`), domain);
            if (newUrl !== href) {
                window.location.href = newUrl;
            }
        }
    })

    private setFilterFromUrl = memoize((
        provinces,
        districts,
        municipalities,
        setFilters,
        faramValues,
    ) => {
        if (provinces.length === 0 && districts.length === 0 && municipalities.length === 0) {
            return;
        }

        if (this.filtersSetFromUrl) {
            return;
        }

        const { hostname } = window.location;

        const index = hostname.search(`.${domain}`);
        const subdomain = index !== -1
            ? hostname.substring(0, index)
            : undefined;

        const region = getMatchingRegion(subdomain, provinces, districts, municipalities);

        const {
            geoarea: currentGeoarea,
            adminLevel: currentAdminLevel,
        } = region || {};

        const {
            geoarea: oldGeoarea,
            adminLevel: oldAdminLevel,
        } = faramValues.region || {};

        if (currentGeoarea && currentAdminLevel && (
            currentGeoarea !== oldGeoarea || oldAdminLevel !== currentAdminLevel
        )) {
            this.filtersSetFromUrl = true;

            setFilters({
                faramValues: {
                    ...faramValues,
                    region,
                },
                faramErrors: {},
                pristine: true,
            });
        }
    })


    private renderRoutes = () => {
        const { pending, hasError } = this.props;

        if (hasError) {
            return (
                <ErrorInPage />
            );
        }
        if (pending) {
            return (
                <Loading
                    text="Loading Resources"
                    pending
                />
            );
        }
        return (
            <Router>
                {routes}
            </Router>
        );
    }

    public render() {
        const {
            mapStyle,
            filters: {
                faramValues,
            },
            provinces,
            municipalities,
            districts,
            setFilters,
        } = this.props;

        this.setFilterFromUrl(provinces, districts, municipalities, setFilters, faramValues);

        return (
            <div className={styles.multiplexer}>
                <Navbar className={styles.navbar} />
                <div className={_cs(styles.content, 'bipad-main-content')}>
                    <Map
                        mapStyle={mapStyle}
                        fitBoundsDuration={200}
                        minZoom={5}
                        logoPosition="bottom-left"

                        showScaleControl
                        scaleControlPosition="bottom-right"

                        showNavControl
                        navControlPosition="bottom-right"
                    >
                        <MapContainer className={styles.map} />
                        {this.renderRoutes()}
                    </Map>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Multiplexer);
