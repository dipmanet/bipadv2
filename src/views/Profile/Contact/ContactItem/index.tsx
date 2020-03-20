import React, { useMemo } from 'react';
import {
    _cs,
    listToMap,
} from '@togglecorp/fujs';

import {
    Contact,
    Municipality,
} from '#store/atom/page/types';
import { iconNames } from '#constants';

import {
    trainingValues,
    committeeValues,
} from '../utils';
import styles from './styles.scss';

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

interface Props {
    contact: Contact;
    municipalityList: Municipality[];
}


const ContactItem = (props: Props) => {
    const {
        contact,
        municipalityList,
    } = props;

    const municipalities = useMemo(
        () => (
            listToMap(municipalityList, d => d.id, d => d.title)
        ),
        [municipalityList],
    );

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
        </div>
    );
};

export default ContactItem;
