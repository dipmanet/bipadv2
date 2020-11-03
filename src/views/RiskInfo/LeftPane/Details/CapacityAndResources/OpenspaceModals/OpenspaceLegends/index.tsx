/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_menu } from 'react-icons-kit/md/ic_menu';
import { ic_opacity } from 'react-icons-kit/md/ic_opacity';
import droneIcon from '#resources/icons/drone-icon1.png';
import { createRequestClient, ClientAttributes, methods } from '#request';
import styles from './styles.scss';

interface Props {
    appContext: any;
    requests: any;
    opacitySlideHandler: () => void;
    handleWmsCheck: () => void;
    opacityValue: number;
    legendTitle: string;
    resourceIdForLegend: number | null;
    openspaceOn: boolean;
    communityspaceOn: boolean;
}

interface State {
    map: any;
    opacityValue: number;
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
            opacityValue: 100,
        };
    }

    public componentDidMount() {
        // const { map } = this.props.appContext;
        const { appContext: { map } } = this.props;
        this.setState({ map });
    }

    private handleWmsCheck = (e, geoserverUrl: string) => {
        const { map } = this.state;
        const { checked } = e.target;
        if (checked) {
            this.addWmsLayer(map, geoserverUrl);
        } else {
            map.removeLayer('wms-openspace-layer');
            map.removeSource('wms-openspace-source');
        }
    };

    private addWmsLayer = (map, geoserverUrl: string) => {
        console.log('url', geoserverUrl);

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
                paint: {},
            },
            'aeroway-line',
        );
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
        if (map.getLayer('wms-openspace-layer')) {
            map.removeLayer('wms-openspace-layer');
        }
        if (map.getSource('wms-openspace-source')) {
            map.removeSource('wms-openspace-source');
        }
        return (
            <div className={styles.mapLegendWrap}>
                <h2>
                    Layer Controls
                    {/* <a href="#/" className={styles.opacityIcon} /> */}
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
                        {/* <a href="#/"><i className="material-icons">close</i></a> */}
                    </div>

                    <div className={styles.wrapList}>
                        <div className={styles.listItem}>
                            <Icon
                                style={{
                                    position: 'relative',
                                    left: '5px',
                                    bottom: '2px',
                                }}
                                icon={ic_opacity}
                                size={16}
                            />
                            <span
                                style={{ marginLeft: '10px' }}
                            >
                                Opacity:
                            </span>
                            <div className={styles.rangeSliderWrap}>
                                <div className={styles.rangeSlider}>
                                    <span className={styles.bar}><span className={styles.fill} id="fill_1" /></span>
                                    <input
                                        className={styles.slider}
                                        id="rangeSlider_1"
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={opacityValue}
                                        onChange={e => this.opacitySlideHandler(e)}

                                    />
                                    <span className={styles.index}>
                                        {opacityValue}
                                        {' '}
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* {geoserverUrl && ( */}
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
                                        onChange={e => this.handleWmsCheck(e, wmsUrl)}
                                    />


                                </div>
                            </div>
                        </div>
                        {/* // )} */}
                    </div>
                </div>
            </div>
        );
    }
}
export default createRequestClient(requestOptions)(BoundaryComponent);
