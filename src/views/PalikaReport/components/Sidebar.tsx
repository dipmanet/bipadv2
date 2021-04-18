import React, { useEffect, useState } from 'react';
import { _cs, reverseRoute } from '@togglecorp/fujs';
import * as ReachRouter from '@reach/router';
import styles from './styles.scss';
import Icon from '#rscg/Icon';

const Sidebar = (props) => {
    const [selectedSubmenu, setSelectedSubmenu] = useState([]);
    const [selectedMenuId, setSelectedMenuId] = useState(1);
    const [isSubmenuClicked, setIsSubmenuClicked] = useState(true);
    const [isIndicatorClicked, setIsIndicatorClicked] = useState(true);
    const [selectedSubMenuId, setSelectedSubMenuId] = useState(1);
    const [initialRender, setInitialRender] = useState(true);
    const [menuSlug, setMenuSlug] = useState('');
    const [subMenuSlug, setSubMenuSlug] = useState('');

    const Data = [{
        id: 1,
        title: 'Palika Reports',
        slug: 'palika-reports',
        components: [{ id: 1,
            title: 'All Reports',
            url: '/disaster-profile/',
            slug: 'all-reports' },
        { id: 2,
            title: 'My Reports',
            url: '/disaster-profile/',
            slug: 'my-reports' }],
    },
        // { id: 2,
        //     title: 'Budget',
        //     slug: 'budget',
        //     components: [{ id: 1,
        //         title: 'Annual Budgets',
        //         url: '/annual-budget/',
        //         slug: 'annual-budget' },
        //     { id: 2,
        //         title: 'Annual Budget Activities',
        //         url: '/annual-budget-activity/',
        //         slug: 'annual-budget-activities' },
        //     { id: 3,
        //         title: 'Annual Policy and Programmes',
        //         url: '/annual-policy-program/',
        //         slug: 'annual-policy-and-programmes' }] },

        // { id: 3,
        //     title: 'Simulation',
        //     slug: 'simulation',
        //     components: [{ id: 1,
        //         title: 'All Simulations',
        //         url: '/simulation/',
        //         slug: 'all-simulations' }] },
        // { id: 4,
        //     title: 'Risk Reduction',
        //     slug: 'risk-reduction',
        //     components: [{ id: 1,
        //         title: 'All Risk Reductions',
        //         url: '/risk-reduction/',
        //         slug: 'all-risk-reduction' }] },
        // { id: 5,
        //     title: 'Recovery',
        //     slug: 'recovery',
        //     components: [{ id: 1,
        //         title: 'All Recoveries',
        //         url: '/recovery/',
        //         slug: 'all-recoveries' }] },
        // { id: 6,
        //     title: 'Research',
        //     slug: 'research',
        //     components: [{ id: 1,
        //         title: 'All Researches',
        //         url: '/research/',
        //         slug: 'all-researches' }] },
        // { id: 7,
        //     title: 'Organization',
        //     slug: 'organization',
        //     components: [{ id: 1,
        //         title: 'All Organizations',
        //         url: '/organization/',
        //         slug: 'all-organizations' }] },


    ];

    const handleSelectMenu = (index, id, name) => {
        setSelectedSubmenu(Data[index].components);
        setIsSubmenuClicked(true);
        setSelectedMenuId(id);
        setInitialRender(false);
        props.getmenuId(id);
        props.getsubmenuId(null);
    };
    const handleSelectSubmenu = (id, url, title, slug, menumainSlug) => {
        setSelectedSubMenuId(id);
        setIsIndicatorClicked(true);
        props.urlData(url);
        props.getsubmenuId(id);
        props.getsubmenuTitle(title);
        setMenuSlug(menumainSlug);
        setSubMenuSlug(slug);
        ReachRouter.navigate(`/palika-report/#/${menuSlug}/${slug}/`);
    };

    // console.log('Test', Data);
    // if (menuSlug) {
    //     const Test = Data.filter(item => item.slug === menuSlug);
    //     const finalTest = Test.components.filter(item => item.slug === subMenuSlug);
    //     console.log('What is this>>>>', finalTest);
    // }

    useEffect(() => {
        const InitialRender = () => {
            if (!initialRender) {
                setIsIndicatorClicked(false);

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

    // const handleDataAdd = () => {

    //     ReachRouter.navigate('/risk-info/#/capacity-and-resources',
    // { state: { showForm: true }, replace: true });
    //     setCarKeys(1);
    // };
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
                                            data.url, data.title, data.slug, item.slug)}
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
