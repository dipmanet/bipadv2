import React, { useState } from 'react';

export interface Profile {
    mainModule: string;
    subModule: string;
}

export interface DamageAndLoss {
    mainModule: string;
    startDate: string;
    endDate: string;
}

export interface TitleContextProps {
    dashboard?: string;
    incident?: string;
    damageAndLoss?: DamageAndLoss;
    realtime?: number;
    profile?: Profile;
    capacityAndResources?: string;
    setDashboard?: Function;
    setIncident?: Function;
    setDamageAndLoss?: Function;
    setRealtime?: Function;
    setProfile?: Function;
    setCapacityAndResources?: Function;
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
    const [damageAndLoss, setDamageAndLoss] = useState<DamageAndLoss>({
        mainModule: '',
        startDate: '',
        endDate: '',
    });
    const [realtime, setRealtime] = useState(0);
    const [profile, setProfile] = useState<Profile>({
        mainModule: '',
        subModule: '',
    });
    const [capacityAndResources, setCapacityAndResources] = useState('');

    const titleProps = {
        dashboard,
        incident,
        damageAndLoss,
        realtime,
        profile,
        capacityAndResources,
        setDashboard,
        setIncident,
        setDamageAndLoss,
        setRealtime,
        setProfile,
        setCapacityAndResources,
    };

    return (
        <TitleContext.Provider value={titleProps}>
            {children}
        </TitleContext.Provider>
    );
};

export default TitleContextProvider;
