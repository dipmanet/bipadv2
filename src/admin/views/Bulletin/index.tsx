/* eslint-disable max-len */
import React, { useState } from 'react';
import BulletinForm from 'src/admin/components/BulletinForm';
import MenuCommon from 'src/admin/components/MenuCommon';
import Navbar from 'src/admin/components/Navbar';
import Footer from 'src/admin/components/Footer';
import Page from '#components/Page';

interface Props {

}

const Bulletin = (props: Props) => {
    const { uri, id, urlLanguage } = props;
    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon
                currentPage="Health Infrastructure"
                layout="common"
                subLevel={'bulletin'}
            />
            <BulletinForm uri={uri} urlLanguage={urlLanguage} id={id} />
            <Footer />
        </>
    );
};

export default Bulletin;
