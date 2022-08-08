import React, { useState } from 'react';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import styles from './styles.scss';


const DataTable = ({ closeModal, incidentList }) => {
    const tabs = [
        { id: 1, name: 'Incident wise details' },
        { id: 2, name: 'Hazarwise summary' },
        { id: 3, name: 'Temporal summary' },
        { id: 4, name: 'Locationwise summary' },
    ];

    const bodyheader = [
        { id: 1, name: 'Hazard Type' },
        { id: 2, name: 'Number of incident' },
        { id: 3, name: 'People death' },
        { id: 4, name: 'People missing' },
        { id: 5, name: 'People injured' },
        { id: 6, name: 'House destroyed' },
        { id: 7, name: 'House affected' },
        { id: 8, name: 'livestock destroyed' },
    ];

    const dummy = [
        {
            name: 'fire',
            numberOfIncident: 10,
            peopleDeathCount: 10,
            peopleMissingCount: 20,
            peopleInjuredCount: 20,
            infrastructureDestroyedHouseCount: 20,
            infrastructureAffectedHouseCount: 30,
            livestockDestroyedCount: 50,
        },
        {
            name: 'landSlide',
            numberOfIncident: 10,
            peopleDeathCount: 10,
            peopleMissingCount: 20,
            peopleInjuredCount: 20,
            infrastructureDestroyedHouseCount: 20,
            infrastructureAffectedHouseCount: 30,
            livestockDestroyedCount: 50,
        },
        {
            name: 'flood',
            numberOfIncident: 10,
            peopleDeathCount: 10,
            peopleMissingCount: 20,
            peopleInjuredCount: 20,
            infrastructureDestroyedHouseCount: 20,
            infrastructureAffectedHouseCount: 30,
            livestockDestroyedCount: 50,
        },
        {
            name: 'earthquake',
            numberOfIncident: 10,
            peopleDeathCount: 10,
            peopleMissingCount: 20,
            peopleInjuredCount: 20,
            infrastructureDestroyedHouseCount: 20,
            infrastructureAffectedHouseCount: 30,
            livestockDestroyedCount: 50,
        },
    ];

    const Header = () => (
        <div className={styles.header}>
            {
                tabs.map(item => (
                    <p className={styles.headerItem} key={item.id}>
                        {item.name}
                    </p>
                ))
            }

        </div>

    );

    const BodyHeader = () => (
        <div className={styles.bodyheader}>
            {
                bodyheader.map(item => (
                    <p className={styles.bodyHeaderItem} key={item.id}>
                        {item.name}
                    </p>
                ))
            }

        </div>

    );

    const BodyData = () => (
        dummy.map(item => (
            <div className={styles.bodyContainer} key={item.name}>
                <div className={styles.bodyWrapper}>
                    {Object.values(item).map(data => (
                        <p className={styles.bodyItem}>
                            {data}
                        </p>
                    ))}

                </div>
            </div>
        ))
    );

    const columns = [
        {
            key: 'hazardInfo.title',
            value: { title: 'Hazard' },
        },
        {
            key: 'hazardInfo.id',
            value: { title: 'Number of Incident' },
        },
        {
            key: 'loss.peopleDeathCount',
            value: { title: 'People Death' },
        },
        {
            key: 'loss.peopleMissingCount',
            value: { title: 'People Missing' },
        },
        {
            key: 'loss.peopleInjuredCount',
            value: { title: 'People Injured' },
        },
        {
            key: 'loss.infrastructureDestroyedHouseCount',
            value: { title: 'House destroyed' },
        },
        {
            key: 'loss.infrastructureAffectedHouseCount',
            value: { title: 'House affected' },
        },
        {
            key: 'loss.livestockDestroyedCount',
            value: { title: 'Total livestock destroyed' },
        },

    ];

    return (

        <Modal className={styles.lossAndDamageTableModal}>
            <ModalHeader
                title={
                    <Header />
                }
                rightComponent={(
                    <DangerButton
                        transparent
                        iconName="close"
                        onClick={closeModal}
                        title="Close Modal"
                    />
                )}
            />
            <ModalBody className={styles.body}>
                <BodyHeader />
                <BodyData />
            </ModalBody>
        </Modal>


    );
};

export default DataTable;
