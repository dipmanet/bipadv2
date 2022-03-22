import React from 'react';
import MenuCommon from '../../components/MenuCommon';
import styles from './styles.module.scss';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Page from '#components/Page';

const Landing = () => (
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
        <MenuCommon currentPage="Health Infrastructure" layout="landing" />
        <Footer />
    </>
);

export default Landing;
