import React, { useEffect, useState } from 'react';
import styles from './styles.scss';

interface Props {
    // buttonName: string;
    // buttonList: string[];
}
const DropdownButton = (props) => {
    const { name, nameList } = props;
    const [dropdownClicked, setDropdownClicked] = useState(false);
    const handleClick = () => {
        setDropdownClicked(!dropdownClicked);
    };

    return (
        <div className={dropdownClicked ? 'dropdown show' : 'dropdown'}>
            <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded={dropdownClicked ? 'true' : 'false'} onClick={handleClick}>
                {name}
            </button>
            <div className={dropdownClicked ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton">
                {nameList.map(item => <a className="dropdown-item" href="https://react-bootstrap.github.io/components/dropdowns/" key={item}>{item}</a>)}


            </div>
        </div>

    );
};

export default DropdownButton;
