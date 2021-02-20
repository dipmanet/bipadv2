import React from 'react';
import VizRiskContext from '#components/VizRiskContext';
import Icon from '#rscg/Icon';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import MaxTempIcon from '#views/VizRisk/SlideOne/Icons/TempMax.svg';
import MinTempIcon from '#views/VizRisk/SlideOne/Icons/TempMin.svg';
import AvgRainFall from '#views/VizRisk/SlideOne/Icons/RainFall.svg';
import ElevationIcon from '#views/VizRisk/SlideOne/Icons/ElevationFromSea.svg';
import AreaIcon from '#views/VizRisk/SlideOne/Icons/Area.svg';
import styles from './styles.scss';

interface State {
    showInfo: boolean;
}

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

class SlideOne extends React.PureComponent<Props, State> {
    public static contextType = VizRiskContext;

    public constructor(props: Props) {
        super(props);

        this.state = {
            showInfo: false,
        };
    }

    public handleInfoClick = () => {
        console.log(this.state.showInfo);
        const { showInfo } = this.state;
        if (showInfo) {
            this.setState({ showInfo: false });
        } else {
            this.setState({ showInfo: true });
        }
    };

    public render() {
        const { currentPage } = this.context;

        const {
            municipalities,
        } = this.props;

        const {
            showInfo,
        } = this.state;

        return (
            <div className={styles.vrSideBar}>
                <h1> Rajapur Municipality </h1>
                {/* <p>
                         Rajapur municipality lies in the Terai region of Bardiya
                        district in Province five. It covers a total area of 127.08
                        square km, and is situated at an elevation of 142 m to 154 m from sea level.
                </p> */}
                <p>
                         Rajapur municipality lies in the Terai region of Bardiya
                        district in Province five.
                </p>
                <div className={styles.iconRow}>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={MaxTempIcon}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>41℃</div>
                            <div className={styles.iconText}>
                            Average Maximum
                                <br />
                            Temeperature in Summer
                            </div>

                        </div>
                    </div>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={MinTempIcon}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>7℃</div>
                            <div className={styles.iconText}>
                            Average Minimum
                                <br />
                            Temeperature in Summer
                            </div>

                        </div>
                    </div>
                </div>
                <div className={styles.iconRow}>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={AvgRainFall}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>1900mm</div>
                            <div className={styles.iconText}>
                            Average Annual
                            Rainfall
                            </div>

                        </div>
                    </div>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={ElevationIcon}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>142m - 154m</div>
                            <div className={styles.iconText}>
                            Elevation from Sea Level
                            </div>

                        </div>
                    </div>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={AreaIcon}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>
                                127.08 km
                                {' '}
                                <sup>2</sup>
                            </div>
                            <div className={styles.iconText}>
                            Total Area
                            </div>

                        </div>
                    </div>
                </div>
                <div className={styles.iconContainer}>
                    <div
                        className={showInfo ? styles.bottomInfo : styles.bottomInfoHide}
                    >
                            Source: Rajapur Municipality Profile
                    </div>
                    <button type="button" className={styles.infoContainerBtn} onClick={this.handleInfoClick}>
                        <Icon
                            name="info"
                            className={styles.closeIcon}
                        />
                    </button>
                </div>


            </div>
        );
    }
}

export default SlideOne;
