/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { _cs } from '@togglecorp/fujs';
import { FixedSizeList, FixedSizeList as List } from 'react-window';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import styles from './styles.scss';
import { mainHeading, bodyheader } from './headers';
import { estimatedLossValueFormatter } from '../utils/utils';


const DataTable = ({ closeModal, incidentList }) => {
    const [focus, setFocus] = useState({ id: 1, name: 'Incident wise details' });
    const [data, setData] = useState([]);
    const [isSortClicked, setIsSortClicked] = useState(false);
    const tableRef = React.createRef<FixedSizeList<any>>();
    const headerRef = React.createRef<HTMLInputElement>();
    const totalRef = React.createRef<HTMLInputElement>();

    useEffect(() => {
        if (headerRef.current) {
            const headerDivWidth = headerRef.current.scrollWidth;
            if (tableRef.current) {
                // eslint-disable-next-line no-underscore-dangle
                tableRef.current._outerRef.style.width = `${headerDivWidth}px`;
            }
            if (totalRef.current) totalRef.current.style.width = `${headerDivWidth}px`;
            // setDivWidth(modalWidth);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalRef, headerRef]);

    useEffect(() => {
        if (isSortClicked) {
            setIsSortClicked(false);
        }
    }, [isSortClicked]);


    useEffect(() => {
        const requiredDataEval = () => {
            const array = [];
            const currentVal = bodyheader[focus.name];
            const returnDataByFormat = (key, value) => {
                if (key === 'incidentOn') {
                    const d = new Date(value).toISOString().split('T')[0];
                    return d;
                }

                if (key === 'description') {
                    if (value === undefined) return '-';
                    return value;
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
                    resultData.push({ id: individualKey, val: '-' });
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
                resultData.push({ id: individualKey, val: reduceData });
            }
        }
        resultData.shift();
        return resultData;
    };

    const totalTableData = sumAvailabeData();

    const sortDatahandler = (type: string, key: string) => {
        setIsSortClicked(true);
        let sortedArr: (string | number)[] = [];
        if (type === 'string') {
            sortedArr = data.length > 0 && data.sort((a: any, b: any) => {
                const nameA = a[key].toUpperCase();
                const nameB = b[key].toUpperCase();
                // eslint-disable-next-line no-nested-ternary
                return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
            });
        } else if (type === 'numeric') {
            sortedArr = data.length > 0 && data.sort((a, b) => {
                const nameA = a[key];
                const nameB = b[key];
                return nameA - nameB;
            });
        }
        if (type === 'date') {
            sortedArr = data.length > 0 && data.sort((a, b) => {
                const dateA = new Date(a[key]);
                const dateB = new Date(b[key]);
                return dateA - dateB;
            });
        }
        setData(sortedArr);
    };
    const Header = () => (
        <div className={styles.header}>
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
        <div
            className={styles.bodyheader}
            ref={headerRef}
        >
            {
                bodyheader[Object.keys(bodyheader)
                    .filter(item => item === focus.name)[0]]
                    .map(dat => (
                        <div
                            className={styles.headerContent}
                            onClick={() => sortDatahandler(dat.type, dat.key)}
                            role="button"
                            tabIndex={0}
                            key={dat.id}
                        >

                            <p
                                className={styles.bodyHeaderItem}
                            >
                                {dat.name}
                                <span className={styles.toolTipItem}>
                                    {
                                        dat.name
                                    }
                                </span>
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

    const Row = ({ index, style, key }) => (
        <div
            style={style}
            className={index % 2 === 0
                ? styles.colorOne
                : styles.colorTwo}
        >
            <div className={styles.bodyWrapper}>
                {
                    Object.values(data[index]).map(item => (
                        <p
                            className={styles.bodyItem}
                            key={key}
                        >
                            {
                                typeof (item) === 'number'
                                    ? estimatedLossValueFormatter(item)
                                    : item
                            }
                            <span className={styles.toolTipItem}>
                                {
                                    typeof (item) === 'number'
                                        ? estimatedLossValueFormatter(item)
                                        : item
                                }
                            </span>
                        </p>
                    ))
                }
            </div>
        </div>

    );

    const TotalData = () => (
        totalTableData.length > 0
        && (
            <div
                className={styles.totalValues}
                ref={totalRef}
            >
                <p className={styles.bodyItem}>Grand Total</p>
                {
                    totalTableData.map(item => (
                        <p className={styles.bodyItem} key={item.id}>
                            {
                                typeof (item.val) === 'number'
                                    ? estimatedLossValueFormatter(item.val)
                                    : item.val
                            }

                        </p>

                    ))
                }
            </div>
        )

    );

    return (
        <>

            <Modal className={styles.lossAndDamageTableModal}>
                <ModalHeader
                    title={(
                        <Header />
                    )}
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
                        sortData={isSortClicked}
                        ref={tableRef}
                        className={styles.reactWindow}
                    >
                        {Row}
                    </List>
                    <TotalData />
                </ModalBody>
            </Modal>

        </>

    );
};
export default DataTable;
