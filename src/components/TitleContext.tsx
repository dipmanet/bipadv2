import React, { useState } from 'react';

export interface Profile {
    mainModule: string;
    subModule: string;
}

export interface TitleContextProps {
    dashboard?: string;
    incident?: string;
    damageAndLoss?: string;
    realTime?: object;
    profile?: Profile;
    riskInfo?: object;
    setDashboard?: Function;
    setIncident?: Function;
    setDamageAndLoss?: Function;
    setRealTime?: Function;
    setProfile?: Function;
    setRiskInfo?: Function;
}

export const TitleContext = React.createContext<TitleContextProps>({});
TitleContext.displayName = 'TitleContext';

interface Props {
    children: React.ReactNode;
}

const TitleContextProvider = (props: Props) => {
    const { children } = props;
    const [dashboard, setDashboard] = useState('Alerts');
    const [incident, setIncident] = useState('Incidents');
    const [damageAndLoss, setDamageAndLoss] = useState('');
    const [realtime, setRealTime] = useState({});
    const [profile, setProfile] = useState<Profile>({
        mainModule: '',
        subModule: '',
    });
    const [riskInfo, setRiskInfo] = useState({});

    const titleProps = {
        dashboard,
        incident,
        damageAndLoss,
        realtime,
        profile,
        riskInfo,
        setDashboard,
        setIncident,
        setDamageAndLoss,
        setRealTime,
        setProfile,
        setRiskInfo,
    };

    return (
        <TitleContext.Provider value={titleProps}>
            {children}
        </TitleContext.Provider>
    );
};

export default TitleContextProvider;
