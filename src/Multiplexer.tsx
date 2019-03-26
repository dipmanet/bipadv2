import Loadable from 'react-loadable';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Router } from '@reach/router';

import Map from '#rscz/Map/index';
import { District, Province, Municipality } from '#store/atom/page/types';

import Navbar from '#components/Navbar';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import SelectInput from '#rsci/SelectInput';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import {
    routeSettings,
    iconNames,
} from '#constants';
import { AppState } from '#store/types';

import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
} from '#selectors';

import errorBound from './errorBound';
import helmetify from './helmetify';

import styles from './styles.scss';

// LOADING

interface GeoArea {
    id: number;
    title: string;
}

const adminLevelKeySelector = (d: GeoArea) => d.id;
const adminLevelLabelSelector = (d: GeoArea) => d.title;

const loadingStyle: React.CSSProperties = {
    zIndex: 1111,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '60px',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: '3px',
};

const LoadingResources = () => (
    <div style={loadingStyle}>
        Loading Resources...
    </div>
);
const LoadingPage = () => (
    <div style={loadingStyle}>
        Loading Page...
    </div>
);
const ErrorInPage = () => (
    <div style={loadingStyle}>
        Some problem occured.
    </div>
);

// ROUTES

const routes = routeSettings.map(({ load, ...settings }) => {
    const Component = errorBound<typeof settings>(ErrorInPage)(
        helmetify(
            Loadable({
                loader: load,
                loading: LoadingPage,
            }),
        ),
    );

    return (
        <Component
            key={settings.name}
            {...settings}
        />
    );
});

// MULTIPLEXER

interface State {
    showSpashScreenModal: boolean;
}
interface OwnProps {
    pending: boolean;
    mapStyle: string;
    showHintAndError: boolean;
}

interface PropsFromState {
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
}

const geolocationControlOptions = {
    showUserLocation: false,
    trackUserLocation: false,
};

interface Coords {
    coords: {
        latitude: number;
        longitude: number;
    };
}

interface OwnProps {}
type Props = OwnProps & PropsFromState;

const mapStateToProps = (state: AppState): PropsFromState => ({
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
});

class Multiplexer extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            showSpashScreenModal: true,
        };
    }

    private handleGeolocationChange = (e: Coords) => {
        console.warn('Getting user location info from:', [e.coords.longitude, e.coords.latitude]);
    }

    private handleProvinceSelect = (key: number) => {
        console.warn(key);
    }

    private handleDistrictSelect = (key: number) => {
        console.warn(key);
    }

    private handleMunicipalitySelect = (key: number) => {
        console.warn(key);
    }

    private handleSplashScreenModalClose = () => {
        this.setState({ showSpashScreenModal: false });
    }

    private renderRoutes = () => {
        const { pending } = this.props;
        if (pending) {
            return (<LoadingResources />);
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
            districts,
            provinces,
            municipalities,
            showHintAndError,
        } = this.props;

        const noLocationInfo = false;

        const {
            showSpashScreenModal,
        } = this.state;

        return (
            <Fragment>
                {/* FIXME: get route key for navbar */}
                <div className="bipad-main-content">

                    { showSpashScreenModal && (
                        <Modal
                            closeOnEscape
                            onClose={this.handleSplashScreenModalClose}
                            className={styles.splashScreenModal}
                        >
                            <ModalBody
                                className={styles.content}
                            >
                                <h1>Welcome to BIPAD</h1>
                                <h1>Disaster Information Management System (DIMS)</h1>
                                <h2>Please select your area of interest</h2>
                                <div className={styles.areaSelect}>
                                    <div className={styles.subtype}>
                                        <h3>National Level</h3>
                                    </div>
                                    <div className={styles.subtype}>
                                        <h3>Province</h3>
                                        <SelectInput
                                            keySelector={adminLevelKeySelector}
                                            labelSelector={adminLevelLabelSelector}
                                            options={provinces}
                                            onChange={this.handleProvinceSelect}
                                        />
                                    </div>
                                    <div className={styles.subtype}>
                                        <h3>District</h3>
                                        <SelectInput
                                            keySelector={adminLevelKeySelector}
                                            labelSelector={adminLevelLabelSelector}
                                            options={districts}
                                            onChange={this.handleDistrictSelect}
                                        />
                                    </div>
                                    <div className={styles.subtype}>
                                        <h3>Municipality</h3>
                                        <SelectInput
                                            labelSelector={adminLevelLabelSelector}
                                            keySelector={adminLevelKeySelector}
                                            options={municipalities}
                                            onChange={this.handleMunicipalitySelect}
                                        />
                                    </div>
                                </div>
                                <div className={styles.disclaimer}>
                                    <h3>Disclaimer</h3>
                                    <p>
                                        This portal is hosted by National
                                        Emergency Operation Centre (NEOC) solely for information
                                        purpose only. NEOC disclaims any liability for errors,
                                        accuracy of information or suitability of purposes. It
                                        makes no warranties, expressed or implied and fitness
                                        for particular purposes as to the quality, content,
                                        accuracy or completeness of the information or other
                                        times contained on the portal. Materials are subject to
                                        change without notice. In no event will the NEOC be
                                        liable for any loss arising from the use of the
                                        information from any of the modules. The boundaries,
                                        colors, denominations, and other information shown on
                                        any map do not imply any judgment or endorsement on the
                                        part of the NEOC or any providers of data, concerning
                                        the delimitation or the legal status of any territory
                                        or boundaries.In no event will the NEOC be liable for
                                        any form of damage arising from the application or
                                        misapplication of any maps or materials.
                                    </p>
                                    <p>
                                        The   administration   team   periodically   adds
                                        changes,improves,or updates the Materials on
                                        this Site without notice.
                                    </p>
                                    <p>
                                        This portal also contains link to
                                        third-party websites. The linked sites are not underthe
                                        control of the NEOC and it is not responsible for the
                                        contents of any linked siteor any link contained in a
                                        linked site. These links are provided only as
                                        aconvenience, and the inclusion of a link does not
                                        imply endorsement of the linkedsite by NEOC. Original
                                        datasets are licensed under their original terms, which
                                        arecontained in the associated layer metadata.
                                    </p>
                                </div>
                            </ModalBody>
                        </Modal>
                    ) }
                    <Map
                        className={styles.map}
                        mapStyle={mapStyle}
                        fitBoundsDuration={200}
                        minZoom={5}
                        logoPosition="bottom-left"

                        showScaleControl
                        scaleControlPosition="bottom-right"

                        showGeolocationControl={noLocationInfo}
                        locateOnStartup={noLocationInfo}
                        geoControlPosition="bottom-right"
                        geoOptions={geolocationControlOptions}
                        onGeolocationChange={this.handleGeolocationChange}

                        showNavControl
                        navControlPosition="bottom-right"
                    >
                        {this.renderRoutes()}
                    </Map>
                </div>
                <Navbar />
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(Multiplexer);
