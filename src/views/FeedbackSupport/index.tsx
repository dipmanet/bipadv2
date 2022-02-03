import React from 'react';
import Page from '#components/Page';
import styles from './styles.scss';
import Feedback1 from './Feedback1';

const FeedbackSupport = () => (
    <>
        <Page
            hideFilter
            hideMap
        />
        <div className={styles.mainDiv}>

            <Feedback1 />
        </div>

    </>
);


export default FeedbackSupport;
