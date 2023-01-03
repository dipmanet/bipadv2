/* eslint-disable react/no-danger */
/* eslint-disable max-len */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import { createRequestClient } from '@togglecorp/react-rest-request';
import Page from '#components/Page';

import nextArrow from '#resources/icons/next.png';
import previousArrow from '#resources/icons/previous.png';
import LoadingAnimation from '#rscv/LoadingAnimation';
import { createConnectedRequestCoordinator } from '#request';
import { dataArchiveEarthquakeListSelector, languageSelector } from '#selectors';
import Navbar from '../Navbar';
import styles from './styles.scss';
import Sidebar from '../Sidebar';
import { aboutDescription, aboutSidebar } from '../Utils';
import FooterButton from '../FooterButton';


const mapStateToProps = (state: AppState): PropsFromState => ({

    language: languageSelector(state),


});
const Developers = ({ language: { language } }) => {
    const [selectedCategory, setSelectedCategory] = useState();
    const [filteredCategory, setFilteredCategory] = useState(aboutDescription);
    const [sidebar, setSidebar] = useState([]);
    const [content, setContent] = useState([]);
    const [loader, setLoader] = useState(true);
    const [headerCategory, setHeaderCategory] = useState();
    const handleChangeSelectedCategories = (mainCategory, category) => {
        console.log('Main cat id', mainCategory);
        setHeaderCategory(mainCategory);
        setSelectedCategory(category);
    };
    useEffect(() => {
        // const routeData = aboutSidebar.filter(i => i.route === 'about');
        // console.log('This is sidebar', routeData);
        if (content.length) {
            setSidebar(content);
            setSelectedCategory(content[0].childs[0].id);
            setHeaderCategory(content[0].id);
        }
    }, [content]);

    useEffect(() => {
        if (content.length) {
            console.log('Header category', headerCategory);
            console.log('sidebar', sidebar);
            const filteredDescription = sidebar.filter(d => d.id === headerCategory)[0].childs.find(i => i.id === selectedCategory);
            console.log('This is filtered category', filteredDescription);
            setFilteredCategory(filteredDescription);
            setLoader(false);
        }
    }, [selectedCategory]);
    const lastPageId = sidebar.length && sidebar[sidebar.length - 1].childs[sidebar[sidebar.length - 1].childs.length - 1].id;
    const firstPageId = sidebar.length && sidebar[0].childs[0].id;


    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_SERVER_URL}/homepage-developers-menu`)
            .then(response => response.json())
            .then(data => setContent(data.results));
    }, []);

    return (
        <>
            <Page
                hideFilter
                hideMap
            />
            <div className={styles.mainContainer}>
                <Sidebar
                    data={sidebar}
                    selectedCategory={selectedCategory}
                    onClick={handleChangeSelectedCategories}
                    language={language}
                />
                <div className={styles.mainBody}>
                    <Navbar />
                    {loader ? <LoadingAnimation className={styles.loader} message="Loading Data,Please Wait..." /> : ''}
                    <div className={styles.content}>
                        <h1>
                            {language === 'en'
                                ? filteredCategory && filteredCategory.headingEn
                                : filteredCategory && filteredCategory.headingNe}

                        </h1>
                        <div dangerouslySetInnerHTML={{
                            __html: language === 'en'
                                ? filteredCategory && filteredCategory.descriptionEn
                                : filteredCategory && filteredCategory.descriptionNe,
                        }}
                        />
                    </div>
                    <FooterButton
                        data={sidebar}
                        selectedCategory={selectedCategory}
                        onClick={handleChangeSelectedCategories}
                        lastPageId={lastPageId}
                        firstPageId={firstPageId}
                        language={language}
                    />

                </div>
            </div>

        </>
    );
};
export default connect(mapStateToProps, null)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient()(
            Developers,
        ),
    ),
);
