import React from 'react';
import { compose, Dispatch } from 'redux';
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
    setProfileContactListAction,
} from '#actionCreators';

import {
    profileContactListSelector,
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
    Training,
} from '#store/atom/page/types';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    iconNames,
    mapStyles,
} from '#constants';

import Filter from './Filter';
import styles from './styles.scss';

interface OwnProps {
    className?: string;
}

interface Params {}
interface PropsFromDispatch {
    setProfileContactList: typeof setProfileContactListAction;
}
interface PropsFromState {
    municipalityList: Municipality[];
    contactList: Contact[];
    region: Region;
    filters: {
        faramValues: unknown;
    };
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    contactList: profileContactListSelector(state),
    municipalityList: municipalitiesSelector(state),
    region: regionSelector(state),
    filters: profileContactFiltersSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setProfileContactList: params => dispatch(setProfileContactListAction(params)),
});

const contactKeySelector = (d: Contact) => d.id;

const requests: { [key: string]: ClientAttributes<Props, Params> } = {
    municipalityContactRequest: {
        url: '/municipality-contact/',
        method: methods.GET,
        onSuccess: ({ response, props: { setProfileContactList } }) => {
            interface Response { results: Contact[] }
            const { results: contactList = [] } = response as Response;

            setProfileContactList({ contactList });
        },
        onMount: true,
        query: {
            expand: ['trainings', 'organization'],
        },
    },
};

const committeeValues: {
    [key in Contact['committee']]: string;
} = {
    LDMC: 'Local Disaster Management Committee',
    WDMC: 'Ward Disaster Management Committee',
    CDMC: 'Community Disaster Management Committee',
    non_committee: 'Non committee members', // eslint-disable-line @typescript-eslint/camelcase
};

const committeeValueList = mapToList(
    committeeValues,
    (v, k) => ({ key: k, label: v }),
);

const trainingValues: {
    [key in Training['title']]: string;
} = {
    LSAR: 'Lite Search and Rescue',
    rapid_assessment: 'Rapid Assessment', // eslint-disable-line @typescript-eslint/camelcase
    first_aid: 'First Aid', // eslint-disable-line @typescript-eslint/camelcase
    fire_fighting: 'Fire Fighting', // eslint-disable-line @typescript-eslint/camelcase
};

const trainingValueList = mapToList(
    trainingValues,
    (v, k) => ({ key: k, label: v }),
);

interface SelectInputOption {
    key: string;
    label: string;
}

class ContactPage extends React.PureComponent<Props> {
    private getMunicipalityMap = (municipalityList: Municipality[]) => (
        listToMap(municipalityList, d => d.id, d => d.title)
    )

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

    private contactRendererParams = (_: string, data: Contact) => ({
        contact: data,
        municipalityList: this.props.municipalityList,
    })

    private renderDetail = (p: {
        label: string;
        value: string;
        className?: string;
    }) => {
        const {
            label,
            value,
            className,
        } = p;

        return (
            <div className={_cs(styles.detail, className)}>
                <div className={styles.label}>
                    { label }
                </div>
                <div className={styles.value}>
                    { value }
                </div>
            </div>
        );
    }

    private renderIconDetail = (p: {
        value: string;
        iconName: string;
        className?: string;
    }) => {
        const {
            value,
            iconName,
            className,
        } = p;

        return (
            <div className={_cs(styles.iconDetail, className)}>
                <div className={_cs(styles.icon, iconName)} />
                <div className={styles.value}>
                    { value }
                </div>
            </div>
        );
    }

    private renderContactDetails = (p: { contact: Contact; municipalityList: Municipality[] }) => {
        const {
            contact,
            municipalityList,
        } = p;

        if (!contact) {
            return null;
        }

        const {
            image,
            name,
            email,
            committee,
            position,
            trainings = [],
            mobileNumber,
            isDrrFocalPerson,
            municipality,
            organization,
        } = contact;

        const Detail = this.renderDetail;
        const IconDetail = this.renderIconDetail;

        const trainingValueString = trainings.map(
            d => trainingValues[d.title],
        ).join(', ') || '-';
        const municipalities = this.getMunicipalityMap(municipalityList);

        return (
            <div className={_cs(
                styles.contactDetails,
                isDrrFocalPerson && styles.focalPerson,
            )}
            >
                <div className={styles.personalDetails}>
                    <div className={styles.displayImageContainer}>
                        { image ? (
                            <img
                                className={styles.image}
                                src={image}
                                alt="img"
                            />
                        ) : (
                            <span
                                className={_cs(
                                    styles.icon,
                                    iconNames.user,
                                )}
                            />
                        )}
                    </div>
                    <div className={styles.right}>
                        <h4 className={styles.name}>
                            { name }
                            { isDrrFocalPerson && (
                                <span
                                    className={_cs(
                                        styles.focalPersonIcon,
                                        iconNames.star,
                                    )}
                                    title="DRR focal person"
                                />
                            )}
                        </h4>
                        <IconDetail
                            iconName={iconNames.telephone}
                            value={mobileNumber || 'Not available'}
                        />
                        <IconDetail
                            iconName={iconNames.email}
                            value={email || 'Not available'}
                        />
                    </div>
                </div>
                <Detail
                    label="Municipality"
                    value={municipalities[municipality]}
                />
                <Detail
                    label="Organization"
                    value={(organization ? organization.title : undefined) || '-'}
                />
                <Detail
                    label="Comittee"
                    value={committeeValues[committee] || '-'}
                />
                <Detail
                    className={styles.position}
                    label="Position"
                    value={position}
                />
                <Detail
                    label="Training"
                    value={trainingValueString}
                />
            </div>
        );
    }

    public render() {
        const {
            contactList,
            region,
            municipalityList,
            filters: {
                faramValues: filterValues,
            },
            requests: {
                municipalityContactRequest: {
                    pending = false,
                } = {},
            },
        } = this.props;

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
            <React.Fragment>
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
                <div className={styles.left}>
                    <header className={styles.header}>
                        <h3 className={styles.heading}>
                            Contact personnels
                        </h3>
                    </header>
                    <ListView
                        className={styles.contactDetailsList}
                        data={filteredContactList}
                        renderer={this.renderContactDetails}
                        rendererParams={this.contactRendererParams}
                        keySelector={contactKeySelector}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(ContactPage);
