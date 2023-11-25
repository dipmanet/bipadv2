/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
import React from 'react';
import Page from '#components/Page';
import MenuCommon from '../../components/MenuCommon';
import styles from './styles.module.scss';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Landing = (props) => {
    const { uri, title } = props;

    return (
        <>
            <Page hideMap hideFilter />
            <Navbar />
            <div className={styles.container}>
                <div className={styles.title}>
                    Welcome to Government of Nepal&apos;s Integrated Disaster
                    Information Management System.
                </div>
                <div className={styles.subtitle}>
                    Select your prefered sector to input, monitor, and analyze information
                    from all three tiers of the Government.
                </div>
            </div>
            <MenuCommon currentPage={title} layout="landing" uri={uri} />
            <Footer />
        </>
    );
};

export default Landing;
