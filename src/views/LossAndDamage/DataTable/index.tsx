/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { _cs } from '@togglecorp/fujs';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import styles from './styles.scss';

const dummy = [
    {
        name: 'fire',
        numberOfIncident: 1,
        peopleDeathCount: 5,
        peopleMissingCount: 10,
        peopleInjuredCount: 30,
        infrastructureDestroyedHouseCount: 20,
        infrastructureAffectedHouseCount: 50,
        livestockDestroyedCount: 70,
    },
    {
        name: 'landSlide',
        numberOfIncident: 25,
        peopleDeathCount: 10,
        peopleMissingCount: 2,
        peopleInjuredCount: 2,
        infrastructureDestroyedHouseCount: 2,
        infrastructureAffectedHouseCount: 2,
        livestockDestroyedCount: 2,
    },
    {
        name: 'flood',
        numberOfIncident: 3,
        peopleDeathCount: 11,
        peopleMissingCount: 3,
        peopleInjuredCount: 3,
        infrastructureDestroyedHouseCount: 3,
        infrastructureAffectedHouseCount: 3,
        livestockDestroyedCount: 3,
    },
    {
        name: 'earthquake',
        numberOfIncident: 4,
        peopleDeathCount: 30,
        peopleMissingCount: 4,
        peopleInjuredCount: 4,
        infrastructureDestroyedHouseCount: 4,
        infrastructureAffectedHouseCount: 4,
        livestockDestroyedCount: 4,
    },
];


const DataTable = ({ closeModal, incidentList }) => {
    const [focus, setFocus] = useState(1);
    const [sortedField, setSortedField] = React.useState('');
    const [data, setData] = useState(dummy);
    const sortDatahandler = (type: string) => {
        setSortedField(type);
        if (type === 'name') {
            const sortedArr = dummy.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                // eslint-disable-next-line no-nested-ternary
                return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
            });
            setData(sortedArr);
            return;
        }
        const sortedArr = dummy.sort((a, b) => a[type] - b[type]);
        setData(sortedArr);
    };

    const tabs = [
        { id: 1, name: 'Incident wise details' },
        { id: 2, name: 'Hazardwise summary' },
        { id: 3, name: 'Temporal summary' },
        { id: 4, name: 'Locationwise summary' },
    ];

    const bodyheader = [
        { id: 1, name: 'Hazard Type', type: 'name' },
        { id: 2, name: 'Number of incident', type: 'numberOfIncident' },
        { id: 3, name: 'People death', type: 'peopleDeathCount' },
        { id: 4, name: 'People missing', type: 'peopleMissingCount' },
        { id: 5, name: 'People injured', type: 'peopleInjuredCount' },
        { id: 6, name: 'House destroyed', type: 'infrastructureDestroyedHouseCount' },
        { id: 7, name: 'House affected', type: 'infrastructureAffectedHouseCount' },
        { id: 8, name: 'livestock destroyed', type: 'livestockDestroyedCount' },
    ];


    const sumAvailabeData = () => {
        const keys = Object.keys(dummy[0]);
        const resultData = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < keys.length; i++) {
            const individualKey = keys[i];
            if (individualKey === 'name') {
                // eslint-disable-next-line no-continue
                continue;
            }
            const reduceData = dummy.map(dat => dat[individualKey])
                .reduce((prev, cur) => prev + cur, 0);
            resultData.push(reduceData);
        }
        return resultData;
    };
    const totalData = sumAvailabeData();
    const Header = () => (
        <div className={styles.header}>
            {
                tabs.map(item => (
                    <p
                        className={focus === item.id
                            ? _cs(styles.headerItem, styles.headerItemActive)
                            : styles.headerItem}
                        key={item.id}
                        onClick={() => setFocus(item.id)}
                    >
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
                    <div
                        className={styles.headerContent}
                        onClick={() => sortDatahandler(item.type)}
                        role="button"
                        tabIndex={0}
                    >

                        <p
                            className={styles.bodyHeaderItem}
                            key={item.id}
                        >
                            {item.name}
                        </p>
                        <span className={styles.sort}>
                            <i
                                className="fa fa-sort"
                                aria-hidden="true"
                            />
                        </span>

                    </div>

                ))
            }

        </div>

    );

    const BodyData = () => (
        <div className={styles.bodyContainer}>

            {data.map((item, index) => (
                <div
                    className={styles.bodyWrapper}
                    style={
                        index % 2 === 0
                            ? { background: '#f6f6f6' }
                            : { background: '#ffffff' }
                    }
                    key={item.name}
                >
                    {Object.values(item).map(datas => (
                        <>
                            <p className={styles.bodyItem}>
                                {datas}
                            </p>
                        </>
                    ))}
                </div>
            ))}
            <div className={styles.totalValues}>
                <p className={styles.bodyItem}>
    Grand total
                </p>
                {totalData.map(total => (
                    <p className={styles.bodyItem}>
                        {total}
                    </p>
                ))}
            </div>
        </div>

    );

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
