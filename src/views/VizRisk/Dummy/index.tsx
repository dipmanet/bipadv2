import React from 'react';
import Page from '#components/Page';
import RatnaNagarMap from '../RatnaNagar/Map/index';
import DummyChildren from './DummyChildren/Children';

const mapCss = {
    position: 'absolute',
    width: '100%',
    left: '0',
    top: 0,
    height: '100vh',
    zIndex: 250,
};


export default function Index() {
    return (
        <>
            <Page
                hideFilter
                hideMap
            />
            <RatnaNagarMap
                mapCss={mapCss}
            >
                <DummyChildren />
            </RatnaNagarMap>
        </>
    );
}
