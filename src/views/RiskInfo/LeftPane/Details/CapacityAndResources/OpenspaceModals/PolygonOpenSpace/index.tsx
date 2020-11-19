import React from 'react';
import { createRequestClient, ClientAttributes, methods } from '#request';

interface Props {
    resourceInfo: any;
    requests: any;
    appContext: any;
}

interface State {
    map: any;
}

interface State {
    map: unknown;
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
            return `/openspace-detail/?open_space=${params.openspaceId}`;
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
        };
    }

    public componentDidMount() {
        const { map } = this.props.appContext;
        this.setState({ map });

        if (map) {
            if (map.getLayer('polygon-layer')) {
                map.removeLayer('polygon-layer');
            }
            if (map.getSource('maine')) {
                map.removeSource('maine');
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
            if (map.getLayer('polygon-layer')) {
                map.removeLayer('polygon-layer');
            }
            if (map.getSource('maine')) {
                map.removeSource('maine');
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
        if (response) {
            // this.setState({
            //     openspaceTitle: response.results[0]
            //     && response.results[0].layerName
            //     && response.results[0].layerName,
            //     geoserverUrl: response.results[0]
            //     && response.results[0].geoserverUrl
            //     && response.results[0].geoserverUrl,
            // });
        }

        const polygonsCoordinates = response
            && response.results[0]
            && response.results[0].polygons.coordinates[0];

        if (polygonsCoordinates) {
            map.addSource('maine', {
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
                id: 'polygon-layer',
                type: 'fill',
                source: 'maine',
                layout: {},
                paint: {
                    'fill-color': '#088',
                    'fill-opacity': 0.8,
                },
            });

            map.flyTo({
                zoom: 16,
            });
        }
    };

    public render() {
        return (
            <>
            </>
        );
    }
}

export default createRequestClient(requestOptions)(Polygon);
