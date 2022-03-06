import React, { useContext } from 'react';
import { MapChildContext } from '#re-map/context';
import Polygon from './index';

interface Props {
    resourceInfo: any;
}

const PolygonBoundaryCommunity = (resourceInfo: Props) => {
    const appContext = useContext(MapChildContext);
    return <Polygon appContext={appContext} resourceInfo={resourceInfo} />;
};

export default PolygonBoundaryCommunity;
