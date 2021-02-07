import React from 'react';
import Map from './Map';
import Legends from './Legends';

export default class SlideSix extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            showRaster: false,
            rasterLayer: 0,
            showSlide: '',
        };
    }

    public handleLegendsClick = (val) => {
        this.setState(prevState => ({
            rasterLayer: val,
            showRaster: !prevState.showRaster,
        }));
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
                <Legends
                    handleLegendsClick={this.handleLegendsClick}
                    handleSlideChange={this.handleSlideChange}
                />
            </div>
        );
    }
}
