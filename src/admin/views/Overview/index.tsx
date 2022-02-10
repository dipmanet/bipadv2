import React from 'react';
import Overview from 'src/admin/components/Dataoverview';
import Navbar from 'src/admin/components/Navbar';
import MenuCommon from 'src/admin/components/MenuCommon';
import Footer from 'src/admin/components/Footer';
import Page from '#components/Page';

const Overviews = () => (
    <>
        <Page hideFilter hideMap />
        <Navbar />
        <MenuCommon layout="common" currentPage={'Epidemics'} />
        <Overview />
        <Footer />
    </>
);

export default Overviews;
