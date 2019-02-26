import PropTypes from 'prop-types';
import React from 'react';
import mapboxgl from 'mapbox-gl';

import { _cs } from '@togglecorp/fujs';

import MapChild from '#rscz/Map/MapChild';
import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

const emptyObject = {};

@MapChild
export default class MapMarkerLayer extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        if (props.setDestroyer) {
            props.setDestroyer(props.layerKey, this.destroy);
        }

        this.markers = [];
    }

    componentDidMount() {
        this.create(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.map !== nextProps.map) {
            this.destroy();
            this.create(nextProps);
        }

        if (this.props.geoJson !== nextProps.geoJson) {
            this.destroy();
            this.create(nextProps);
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    create = ({
        geoJson,
        map,
    }) => {
        geoJson.features.forEach((feature) => {
            const {
                properties: {
                    popupHTML,
                    markerHTML,
                    containerClassName,
                },
            } = feature;

            const el = document.createElement('div');
            el.className = containerClassName;

            const marker = new mapboxgl.Marker(el);
            el.innerHTML = markerHTML;

            if (popupHTML) {
                const popup = new mapboxgl.Popup({ offset: 10 })
                    .setHTML(popupHTML);
                marker.setPopup(popup);
            }

            marker.setLngLat(feature.geometry.coordinates)
                .addTo(map);

            this.markers.push(marker);
        });
    }

    destroy = () => {
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
    }

    render() {
        return null;
    }
}
