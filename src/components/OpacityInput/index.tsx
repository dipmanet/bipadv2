import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Slider from 'react-input-slider';

import styles from './styles.scss';

interface Props {
    className?: string;
    inputKey: number;
    onChange: (key: number, value: number) => void;
}

interface State {
    value: number;
}

class OpacityInput extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            value: 1,
        };
    }

    private handleSliderChange = ({ x: value }: { x: number }) => {
        const {
            inputKey,
            onChange,
        } = this.props;

        this.setState({ value });

        onChange(inputKey, value);
    }


    public render() {
        const { className } = this.props;
        const { value } = this.state;

        return (
            <div className={_cs(styles.opacityInput, className)}>
                <div className={styles.label}>
                    Opacity:
                </div>
                <Slider
                    className={styles.slider}
                    axis="x"
                    xmin={0}
                    xmax={1}
                    xstep={0.1}
                    x={value}
                    onChange={this.handleSliderChange}
                    styles={{
                        track: {
                            width: '100%',
                        },
                        thumb: {
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                        },
                    }}
                />
            </div>
        );
    }
}

export default OpacityInput;
