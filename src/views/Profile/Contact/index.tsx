import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    _cs,
    mapToList,
    listToMap,
} from '@togglecorp/fujs';

import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';

import CommonMap from '#components/CommonMap';
import Loading from '#components/Loading';
import ListView from '#rscv/List/ListView';

import {
    regionSelector,
    municipalitiesSelector,
    profileContactFiltersSelector,
} from '#selectors';
import {
    AppState,
} from '#store/types';
import {
    Contact,
    Municipality,
    Region,
} from '#store/atom/page/types';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { mapStyles } from '#constants';

import ContactItem from './ContactItem';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
}

interface Params {
    setProfileContactList: (contactList: Contact[]) => void;
}

interface PropsFromState {
    municipalityList: Municipality[];
    region: Region;
    filters: {
        faramValues: unknown;
    };
}

type ReduxProps = OwnProps & PropsFromState;
type Props = NewProps<ReduxProps, Params>;
interface State {
    contactList: Contact[];
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    municipalityList: municipalitiesSelector(state),
    region: regionSelector(state),
    filters: profileContactFiltersSelector(state),
});

const contactKeySelector = (d: Contact) => d.id;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    municipalityContactRequest: {
        url: '/municipality-contact/',
        method: methods.GET,
        onSuccess: ({ response, params }) => {
            interface Response { results: Contact[] }
            const { results: contactList = [] } = response as Response;

            if (params && params.setProfileContactList) {
                params.setProfileContactList(contactList);
            }
        },
        onMount: true,
        query: {
            expand: ['trainings', 'organization'],
        },
    },
};

interface SelectInputOption {
    key: string;
    label: string;
}

class ContactPage extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            requests: {
                municipalityContactRequest,
            },
        } = this.props;

        municipalityContactRequest.setDefaultParams({
            setProfileContactList: this.setProfileContactList,
        });

        this.state = {
            contactList: [],
        };
    }

    private getPositionOptions = memoize((contactList: Contact[]) => {
        const contactPositionList = [...new Set(
            contactList
                .map(d => d.position)
                .filter(d => !!d),
        )];

        const options = [] as SelectInputOption[];
        contactPositionList.forEach(d => options.push({ key: d, label: d }));

        return options;
    })

    private getPointsGeoJson = memoize((
        contactList: Contact[],
        municipalityList: Municipality[],
    ) => {
        const municipalityBounds = listToMap(municipalityList, d => d.id, d => d.centroid);

        const pointList = contactList
            .filter(d => d.point || d.municipality)
            .map(d => (
                d.point || municipalityBounds[d.municipality]
            ));

        const geojson = {
            type: 'FeatureCollection',
            features: pointList.map((p, i) => ({
                id: i,
                type: 'Feature',
                geometry: {
                    ...p,
                },
            })),
        };

        return geojson;
    })

    private getFilteredContactList = memoize((
        contactList: Contact[],
        region,
        municipalityList: Municipality[],
        filterOptions,
    ) => {
        const {
            committee,
            training,
            position,
            drrFocalPersonOnly,
        } = filterOptions;

        let newContactList = [...contactList].sort((a: Contact, b: Contact) => {
            const aWeight = a.isDrrFocalPerson ? 1 : 0;
            const bWeight = b.isDrrFocalPerson ? 1 : 0;

            return (bWeight - aWeight);
        });

        if (drrFocalPersonOnly) {
            newContactList = newContactList.filter(d => d.isDrrFocalPerson);
        }

        if (committee) {
            newContactList = newContactList.filter(d => d.committee === committee);
        }

        if (training) {
            newContactList = newContactList.filter((d) => {
                if (!d.trainings) {
                    return false;
                }

                return d.trainings.some(t => t.title === training);
            });
        }

        if (position) {
            newContactList = newContactList.filter(d => d.position === position);
        }

        if (!region.adminLevel) {
            return newContactList;
        }

        if (region.adminLevel === 1) {
            const municipalities: {
                [key: string]: boolean;
            } = {};
            municipalityList.forEach((d) => {
                if (d.province === region.geoarea) {
                    municipalities[d.id] = true;
                }
            });

            return newContactList.filter(d => municipalities[d.municipality]);
        }

        if (region.adminLevel === 2) {
            const municipalities: {
                [key: string]: boolean;
            } = {};
            municipalityList.forEach((d) => {
                if (d.district === region.geoarea) {
                    municipalities[d.id] = true;
                }
            });

            return newContactList.filter(d => municipalities[d.municipality]);
        }

        if (region.adminLevel === 3) {
            return newContactList.filter(d => d.municipality === region.geoarea);
        }

        return [];
    })

    private setProfileContactList = (contactList: Contact[]) => {
        this.setState({ contactList });
    }

    private contactRendererParams = (_: string, data: Contact) => ({
        contact: data,
        municipalityList: this.props.municipalityList,
    })

    public render() {
        const {
            region,
            municipalityList,
            className,
            filters: {
                faramValues: filterValues,
            },
            requests: {
                municipalityContactRequest: {
                    pending = false,
                } = {},
            },
        } = this.props;

        const {
            contactList,
        } = this.state;

        const filteredContactList = this.getFilteredContactList(
            contactList,
            region,
            municipalityList,
            filterValues,
        );

        const pointsGeoJson = this.getPointsGeoJson(filteredContactList, municipalityList);
        const clusteredPointFilter = ['has', 'point_count'];
        const nonClusteredPointFilter = ['!', clusteredPointFilter];

        const positionOptions = this.getPositionOptions(contactList);

        return (
            <>
                <Loading pending={pending} />
                <CommonMap sourceKey="profile-contact" />
                <MapSource
                    sourceKey="profile-contact-points"
                    geoJson={pointsGeoJson}
                    sourceOptions={{
                        type: 'geojson',
                        cluster: true,
                        clusterMaxZoom: 10,
                    }}
                >
                    <MapLayer
                        layerKey="contact-point-clusters"
                        layerOptions={{
                            type: 'circle',
                            paint: mapStyles.contactPoint.clusteredCircle,
                            filter: clusteredPointFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="contact-point-cluster-count"
                        layerOptions={{
                            type: 'symbol',
                            paint: mapStyles.contactPoint.clusterLabelPaint,
                            layout: mapStyles.contactPoint.clusterLabelLayout,
                            filter: clusteredPointFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="contact-points"
                        layerOptions={{
                            type: 'circle',
                            paint: mapStyles.contactPoint.circle,
                            filter: nonClusteredPointFilter,
                        }}
                    />
                </MapSource>
                <div className={_cs(className, styles.left)}>
                    <header className={styles.header}>
                        <h2 className={styles.heading}>
                            Contact personnels
                        </h2>
                    </header>
                    <ListView
                        className={styles.contactDetailsList}
                        data={filteredContactList}
                        renderer={ContactItem}
                        rendererParams={this.contactRendererParams}
                        keySelector={contactKeySelector}
                    />
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            ContactPage,
        ),
    ),
);
