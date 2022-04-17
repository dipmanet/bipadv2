import React from 'react';
import Overview from 'src/admin/components/Dataoverview';
import Navbar from 'src/admin/components/Navbar';
import MenuCommon from 'src/admin/components/MenuCommon';
import Footer from 'src/admin/components/Footer';
import Page from '#components/Page';

const Overviews = (props) => {
    const { uri } = props;
    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon layout="common" currentPage={'Epidemics'} uri={uri} />
            <Overview />
            <Footer />
        </>
    );
};
export default Overviews;
