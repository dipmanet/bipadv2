import React, { useState } from 'react';
import Navbar from '../../Navbar';
import Footer from '../../Footer';
import MenuCommon from '../../MenuCommon';


const Layout = ({ children }: {children: any}) => {
    const [activeLanguage, setActiveLanguage] = useState('EN');
    const handleLanguageToggle = (language) => {
        if (language === 'NP') {
            setActiveLanguage('EN');
        } else {
            setActiveLanguage('NP');
        }
    };
    return (
        <>
            <Navbar activeLanguage={activeLanguage} handleLanguageToggle={handleLanguageToggle} />
            <MenuCommon currentPage="Health Infrastructure" layout="common" />
            {children}
            <Footer />
        </>
    );
};

export default Layout;
