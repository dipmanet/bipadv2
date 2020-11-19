import React, { useContext } from 'react';
import { MapChildContext } from '#re-map/context';
import BoundaryComponent from './index';

interface Props {
    handleDroneImage: (loading: boolean) => void;
    resourceIdForLegend: number | null;
    openspaceOn: boolean;
    communityspaceOn: boolean;
    legendTitle: string;
}


const OpenspaceLegends = (props: Props) => {
    const appContext = useContext(MapChildContext);

    return (
        <BoundaryComponent
            appContext={appContext}
            {...props}
        />
    );
};

export default OpenspaceLegends;
