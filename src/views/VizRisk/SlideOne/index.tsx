import React from 'react';
import Map from './Map';
// import Legends from './Legends';

export default class SlideFour extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            showRaster: true,
            rasterLayer: '5',
            exposedElement: 'all',
        };
    }

    public handleLegendsClick = (rasterLayer: string, showRasterRec: boolean) => {
        this.setState({
            rasterLayer,
            showRaster: showRasterRec,
        });
    }

    public handleExposedElementChange = (exposed: string) => {
        this.setState({
            exposedElement: exposed,
        });
    }

    public render() {
        const {
            showRaster,
            rasterLayer,
            exposedElement,
        } = this.state;

        return (
            <div>
                <Map
                    showRaster={showRaster}
                    rasterLayer={rasterLayer}
                    exposedElement={exposedElement}
                />
                {/* <Legends
                    handleFloodChange={this.handleLegendsClick}
                    handleExposedElementChange={this.handleExposedElementChange}
                /> */}
            </div>
        );
    }
}
