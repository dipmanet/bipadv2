/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { _cs } from '@togglecorp/fujs';
import { FixedSizeList as List } from 'react-window';
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
    const tableRef = React.createRef<HTMLInputElement>();

    useEffect(() => {
        if (tableRef.current) {
            const Heading = document.getElementById('mainHeader');
            Heading.scrollLeft = 400;

            tableRef.current.scrollLeft = 100;
            const rect = tableRef.current.getBoundingClientRect();
            const leftPos = rect.left;
        }
    }, [tableRef]);

    // const bodyRef = useRef<List>('');
    // const [curerntListPos, setCurerntListPos] = useState(0);

    // useEffect(() => {
    //     const element = document.querySelector('.listDiv');
    //     const func = (e: Event) => {
    //         if (element) {
    //             setCurerntListPos(element.scrollLeft);
    //         }
    //     };
    //     if (element) {
    //         element.addEventListener('scroll', func);
    //     }
    //     return () => element && element.removeEventListener('scroll', func);

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // useEffect(() => {
    //     const element1 = document.getElementById('mainHeader');

    //     if (element1) {
    //         console.log('element1', element1);
    //         element1.scrollBy(1000, 0);
    //     }
    // }, [curerntListPos]);

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
                    resultData.push('-');
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

    const totalTableData = sumAvailabeData();

    const sortDatahandler = (type: string, key: string) => {
        setIsSortClicked(true);
        let sortedArr = [];
        if (type === 'string') {
            sortedArr = data.length > 0 && data.sort((a, b) => {
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
        <div id="mainHeader" className={styles.bodyheader}>
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

    const Row = ({ index, key, style }) => (
        <div
            ref={tableRef}
            key={key}
            style={style}
            className={index % 2 === 0
                ? styles.colorOne
                : styles.colorTwo}
        >
            <div className={styles.bodyWrapper}>
                {
                    Object.values(data[index]).map(item => (
                        <>
                            <p className={styles.bodyItem}>

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


                        </>

                    ))
                }
            </div>
        </div>

    );

    const TotalData = () => (totalTableData.length > 0
        && (
            <div
                style={{
                    background: '#e5e5e5',
                    display: 'flex',
                    gap: '15px',
                    width: '100%',
                }}
            >
                <>
                    <p className={styles.bodyItem}>Grand Total</p>
                    {
                        totalTableData.map(item => (
                            <p className={styles.bodyItem}>
                                {
                                    typeof (item) === 'number'
                                        ? estimatedLossValueFormatter(item)
                                        : item
                                }

                            </p>

                        ))
                    }
                </>
            </div>
        )

    );

    return (
        <>

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
                        className="listDiv"
                        sortData={isSortClicked}
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
