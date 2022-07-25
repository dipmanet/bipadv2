/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */
/* eslint-disable prefer-const */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React from 'react';
import produce from 'immer';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    _cs,
    compareDate,
    compareString,
    compareBoolean,
    listToMap,
} from '@togglecorp/fujs';
import { Item } from 'semantic-ui-react';
import { MapChildContext } from '#re-map/context';
import ScalableVectorGraphcis from '#rscv/ScalableVectorGraphics';
import Icon from '#rscg/Icon';
import Sortable from '#rscv/Taebul/Sortable';
import ColumnWidth from '#rscv/Taebul/ColumnWidth';
import Button from '#rsca/Button';
import DownloadButton from '#components/DownloadButton';
import TableDateCell from '#components/TableDateCell';
import {
    convertTableToCsv,
    prepareColumns,
    defaultState,
} from '#utils/table';

import modalize from '#rscg/Modalize';
import AccentButton from '#rsca/Button/AccentButton';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import Cloak from '#components/Cloak';
import CommonMap from '#components/CommonMap';
import Loading from '#components/Loading';
import ListView from '#rscv/List/ListView';
import Message from '#rscv/Message';
import {
    regionSelector,
    municipalitiesSelector,
    profileContactFiltersSelector,
    palikaRedirectSelector,
    userSelector,
} from '#selectors';
import {
    AppState,
} from '#store/types';
import {
    Contact,
    Municipality,
    Region,
} from '#store/atom/page/types';
import phoneContactLogo from '../../../resources/icons/phone-contact.svg';
import emailContactLogo from '../../../resources/icons/email-logo.svg';
import tableView from '../../../resources/icons/list-view.svg';
import listView from '../../../resources/icons/category-view.svg';
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
import Taebul from '#rscv/Taebul';
import { checkSameRegionPermission } from '#utils/common';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';


const AccentModalButton = modalize(AccentButton);
const ModalButton = modalize(Button);
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
    palikaRedirect: palikaRedirectSelector(state),

    user: userSelector(state),
});

const contactKeySelector = (d: Contact) => d.id;
const tableKeySelector = data => data.id;
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
        query: ({ params }) => ({

            expand: ['trainings', 'organization'],
            limit: -1,
            province: params.province,
            district: params.district,
            municipality: params.municipality,


        }),
    },
    municipalityContactPatchSelectedID: {
        url: ({ params }) => '/municipality-contact/',
        method: methods.GET,
        query: ({ params }) => ({
            swap: true,
            // eslint-disable-next-line @typescript-eslint/camelcase
            first_contact: params && params.selectedId,
            // eslint-disable-next-line @typescript-eslint/camelcase
            second_contact: params && params.alternateId,

        }),
        onSuccess: ({ params, response }) => {
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
    municipalityContactDeleteRequest: {
        url: ({ params }) => `/municipality-contact/${params.contactId}/`,
        method: methods.DELETE,
        onSuccess: ({ params }) => {
            if (params.onContactDelete) {
                params.onContactDelete(params.contactId);
            }
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
    public static contextType = TitleContext;

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
            isSortByOrdering: true,
            settings: defaultState,
            sortData: [],
            enableAscendingSort: null,
            selectedSortList: '',
            searchActivated: false,
            enableListView: true,
            selectedContactFromLabelListId: null,
            searchKeyword: '',

        };
        const { contactList } = this.state;
        if (!contactList.length) {
            const { user } = this.props;


            if (user) {
                const { user: { profile: {
                    province,
                    district,
                    municipality,
                } },
                    region } = this.props;
                municipalityContactRequest.setDefaultParams({
                    setProfileContactList: this.setProfileContactList,
                    province: region.adminLevel === 1 ? region.geoarea : '',
                    district: region.adminLevel === 2 ? region.geoarea : '',
                    municipality: region.adminLevel === 3 ? region.geoarea : '',

                });
            } else {
                municipalityContactRequest.setDefaultParams({
                    setProfileContactList: this.setProfileContactList,
                });
            }
        }
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

        // let newContactList = [...contactList].sort((a: Contact, b: Contact) => {
        //     const aWeight = a.isDrrFocalPerson ? 1 : 0;
        //     const bWeight = b.isDrrFocalPerson ? 1 : 0;

        //     return (bWeight - aWeight);
        // });

        let newContactList = contactList;
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
        this.setState({
            contactList,
            sortData: contactList,
            searchActivated: false,
            searchKeyword: '',
            selectedContactFromLabelListId: false,
        });
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

    private handleContactSortUp = (contactDetail) => {
        this.setState({
            contactLoading: true,
            isSortByOrdering: false,
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
        // filteredContactList = contactList;
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

            selectedId: selectedContactId,
            alternateId: alternateContactId,
            loaderCondition: this.handleLoader,


        });
    }

    private handleLoader = (data) => {
        this.setState({
            contactLoading: false,
            isSortByOrdering: true,
        });
    }

    private handleContactSortDown = (contactDetail) => {
        this.setState({
            contactLoading: true,
            isSortByOrdering: false,
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
        // filteredContactList = contactList;
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
        municipalityContactPatchSelectedID.do({

            selectedId: selectedContactId,
            alternateId: alternateContactId,
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


    public componentDidUpdate(prevProps, prevState, snapshot) {
        const { region,
            requests: {
                municipalityContactRequest,
            } } = this.props;

        // if (prevState.sortData !== this.state.sortData) {
        //     window.scrollTo(0, 0);
        // }
        if (prevProps.region !== region) {
            municipalityContactRequest.do(
                {
                    setProfileContactList: this.setProfileContactList,
                    province: region.adminLevel === 1 ? region.geoarea : '',
                    district: region.adminLevel === 2 ? region.geoarea : '',
                    municipality: region.adminLevel === 3 ? region.geoarea : '',
                },
            );
        }
    }

    private handleSettingsChange = (val) => {
        this.setState({ settings: val });
    }


    private AlertTableEmptyComponent = () => (
        <Message>
            <div className={styles.alertEmpty}>
                There are no alerts at the moment.
            </div>
        </Message>
    );

    private sortButtonDescending = (keyword) => {
        const { sortData } = this.state;
        this.setState({ searchActivated: true });
        let data = [];
        if (sortData.length) {
            data = sortData.sort((a, b) => {
                if (a[keyword] < b[keyword]) return 1;
                if (a[keyword] > b[keyword]) return -1;
                return 0;
            });
        } else {
            data = filteredContactList.sort((a, b) => {
                if (a[keyword] < b[keyword]) return 1;
                if (a[keyword] > b[keyword]) return -1;
                return 0;
            });
        }


        this.setState({
            sortData: data,
            sortButtonAscending: false,
            selectedSortList: keyword,
        });
    }

    private sortButtonAscending = (keyword) => {
        const { sortData } = this.state;
        this.setState({ searchActivated: true });
        let data = [];
        if (sortData.length) {
            data = sortData.sort((a, b) => {
                if (a[keyword] < b[keyword]) return -1;
                if (a[keyword] > b[keyword]) return 1;
                return 0;
            });
        } else {
            data = filteredContactList.sort((a, b) => {
                if (a[keyword] < b[keyword]) return -1;
                if (a[keyword] > b[keyword]) return 1;
                return 0;
            });
        }

        this.setState({
            sortData: data,
            sortButtonAscending: true,
            selectedSortList: keyword,
        });
    }

    private handleSearch = (value) => {
        this.setState({ searchActivated: true, searchKeyword: value });

        if (value === '' || value === null) {
            this.setState({
                sortData: filteredContactList,
            });
        } else {
            const filteredData = filteredContactList.filter((item, i) => (
                item.position.toLowerCase().indexOf(value.toLowerCase()) !== -1
            ));

            this.setState({ sortData: filteredData });
        }
    }

    private SortButton = (
        tableHeaderName,

    ) => {
        const { sortButtonAscending, selectedSortList } = this.state;

        return ((sortButtonAscending === undefined ? (
            <button
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                type="button"
                onClick={() => this.sortButtonAscending(tableHeaderName)}
            >
                <Icon className={styles.visualizationIcon} name="sort" />
            </button>
        ) // eslint-disable-next-line no-nested-ternary
            : selectedSortList === tableHeaderName ? (
                !sortButtonAscending ? (
                    <button
                        type="button"
                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        onClick={() => this.sortButtonAscending(tableHeaderName)}
                    >
                        <Icon className={styles.visualizationIcon} name="sortAscending" />
                    </button>
                ) : (
                    <button
                        type="button"
                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        onClick={() => this.sortButtonDescending(tableHeaderName)}
                    >
                        <Icon className={styles.visualizationIcon} name="sortDescending" />
                    </button>
                )
            ) : (
                <button
                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                    type="button"
                    onClick={() => this.sortButtonDescending(tableHeaderName)}
                >
                    <Icon className={styles.visualizationIcon} name="sort" />
                </button>
            )));
    };

    private editDeleteButton = (contactId, contact) => {
        const { user, region, requests: {
            municipalityContactDeleteRequest,
        } } = this.props;
        const filterPermissionGranted = checkSameRegionPermission(user, region);
        const { name } = contact;

        const handleContactDetailsDelete = () => {
            municipalityContactDeleteRequest.do({
                contactId,
                onContactDelete: this.handleContactDelete,
            });
        };

        const { pending } = municipalityContactDeleteRequest;
        const confirmationMessage = `Are you sure you want to remove the contact ${name}?`;
        return (
            filterPermissionGranted
                ? (
                    <>
                        <div className={styles.actionButtons}>
                            <Cloak hiddenIf={p => !p.change_contact}>
                                <ModalButton
                                    className={styles.editButton}
                                    iconName="edit"
                                    transparent
                                    modal={(
                                        <ContactEditForm
                                            contactId={contactId}
                                            details={contact}
                                            onEditSuccess={this.handleContactEdit}
                                        />
                                    )}
                                >
                                    Edit
                                </ModalButton>
                            </Cloak>
                            <Cloak hiddenIf={p => !p.delete_contact}>
                                <DangerConfirmButton
                                    className={styles.editButton}
                                    iconName="delete"
                                    confirmationMessage={confirmationMessage}
                                    pending={pending}
                                    onClick={handleContactDetailsDelete}
                                    transparent
                                >
                                    Delete
                                </DangerConfirmButton>
                            </Cloak>
                        </div>
                    </>
                )
                : ''
        );
    }

    private tableComponent = () => {
        const { isSortByOrdering, contactList,
            sortData, sortButtonAscending,
            searchActivated, selectedSortList } = this.state;
        return (
            <div style={{ overflow: 'auto', padding: '20px', paddingTop: '0px' }}>
                <table className={styles.contacts}>
                    <thead>
                        <tr style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                            <th>
                                S/N


                            </th>
                            <th>
                                <div style={{ display: 'flex' }}>

                                    Name

                                    {this.SortButton('name')}

                                </div>
                            </th>
                            <th>
                                <div style={{ display: 'flex' }}>

                                    Position
                                    {this.SortButton('position')}

                                </div>
                            </th>
                            <th>
                                <div style={{ display: 'flex' }}>
                                    Organization
                                    {this.SortButton('position')}

                                </div>
                            </th>
                            {/* <th>Organization</th> */}
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>
                                <div style={{ display: 'flex' }}>
                                    Committe
                                    {this.SortButton('committee')}
                                </div>
                            </th>
                            <Cloak hiddenIf={p => !p.add_contact}>
                                <th>Action</th>
                            </Cloak>

                        </tr>
                    </thead>
                    <tbody>
                        {searchActivated ? !sortData.length
                            ? (
                                <tr>
                                    <td />
                                    <td />
                                    <td />
                                    <td>No Data Available</td>
                                    <td />
                                    <td />
                                    <td />
                                </tr>
                            )
                            : sortData.map((item, i) => (
                                <tr key={item.id}>
                                    <td>{i + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.position}</td>
                                    <td>
                                        {item.organization ? item.organization.title : '-'}
                                    </td>
                                    <td>{item.mobileNumber}</td>
                                    <td>{item.email}</td>
                                    <td>{item.committee}</td>
                                    <td>{this.editDeleteButton(item.id, item)}</td>
                                </tr>
                            )) : filteredContactList.length ? filteredContactList.map((item, i) => (
                                <tr key={item.id}>
                                    <td>{i + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.position}</td>
                                    <td>
                                        {item.organization ? item.organization.title : '-'}

                                    </td>
                                    <td>{item.mobileNumber}</td>
                                    <td>{item.email}</td>
                                    <td>{item.committee}</td>
                                    <td>{this.editDeleteButton(item.id, item)}</td>
                                </tr>
                            )) : (
                            <tr>
                                <td />
                                <td />
                                <td />
                                <td>No Data Available</td>
                                <td />
                                <td />
                                <td />
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    private trainingTitleName = (title) => {
        const trainingList = {
            LSAR: 'Lite Search & Rescue',
            rapid_assessment: 'Rapid Assessment',
            first_aid: 'First Aid',
            fire_fighting: 'Fire Fighting',
        };
        return trainingList[title];
    }

    private listComponent = () => {
        const { sortData, searchActivated, selectedContactFromLabelListId } = this.state;


        const handleClick = (coordinates, id) => {
            const { map } = this.context;


            this.setState({ selectedContactFromLabelListId: id });
            map.flyTo({ center: coordinates, zoom: 15 });
        };

        return (

            <div style={{ overflowY: 'scroll' }}>
                <div className={styles.row}>
                    {searchActivated ? !sortData.length
                        ? (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <h2>No Data Availabe</h2>
                            </div>

                        )
                        : sortData.map((item, i) => (

                            <div
                                key={item.id}
                                className={item.id === selectedContactFromLabelListId ? _cs(styles.column, styles.active) : styles.column}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleClick(item.point.coordinates, item.id)}
                                onKeyDown={undefined}
                            >
                                <div className={styles.contactImageProfile}>
                                    <img
                                        className={styles.image}
                                        src={item.image}
                                        alt="profile"
                                        loading="lazy"
                                    />
                                    <div className={styles.contactNameDetails}>
                                        <span style={{ fontWeight: 'bold' }}>{item.name.toUpperCase()}</span>
                                        <span>
                                            {item.position}
                                            ,
                                            {item.committee}
                                        </span>


                                    </div>
                                </div>
                                <div className={styles.contactPhoneDetails}>
                                    <span style={{ color: 'black' }}>{item.mobileNumber || '-'}</span>
                                    <ScalableVectorGraphcis
                                        className={styles.icon}
                                        src={phoneContactLogo}
                                    />
                                </div>
                                <div className={styles.contactEmailDetails}>
                                    <span style={{ color: 'black', wordBreak: 'break-word', marginRight: '10px' }}>{item.email || '-'}</span>
                                    <ScalableVectorGraphcis
                                        className={styles.icon}
                                        src={emailContactLogo}
                                    />
                                </div>
                                <div className={styles.contactDetailsFooter} style={item.trainings.length ? {} : { display: 'flex' }}>
                                    <div style={item.trainings.length ? { marginLeft: '10px', marginRight: '10px' }
                                        : { marginLeft: '10px', marginRight: '10px', display: 'flex', alignItems: 'center' }}
                                    >
                                        <p>
                                            {item.trainings.length ? item.trainings.map((data, index) => (
                                                <>
                                                    {(item.trainings.length - 1 === index) && (item.trainings.length !== 1) ? ' & ' : ''}
                                                    {this.trainingTitleName(data.title)}

                                                    {(item.trainings.length - 1 === index) || (item.trainings.length - 2 === index) ? '' : ','}
                                                </>
                                            )) : 'No Training Attained'}
                                        </p>
                                    </div>
                                    <div className={styles.editDeleteButtn}>
                                        {this.editDeleteButton(item.id, item)}
                                    </div>

                                </div>
                            </div>


                        )) : filteredContactList.length ? filteredContactList.map((item, i) => (

                            <div
                                key={item.id}
                                className={item.id === selectedContactFromLabelListId ? _cs(styles.column, styles.active) : styles.column}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleClick(item.point.coordinates, item.id)}
                                onKeyDown={undefined}
                            >
                                <div className={styles.contactImageProfile}>
                                    <img
                                        className={styles.image}
                                        src={item.image}
                                        alt="profile"
                                        loading="lazy"
                                    />
                                    <div className={styles.contactNameDetails}>
                                        <span style={{ fontWeight: 'bold' }}>{item.name.toUpperCase()}</span>
                                        <span>
                                            {item.position}
                                            ,
                                            {item.committee}
                                        </span>


                                    </div>
                                </div>
                                <div className={styles.contactPhoneDetails}>
                                    <span style={{ color: 'black' }}>{item.mobileNumber || '-'}</span>
                                    <ScalableVectorGraphcis
                                        className={styles.icon}
                                        src={phoneContactLogo}
                                    />
                                </div>
                                <div className={styles.contactEmailDetails}>
                                    <span style={{ color: 'black', wordBreak: 'break-word', marginRight: '10px' }}>{item.email || '-'}</span>
                                    <ScalableVectorGraphcis
                                        className={styles.icon}
                                        src={emailContactLogo}
                                    />
                                </div>
                                <div className={styles.contactDetailsFooter} style={item.trainings.length ? {} : { display: 'flex' }}>
                                    <div style={{ marginLeft: '10px', marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                                        <p>
                                            {item.trainings.length ? item.trainings.map((data, index) => (
                                                <>
                                                    {(item.trainings.length - 1 === index) && (item.trainings.length !== 1) ? ' & ' : ''}
                                                    {this.trainingTitleName(data.title)}

                                                    {(item.trainings.length - 1 === index) || (item.trainings.length - 2 === index) ? '' : ','}
                                                </>
                                            )) : 'No Training Attained'}
                                        </p>
                                        {/* <p>First Aid,Search & Rescue and Drill exercise</p> */}
                                    </div>
                                    <div className={styles.editDeleteButtn}>
                                        {this.editDeleteButton(item.id, item)}
                                    </div>


                                </div>
                            </div>

                        )) : (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h2>No Data Available</h2>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    public render() {
        const {
            region,
            municipalityList,
            className,
            user,
            filters: {
                faramValues: filterValues,
            },
            requests: {
                municipalityContactRequest: {
                    pending = false,
                } = {},

            },
            palikaRedirect,
        } = this.props;

        const { setProfile } = this.context;
        const { isSortByOrdering, contactList,
            sortData, sortButtonAscending,
            searchActivated, selectedSortList, enableListView, searchKeyword } = this.state;

        if (setProfile) {
            setProfile((prevProfile: Profile) => {
                if (prevProfile.mainModule !== 'Contacts') {
                    return { ...prevProfile, mainModule: 'Contacts' };
                }
                return prevProfile;
            });
        }
        if (isSortByOrdering) {
            const filteredContactListWithoutArrayIndex = this.getFilteredContactList(
                contactList,
                region,
                municipalityList,
                filterValues,
            );
            // const filteredContactListWithoutArrayIndex = contactList;
            filteredContactList = filteredContactListWithoutArrayIndex
                .map((item, i) => ({ ...item, indexValue: i }));


            filteredContactListLastIndex = filteredContactList.length - 1;
        }

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
                        <input className={styles.search} name="search" type="text" value={searchKeyword} placeholder="SEARCH BY POSITION" onChange={e => this.handleSearch(e.target.value)} />

                        <div style={{ marginLeft: '10px', marginRight: '10px', display: 'flex' }}>
                            <Button
                                className={styles.SelectTableButton}
                                onClick={() => this.setState({ enableListView: !enableListView })}
                                disabled={!filteredContactList.length}
                                title={enableListView ? 'Table View' : 'List View'}
                            >
                                <div key={enableListView}>
                                    <ScalableVectorGraphcis
                                        className={styles.iconDataView}
                                        src={enableListView ? tableView : listView}
                                    />
                                </div>


                            </Button>


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
                        </div>
                    </header>
                    {enableListView ? this.listComponent() : this.tableComponent()}

                </div>
            </>
        );
    }
}
ContactPage.contextType = MapChildContext;
export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            ContactPage,
        ),
    ),
);
