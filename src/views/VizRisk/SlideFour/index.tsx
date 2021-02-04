import React from 'react';
import Map from './Map';
import Legends from './Legends';

export default class SlideFour extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            showRaster: true,
            rasterLayer: 0,
        };
    }

    public handleLegendsClick = (rasterLayer: number, showRasterRec: boolean) => {
        this.setState({ rasterLayer,
            showRaster: showRasterRec });
    }

    public render() {
        const {
            showRaster,
            rasterLayer,
        } = this.state;

        return (
            <div>
                <Map
                    showRaster={showRaster}
                    rasterLayer={rasterLayer}
                />
                <Legends
                    handleLegendsClick={this.handleLegendsClick}
                />
            </div>
        );
    }
}
