import React from 'react';
import PropTypes from 'prop-types';
import turf from 'turf';

import Map from '#rscz/Map/index';
import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';
import { getHashFromString } from '@togglecorp/fujs';

import nepalGeoJson from '#resources/districts.json';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
    showColors: false,
};

const nepalBounds = turf.bbox(nepalGeoJson);

const boundsFill = {
    'fill-color': '#0081f0',
    'fill-opacity': 0.1,
};

const boundsOutline = {
    'line-color': '#4c4caa',
    'line-opacity': 0.2,
    'line-width': 1,
};

const pointsOuter = {
    'circle-color': '#000',
    'circle-radius': 10,
    'circle-opacity': 0.4,
};

const pointsInner = {
    'circle-color': '#f04656',
    'circle-radius': 7,
    'circle-opacity': 1,
};

const hoverPaint = {
    'circle-color': '#f04656',
    'circle-radius': 10,
    'circle-opacity': 1,
};

export default class ProjectsMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        console.warn('this is here');
        this.state = {
            currentHoverData: undefined,
        };

        this.hoverInfo = {
            paint: hoverPaint,
            showTooltip: true,
            tooltipProperty: 'name',
            tooltipModifier: this.renderTooltip,
            onMouseOver: this.handleMapPointHover,
        };
    }

    handleMapPointHover = (data = {}) => {
        this.setState({ currentHoverData: data.title });
    }

    handlePointClick = (id) => {
        window.open(`#/${id}`, '_blank');
    }

    renderTooltip = () => {
        const { currentHoverData } = this.state;

        return (
            <div className={styles.hoverInfo}>
                <h4>
                    {currentHoverData}
                </h4>
            </div>
        );
    }

    render() {
        const {
            className: classNameFromProps,
            points,
            showColors,
        } = this.props;

        const className = [
            styles.map,
            classNameFromProps,
            'projects-map',
        ].join(' ');

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="bounds"
                    geoJson={nepalGeoJson}
                >
                    {!showColors ? (
                        <React.Fragment>
                            <MapLayer
                                layerKey="bounds-fill"
                                type="fill"
                                paint={boundsFill}
                            />
                            <MapLayer
                                layerKey="bounds-outline"
                                type="line"
                                paint={boundsOutline}
                            />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {nepalGeoJson.features.map(m => (
                                <MapLayer
                                    layerKey={`bounds-fill-${m.properties.DIST_ID}`}
                                    type="fill"
                                    filter={['==', 'DIST_ID', m.properties.DIST_ID]}
                                    paint={{
                                        'fill-color': `hsl(200, 50%, ${(Math.abs(getHashFromString(m.properties.DISTRICT)) % 50) + 50}%)`,
                                        'fill-opacity': 0.8,
                                    }}
                                />
                            ))}
                            <MapLayer
                                layerKey="bounds-outline"
                                type="line"
                                paint={boundsOutline}
                            />
                        </React.Fragment>
                    )}
                </MapSource>
                <MapSource
                    sourceKey="points"
                    geoJson={points}
                    supportHover
                >
                    <MapLayer
                        layerKey="points-red"
                        type="circle"
                        paint={pointsOuter}
                        property="id"
                        onClick={this.handlePointClick}
                    />
                    <MapLayer
                        layerKey="points"
                        type="circle"
                        paint={pointsInner}
                        property="id"
                        onClick={this.handlePointClick}
                        hoverInfo={this.hoverInfo}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}
