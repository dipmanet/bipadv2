import React from 'react';
import produce from 'immer';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    _cs,
    listToMap,
} from '@togglecorp/fujs';

import modalize from '#rscg/Modalize';
import AccentButton from '#rsca/Button/AccentButton';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import Cloak from '#components/Cloak';
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

import { TitleContext, Profile } from '#components/TitleContext';

import { mapStyles } from '#constants';
import ContactItem from './ContactItem';
import ContactEditForm from './ContactEditForm';

import styles from './styles.scss';

const AccentModalButton = modalize(AccentButton);

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
            limit: -1,
        },
    },
    municipalityContactPatchSelectedID: {
        url: ({ params }) => `/municipality-contact/${params.id}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
        query: {
            expand: ['trainings', 'organization'],
        },
        onSuccess: ({ params, response }) => {
            // if (params && params.onSuccess) {
            //     params.onSuccess();
            // }
            console.log('This is final data', response);
        },
        onFailure: ({ error, params }) => {
            console.warn('failure', error.errorMessage);
        },
        onFatal: ({ error, params }) => {
            console.warn('failure', error.errorMessage);
        },
    },
    municipalityContactPatchAlternateID: {
        url: ({ params }) => `/municipality-contact/${params.id}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
        query: {
            expand: ['trainings', 'organization'],
        },
        onSuccess: ({ params, response }) => {
            // if (params && params.onSuccess) {
            //     params.onSuccess();
            // }
            console.log('This is final data', response);
            if (params && params.loaderCondition) {
                const { loaderCondition } = params;
                loaderCondition(response.results);
            }
        },
        onFailure: ({ error, params }) => {
            console.warn('failure', error.errorMessage);
        },
        onFatal: ({ error, params }) => {
            console.warn('failure', error.errorMessage);
        },
    },
};

interface SelectInputOption {
    key: string;
    label: string;
}
// eslint-disable-next-line no-unused-vars
let filteredContactList = [];
let filteredContactListLastIndex = null;
class ContactPage extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            requests: {
                municipalityContactRequest,
            },
        } = this.props;


        this.state = {
            contactList: [],
            indexOfSelectedContact: null,
            changedIndex: null,
            contactLoading: false,

        };
        const { contactList } = this.state;
        if (!contactList.length) {
            municipalityContactRequest.setDefaultParams({
                setProfileContactList: this.setProfileContactList,
            });
        }
    }

    public static contextType = TitleContext;

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
        const municipalityBounds = listToMap(
            municipalityList,
            d => d.id,
            d => d.centroid,
        );

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
        contactId: data.id,
        contact: data,
        municipalityList: this.props.municipalityList,
        onContactEdit: this.handleContactEdit,
        onContactDelete: this.handleContactDelete,
        onContactSortDown: this.handleContactSortDown,
        onContactSortUp: this.handleContactSortUp,
        filteredContactListLastIndex,
        contactLoading: this.state.contactLoading,

    })

    private handleContactSortUp=(contactDetail) => {
        this.setState({
            contactLoading: true,
        });
        const {
            contactList,
        } = this.state;
        const {
            region,
            municipalityList,
            className,
            filters: {
                faramValues: filterValues,
            },
            requests: {
                municipalityContactPatchSelectedID,
                municipalityContactPatchAlternateID,

                municipalityContactRequest: {
                    pending = false,
                } = {},
            },
        } = this.props;

        filteredContactList = this.getFilteredContactList(
            contactList,
            region,
            municipalityList,
            filterValues,
        );
        const indexOfSelectedContact = filteredContactList
            .findIndex(item => item.id === contactDetail.id);


        const moveElement = (filteredList, indexInitial,
            indexDestination) => {
            filteredList.splice(indexDestination, 0, filteredList.splice(indexInitial, 1)[0]);

            return filteredList;
        };
        filteredContactList = moveElement(filteredContactList,
            indexOfSelectedContact, indexOfSelectedContact - 1);


        const TargetOrderData = filteredContactList[indexOfSelectedContact].order;
        const SelectedOrderData = filteredContactList[indexOfSelectedContact - 1].order;
        const alternateContactId = filteredContactList[indexOfSelectedContact].id;
        const selectedContactId = filteredContactList[indexOfSelectedContact - 1].id;

        this.setState({
            indexOfSelectedContact,
            changedIndex: indexOfSelectedContact - 1,
        });
        const selectedContactBody = {
            order: TargetOrderData,
            province: filteredContactList[indexOfSelectedContact].province,
            district: filteredContactList[indexOfSelectedContact].district,
            municipality: filteredContactList[indexOfSelectedContact].municipality,
            committee: filteredContactList[indexOfSelectedContact].committee,
        };
        const selectedAlternateBody = {
            order: SelectedOrderData,
            province: filteredContactList[indexOfSelectedContact - 1].province,
            district: filteredContactList[indexOfSelectedContact - 1].district,
            municipality: filteredContactList[indexOfSelectedContact - 1].municipality,
            committee: filteredContactList[indexOfSelectedContact - 1].committee,
        };

        municipalityContactPatchSelectedID.do({
            id: selectedContactId,
            body: selectedContactBody,


        });
        municipalityContactPatchAlternateID.do({
            id: alternateContactId,
            body: selectedAlternateBody,
            loaderCondition: this.handleLoader,

        });
    }

    private handleLoader=(data) => {
        this.setState({
            contactLoading: false,
        });
    }

    private handleContactSortDown=(contactDetail) => {
        this.setState({
            contactLoading: true,
        });
        const {
            contactList,
        } = this.state;
        const {
            region,
            municipalityList,
            className,
            filters: {
                faramValues: filterValues,
            },
            requests: {
                municipalityContactPatchSelectedID,
                municipalityContactPatchAlternateID,
                municipalityContactRequest: {
                    pending = false,
                } = {},
            },
        } = this.props;
        filteredContactList = this.getFilteredContactList(
            contactList,
            region,
            municipalityList,
            filterValues,
        );
        const indexOfSelectedContact = filteredContactList
            .findIndex(item => item.id === contactDetail.id);


        const moveElement = (filteredList, indexInitial,
            indexDestination) => {
            filteredList.splice(indexDestination, 0, filteredList.splice(indexInitial, 1)[0]);

            return filteredList;
        };
        filteredContactList = moveElement(filteredContactList,
            indexOfSelectedContact, indexOfSelectedContact + 1);


        const TargetOrderData = filteredContactList[indexOfSelectedContact].order;
        const SelectedOrderData = filteredContactList[indexOfSelectedContact + 1].order;
        const alternateContactId = filteredContactList[indexOfSelectedContact].id;
        const selectedContactId = filteredContactList[indexOfSelectedContact + 1].id;
        console.log('test', filteredContactList[indexOfSelectedContact]);
        console.log('test1', filteredContactList[indexOfSelectedContact + 1]);

        this.setState({
            indexOfSelectedContact,
            changedIndex: indexOfSelectedContact + 1,
        });
        const selectedContactBody = {
            order: TargetOrderData,
            province: filteredContactList[indexOfSelectedContact].province,
            district: filteredContactList[indexOfSelectedContact].district,
            municipality: filteredContactList[indexOfSelectedContact].municipality,
            committee: filteredContactList[indexOfSelectedContact].committee,
        };
        const selectedAlternateBody = {
            order: SelectedOrderData,
            province: filteredContactList[indexOfSelectedContact + 1].province,
            district: filteredContactList[indexOfSelectedContact + 1].district,
            municipality: filteredContactList[indexOfSelectedContact + 1].municipality,
            committee: filteredContactList[indexOfSelectedContact + 1].committee,
        };
        console.log('This is data sent', selectedContactBody);
        municipalityContactPatchSelectedID.do({
            id: selectedContactId,
            body: selectedContactBody,

        });
        municipalityContactPatchAlternateID.do({
            id: alternateContactId,
            body: selectedAlternateBody,
            loaderCondition: this.handleLoader,

        });
    }

    private handleContactEdit = (contactId: Contact['id'], contact: Contact) => {
        const { contactList } = this.state;
        const newContactList = produce(contactList, (safeContactList) => {
            const contactIndex = safeContactList.findIndex(c => c.id === contactId);
            if (contactIndex !== -1) {
                // eslint-disable-next-line no-param-reassign
                safeContactList[contactIndex] = {
                    ...safeContactList[contactIndex],
                    ...contact,
                };
            }
        });

        this.setState({ contactList: newContactList });
    }

    private handleContactAdd = (contact: Contact) => {
        const { contactList } = this.state;
        const newContactList = [
            contact,
            ...contactList,
        ];

        this.setState({ contactList: newContactList });
    }

    private handleContactDelete = (contactId: Contact['id']) => {
        const { contactList } = this.state;
        const newContactList = produce(contactList, (safeContactList) => {
            const contactIndex = safeContactList.findIndex(c => c.id === contactId);
            if (contactIndex !== -1) {
                // eslint-disable-next-line no-param-reassign
                safeContactList = safeContactList.splice(contactIndex, 1);
            }
        });

        this.setState({ contactList: newContactList });
    }

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

        const { setProfile } = this.context;

        if (setProfile) {
            setProfile((prevProfile: Profile) => {
                if (prevProfile.mainModule !== 'Contacts') {
                    return { ...prevProfile, mainModule: 'Contacts' };
                }
                return prevProfile;
            });
        }

        const {
            contactList,
        } = this.state;
        const filteredContactListWithoutArrayIndex = this.getFilteredContactList(
            contactList,
            region,
            municipalityList,
            filterValues,
        );
        filteredContactList = filteredContactListWithoutArrayIndex
            .map((item, i) => ({ ...item, indexValue: i }));
        filteredContactListLastIndex = filteredContactList.length - 1;


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
                        <Cloak hiddenIf={p => !p.add_contact}>
                            <AccentModalButton
                                className={styles.button}
                                iconName="add"
                                transparent
                                modal={(
                                    <ContactEditForm
                                        onAddSuccess={this.handleContactAdd}
                                    />
                                )}
                            >
                                Add Contact
                            </AccentModalButton>
                        </Cloak>
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
