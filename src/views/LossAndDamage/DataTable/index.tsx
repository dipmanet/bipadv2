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
import DownloadButton from '#components/DownloadButton';
import { mainHeading, bodyheader } from './headers';
import { estimatedLossValueFormatter } from '../utils/utils';
import { returnDataByFormat } from './util';
import { Data } from '../types';
import { Sorted } from './types';
import styles from './styles.scss';

interface TableProps {
    closeModal: () => void;
    incidentList: Data[];
    language?: string;
}

const DataTable = ({ closeModal, incidentList, language }: TableProps) => {
    const [focus, setFocus] = useState({ id: 1, name: 'Incident-wise details' });
    const [data, setData] = useState<Sorted[] | []>([]);
    const [isSortClicked, setIsSortClicked] = useState(false);
    const [sortDirection, setSortDirection] = useState(false);
    const tableRef = React.createRef<FixedSizeList<any>>();
    const headerRef = React.createRef<HTMLInputElement>();
    const totalRef = React.createRef<HTMLInputElement>();
    const [calculation, setCalculation] = useState([]);

    useEffect(() => {
        if (headerRef.current) {
            const headerDivWidth = headerRef.current.scrollWidth;
            headerRef.current.style.width = `${headerDivWidth}px`;
            if (tableRef.current) {
                // eslint-disable-next-line no-underscore-dangle
                tableRef.current._outerRef.style.width = `${headerDivWidth}px`;
            }
            if (totalRef.current) totalRef.current.style.width = `${headerDivWidth}px`;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalRef, headerRef]);

    useEffect(() => {
        if (isSortClicked) {
            setIsSortClicked(false);
        }
    }, [isSortClicked]);


    const summaryCalculate = (dat) => {
        if (focus.id !== 1) {
            const keys = [...new Set(dat.map(item => Object.values(item)[0]))];
            const reducedData = [];
            const groupedData = [];
            for (const keyItem of keys) {
                const array = [];
                for (const item of dat) {
                    if ((Object.values(item)[0]) === keyItem) array.push(item);
                }
                groupedData.push(array);
            }
            for (const individualArray of groupedData) {
                const noOfIncidents = individualArray.length;
                const titleValue = Object.entries(individualArray[0]).filter(item => typeof item[1] === 'string');
                const [title, valueOfTitle] = titleValue[0];
                const result = individualArray.reduce((r, o) => ((
                    Object.entries(o)
                        // eslint-disable-next-line no-return-assign
                        .forEach(([k, v]) =>
                            // eslint-disable-next-line no-return-assign, no-param-reassign, implicit-arrow-linebreak
                            r[k] = (r[k] || 0) + v), r)), {});
                result[title] = valueOfTitle;
                result['Number of incident'] = noOfIncidents;
                reducedData.push(result);
            }

            return reducedData;
        }
        return dat;
    };

    const requiredDataEval = () => {
        const array = [];
        const currentVal = bodyheader[focus.name];
        if (incidentList.length > 0) {
            // eslint-disable-next-line no-plusplus
            for (const element of incidentList) {
                // eslint-disable-next-line no-plusplus
                const obj = {};
                for (const elemCur of currentVal) {
                    // const elemCur = currentVal[j];
                    if (elemCur.key.split('').includes('.')) {
                        const requiredKey = elemCur.key.replace('.', ' ').split(' ')[0];
                        const requiredKey1 = elemCur.key.replace('.', ' ').split(' ')[1];
                        let elementValue;
                        if (element[requiredKey]) {
                        // eslint-disable-next-line no-prototype-builtins
                            if (element[requiredKey].hasOwnProperty(requiredKey1)) {
                                elementValue = element[requiredKey][requiredKey1];
                            }
                        } else {
                            elementValue = 0;
                        }

                        obj[elemCur.name] = returnDataByFormat(elemCur.key, elementValue);
                    } else {
                        obj[elemCur.name] = returnDataByFormat(elemCur.key, element[elemCur.key]);
                    }
                }
                array.push(obj);
            }
        }
        const summary = summaryCalculate(array);
        return summary;
    };

    const headerCickHandler = (item: Record<string, any>) => {
        setData([]);
        setFocus({ id: item.id, name: item.name });
    };

    useEffect(() => {
        const incidentData = requiredDataEval();
        setCalculation(incidentData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focus]);

    useEffect(() => {
        if (calculation) setData(calculation);
    }, [calculation]);

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

    const sortDatahandler = (type: string, name: string) => {
        setIsSortClicked(true);
        setSortDirection(!sortDirection);
        if (data.length > 0) {
            let sortedArr: Sorted[] = [];
            if (type === 'string') {
                sortedArr = data.sort((a, b) => {
                    const nameA = a[name].toUpperCase();
                    const nameB = b[name].toUpperCase();
                    // eslint-disable-next-line no-nested-ternary
                    return sortDirection
                        // eslint-disable-next-line no-nested-ternary
                        ? (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
                        // eslint-disable-next-line no-nested-ternary
                        : (nameB < nameA) ? -1 : (nameB > nameA) ? 1 : 0;
                });
            } else if (type === 'numeric') {
                sortedArr = data.sort((a, b) => {
                    const nameA = a[name];
                    const nameB = b[name];
                    return sortDirection ? nameA - nameB : nameB - nameA;
                });
            }
            if (type === 'date') {
                sortedArr = data.sort((a, b) => {
                    const dateA = new Date(a[name]).valueOf();
                    const dateB = new Date(b[name]).valueOf();
                    return sortDirection ? dateA - dateB : dateB - dateA;
                });
            }
            setData(sortedArr);
        }
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
                        onClick={() => headerCickHandler(item)}
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
            style={focus.id === 1 ? { width: 'fit-content' } : {}}
        >
            {
                bodyheader[Object.keys(bodyheader)
                    .filter(item => item === focus.name)[0]]
                    .map(dat => (
                        <div
                            className={styles.headerContent}
                            onClick={() => sortDatahandler(dat.type, dat.name)}
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

    const Row = ({ index, style }) => (
        <div
            style={style}
            className={index % 2 === 0
                ? styles.colorOne
                : styles.colorTwo}
        >
            <div className={styles.bodyWrapper}>
                {
                    Object.values(data[index]).map((item, idx) => (
                        <p
                            className={styles.bodyItem}
                            key={`${index}-${`${idx}-`}`}
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
                style={focus.id === 1 ? { width: 'fit-content' } : {}}
            >
                <p className={styles.bodyItem}>{language === 'en' ? 'Grand Total' : 'कूल जम्मा'}</p>
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

            <Modal className={_cs(styles.lossAndDamageTableModal, language === 'np' && styles.languageFont)}>
                <ModalHeader
                    title={(
                        <Header />
                    )}
                    rightComponent={(
                        <div style={{ display: 'flex', marginTop: '20px' }}>
                            <DownloadButton
                                value={data}
                                name="incidents"
                            >
                                {language === 'en' ? 'Download csv' : 'csv डाउनलोड गर्नुहोस्'}
                            </DownloadButton>
                            <DangerButton
                                transparent
                                iconName="close"
                                onClick={closeModal}
                                title="Close Modal"
                            />
                        </div>
                    )}
                    className={styles.modalHeader}
                />
                {
                    (data.length > 0)
                        ? (
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
                        )
                        : (
                            <span className={styles.loader} />
                        )
                }
            </Modal>

        </>

    );
};
export default DataTable;
