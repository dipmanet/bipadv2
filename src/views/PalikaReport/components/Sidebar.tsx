/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { _cs, reverseRoute } from '@togglecorp/fujs';
import * as ReachRouter from '@reach/router';
import { connect } from 'react-redux';
import styles from './styles.scss';
import Icon from '#rscg/Icon';
import { userSelector, palikaRedirectSelector, generalDataSelector } from '#selectors';

const mapStateToProps = (state, props) => ({
    user: userSelector(state),
    palikaRedirect: palikaRedirectSelector(state),
    generalData: generalDataSelector(state),
});

const menuItems: {
    key: number;
    content: TabContent;
    url?: string;
}[] = [
    {
        key: 0,
        content: 'General',
        url: '/municipality-contact/',
    },
    {
        key: 1,
        content: 'Budget',
        url: '/annual-budget/',
    },
    {
        key: 2,
        content: 'Budget Activity',
        url: '/annual-budget-activity/',
    },
    {
        key: 3,
        content: 'Programme and Policies',
        url: '/annual-policy-program/',
    },
    {
        key: 4,
        content: 'Organisation',
        url: '/resource/',
    },
    {
        key: 5,
        content: 'Inventories',
        url: '',
    },
    {
        key: 6,
        content: 'Resources',
        url: '',
    },
    {
        key: 7,
        content: 'Contacts',
        url: '',
    },
    {
        key: 8,
        content: 'Incident and Relief',
        url: '',
    },
    {
        key: 9,
        content: 'Simulation',
        url: '/simulation/',
    },
    {
        key: 10,
        content: 'Create Report',
        url: '/simulation/',
    },
];


const Sidebar = (props) => {
    const [selectedSubmenu, setSelectedSubmenu] = useState([]);
    const [selectedMenuId, setSelectedMenuId] = useState(1);
    const [isSubmenuClicked, setIsSubmenuClicked] = useState(true);
    const [isIndicatorClicked, setIsIndicatorClicked] = useState(true);
    const [selectedSubMenuId, setSelectedSubMenuId] = useState(1);
    const [initialRender, setInitialRender] = useState(true);
    const [showErr, setShowErr] = useState(false);
    const [menuSlug, setMenuSlug] = useState('');
    const [subMenuSlug, setSubMenuSlug] = useState('');
    // eslint-disable-next-line react/prop-types
    // eslint-disable-next-line @typescript-eslint/camelcase
    const {
        municipalityName,
        municipalityName: { title_en },
        showReportEdit,
        handleMenuClick,
        selectedTab,
        generalData,
    } = props;

    useEffect(() => {
        setShowErr(props.showErr);
    }, [props.showErr]);

    const handleMenuItemClick = (menuItem: number) => {
        if (generalData && generalData.fiscalYear) {
            handleMenuClick(menuItem);
            setShowErr(false);
            props.handleShowErr(false);
        } else {
            props.handleShowErr(true);
            setShowErr(true);
        }
    };
    const Data1 = [{
        id: 1,
        title: 'Palika Reports',
        slug: 'palika-reports',
        components: [{ id: 1,
            title: 'All Reports',
            url: '/disaster-profile/',
            slug: 'all-reports' },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { id: 2,
            // eslint-disable-next-line @typescript-eslint/camelcase
            title: `${title_en} Municipality Reports`,
            url: '/disaster-profile/',
            slug: 'my-reports' }],
    }];
    const Data2 = [{
        id: 1,
        title: 'Palika Reports',
        slug: 'palika-reports',
        components: [{ id: 1,
            title: 'All Reports',
            url: '/disaster-profile/',
            slug: 'all-reports' },
        // eslint-disable-next-line @typescript-eslint/camelcase
        ],
    },
    ];
    const Data = municipalityName ? Data1 : Data2;
    const handleMyPalikaClick = () => {
        props.handleMyPalikaSelect(true);
    };
    const handleMyPalikaClickReport = () => {
        props.handleMyPalikaSelect(false);
    };
    const handleSelectMenu = (index, id, name) => {
        setSelectedSubmenu(Data[index].components);
        setIsSubmenuClicked(true);
        setSelectedMenuId(id);
        setInitialRender(false);
        props.getmenuId(id);
        // props.getsubmenuId(null);
    };
    const handleSelectSubmenu = (id, url, title, slug, menumainSlug) => {
        setSelectedSubMenuId(id);
        setIsIndicatorClicked(true);
        props.urlData(url);
        props.getsubmenuId(id);
        props.getsubmenuTitle(title);
        setMenuSlug(menumainSlug);
        setSubMenuSlug(slug);
        // ReachRouter.navigate(`/palika-report/#/${menuSlug}/${slug}/`);
    };
    useEffect(() => {
        if (selectedSubMenuId) {
            props.getsubmenuId(selectedSubMenuId);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSubMenuId]);

    // if (menuSlug) {
    //     const Test = Data.filter(item => item.slug === menuSlug);
    //     const finalTest = Test.components.filter(item => item.slug === subMenuSlug);
    // }

    useEffect(() => {
        const InitialRender = () => {
            if (!initialRender) {
                setIsIndicatorClicked(false);

                // setSelectedSubMenuId(1);

                // const linkUrl = selectedSubmenu.filter(item => item.id
                //     === selectedSubMenuId).map(item => item.url);
                // props.urlData(linkUrl[0]);
            }
        };
        InitialRender();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMenuId]);

    return (
        <div>

            {showReportEdit

            && (
                <div className={styles.breadcrumbRow}>
                    <button
                        className={styles.breadcrumb}
                        type="button"
                        onClick={handleMyPalikaClick}
                    >
                        My Palika Report &gt;

                    </button>
                    <button
                        className={_cs(styles.breadcrumb, styles.rightCrumb)}
                        type="button"
                        onClick={handleMyPalikaClickReport}
                    >
                    Add a report

                    </button>
                </div>
            )
            }


            {
                !showReportEdit
                && (
                    <ul className={styles.orderList}>
                        {Data.map((item, i) => (
                            <button className={styles.menu} type="button" key={item.id} onClick={() => handleSelectMenu(i, item.id)}>
                                <div className={styles.menuName}>
                                    {isSubmenuClicked && item.id === selectedMenuId ? <Icon className={styles.icons} name="arrowDown" /> : <Icon className={styles.icons} name="play" />}
                                    {item.title}

                                </div>
                                {isSubmenuClicked && selectedMenuId === item.id
                                    ? item.components.map((data, index) => (
                                        <div className={styles.subMenuDiv} key={data.id}>
                                            <button
                                                type="submit"


                                                className={isIndicatorClicked
                                        && selectedSubMenuId === data.id ? _cs(
                                                        styles.subMenu, styles.subMenuActive,
                                                    ) : styles.subMenu}

                                                onClick={() => handleSelectSubmenu(data.id,
                                                    data.url, data.title, data.slug, item.slug)}
                                            >

                                                {data.title}


                                            </button>
                                        </div>
                                    ))
                                    : ''
                                }


                            </button>
                        ))}

                    </ul>
                )
            }

            {
                showReportEdit
                && (
                    <div className={styles.reportSidebarMainContainer}>
                        <h2>Create a Report</h2>
                        <ul className={styles.menuList}>
                            {menuItems.map((item) => {
                                if (item.key < menuItems.length - 1) {
                                    return (
                                        <li>
                                            <button
                                                key={item.key}
                                                className={selectedTab === item.key ? styles.selected : styles.notSelected}
                                                onClick={() => handleMenuItemClick(item.key)}
                                                type="button"
                                            >

                                                {item.content}
                                            </button>
                                        </li>
                                    );
                                }
                                return (
                                    <li>
                                        <button
                                            key={item.key}
                                            className={styles.createReport}
                                            onClick={() => handleMenuItemClick(item.key)}
                                            type="button"
                                        >
                                            {item.content}
                                        </button>
                                    </li>

                                );
                            })}
                            {
                                showErr
                                    && (
                                        <span className={styles.error}>
                                            Please Enter Valid Fiscal Year from General Section
                                        </span>
                                    )}
                        </ul>
                    </div>
                )
            }
        </div>

    );
};

export default connect(mapStateToProps)(
    Sidebar,
);
