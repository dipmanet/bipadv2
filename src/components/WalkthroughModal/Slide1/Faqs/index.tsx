/* eslint-disable react/no-danger */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-const */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable max-len */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createRequestClient } from '@togglecorp/react-rest-request';
import { Link } from '@reach/router';
import { _cs } from '@togglecorp/fujs';
import Page from '#components/Page';
import { createConnectedRequestCoordinator } from '#request';
import { languageSelector } from '#selectors';
import nextArrow from '#resources/icons/next.png';
import previousArrow from '#resources/icons/previous.png';
import plus from '#resources/icons/plus.png';
import minus from '#resources/icons/minus.png';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Navbar from '../Navbar';
import styles from './styles.scss';
import Sidebar from '../Sidebar';
import FooterButton from '../FooterButton';
import { aboutDescription, aboutSidebar, faqs } from '../Utils';


const mapStateToProps = (state: AppState): PropsFromState => ({

    language: languageSelector(state),


});


const Faqs = ({ language: { language } }) => {
    const [selectedCategory, setSelectedCategory] = useState();
    const [filteredCategory, setFilteredCategory] = useState(faqs);
    const [sidebar, setSidebar] = useState([]);
    const [loader, setLoader] = useState(true);
    const [clickedQuestionList, setClickedQuestionList] = useState([]);
    const [content, setContent] = useState([]);
    const [headerCategory, setHeaderCategory] = useState();
    const handleChangeSelectedCategories = (category) => {
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

    const handleClickQuestion = (id) => {
        setClickedQuestionList([...new Set([...clickedQuestionList, id])]);
    };
    const handleRemoveAnswer = (id) => {
        const filteredData = clickedQuestionList.filter(i => i !== id);
        setClickedQuestionList(filteredData);
    };
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
        fetch(`${process.env.REACT_APP_API_SERVER_URL}/homepage-faq-menu`)
            .then(response => response.json())
            .then(data => setContent(data.results));
    }, []);
    console.log('sidebar', sidebar);
    console.log('Filtered category', filteredCategory);
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
                    faqs
                />
                <div className={styles.mainBody}>
                    <Navbar />
                    {loader ? <LoadingAnimation className={styles.loader} message="Loading Data,Please Wait..." /> : ''}
                    <div className={styles.content}>
                        <h1>{language === 'en' ? 'Frequently asked question for BIPAD Portal' : 'विपद् पोर्टलका बारे बारम्बार सोधिने प्रश्नहरु'}</h1>
                        {filteredCategory && filteredCategory.childs && filteredCategory.childs.length && filteredCategory.childs.map(item => (
                            <div key={item.id}>
                                <div className={styles.questionList}>
                                    <div className={styles.question}>
                                        <span>
                                            {language === 'en' ? item.questionEn : item.questionNe}
                                        </span>
                                        <div
                                            onClick={() => {
                                                clickedQuestionList.includes(item.id)
                                                    ? handleRemoveAnswer(item.id)
                                                    : handleClickQuestion(item.id);
                                            }}

                                            style={{ height: '20px', width: '20px', cursor: 'pointer' }}
                                        >
                                            <img
                                                src={clickedQuestionList.includes(item.id) ? minus : plus}
                                                alt="plus"

                                            />
                                        </div>


                                    </div>
                                    {clickedQuestionList.includes(item.id)
                                        ? (
                                            <div className={styles.answers}>
                                                <div dangerouslySetInnerHTML={{
                                                    __html: language === 'en' ? item.answerEn : item.answerNe,
                                                }}
                                                />
                                                {/* <span>
                                                    {language === 'en' ? item.answerEn : item.answerNe}
                                                </span> */}
                                            </div>
                                        ) : ''
                                    }
                                </div>
                            </div>
                        ))}


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
            Faqs,
        ),
    ),
);
