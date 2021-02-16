import React from 'react';
import Map from './Map';
import Legends from './Legends';
import RightPane from './RightPane';

export default class SlideSix extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            showRaster: false,
            rasterLayer: '5',
            showSlide: '',
        };
    }

    public handleLegendsClick = (val) => {
        this.setState(prevState => ({
            rasterLayer: val,
            showRaster: !prevState.showRaster,
        }));
    }

    public handleFloodChange = (rasterLayer: string) => {
        this.setState({
            rasterLayer,
        });
    }


    public handleSlideChange = (showSlide) => {
        this.setState({
            showSlide,
        });
    }

    public render() {
        const {
            showRaster,
            rasterLayer,
            showSlide,
        } = this.state;

        return (
            <div>
                <Map
                    showRaster={showRaster}
                    rasterLayer={rasterLayer}
                    showSlide={showSlide}
                />
                <RightPane />
                <Legends
                    handleLegendsClick={this.handleLegendsClick}
                    handleFloodChange={this.handleFloodChange}
                    handleSlideChange={this.handleSlideChange}
                />
            </div>
        );
    }
}
