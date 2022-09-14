/* eslint-disable max-len */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createRequestClient } from '@togglecorp/react-rest-request';
import Page from '#components/Page';
import LoadingAnimation from '#rscv/LoadingAnimation';
import rectangle from '#resources/icons/rectangle.svg';
import { createConnectedRequestCoordinator } from '#request';
import { languageSelector } from '#selectors';
import Navbar from '../Navbar';
import styles from './styles.scss';
import Sidebar from '../Sidebar';


const mapStateToProps = (state: AppState): PropsFromState => ({
    language: languageSelector(state),
});
const Manuals = ({ language: { language } }) => {
    const [selectedCategory, setSelectedCategory] = useState(1);
    const [loader, setLoader] = useState(true);
    const [manual, setManual] = useState([]);
    const [backupManualList, setBackupManualList] = useState([]);
    const handleChangeSelectedCategories = (category) => {
        setSelectedCategory(category);
    };
    useEffect(() => {
        const fetchedData = async () => {
            await fetch(`${process.env.REACT_APP_API_SERVER_URL}/manual/`)
                .then(res => res.json())
                .then((data) => {
                    setManual(data.results);
                    setBackupManualList(data.results);
                    setLoader(false);
                });
        };

        fetchedData();
    }, []);

    const manualYears = manual.length ? [...new Set(manual.map(i => i.year))] : null;
    const manualYearAscendingOrder = manualYears ? manualYears.sort((a, b) => b - a) : '';

    const searchData = (e) => {
        const filteredData = backupManualList.length ? backupManualList.filter(
            item => (
                item
                    .title
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            ),
        ) : '';

        setManual(filteredData);
    };

    const handleManualType = (e) => {
        if (e.target.value) {
            const filteredManual = backupManualList.length ? backupManualList.filter(i => i.manualType === e.target.value) : [];
            setManual(filteredManual);
        } else {
            setManual(backupManualList);
        }
    };
    return (
        <>
            <Page
                hideFilter
                hideMap
            />
            <div className={styles.mainContainer}>
                {loader ? <LoadingAnimation /> : ''}

                <Sidebar
                    manual
                    searchData={searchData}
                    handleManualType={handleManualType}
                    language={language}
                />

                <div className={styles.mainBody}>
                    <Navbar />
                    <div className={styles.content}>
                        {manualYearAscendingOrder ? manualYearAscendingOrder.map(item => (
                            <div key={item}>
                                <h1 style={{ marginBottom: '20px', marginTop: '20px', borderBottom: '1px solid blue', width: 'fit-content' }}>{item}</h1>
                                {manual.filter(data => data.year === item).map(d => (
                                    <a href={d.file} download key={d.id}>
                                        <div className={styles.manuals}>
                                            <div className={styles.manualImage}>
                                                <img
                                                    src={rectangle}
                                                    alt=""
                                                    style={{ marginBottom: '0px' }}
                                                    height="150px"
                                                />
                                            </div>
                                            <div className={styles.manualContent}>
                                                <span>
                                                    {d.title}
                                                </span>
                                                <p>{d.description}</p>
                                            </div>
                                        </div>
                                    </a>

                                ))}


                            </div>
                        )) : <p>No Data Available for your Search</p>}


                    </div>

                </div>
            </div>

        </>
    );
};

export default connect(mapStateToProps, null)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient()(
            Manuals,
        ),
    ),
);
