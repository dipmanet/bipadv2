import React from 'react';
import Covid from 'src/admin/components/Covid';
import Navbar from 'src/admin/components/Navbar';
import MenuCommon from 'src/admin/components/MenuCommon';
import Footer from 'src/admin/components/Footer';
import Page from '#components/Page';

const Covidpage = () => (
    <>
        <Page hideFilter hideMap />
        <Navbar />
        <MenuCommon layout="common" currentPage={'Epidemics'} />
        <Covid key={undefined} type={undefined} props={undefined} />
        <Footer />
    </>
);

export default Covidpage;
