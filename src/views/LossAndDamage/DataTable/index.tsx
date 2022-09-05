/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
import React, { useState, useMemo, useEffect } from 'react';
import { _cs } from '@togglecorp/fujs';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import styles from './styles.scss';

const DataTable = ({ closeModal, incidentList }) => {
    const [focus, setFocus] = useState({ id: 1, name: 'Incident wise details' });
    const [data, setData] = useState([]);

    const tabs = [
        { id: 1, name: 'Incident wise details' },
        { id: 2, name: 'Hazardwise summary' },
        { id: 3, name: 'Temporal summary' },
        { id: 4, name: 'Locationwise summary' },
    ];

    const bodyheader = {
        'Incident wise details':
            [
                { id: 1, name: 'Verified', type: 'string', key: 'verified' },
                { id: 2, name: 'Title', type: 'string', key: 'title' },
                { id: 3, name: 'Description', type: 'string', key: 'description' },
                { id: 4, name: 'Source', type: 'string', key: 'source' },
                { id: 5, name: 'Hazard', type: 'string', key: 'hazardInfo.title' },
                { id: 6, name: 'Incident on', type: 'date', key: 'incidentOn' },
                { id: 7, name: 'Province', type: 'string', key: 'provinceTitle' },
                { id: 8, name: 'District', type: 'string', key: 'districtTitle' },
                { id: 9, name: 'Municipality', type: 'string', key: 'municipalityTitle' },
                { id: 10, name: 'Ward', type: 'string', key: 'wardTitle' },
                { id: 11, name: 'Total estimated loss (NPR)', type: 'numeric', key: 'loss.estimatedLoss' },
                { id: 12, name: 'Agriculture economic loss (NPR)', type: 'numeric', key: 'loss.agricultureEconomicLoss' },
                { id: 13, name: 'Infrastructure economic loss (NPR)', type: 'numeric', key: 'loss.infrastructureEconomicLoss' },
                { id: 14, name: 'Total infrastructure destroyed', type: 'numeric', key: 'loss.infrastructureDestroyedCount' },
                { id: 15, name: 'House destroyed', type: 'numeric', key: 'loss.infrastructureDestroyedHouseCount' },
                { id: 16, name: 'House affected', type: 'numeric', key: 'loss.infrastructureAffectedHouseCount' },
                { id: 17, name: 'Total livestock destroyed', type: 'numeric', key: 'loss.livestockDestroyedCount' },
                { id: 18, name: 'Total - People Death', type: 'numeric', key: 'loss.peopleDeathCount' },
                { id: 19, name: 'Male - People Death', type: 'numeric', key: 'loss.peopleDeathMaleCount' },
                { id: 20, name: 'Female - People Death', type: 'numeric', key: 'loss.peopleDeathFemaleCount' },
                { id: 21, name: 'Unknown - People Death', type: 'numeric', key: 'loss.peopleDeathUnknownCount' },
                { id: 22, name: 'Disabled - People Death', type: 'numeric', key: 'loss.peopleDeathDisabledCount' },
                { id: 23, name: 'Total - People Missing', type: 'numeric', key: 'loss.peopleMissingCount' },
                { id: 24, name: 'Male - People Missing', type: 'numeric', key: 'loss.peopleMissingMaleCount' },
                { id: 25, name: 'Female - People Missing', type: 'numeric', key: 'loss.peopleMissingFemaleCount' },
                { id: 26, name: 'Unknown - People Missing', type: 'numeric', key: 'loss.peopleMissingUnknownCount' },
                { id: 27, name: 'Disabled - People Missing', type: 'numeric', key: 'loss.peopleMissingDisabledCount' },
                { id: 28, name: 'Total - People Injured', type: 'numeric', key: 'loss.peopleInjuredCount' },
                { id: 29, name: 'Male - People Injured', type: 'numeric', key: 'loss.peopleInjuredMaleCount' },
                { id: 30, name: 'Female - People Injured', type: 'numeric', key: 'loss.peopleInjuredFemaleCount' },
                { id: 31, name: 'Unknown - People Injured', type: 'numeric', key: 'loss.peopleInjuredUnknownCount' },
                { id: 32, name: 'Disabled - People Injured', type: 'numeric', key: 'loss.peopleInjuredDisabledCount' },
            ],
        'Hazardwise summary':
            [
                { id: 1, name: 'Hazard Type', key: 'hazardInfo.title', type: 'string' },
                { id: 2, name: 'Number of incident', key: 'numberOfIncident', type: 'numeric' },
                { id: 3, name: 'People death', key: 'loss.peopleDeathCount', type: 'numeric' },
                { id: 4, name: 'People missing', key: 'loss.peopleMissingCount', type: 'numeric' },
                { id: 5, name: 'People injured', key: 'loss.peopleInjuredCount', type: 'numeric' },
                { id: 6, name: 'House destroyed', key: 'loss.infrastructureDestroyedHouseCount', type: 'numeric' },
                { id: 7, name: 'House affected', key: 'loss.infrastructureAffectedHouseCount', type: 'numeric' },
                { id: 8, name: 'livestock destroyed', key: 'loss.livestockDestroyedCount', type: 'numeric' },
            ],
        'Temporal summary':
            [
                { id: 1, name: 'Year', key: 'incidentOn', type: 'string' },
                { id: 2, name: 'Number of incident', key: 'numberOfIncident', type: 'numeric' },
                { id: 3, name: 'People death', key: 'loss.peopleDeathCount', type: 'numeric' },
                { id: 4, name: 'People missing', key: 'loss.peopleMissingCount', type: 'numeric' },
                { id: 5, name: 'People injured', key: 'loss.peopleInjuredCount', type: 'numeric' },
                { id: 6, name: 'House destroyed', key: 'loss.infrastructureDestroyedHouseCount', type: 'numeric' },
                { id: 7, name: 'House affected', key: 'loss.infrastructureAffectedHouseCount', type: 'numeric' },
                { id: 8, name: 'livestock destroyed', key: 'loss.livestockDestroyedCount', type: 'numeric' },
            ],
        'Locationwise summary':
            [
                { id: 1, name: 'Province', key: 'provinceTitle', type: 'string' },
                { id: 2, name: 'Number of incident', key: 'numberOfIncident', type: 'numeric' },
                { id: 3, name: 'People death', key: 'loss.peopleDeathCount', type: 'numeric' },
                { id: 4, name: 'People missing', key: 'loss.peopleMissingCount', type: 'numeric' },
                { id: 5, name: 'People injured', key: 'loss.peopleInjuredCount', type: 'numeric' },
                { id: 6, name: 'House destroyed', key: 'loss.infrastructureDestroyedHouseCount', type: 'numeric' },
                { id: 7, name: 'House affected', key: 'loss.infrastructureAffectedHouseCount', type: 'numeric' },
                { id: 8, name: 'livestock destroyed', key: 'loss.livestockDestroyedCount', type: 'numeric' },
            ],


    };
    useEffect(() => {
        const requiredDataEval = () => {
            const array = [];
            const currentVal = bodyheader[focus.name];
            const returnDataByFormat = (key, value) => {
                if (key === 'incidentOn') {
                    const d = new Date(value).toISOString().split('T')[0];
                    return d;
                }
                if (key === 'verified') {
                    if (value === true) return 'Yes';
                    return 'No';
                }

                if (value === undefined) {
                    return 0;
                }

                return value;
            };
            if (incidentList.length > 0) {
                // eslint-disable-next-line no-plusplus
                for (const element of incidentList) {
                    // const element = incidentList[i];
                    // eslint-disable-next-line no-plusplus
                    const obj = {};
                    for (const elemCur of currentVal) {
                        // const elemCur = currentVal[j];
                        if (elemCur.key.split('').includes('.')) {
                            const requiredKey = elemCur.key.replace('.', ' ').split(' ')[0];
                            const requiredKey1 = elemCur.key.replace('.', ' ').split(' ')[1];
                            obj[elemCur.key] = returnDataByFormat(elemCur.key, element[requiredKey][requiredKey1]);
                        } else {
                            obj[elemCur.key] = returnDataByFormat(elemCur.key, element[elemCur.key]);
                        }
                    }
                    array.push(obj);
                }
            }
            return array;
        };
        const incidentData = requiredDataEval();
        setData(incidentData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focus.name]);


    // eslint-disable-next-line react-hooks/exhaustive-deps


    // const requiredData = requiredDataEval();

    const sumAvailabeData = () => {
        const values = Object.values(data[0]);
        const keys = Object.keys(data[0]);
        const resultData = [];
        // eslint-disable-next-line no-plusplus
        for (const [i, v] of values.entries()) {
            const individualValue = values[i];
            const individualKey = keys[i];
            if (typeof (individualValue) === 'string') {
                resultData.push('');
                // eslint-disable-next-line no-continue
                continue;
            }
            const reduceData = data.map((dat) => {
                if (typeof dat[individualKey] === 'number') {
                    return dat[individualKey];
                }
                return [];
            })
                .reduce((prev, cur) => prev + cur, 0);
            resultData.push(reduceData);
        }
        resultData.shift();

        return resultData;
    };

    const sortDatahandler = (type: string) => {
        const entries = data.length > 0 && Object.entries(data);
        if (type === 'string') {
            const sortedArr = entries.sort((a, b) => {
                const nameA = a;
                console.log(nameA, 'sort');

                // const nameB = b.name.toUpperCase();
                // eslint-disable-next-line no-nested-ternary
                // return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                return '';
            });
            // setData(sortedArr);
            // return;
        }
        // const sortedArr = data.sort((a, b) => a[type] - b[type]);
        // setData(sortedArr);
    };
    // const totalData = sumAvailabeData();
    const Header = () => (
        <div className={styles.header}>
            {
                tabs.map(item => (
                    <p
                        className={focus.id === item.id
                            ? _cs(styles.headerItem, styles.headerItemActive)
                            : styles.headerItem}
                        key={item.id}
                        onClick={() => setFocus({ id: item.id, name: item.name })}
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
                bodyheader[Object.keys(bodyheader)
                    .filter(item => item === focus.name)[0]]
                    .map(dat => (
                        <div
                            className={styles.headerContent}
                            onClick={() => sortDatahandler(dat.type)}
                            role="button"
                            tabIndex={0}
                            key={dat.id}
                        >

                            <p
                                className={styles.bodyHeaderItem}
                            >
                                {dat.name}
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

            {data.length > 0 && data.map((item, index) => (
                <div
                    className={styles.bodyWrapper}
                    style={
                        index % 2 === 0
                            ? { background: '#f6f6f6' }
                            : { background: '#ffffff' }
                    }
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
                {/* {totalData.map(total => (
                    <p className={styles.bodyItem}>
                        {total}
                    </p>
                ))} */}
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
