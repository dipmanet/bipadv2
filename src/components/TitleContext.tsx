import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { languageSelector } from '#selectors';

export interface Profile {
    mainModule: string;
    subModule: string;
}

export interface DamageAndLoss {
    mainModule: string;
    startDate: string;
    endDate: string;
}

export interface DataArchive {
    mainModule: string;
    location: string;
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
    dataArchive?: DataArchive;
    source?: string;
    setDashboard?: Function;
    setIncident?: Function;
    setDamageAndLoss?: Function;
    setRealtime?: Function;
    setProfile?: Function;
    setCapacityAndResources?: Function;
    setDataArchive?: Function;
    setSource?: Function;
}

export const TitleContext = React.createContext<TitleContextProps>({});
TitleContext.displayName = 'TitleContext';

interface Props {
    children: React.ReactNode;
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});

const TitleContextProvider = (props: Props) => {
    const { children, language: { language } } = props;
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
    const [dataArchive, setDataArchive] = useState({
        mainModule: '',
        location: '',
        startDate: '',
        endDate: '',
    });
    const [source, setSource] = useState('');

    useEffect(() => {
        if (language === 'np') {
            setDashboard('अलर्टहरू');
            setIncident('घटनाहरू');
        } else {
            setDashboard('Alerts');
            setIncident('Incidents');
        }
    }, [language]);
    const titleProps = {
        dashboard,
        incident,
        damageAndLoss,
        realtime,
        profile,
        capacityAndResources,
        dataArchive,
        source,
        setDashboard,
        setIncident,
        setDamageAndLoss,
        setRealtime,
        setProfile,
        setCapacityAndResources,
        setDataArchive,
        setSource,

    };

    return (
        <TitleContext.Provider value={titleProps}>
            {children}
        </TitleContext.Provider>
    );
};

export default connect(mapStateToProps)(TitleContextProvider);
