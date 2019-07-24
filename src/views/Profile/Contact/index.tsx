import React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    _cs,
    mapToList,
} from '@togglecorp/fujs';

import CommonMap from '#components/CommonMap';
import Loading from '#components/Loading';
import Page from '#components/Page';
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
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    iconNames,
    getMapPaddings,
} from '#constants';

import Filter from './Filter';
import styles from './styles.scss';

interface Response {
    results: Contact[];
}

interface OwnProps {
    className?: string;
}

interface Params {}
interface PropsFromDispatch {
    setProfileContactList: typeof setProfileContactListAction;
}
interface PropsFromState {
    contactList: Contact[];
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    contactList: profileContactListSelector(state),
    region: regionSelector(state),
    municipalityList: municipalitiesSelector(state),
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

            setProfileContactList({
                contactList,
            });
        },
        onMount: true,
        query: {
            expand: 'trainings',
        },
    },
};

interface Contact {
    committee: string;
    email: string;
    id: string;
    image?: string;
    mobileNumber: string;
    municipality: string;
    name: string;
    point?: number[];
    position: string;
    trainings: Training[];
    ward?: string;
    workNumber: string;
}

interface Training {
    id: string;
    title: string;
}

const committeeValues = {
    LDMC: 'Local Disaster Management Committee',
    WDMC: 'Ward Disaster Management Committee',
    CDMC: 'Community Disaster Management Committee',
    non_comittee_member: 'Non comittee members', // eslint-disable-line @typescript-eslint/camelcase
};

const committeeValueList = mapToList(committeeValues, (v, k) => ({ key: k, label: v }));

const trainingValues = {
    LSAR: 'Lite Search and Rescue',
    rapid_assessment: 'Rapid Assessment', // eslint-disable-line @typescript-eslint/camelcase
    first_aid: 'First Aid', // eslint-disable-line @typescript-eslint/camelcase
    fire_fighting: 'Fire Fighting', // eslint-disable-line @typescript-eslint/camelcase
};

const trainingValueList = mapToList(trainingValues, (v, k) => ({ key: k, label: v }));

const emptyList = [];

class Contact extends React.PureComponent<Props> {
    private getFilteredContactList = memoize((
        contactList,
        region,
        municipalityList,
        filterOptions,
    ) => {
        const {
            committee,
            training,
            position,
        } = filterOptions;

        let newContactList = contactList;

        if (committee) {
            newContactList = newContactList.filter(d => d.committee === committee);
        }

        if (training) {
            newContactList = newContactList.filter(d => d.training === training);
        }

        if (position) {
            newContactList = newContactList.filter((d) => {
                if (d.position) {
                    return d.position.toLowerCase().includes(position.toLowerCase());
                }

                return false;
            });
        }

        if (!region.adminLevel) {
            return newContactList;
        }

        if (region.adminLevel === 1) {
            const municipalities = {};
            municipalityList.forEach((d) => {
                if (d.province === region.geoarea) {
                    municipalities[d.id] = true;
                }
            });

            return newContactList.filter(d => municipalities[d.municipality]);
        }

        if (region.adminLevel === 2) {
            const municipalities = {};
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


        return emptyList;
    })

    private contactRendererParams = (_: string, data: Contact) => ({
        contact: data,
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
    private renderContactDetails = (p: { contact: Contact }) => {
        const { contact } = p;

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
        } = contact;

        const Detail = this.renderDetail;
        const IconDetail = this.renderIconDetail;

        const trainingValueString = trainings.map(d => trainingValues[d.title]).join(', ') || '-';

        return (
            <div className={styles.contactDetails}>
                <div className={styles.personalDetails}>
                    <div className={styles.displayImageContainer}>
                        { image ? (
                            <img
                                src={image}
                                alt="img"
                            />
                        ) : (
                            <span className={_cs(
                                styles.icon,
                                iconNames.user,
                            )}
                            />
                        )}
                    </div>
                    <div className={styles.right}>
                        <h4 className={styles.name}>
                            { name }
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
                    label="Comittee"
                    value={committeeValues[committee] || '-'}
                />
                <Detail
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
            className,
            contactList,
            region,
            municipalityList,
            filters: {
                faramValues: filterValues,
            },
            requests: {
                municipalityContactRequest: {
                    pending,
                } = {},
            },
        } = this.props;

        const filteredContactList = this.getFilteredContactList(
            contactList,
            region,
            municipalityList,
            filterValues,
        );

        return (
            <React.Fragment>
                <Loading pending={pending} />
                <CommonMap
                    region={region}
                    boundsPadding={getMapPaddings().leftPaneExpanded}
                />
                <Page
                    leftContentClassName={styles.left}
                    leftContent={
                        <React.Fragment>
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
                        </React.Fragment>
                    }
                    rightContentClassName={styles.right}
                    rightContent={
                        <Filter
                            committeeValueList={committeeValueList}
                            trainingValueList={trainingValueList}
                        />
                    }
                />
            </React.Fragment>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(Contact);
