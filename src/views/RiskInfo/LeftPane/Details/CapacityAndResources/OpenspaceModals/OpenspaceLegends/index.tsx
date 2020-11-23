/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_menu } from 'react-icons-kit/md/ic_menu';

import { createRequestClient, ClientAttributes, methods } from '#request';
import droneIcon from '#resources/icons/drone-icon1.png';
import styles from './styles.scss';
import OpacitySlider from './OpacitySlider';

interface Props {
    appContext: any;
    requests: any;
    opacitySlideHandler: () => void;
    handleWmsCheck: () => void;
    handleDroneImage: (loading: boolean) => void;
    opacityValue: number;
    legendTitle: string;
    resourceIdForLegend: number | null;
    openspaceOn: boolean;
    communityspaceOn: boolean;
}

interface State {
    map: any;
    opacityValue: number;
    wmsLoading: boolean| null;
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    getDetailsRequest: {
        url: ({ params }) => {
            if (params.openspaceOn) {
                return `/openspace-detail/?open_space=${params.resourceIdForLegend}`;
            } return `/communityspace-detail/?community_space=${params.resourceIdForLegend}`;
        },
        method: methods.GET,
        onMount: false,
    },
};
class BoundaryComponent extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        const {
            requests: { getDetailsRequest },
            resourceIdForLegend,
            openspaceOn,
            communityspaceOn,
        } = this.props;
        if (resourceIdForLegend) {
            getDetailsRequest.do({
                openspaceOn,
                communityspaceOn,
                resourceIdForLegend,
            });
        }

        this.state = {
            map: '',
            opacityVal: 100,
            opacityValue: 100,
            wmsLoading: false,
        };
    }

    public componentDidMount() {
        // const { map } = this.props.appContext;
        const { appContext: { map } } = this.props;
        this.setState({ map });
    }

    private handleWmsCheck = (e, geoserverUrl: string) => {
        const { map } = this.state;
        const { handleDroneImage } = this.props;
        const { checked } = e.target;
        if (map.getLayer('wms-openspace-layer')) {
            map.removeLayer('wms-openspace-layer');
        }
        if (map.getSource('wms-openspace-source')) {
            map.removeSource('wms-openspace-source');
        }
        if (checked) {
            handleDroneImage(true);
            // setTimeout(() => {
            //     handleDroneImage(true);
            // }, 5000);
            this.addWmsLayer(geoserverUrl);
        } else if (!checked) {
            setTimeout(() => {
                handleDroneImage(false);
            }, 500);
            if (map.getLayer('wms-openspace-layer')) {
                map.removeLayer('wms-openspace-layer');
            }
            if (map.getSource('wms-openspace-source')) {
                map.removeSource('wms-openspace-source');
            }
        }
    };

    private addWmsLayer = (geoserverUrl: string) => {
        const { map } = this.state;
        const { handleDroneImage } = this.props;
        map.addSource('wms-openspace-source', {
            type: 'raster',
            tiles: [
                geoserverUrl,
            ],
            tileSize: 256,
        });
        map.addLayer(
            {
                id: 'wms-openspace-layer',
                type: 'raster',
                source: 'wms-openspace-source',
                paint: {
                    'raster-opacity': 0.8,
                },
            },
            'aeroway-line',
        );

        if (map.getLayer('wms-openspace-layer')) {
            setTimeout(() => {
                handleDroneImage(false);
            }, 11000);
        }
    };

    private opacitySlideHandler = (e) => {
        const { map } = this.state;
        const { value } = e.target;
        // let name = e.target.getAttribute("name");
        this.setState({
            opacityValue: value,
        });

        if (map.getLayer('polygon-layer')) {
            map.setPaintProperty(
                'polygon-layer',
                'fill-opacity',
                parseInt(value, 10) / 100,
            );
        }
        if (map.getLayer('community-sorce-layer')) {
            map.setPaintProperty(
                'community-sorce-layer',
                'fill-opacity',
                parseInt(value, 10) / 100,
            );
        }
    };


    public render() {
        const { opacityValue } = this.state;
        const { appContext: { map }, requests, legendTitle } = this.props;
        const {
            getDetailsRequest: { response },
        } = requests;
        let geoserverUrl = '';
        let layerName = '';
        let workspace = '';
        let wmsUrl = '';
        // let title = '';
        if (response) {
            geoserverUrl = response.results
                && response.results[0]
                && response.results[0].geoserverUrl;
            layerName = response.results
                && response.results[0]
                && response.results[0].layerName;
            workspace = response.results
                && response.results[0]
                && response.results[0].workspace;
            // 'https://geoserver.yilab.org.np/geoserver/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=Bipad%3ADistrict'
            wmsUrl = `${geoserverUrl}?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=${workspace}:${layerName}`;
        }

        return (
            <React.Fragment>
                <div className={styles.mapLegendWrap}>
                    <h2>
                    Layer Controls
                    </h2>
                    <div className={styles.legendWrap}>
                        <div className={styles.legendTitle}>
                            <span>
                                <Icon
                                    icon={ic_menu}
                                    size={15}
                                />
                                {legendTitle}
                            </span>
                        </div>

                        <div className={styles.wrapList}>
                            <div className={styles.listItem}>
                                <OpacitySlider
                                    opacitySlideHandler={this.opacitySlideHandler}
                                    opacityValue={opacityValue}
                                />
                            </div>
                            <div className={styles.listItem}>
                                <img
                                    alt="drone"
                                    src={droneIcon}
                                    className={styles.dImg}
                                />
                                <span>Drone Image :</span>
                                <div className={styles.rangeSliderInputWrap}>
                                    <div className={styles.rangeSliderr}>
                                        <input
                                            type="checkbox"
                                            onClick={(e) => {
                                                this.handleWmsCheck(e, wmsUrl);
                                            }}
                                        />

                                    </div>
                                </div>
                                {!geoserverUrl && (
                                    <span
                                        className={styles.droneWarning}
                                    >
                                        Drone image not available!

                                    </span>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default createRequestClient(requestOptions)(BoundaryComponent);
