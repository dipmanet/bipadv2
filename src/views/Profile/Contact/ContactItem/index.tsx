import React, { useMemo, useCallback } from 'react';
import {
    _cs,
    listToMap,
} from '@togglecorp/fujs';

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
                { label }
            </div>
            <div className={styles.value}>
                { value }
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
                { value }
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

interface Params {}

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

const ContactItem = (props: Props) => {
    const {
        contact,
        contactId,
        municipalityList,
        onContactEdit,
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

    const confirmationMessage = `Are you sure you want to remove the contact ${name}?`;

    return (
        <div
            className={_cs(
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
            <div className={styles.actionButtons}>
                <Cloak hiddenIf={p => !p.change_contact}>
                    <ModalButton
                        className={styles.button}
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
                        className={styles.button}
                        confirmationMessage={confirmationMessage}
                        pending={pending}
                        onClick={handleContactDelete}
                        transparent
                    >
                        Delete
                    </DangerConfirmButton>
                </Cloak>
            </div>
        </div>
    );
};

export default createConnectedRequestCoordinator<Props>()(
    createRequestClient(requests)(ContactItem),
);
