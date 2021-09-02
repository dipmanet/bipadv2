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
                {/* <div
                    style={{ left: `calc(${Number(value) * 10}% - ${Number(value) * 2}px)` }}
                    className={styles.rangeValue}
                    id="rangeV"
                >
                    {Number(value) + 2011}
                </div> */}


                <input
                    onChange={onChange}
                    id="slider"
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    className={styles.slider}
                    // list="tickmarks"
                />
                <div className={styles.ticks}>
                    <span className={styles.tick}>2011</span>
                    <span className={styles.tick}>2012</span>
                    <span className={styles.tick}>2013</span>
                    <span className={styles.tick}>2014</span>
                    <span className={styles.tick}>2015</span>
                    <span className={styles.tick}>2016</span>
                    <span className={styles.tick}>2017</span>
                    <span className={styles.tick}>2018</span>
                    <span className={styles.tick}>2019</span>
                    <span className={styles.tick}>2020</span>
                    <span className={styles.tick}>2021</span>
                </div>
                {/* <datalist id="tickmarks">
                    <option value="0" label="2011">{'0'}</option>
                    <option value="1" label="2012">{'1'}</option>
                    <option value="2" label="2013">{'2'}</option>
                    <option value="3" label="2014">{'3'}</option>
                    <option value="4" label="2015">{'4'}</option>
                    <option value="5" label="2016">{'5'}</option>
                    <option value="6" label="2017">{'6'}</option>
                    <option value="7" label="2018">{'7'}</option>
                    <option value="8" label="2019">{'8'}</option>
                    <option value="9" label="2020">{'9'}</option>
                    <option value="10" label="2021">{'10'}</option>
                </datalist> */}
            </div>
        </div>
    );
};

export default TimelineSlider;
