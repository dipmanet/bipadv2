import React, { useContext } from 'react';
import { MapChildContext } from '#re-map/context';
import BoundaryComponent from './index';

interface Props {
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
