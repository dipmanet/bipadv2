import React, { useEffect, useState } from 'react';
import { styled, withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/';
import PlayIcon from '@material-ui/icons/Pause';

const PositionContainer = styled('div')({
    position: 'fixed',
    zIndex: 230,
    bottom: '80px',
    right: '80px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const SliderInput = withStyles({
    root: {
        marginLeft: 12,
        width: '40%',
    },
    valueLabel: {
        '& span': {
            background: 'none',
            color: '#ddd',
        },
    },
    thumb: {
        color: '#d0d060',
    },
    track: {
        color: '#d0d060',
    },
    rail: {
        color: '#ddd',
    },
    mark: {
        color: '#ddd',
    },
    markLabel: {
        color: '#ddd',
    },
    markActive: {
        color: '#ddd',
    },

})(Slider);

const RangeInput = ({ min, max, value, animationSpeed, onChange, formatLabel }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [animation] = useState({});
    console.log(value);
    // prettier-ignore
    useEffect(() => () => animation.id && cancelAnimationFrame(animation.id), [animation]);

    if (isPlaying && !animation.id) {
        const span = value[1] - value[0];
        let nextValueMin = value[0] + animationSpeed;
        if (nextValueMin + span >= max) {
            nextValueMin = min;
        }
        animation.id = requestAnimationFrame(() => {
            animation.id = 0;
            onChange([nextValueMin, nextValueMin + span]);
        });
    }

    const isButtonEnabled = value[0] > min || value[1] < max;
    const labelsYears = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
    const marks = [
        {
            value: 1577816100000,
            label: '2020',
        },
        {
            value: 1546280100000,
            label: '2019',
        },
        {
            value: 1514744100000,
            label: '2018',
        },
        {
            value: 1451585700000,
            label: '2016',
        },
        {
            value: 1483208100000,
            label: '2017',
        },
        {
            value: 1420049700000,
            label: '2015',
        },
        {
            value: 1388513700000,
            label: '2014',
        },
        {
            value: 1325355300000,
            label: '2012',
        },
        {
            value: 1356977700000,
            label: '2013',
        },
    ];
    return (
        <PositionContainer>
            <Button color="primary" disabled={!isButtonEnabled} onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <PlayIcon title="Animate" /> : <PauseIcon title="Stop" /> }
            </Button>
            <SliderInput
                min={min}
                max={max}
                value={value}
                onChange={(event, newValue) => onChange(newValue)}
                valueLabelDisplay="auto"
                valueLabelFormat={formatLabel}
                marks={marks}
                // valueLabelDisplay={'on'}
            />
        </PositionContainer>
    );
};

export default RangeInput;
