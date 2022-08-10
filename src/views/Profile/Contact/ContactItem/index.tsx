/* eslint-disable no-nested-ternary */
import React, { useMemo, useCallback, useState } from 'react';
import {
    _cs,
    listToMap,
} from '@togglecorp/fujs';


import Loader from 'react-loader-spinner';
import { connect } from 'react-redux';
import {
    Contact,
    Municipality,
} from '#store/atom/page/types';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { iconNames } from '#constants';
import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';
import Cloak from '#components/Cloak';
import {
    trainingValues,
    committeeValues,
} from '../utils';
import ContactEditForm from '../ContactEditForm';

import styles from './styles.scss';
import Icon from '#rscg/Icon';
import { checkSameRegionPermission } from '#utils/common';
import { regionSelector, userSelector } from '#selectors';

const ModalButton = modalize(Button);

const Detail = (p: {
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
                {label}
            </div>
            <div className={styles.value}>
                {value}
            </div>
        </div>
    );
};

const IconDetail = (p: {
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
                {value}
            </div>
        </div>
    );
};

interface OwnProps {
    contactId: Contact['id'];
    contact: Contact;
    onContactEdit: (contactId: Contact['id'], contact: Contact) => void;
    onContactDelete: (contactId: Contact['id']) => void;
    municipalityList: Municipality[];
}

interface Params { }

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<Props, Params> } = {
    municipalityContactDeleteRequest: {
        url: ({ props }) => `/municipality-contact/${props.contactId}/`,
        method: methods.DELETE,
        onSuccess: ({ props }) => {
            if (props.onContactDelete) {
                props.onContactDelete(props.contactId);
            }
        },
    },
};
const mapStateToProps = (state: AppState): PropsFromState => ({

    region: regionSelector(state),

    user: userSelector(state),
});
const ContactItem = (props: Props) => {
    const {
        user,
        region,
        contact,
        contactId,
        municipalityList,
        onContactEdit,
        onContactSortDown,
        onContactSortUp,
        filteredContactListLastIndex,
        contactLoading,
        requests: {
            municipalityContactDeleteRequest,
        },
    } = props;

    const { pending } = municipalityContactDeleteRequest;

    const municipalities = useMemo(
        () => (
            listToMap(municipalityList, d => d.id, d => d.title)
        ),
        [municipalityList],
    );

    const handleContactDelete = useCallback(() => {
        municipalityContactDeleteRequest.do();
    }, [municipalityContactDeleteRequest]);

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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const trainingValueString = useMemo(
        () => (trainings.map(
            d => trainingValues[d.title],
        ).join(', ') || '-'),
        [trainings],
    );
    const filterPermissionGranted = checkSameRegionPermission(user, region);
    const confirmationMessage = `Are you sure you want to remove the contact ${name}?`;
    return (
        <div
            className={_cs(
                styles.contactDetails,
                isDrrFocalPerson && styles.focalPerson,
            )}
        >
            {filterPermissionGranted
                ? (
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
                                        onEditSuccess={onContactEdit}
                                    />
                                )}
                            >
                                Edit
                            </ModalButton>
                        </Cloak>
                        <Cloak hiddenIf={p => !p.delete_contact}>
                            <DangerConfirmButton
                                className={styles.deleteButton}
                                iconName="delete"
                                confirmationMessage={confirmationMessage}
                                pending={pending}
                                onClick={handleContactDelete}
                                transparent
                            >
                                Delete
                            </DangerConfirmButton>
                        </Cloak>
                    </div>
                )
                : ''}
        </div>
    );
};

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<Props>()(
        createRequestClient(requests)(ContactItem),
    ),
);
