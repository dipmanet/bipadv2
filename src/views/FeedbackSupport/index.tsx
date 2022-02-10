import React from 'react';
import Page from '#components/Page';
import styles from './styles.scss';
import Welcome from './Welcome';

const FeedbackSupport = () => (
    <>
        <Page
            hideFilter
            hideMap
        />
        <div className={styles.mainDiv}>

            <Welcome />
        </div>

    </>
);


export default FeedbackSupport;
