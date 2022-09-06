/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { _cs } from '@togglecorp/fujs';
import { FixedSizeList as List } from 'react-window';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import styles from './styles.scss';
import { mainHeading, bodyheader } from './headers';


const DataTable = ({ closeModal, incidentList }) => {
    const [focus, setFocus] = useState({ id: 1, name: 'Incident wise details' });
    const [data, setData] = useState([]);


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
        const values = data.length > 0 && Object.values(data[0]);
        const keys = data.length > 0 && Object.keys(data[0]);
        const resultData = [];
        // eslint-disable-next-line no-plusplus
        if (values.length > 0) {
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
    const totalData = sumAvailabeData();
    const Header = () => (
        <div className={styles.header} ref={headerRef}>
            {
                mainHeading.map(item => (
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

    const Row = ({ index, key, style }) => (
        <div
            key={key}
            style={style}
            className={index % 2 === 0
                ? styles.colorOne
                : styles.colorTwo}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {
                    Object.values(data[index]).map(item => (
                        <p className={styles.bodyItem}>{item}</p>
                    ))
                }
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
                className={styles.modalHeader}
            />
            <ModalBody className={styles.body}>
                <BodyHeader />
                <List
                    width={'100%'}
                    height={700}
                    itemCount={data.length}
                    itemSize={45}
                    rowHeight={'5px'}
                >
                    {Row}
                </List>
            </ModalBody>
        </Modal>


    );
};
export default DataTable;
