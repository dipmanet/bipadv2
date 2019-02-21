import PropTypes from 'prop-types';
import React from 'react';
import mapboxgl from 'mapbox-gl';
import ReactDOMServer from 'react-dom/server';

import { _cs } from '@togglecorp/fujs';

import MapChild from '#rscz/Map/MapChild';
import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

const emptyObject = {};

@MapChild
export default class MapIconLayer extends React.PureComponent {
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

        if (this.props.features !== nextProps.features) {
            this.reloadFeatures(nextProps);
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    create = () => {
        const {
            geoJson,
            map,
        } = this.props;

        geoJson.features.forEach((feature) => {
            const {
                properties: {
                    popupComponent,
                    imageSource,
                    className,
                },
            } = feature;

            const el = document.createElement('img');
            el.className = className;
            el.src = imageSource;

            const marker = new mapboxgl.Marker(el);

            if (popupComponent) {
                const popupHTML = ReactDOMServer.renderToString(popupComponent);
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
    }

    render() {
        return null;
    }
}
