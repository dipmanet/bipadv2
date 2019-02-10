import React from 'react';
import PropTypes from 'prop-types';
import turf from 'turf';

import Map from '#rscz/Map/index';
import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import nepalGeoJson from '#resources/districts.json';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

const nepalBounds = turf.bbox(nepalGeoJson);

const boundsFill = {
    'fill-color': '#00897B',
    'fill-opacity': 0.4,
};

const boundsOutline = {
    'line-color': '#ffffff',
    'line-opacity': 1,
    'line-width': 1,
};

const pointsOuter = {
    'circle-color': '#000',
    'circle-radius': 14,
    'circle-opacity': 0.4,
};

const pointsInner = {
    'circle-color': '#f37123',
    'circle-radius': 10,
    'circle-opacity': 1,
};

const hoverPaint = {
    'circle-color': '#f37123',
    'circle-radius': 10,
    'circle-opacity': 1,
};
const rcDataParams = (key, data) => ({
    title: data.name,
    value: data.value,
});

const keySelector = d => d.name;

export default class ProjectsMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            currentHoverId: undefined,
        };

        this.hoverInfo = {
            paint: hoverPaint,
            showTooltip: true,
            tooltipProperty: 'name',
            onMouseOver: this.handleMapPointHover,
        };
    }

    handleMapPointHover = (data = {}) => {
        this.setState({ currentHoverId: data.id });
    }

    handlePointClick = (id) => {
        window.open(`#/${id}`, '_blank');
    }

    render() {
        const {
            className: classNameFromProps,
            points,
        } = this.props;

        const className = [
            styles.map,
            classNameFromProps,
            'projects-map',
        ].join(' ');

        console.warn(process.env);
        return (
            <Map
                className={className}
                bounds={nepalBounds}
                fitBoundsDuration={10}
            >
                <MapSource
                    sourceKey="bounds"
                    geoJson={nepalGeoJson}
                >
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
                </MapSource>
            </Map>
        );
    }
}
