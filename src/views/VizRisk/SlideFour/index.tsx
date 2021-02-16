import React from 'react';
import Map from './Map';
import Legends from './Legends';

export default class SlideFour extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            rasterLayer: '5',
            exposedElement: 'all',
            chisapaniClicked: false,
        };
    }

    public handleFloodChange = (rasterLayer: string) => {
        this.setState({
            rasterLayer,
        });
    }

    public handleChisapani = () => {
        this.setState(prevState => ({
            chisapaniClicked: !prevState.chisapaniClicked,
        }));
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
            chisapaniClicked,
        } = this.state;

        return (
            <div>
                <Map
                    showRaster={showRaster}
                    rasterLayer={rasterLayer}
                    exposedElement={exposedElement}
                    chisapaniClicked={chisapaniClicked}
                />
                <Legends
                    handleFloodChange={this.handleFloodChange}
                    handleExposedElementChange={this.handleExposedElementChange}
                    handleChisapani={this.handleChisapani}
                />
            </div>
        );
    }
}
