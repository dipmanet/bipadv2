import React from 'react';
import Map from './Map';
// import Legends from './Legends';
import styles from './styles.scss';
import RightElement1 from './RightPane1';
import RightElement2 from './RightPane2';
import RightElement3 from './RightPane3';
import LandcoverLegends from './LandCoverLegends';
import DemographicsLegends from './DemographicsLegends';
import Icon from '#rscg/Icon';

const rightelements = [
    <RightElement1 />,
    <RightElement2 />,
    <RightElement3 />,
];
const legends = [
    <LandcoverLegends />,
    <DemographicsLegends />,
];

export default class SlideFour extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            showRaster: true,
            rasterLayer: '5',
            exposedElement: 'all',
            rightElement: 0,
            legendElement: 0,
            showLegend: false,
            disableNavBtns: false,
            hoveredWard: '',
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

    public handleNext = () => {
        if (this.state.rightElement < rightelements.length) {
            this.setState(prevState => ({ rightElement: prevState.rightElement + 1 }));
        }
    }

    public handlePrev = () => {
        if (this.state.rightElement > 0) {
            this.setState(prevState => ({ rightElement: prevState.rightElement - 1 }));
        }
    }

    public handleMoveEnd = (value) => {
        this.setState({ disableNavBtns: false });
        console.log('moveend: ', value);
    }

    public render() {
        const {
            showRaster,
            rasterLayer,
            exposedElement,
            rightElement,
            legendElement,
            disableNavBtns,
            hoveredWard,
        } = this.state;

        return (
            <div>
                {!disableNavBtns && (
                    <div className={styles.navBtnCont}>
                        <button
                            type="button"
                            onClick={this.handlePrev}
                            className={styles.navbutton}
                            disabled={rightElement === 0}
                        >
                            <Icon
                                name="chevronLeft"
                                className={rightElement === 0
                                    ? styles.btnDisable
                                    : styles.nextPrevBtn
                                }
                            />
                        </button>
                        <button
                            type="button"
                            onClick={this.handleNext}
                            className={styles.navbutton}
                            disabled={(rightElement === (rightelements.length) - 1)}
                        >
                            <Icon
                                name="chevronRight"
                                className={(rightElement === rightelements.length - 1)
                                    ? styles.btnDisable
                                    : styles.nextPrevBtn
                                }
                            />
                        </button>

                    </div>
                )}


                <Map
                    showRaster={showRaster}
                    rasterLayer={rasterLayer}
                    exposedElement={exposedElement}
                    rightElement={rightElement}
                    handleMoveEnd={this.handleMoveEnd}
                    handleWardHover={this.handleWardHover}
                />
                {rightelements[rightElement]}
                {rightElement === 1 ? legends[0] : ''}
                {rightElement === 2 ? legends[1] : ''}
            </div>
        );
    }
}
