import React from 'react';
import Map from './Map';
import Legends from './Legends';

export default class App extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            showRaster: false,
            rasterLayer: 0,
        };
    }

    public handleLegendsClick = (val) => {
        this.setState(prevState => ({
            rasterLayer: val,
            showRaster: !prevState.showRaster,
        }));
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
