import React from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';

interface Props {
    playState: boolean;
    handlePlayPause: () => void;
    handleInputChange: (e: any) => void;
    incidentYear: string;
}
const TimelineSlider = (props: Props) => {
    const {
        handlePlayPause,
        handleInputChange,
        playState,
        incidentYear,
    } = props;

    return (
        <div className={styles.incidentsSlider}>
            <button
                className={styles.playButton}
                type="button"
                onClick={handlePlayPause}
            >
                {
                    playState
                        ? (
                            <Icon
                                name="play"
                                className={styles.playpauseIcon}
                            />
                        ) : (
                            <Icon
                                name="pause"
                                className={styles.playpauseIcon}
                            />
                        )}
            </button>

            <div className={styles.rangeWrap}>
                <div
                    style={{ left: `calc(${Number(incidentYear) * 10}% - ${Number(incidentYear) * 2}px)` }}
                    className={styles.rangeValue}
                    id="rangeV"
                >
                    {Number(incidentYear) + 2011}
                </div>
                <input
                    onChange={handleInputChange}
                    id="slider"
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={Number(incidentYear)}
                    className={styles.slider}
                />
            </div>
        </div>
    );
};

export default TimelineSlider;
