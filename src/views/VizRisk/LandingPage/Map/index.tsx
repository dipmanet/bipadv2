import React, { useContext, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { AppState } from '#types';


const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;

if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}
interface Props { }

// const mapStateToProps = (state: AppState) => ({

// })

const Map = (props: Props) => {

};

export default connect(mapStateToProps)(Map);
