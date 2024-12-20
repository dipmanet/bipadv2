/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_opacity } from 'react-icons-kit/md/ic_opacity';
import styles from './styles.scss';

interface Props {
    opacitySlideHandler: (e: any) => void;
    opacityValue: number;
}


const OpacitySlider = (props: Props) => {
    const {
        opacitySlideHandler,
        opacityValue,
    } = props;
    return (
        <>
            <Icon
                style={{
                    position: 'relative',
                    left: '5px',
                    bottom: '2px',
                }}
                icon={ic_opacity}
                size={16}
            />
            <span
                style={{ marginLeft: '10px' }}
            >
    Opacity:
            </span>
            <div className={styles.rangeSliderWrap}>
                <div className={styles.rangeSlider}>
                    <span className={styles.bar}><span className={styles.fill} id="fill_1" /></span>
                    <input
                        className={styles.slider}
                        id="rangeSlider_1"
                        type="range"
                        min="1"
                        max="100"
                        value={opacityValue}
                        onChange={e => opacitySlideHandler(e)}

                    />
                    <span className={styles.index}>
                        {opacityValue}
                        {' '}
            %
                    </span>
                </div>
            </div>
        </>
    );
};

export default OpacitySlider;
