import React, { useEffect, useState } from 'react';
import styles from './styles.scss';
import Icon from '#rscg/Icon';

const Sidebar = () => {
    const [selectedSubmenu, setSelectedSubmenu] = useState([]);
    const [selectedMenuId, setSelectedMenuId] = useState();
    const [isSubmenuClicked, setIsSubmenuClicked] = useState(false);
    const [isIndicatorClicked, setIsIndicatorClicked] = useState(false);
    const [selectedSubMenuId, setSelectedSubMenuId] = useState();
    const [selectedSubmenuIndex, setSelectedSubmenuIndex] = useState();
    const Data = [{
        id: 1,
        title: 'palika reports',
        components: [{ id: 1,
            title: 'all reports',
            indicators: [{ id: 1, title: 'Palika Report count' },
                { id: 2, title: 'Palika 1' }, { id: 3, title: 'Palika 2' }] },
        { id: 2,
            title: 'my reports',
            indicators: [{ id: 1, title: 'my Report count' },
                { id: 2, title: 'Report 1' }, { id: 3, title: 'Report 2' }] }],
    }, {
        id: 2,
        title: 'Budget',
        components: [{ id: 1,
            title: 'Annual Budget',
            indicators: [{ id: 1, title: 'Palika Report count' },
                { id: 2, title: 'Paliks1' }, { id: 3, title: 'Palika Audit' }] },
        { id: 2,
            title: 'Budget Activities',
            indicators: [{ id: 1, title: 'Palika Report count' },
                { id: 2, title: 'Edition1' }, { id: 3, title: 'Edition2' }] }],
    },
    {
        id: 3,
        title: 'Annual Policy',
        components: [{ id: 1,
            title: 'Annual meeting',
            indicators: [{ id: 1, title: 'Final Palika' },
                { id: 2, title: 'Final 2 palika' }, { id: 3, title: 'extra palika' }] },
        { id: 2,
            title: 'Annual demands',
            indicators: [{ id: 1, title: 'Palika Report count' },
                { id: 2, title: 'Confirm palika' }, { id: 3, title: 'Rara palika' }] }],
    }];

    const handleSelectMenu = (index, id) => {
        setSelectedSubmenu(Data[index].components);
        setIsSubmenuClicked(true);
        setSelectedMenuId(id);

        // if (selectedMenuId && isIndicatorClicked) {
        //     setIsIndicatorClicked(false);
        // }
    };
    const handleSelectSubmenu = (index, id) => {
        setSelectedSubMenuId(id);
        setIsIndicatorClicked(true);
    };

    // let finalContent = [];
    // const test = () => {
    //     finalContent = selectedSubmenu.filter(contain => contain.id === selectedSubMenuId)
    //         .map(contain => contain.indicators);
    // };
    // test();

    return (
        <div>
            <ul>
                {Data.map((item, i) => (
                    <button className={styles.menu} type="button" key={item.id} onClick={() => handleSelectMenu(i, item.id)}>
                        <div>
                            {isSubmenuClicked && item.id === selectedMenuId ? <Icon className={styles.icons} name="arrowDown" /> : <Icon className={styles.icons} name="play" />}
                            {item.title}

                        </div>
                        {isSubmenuClicked && selectedMenuId === item.id
                            ? item.components.map((data, index) => (
                                <button
                                    className={styles.subMenu}
                                    type="button"
                                    key={data.id}
                                    onClick={() => handleSelectSubmenu(i, data.id)}
                                >
                                    <div>
                                        {isIndicatorClicked && selectedSubMenuId === item.components[index].id ? <Icon className={styles.icons} name="arrowDown" /> : <Icon className={styles.icons} name="play" />}
                                        {data.title}
                                    </div>
                                    {isIndicatorClicked
                                    && selectedSubMenuId === item.components[index].id
                                        ? item.components[index].indicators.map(indicator => (
                                            <button
                                                className={styles.indicator}
                                                type="button"
                                                key={indicator.id}
                                            >
                                                {indicator.title}
                                            </button>
                                        )) : ''}
                                </button>
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
