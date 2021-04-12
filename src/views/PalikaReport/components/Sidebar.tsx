import React, { useEffect, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';
import Icon from '#rscg/Icon';

const Sidebar = (props) => {
    const [selectedSubmenu, setSelectedSubmenu] = useState([]);
    const [selectedMenuId, setSelectedMenuId] = useState(1);
    const [isSubmenuClicked, setIsSubmenuClicked] = useState(true);
    const [isIndicatorClicked, setIsIndicatorClicked] = useState(true);
    const [selectedSubMenuId, setSelectedSubMenuId] = useState(1);
    const [selectedSubmenuIndex, setSelectedSubmenuIndex] = useState();
    const [initialRender, setInitialRender] = useState(true);

    // const Data = [{
    //     id: 1,
    //     title: 'Palika Reports',
    //     components: [{ id: 1,
    //         title: 'All Reports',
    //         url: '/disaster-profile/',
    //         indicators: [{ id: 1, title: 'Palika Report count' },
    //             { id: 2, title: 'Palika 1' }, { id: 3, title: 'Palika 2' }] },
    //     { id: 2,
    //         title: 'My Reports',
    //         url: '/disaster-profile/',
    //         indicators: [{ id: 1, title: 'my Report count' },
    //             { id: 2, title: 'Report 1' }, { id: 3, title: 'Report 2' }] }],
    // }, { id: 2,
    //     title: 'Budget',
    //     components: [{ id: 1,
    //         title: 'Annual Budgets',
    //         url: '/annual-budget/',
    //         indicators: [{ id: 1, title: 'Palika Report count' },
    //             { id: 2, title: 'Paliks1' }, { id: 3, title: 'Palika Audit' }] },
    //     { id: 2,
    //         title: 'Annual Budget Activities',
    //         url: '/annual-budget-activity/',
    //         indicators: [{ id: 1, title: 'Palika Report count' },
    //             { id: 2, title: 'Edition1' }, { id: 3, title: 'Edition2' }] }] ,
    // { id: 3,
    //     title: 'Annual Policy and Programmes',
    //     url: '/annual-policy-program/',
    //     indicators: [{ id: 1, title: 'Palika Report count' },
    //         { id: 2, title: 'Edition1' }, { id: 3, title: 'Edition2' }] }]},

    // {
    //     id: 3,
    //     title: 'Simulation',
    //     components: [{ id: 1,
    //         title: 'Simulations',
    //         url: '/simulation/',
    //         indicators: [{ id: 1, title: 'Final Palika' },
    //             { id: 2, title: 'Final 2 palika' }, { id: 3, title: 'extra palika' }] },
    //     { id: 2,
    //         title: 'Annual demands',
    //         url: '/annual-budget-activity/',
    //         indicators: [{ id: 1, title: 'Palika Report count' },
    //             { id: 2, title: 'Confirm palika' }, { id: 3, title: 'Rara palika' }] }],
    // }];

    const Data = [{
        id: 1,
        title: 'Palika Reports',
        components: [{ id: 1,
            title: 'All Reports',
            url: '/disaster-profile/' },
        { id: 2,
            title: 'My Reports',
            url: '/disaster-profile/' }],
    }, { id: 2,
        title: 'Budget',
        components: [{ id: 1,
            title: 'Annual Budgets',
            url: '/annual-budget/' },
        { id: 2,
            title: 'Annual Budget Activities',
            url: '/annual-budget-activity/' },
        { id: 3,
            title: 'Annual Policy and Programmes',
            url: '/annual-policy-program/' }] },

    { id: 3,
        title: 'Simulation',
        components: [{ id: 1,
            title: 'All Simulations',
            url: '/simulation/' }] },
    { id: 4,
        title: 'Risk Reduction',
        components: [{ id: 1,
            title: 'All Risk Reductions',
            url: '/risk-reduction/' }] },
    { id: 5,
        title: 'Recovery',
        components: [{ id: 1,
            title: 'All Recoveries',
            url: '/recovery/' }] },
    { id: 6,
        title: 'Research',
        components: [{ id: 1,
            title: 'All Researches',
            url: '/research/' }] },


    ];

    const handleSelectMenu = (index, id) => {
        setSelectedSubmenu(Data[index].components);
        setIsSubmenuClicked(true);
        setSelectedMenuId(id);
        setInitialRender(false);
        props.getmenuId(id);
        props.getsubmenuId(null);
    };
    const handleSelectSubmenu = (id, url, title) => {
        setSelectedSubMenuId(id);
        setIsIndicatorClicked(true);
        props.urlData(url);
        props.getsubmenuId(id);
        props.getsubmenuTitle(title);
    };
    console.log('submenu id>>>', selectedSubMenuId);

    useEffect(() => {
        const InitialRender = () => {
            if (!initialRender) {
                setIsIndicatorClicked(false);
                console.log('This');
                // setSelectedSubMenuId(1);

                // const linkUrl = selectedSubmenu.filter(item => item.id
                //     === selectedSubMenuId).map(item => item.url);
                // console.log('link url>>>', linkUrl);
                // props.urlData(linkUrl[0]);
            }
        };
        InitialRender();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMenuId]);


    return (
        <div>
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
                                            data.url, data.title)}
                                    >
                                        {data.title}

                                    </button>
                                </div>
                                // <button
                                //     className={styles.subMenu}
                                //     type="button"
                                //     key={data.id}
                                //     onClick={() => handleSelectSubmenu(i, data.id)}
                                // >
                                //     <div>
                                //         {isIndicatorClicked && selectedSubMenuId
                                //         === item.components[index].id
                                //             ? <Icon className={styles.icons} name="arrowDown" />
                                //             : <Icon className={styles.icons} name="play" />}
                                //         <li>{data.title}</li>
                                //     </div>
                                //     {isIndicatorClicked
                                //     && selectedSubMenuId === item.components[index].id
                                //         ? item.components[index].indicators.map(indicator => (
                                //             <button
                                //                 className={styles.indicator}
                                //                 type="button"
                                //                 key={indicator.id}
                                //             >
                                //                 {indicator.title}
                                //             </button>
                                //         )) : ''}
                                // </button>
                            ))
                            : ''
                        }


                    </button>
                ))}

            </ul>
        </div>

    );
};

export default Sidebar;
