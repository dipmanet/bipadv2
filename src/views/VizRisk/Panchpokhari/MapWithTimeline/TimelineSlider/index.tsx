import React from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';

interface Props{
    onChange: (e: any) => void;
    min: string;
    max: string;
    step: string;
    value: string;
    playState: boolean;
    onPlayBtnClick: () => void;
}

const TimelineSlider = (props: Props) => {
    const { onChange, min, max, step, value, playState, onPlayBtnClick } = props;
    console.log(props);

    return (
        <div className={styles.incidentsSlider}>
            <button
                className={styles.playButton}
                type="button"
                onClick={onPlayBtnClick}
            >
                {
                    !playState
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
                    style={{ left: `calc(${Number(value) * 10}% - ${Number(value) * 2}px)` }}
                    className={styles.rangeValue}
                    id="rangeV"
                >
                    {Number(value) + 2011}
                </div>
                <input
                    onChange={onChange}
                    id="slider"
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    className={styles.slider}
                />
            </div>
        </div>
    );
};

export default TimelineSlider;
