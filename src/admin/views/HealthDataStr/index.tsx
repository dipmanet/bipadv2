import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import Loader from 'react-loader';
import ProgressMenu from 'src/admin/components/ProgressMenu';
import HealthForm from 'src/admin/components/HealthForm';
import MenuCommon from 'src/admin/components/MenuCommon';
import Footer from 'src/admin/components/Footer';
import Navbar from 'src/admin/components/Navbar';
import styles from './styles.module.scss';
import Page from '#components/Page';

const HealthDataStr = (): JSX.Element => {
    const [activeMenu, setActiveMenu] = useState<string|undefined>('Institution Details');
    const [progress, setProgress] = useState<number>(0);
    // const { healthFormLoader } = useSelector((state: RootState) => state.health);

    const getActiveMenu = (menuItem: number) => {
        setActiveMenu(menuItem);
    };
    const handleProgress = (p: number) => {
        setProgress(p);
    };

    const handleViewTableBtn = () => {
        console.log('fdf');
    };


    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon layout="common" currentPage={'Health'} />

            <div className={styles.dataContainer}>
                <h2 className={styles.mainHeading}>
Health Infrastructure Data Structure
                </h2>
                <h3 className={styles.subHeading}>
Add new Health Infrastructure data
                </h3>
                <div className={styles.tableMenuContainer}>
                    <ProgressMenu
                        activeMenu={activeMenu}
                        getActiveMenu={getActiveMenu}
                        progress={progress}
                    />
                    <div className={styles.mainContent}>

                        <div className={styles.formDataContainer}>
                            {/* <HealthForm
                                getActiveMenu={getActiveMenu}
                                activeMenu={activeMenu}
                                progress={progress}
                                handleProgress={handleProgress}
                            /> */}
                        </div>

                    </div>
                </div>

            </div>

            <Footer />
        </>
    );
};

export default HealthDataStr;
