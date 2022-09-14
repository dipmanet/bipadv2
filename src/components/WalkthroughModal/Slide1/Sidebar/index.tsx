/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable css-modules/no-undef-class */
import { Link } from '@reach/router';
import React from 'react';
import styles from './styles.scss';

const SidebarLogo = ({ data, selectedCategory, onClick,
    manual, searchData, handleManualType, language }) => (
    <div className={styles.sidebar}>
        <div className={styles.sideNavHeading}>
            <div className={styles.navLeftSide}>
                <div className={styles.navLogo}>
                    <div className={styles.colorBar} />
                    <Link to="/">
                        <div className={styles.bipdLogoName}>BIPAD Portal</div>
                    </Link>

                </div>
            </div>
        </div>
        <div className={styles.mainSideBarBody}>
            {manual
                ? (
                    <>
                        <h3>{language === 'en' ? 'Manuals' : 'पुस्तिकाहरू'}</h3>
                        <div className={styles.sidebarCategories}>
                            <>
                                <input
                                    className={styles.search}
                                    name="search"
                                    type="text"
                                    placeholder={language === 'en' ? 'Search' : 'खोज्नुहोस्'}
                                    onChange={e => searchData(e)}
                                />
                                <select name="type" id="manual" onChange={handleManualType}>
                                    <option value="">{language === 'en' ? 'Type of Document' : 'डक्यूमेन्टको प्रकार'}</option>
                                    <option value="Technical Manual">{language === 'en' ? 'Technical Manual' : 'प्राविधिक पुस्तिका'}</option>
                                    <option value="User Manual">{language === 'en' ? 'User Manual' : 'प्रयोगकर्ता पुस्तिका'}</option>

                                </select>
                            </>
                        </div>
                    </>
                )

                : data.map(item => (
                    <div key={item.id}>
                        <h3>{language === 'en' ? item.nameEn : item.nameNe}</h3>
                        <div className={styles.sidebarCategories}>
                            {item.data.map(d => (
                                <span
                                    key={d.id}
                                    className={selectedCategory === d.id
                                        ? styles.active
                                        : ''}
                                    onClick={() => onClick(d.id)}
                                >
                                    {language === 'en' ? d.nameEn : d.nameNe}

                                </span>
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    </div>
);

export default SidebarLogo;
