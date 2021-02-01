import React from 'react';
import Panel from './Panel';
import Map from './Map';
import Filter from './Filter';
import Legends from './SlideFour/Legends';

export default class App extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            chapterName: 'marikina',
            buildingType: 'all',
            amenity: 'all',
            layer: 'flood',
            floodYear: 'fhm005yrs',
            minutes: 5,
            suitabilityYear: 'mcda005yrs',
            showRaster: true,
        };

        this.updateChapter = this.updateChapter.bind(this);
        this.updateAmenity = this.updateAmenity.bind(this);
        this.updateBuildingType = this.updateBuildingType.bind(this);
        this.updateLayer = this.updateLayer.bind(this);
        this.updateFloodYear = this.updateFloodYear.bind(this);
        this.updateMinutes = this.updateMinutes.bind(this);
        this.updateSuitabilityYear = this.updateSuitabilityYear.bind(this);
    }

    public updateChapter = (chapterName) => {
        let { layer } = this.state;

        if (chapterName === 'typhoon') {
            layer = 'flood';
        }

        this.setState({
            chapterName,
            layer,
        });
    }

    public updateAmenity = (event) => {
        this.setState({
            amenity: event.target.value,
        });
    }

    public updateBuildingType = (event) => {
        this.setState({
            buildingType: event.target.value,
        });
    }

    public updateLayer = (event) => {
        this.setState({
            layer: event.target.value,
        });
    }

    public updateFloodYear = (event) => {
        this.setState({
            floodYear: event.target.value,
        });
    }

    public updateMinutes = (event) => {
        this.setState({
            minutes: parseInt(event.target.value, 10),
        });
    }

    public updateSuitabilityYear = (event) => {
        this.setState({
            suitabilityYear: event.target.value,
        });
    }

    public handleLegendsClick = () => {
        if (this.state.showRaster) {
            this.setState({
                showRaster: false,
            });
        } else {
            this.setState({
                showRaster: true,
            });
        }
    }

    public render() {
        const {
            chapterName, buildingType, amenity, layer,
            floodYear, minutes, suitabilityYear, showRaster,
        } = this.state;

        return (
            <div>
                <Map
                    chapterName={chapterName}
                    buildingType={buildingType}
                    amenity={amenity}
                    layer={layer}
                    floodYear={floodYear}
                    minutes={minutes}
                    suitabilityYear={suitabilityYear}
                    showRaster={showRaster}
                />
                {/* <Panel
                    chapterName={chapterName}
                    updateChapter={this.updateChapter}
                /> */}
                {/* <Filter
                    chapterName={chapterName}
                    buildingType={buildingType}
                    amenity={amenity}
                    layer={layer}
                    floodYear={floodYear}
                    minutes={minutes}
                    suitabilityYear={suitabilityYear}
                    updateAmenity={this.updateAmenity}
                    updateBuildingType={this.updateBuildingType}
                    updateLayer={this.updateLayer}
                    updateFloodYear={this.updateFloodYear}
                    updateMinutes={this.updateMinutes}
                    updateSuitabilityYear={this.updateSuitabilityYear}
                /> */}
                <Legends
                    handleLegendsClick={this.handleLegendsClick}
                />
            </div>
        );
    }
}
