import React, { useState } from 'react';
import RiskAndImpactIcon from '#resources/icons/IbfRiskAndImpact.svg';
import Button from '../Components/CollapsableButton';
import style from './styles.scss';
import RiskAndImpact from '../Components/RiskAndImpact';

interface Props {
    handleWidthToggle: (bool: boolean) => void;
}

const RiskAndImpactCon = ({ handleWidthToggle }: Props) => {
    const [toggle, setToggle] = useState(false);

    return (
        <>
            <Button
                btnClassName={style.impactBtn}
                btnName={'Risk and Impact'}
                btnIcon={RiskAndImpactIcon}
                setToggleBtn={setToggle}
                toggleBtn={toggle}
                handleWidth={handleWidthToggle}
            />
            <RiskAndImpact
                riskClassName={style.riskModal}
                setToggleRisk={setToggle}
                toggleRisk={toggle}
                handleWidth={handleWidthToggle}
            />
        </>
    );
};

export default RiskAndImpactCon;
