
import React from 'react';
import { createRequestClient, ClientAttributes, methods } from '#request';
import { OpenspaceLegends } from '../OpenspaceLegends';

interface Props {
    resourceInfo: any;
    requests: any;
}

interface State {
    map: any;
    opacityValue: number;
}

interface Params {
    openspaceId: number;
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    mediaGetRequest: {
        url: ({ params }) => {
            if (!params || !params.openspaceId) {
                return '';
            }
            return `/communityspace-detail/?community_space=${params.openspaceId}`;
        },
        method: methods.GET,
        onMount: false,
    },
};


class Polygon extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            map: '',
            opacityValue: 100,
        };
    }

    public componentDidMount() {
        const { map } = this.props.appContext;
        this.setState({ map });

        if (map) {
            if (map.getLayer('community-sorce-layer')) {
                map.removeLayer('community-sorce-layer');
            }
            if (map.getSource('community-sorce')) {
                map.removeSource('community-sorce');
            }
        }

        const {
            requests: { mediaGetRequest },
        } = this.props;

        const openspaceId = this.props.resourceInfo.resourceInfo.id;

        mediaGetRequest.do({
            openspaceId,
        });
    }

    public componentDidUpdate(prevProps: Props) {
        const {
            requests: {
                mediaGetRequest: { response, pending },
            },
        } = this.props;

        if (response !== prevProps.requests.mediaGetRequest.response) {
            this.plotPolygon();
        }
    }

    public componentWillUnmount() {
        const { map } = this.state;
        if (map) {
            if (map.getLayer('community-sorce-layer')) {
                map.removeLayer('community-sorce-layer');
            }
            if (map.getSource('community-sorce')) {
                map.removeSource('community-sorce');
            }
        }
    }

    public plotPolygon = () => {
        const {
            requests: {
                mediaGetRequest: { response },
            },
        } = this.props;
        const { map } = this.state;

        const polygonsCoordinates = response
            && response.results[0]
            && response.results[0].polygons
            && response.results[0].polygons.coordinates
            && response.results[0].polygons.coordinates[0];

        if (polygonsCoordinates) {
            map.addSource('community-sorce', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: polygonsCoordinates,
                    },
                },
            });

            map.addLayer({
                id: 'community-sorce-layer',
                type: 'fill',
                source: 'community-sorce',
                layout: {},
                paint: {
                    'fill-color': '#088',
                    'fill-opacity': 0.8,
                },
            });
        }
    };

    private opacitySlideHandler = (e) => {
        const { map } = this.state;
        const { value } = e.target;
        // let name = e.target.getAttribute("name");
        this.setState({
            opacityValue: value,
        });
        console.log('set opacity', value);
        map.setPaintProperty(
            'community-sorce-layer',
            'fill-opacity',
            parseInt(value, 10) / 100,
        );
        const sliderValue = document.getElementById('slider-value');
        sliderValue.textContent = `${value}%`;
    };

    private handleWmsCheck = (e) => {
        const { map } = this.state;
        const { checked } = e.target;
        if (checked) {
            this.addWmsLayer(map);
        } else {
            map.removeLayer('wms-openspace-layer');
            map.removeSource('wms-openspace-source');
        }
    };

    private addWmsLayer = (map) => {
        console.log('adding wms');

        map.addSource('wms-openspace-source', {
            type: 'raster',
            tiles: [
                'http://202.45.146.139:8080/geoserver/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=GIID:App_districts',
            ],
            tileSize: 256,
        });
        map.addLayer(
            {
                id: 'wms-openspace-layer',
                type: 'raster',
                source: 'wms-openspace-source',
                paint: {},
            },
            'aeroway-line',
        );
    };

    public render() {
        const { opacityValue } = this.state;
        return (
            <>
                {/* <OpenspaceLegends
                    opacityValue={opacityValue}
                    opacitySlideHandler={this.opacitySlideHandler}
                    handleWmsCheck={this.handleWmsCheck}
                /> */}
            </>
        );
    }
}

export default createRequestClient(requestOptions)(Polygon);
