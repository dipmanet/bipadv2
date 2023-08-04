/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import home from '#resources/icons/Ibfhome.svg';
import road from '#resources/icons/Ibfroad.svg';
import land from '#resources/icons/Ibfland.svg';
import style from './styles.scss';
import TabPane from './tab-pane';

const Tabs = (props) => {
    const { children } = props;
    const [tabHeader, setTabHeader] = useState([]);
    const [childContent, setChildConent] = useState({});
    const [active, setActive] = useState('');
    useEffect(() => {
        const headers = [];
        const childCnt = {};
        React.Children.forEach(children, (element) => {
            if (!React.isValidElement(element)) return;
            const { name, total } = element.props;
            headers.push({ name, total });
            childCnt[name] = element.props.children;
        });
        setTabHeader(headers);
        setActive(headers[0].name);
        setChildConent({ ...childCnt });
    }, [props, children]);

    const changeTab = (name) => {
        setActive(name);
    };

    return (
        <div className={style.tabs}>
            <ul className={style.tabHeader}>
                {tabHeader.map((item, index) => (

                    <li
                        key={index}
                        onClick={() => changeTab(item.name)}
                        className={item.name === active ? _cs(style.active, 'bubble-bottom-left') : ''}
                        role="presentation"
                    >
                        <div className={style.tabHeaderContent}>
                            <div className={style.tht}>
                                <div className={style.tabHeaderTotal}>
                                    {item.total}
                                </div>

                                <div className={style.tabHeaderUnit}>
                                    {
                                        item.name === 'Roads' ? 'Km' : item.name === 'Landuse' ? 'SqKm' : ''
                                    }
                                </div>

                            </div>
                            <div className={style.tabHeaderName}>
                                <div className={style.thnName}>
                                    {item.name}
                                </div>
                                <div className={style.thnIcon}>
                                    {
                                        ((item.name === 'Buildings')
                                            ? <span><img src={home} alt="" /></span>
                                            : (item.name === 'Roads')
                                                ? <span><img src={road} alt="" /></span>
                                                : <span><img src={land} alt="" /></span>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className={style.tabContent}>
                {Object.keys(childContent).map((key, index) => {
                    if (key === active) {
                        return (
                            <div key={index} className={style.tabChild}>
                                {childContent[key]}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

Tabs.propTypes = {
    // eslint-disable-next-line react/require-default-props
    children(props, propName, componentName) {
        const prop = props[propName];

        let error = null;
        React.Children.forEach(prop, (child) => {
            if (child.type !== TabPane) {
                error = new Error(
                    `\`${componentName}\` children should be of type \`TabPane\`.`,
                );
            }
        });
        return error;
    },
};

export default Tabs;
