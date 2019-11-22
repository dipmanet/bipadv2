import React from 'react';
import { connect } from 'react-redux';
import html2canvas from 'html2canvas';

import Button from '#rsca/Button';
import MapChild from '#rscz/Map/MapChild';

import PageContext from '#components/PageContext';

import { AppState } from '#store/types';
import {
    Ward,
    District,
    Province,
    Municipality,
    Region,
} from '#store/atom/page/types';
import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    wardsSelector,
    regionSelector,
} from '#selectors';

import indexMapImage from '#resources/images/index-map.png';

interface OwnProps {
    map: {};
}

interface State {
    pending: boolean;
}

interface PropsFromAppState {
    region: Region;
    wards: Ward[];
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
}

type Props = OwnProps & PropsFromAppState;

const indexBounds = {
    sw: { lng: 80.0884245137, lat: 26.3978980576 },
    ne: { lng: 88.1748043151, lat: 30.4227169866 },
};

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    region: regionSelector(state),
    wards: wardsSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
});

const getIndexMapProportion = (bounds) => {
    const {
        _sw,
        _ne,
    } = bounds;

    const lngBW = (indexBounds.ne.lng - indexBounds.sw.lng);
    const latBW = (indexBounds.ne.lat - indexBounds.sw.lat);

    return {
        left: (_sw.lng - indexBounds.sw.lng) / lngBW,
        top: (indexBounds.ne.lat - _ne.lat) / latBW,
        height: (_ne.lat - _sw.lat) / latBW,
        width: (_ne.lng - _sw.lng) / lngBW,
    };
};

class MapDownloadButton extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            pending: false,
        };
    }

    private export = () => {
        const {
            map,
            region,
            wards,
            districts,
            municipalities,
            provinces,
        } = this.props;

        if (!map) {
            console.warn('Cannot export as there is no map');
            return;
        }

        let regionName = 'Nepal';
        const pageTitle = this.context.activeRouteDetails.title;

        if (map) {
            if (region.adminLevel === 1) {
                const province = provinces.find(d => d.id === region.geoarea);
                if (province) {
                    regionName = province.title;
                }
            } else if (region.adminLevel === 2) {
                const district = districts.find(d => d.id === region.geoarea);
                if (district) {
                    regionName = district.title;
                }
            } else if (region.adminLevel === 3) {
                const municipality = municipalities.find(d => d.id === region.geoarea);

                if (municipality) {
                    regionName = municipality.title;
                }
            }
        }

        const legendContainerClassName = 'map-legend-container';

        this.setState({ pending: true });
        const mapCanvas = map.getCanvas();

        const canvas = document.createElement('canvas');
        canvas.width = mapCanvas.width;
        canvas.height = mapCanvas.height;

        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }
        context.drawImage(mapCanvas, 0, 0);

        const mapBounds = map.getBounds();
        const mp = getIndexMapProportion(mapBounds);
        const indexMap = new Image();
        indexMap.src = indexMapImage;
        indexMap.onload = () => {
            const rightMargin = 24;
            const topMargin = 24;

            const indexMapWidth = 200;
            const indexMapHeight = 200 * indexMap.height / indexMap.width;

            const left = canvas.width - indexMapWidth - rightMargin;
            const top = topMargin;

            const dx = mp.left * indexMapWidth;
            const dy = mp.top * indexMapHeight;

            context.drawImage(
                indexMap,
                canvas.width - indexMapWidth - rightMargin,
                topMargin,
                indexMapWidth,
                indexMapHeight,
            );

            context.beginPath();
            context.strokeStyle = '#ff0000';
            context.rect(
                left + dx,
                top + dy,
                indexMapWidth * mp.width,
                indexMapHeight * mp.height,
            );
            context.stroke();

            const legend = document.getElementsByClassName(legendContainerClassName);
            const scale = document.getElementsByClassName('mapboxgl-ctrl-scale')[0];

            const today = new Date();
            const title = `${pageTitle} for ${regionName}`;
            context.font = '24px Source Sans Pro';
            context.fillText(title, 12, 24);
            context.font = '14px Source Sans Pro';
            context.fillText(`Exported on: ${today.toLocaleDateString()}`, 12, 48);

            if (scale) {
                const scaleCanvas = html2canvas(scale);

                scaleCanvas.then((c) => {
                    context.drawImage(
                        c,
                        mapCanvas.width - c.width - 6,
                        mapCanvas.height - c.height - 6,
                    );
                });
            }

            if (legend) {
                const promises = Array.from(legend).map((l) => {
                    const el = l;
                    const elCanvas = html2canvas(l);

                    return elCanvas;
                });

                Promise.all(promises).then((canvases) => {
                    const x = 6;

                    canvases.forEach((c) => {
                        const y = mapCanvas.height - c.height - 6;
                        // context.shadowBlur = 1;
                        // context.shadowColor = 'rgba(0, 0, 0, 0.1)';
                        context.drawImage(c, x, y);
                    });

                    canvas.toBlob((blob) => {
                        const link = document.createElement('a');
                        link.download = 'map-export.png';
                        link.href = URL.createObjectURL(blob);
                        link.click();
                        this.setState({ pending: false });
                    }, 'image/png');
                });
            } else {
                canvas.toBlob((blob) => {
                    const link = document.createElement('a');
                    link.download = 'map-export.png';
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    this.setState({ pending: false });
                }, 'image/png');
            }
        };
    }

    public render() {
        const {
            legendContainerClassName, // capturing the prop
            setDestroyer,
            zoomLevel,
            mapContainerRef,
            mapStyle, // capturing the prop
            ...otherProps
        } = this.props;

        const {
            pending,
        } = this.state;

        return (
            <Button
                pending={pending}
                onClick={this.export}
                {...otherProps}
            />
        );
    }
}

MapDownloadButton.contextType = PageContext;

export default connect(mapStateToProps)(MapChild(MapDownloadButton));
