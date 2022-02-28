
import React from 'react';
import { createRequestClient, ClientAttributes, methods } from '#request';
import { OpenspaceLegends } from '../OpenspaceLegends';

interface Props {
    resourceInfo: any;
    requests: any;
}

interface State {
    map: any;
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
