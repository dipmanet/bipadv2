import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import { mapSources, mapStyles } from '#constants';

const propTypes = {
    boundsPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    // eslint-disable-next-line react/forbid-prop-types
    bounds: PropTypes.array,
    sourceKey: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    mapState: PropTypes.array,
};

const defaultProps = {
    bounds: [
        80.05858661752784, 26.347836996368667,
        88.20166918432409, 30.44702867091792,
    ],
    boundsPadding: undefined,
    sourceKey: 'country',
    mapState: undefined,
};

export default class ChoroplethMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const {
            boundsPadding,
            bounds,
            sourceKey,
            mapState,
            paint,
        } = this.props;

        return (
            <Fragment>
                <MapSource
                    sourceKey={`${sourceKey}-fill`}
                    url={mapSources.nepal.url}
                >
                    <MapLayer
                        layerKey="district-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={paint}
                        mapState={mapState}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-outline`}
                    url={mapSources.nepal.url}
                    bounds={bounds}
                    boundsPadding={boundsPadding}
                >
                    <MapLayer
                        layerKey="province-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.province}
                        paint={mapStyles.province.choroplethOutline}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={mapStyles.district.choroplethOutline}
                    />
                </MapSource>
            </Fragment>
        );
    }
}
