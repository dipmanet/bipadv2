import React from 'react';
import Map from './Map';
// import Legends from './Legends';
import styles from './styles.scss';
import RightElement1 from './RightPane1';
import RightElement2 from './RightPane2';
import RightElement3 from './RightPane3';
import RightElement4 from './RightPane4';
import Icon from '#rscg/Icon';

const rightelements = [<RightElement1 />, <RightElement2 />, <RightElement3 />, <RightElement4 />];

export default class SlideFour extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            showRaster: true,
            rasterLayer: '5',
            exposedElement: 'all',
            rightElement: 0,
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

    public render() {
        const {
            showRaster,
            rasterLayer,
            exposedElement,
            rightElement,
        } = this.state;

        return (
            <div>
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
                        disabled={rightElement === (rightelements.length) - 1}
                    >
                        <Icon
                            name="chevronRight"
                            className={rightElement === rightelements.length - 1
                                ? styles.btnDisable
                                : styles.nextPrevBtn
                            }
                        />
                    </button>

                </div>

                <Map
                    showRaster={showRaster}
                    rasterLayer={rasterLayer}
                    exposedElement={exposedElement}
                    rightElement={rightElement}
                />
                {/* <Legends
                    handleFloodChange={this.handleLegendsClick}
                    handleExposedElementChange={this.handleExposedElementChange}
                /> */}
                {/* {this.state.rightElement === 1 && <RightElement1 /> }
                {this.state.rightElement === 2 && <RightElement2 /> } */}
                {rightelements[rightElement]}
            </div>
        );
    }
}
