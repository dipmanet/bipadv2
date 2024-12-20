import React from 'react';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const CustomChartLegend = (props: Props) => {
    const {
        text,
        barColor,
        data,
        background,
        selected,
        builtupArea,
    } = props;
    let innerbarLength;
    if (typeof data === 'string') {
        innerbarLength = parseInt(data.split('/')[1], 10);
    } else {
        innerbarLength = data;
        if (innerbarLength < 1) {
            innerbarLength *= 100;
        }
    }

    const containerStyle = {
        backgroundColor: background,
        width: '100%',
        height: '8px',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: '20px',
    };

    const innerBar = {
        width: `${innerbarLength.toString()}%`,
        backgroundColor: barColor,
        height: '8px',
        borderRadius: '4px',
    };

    const builtup = {
        width: '1%',
        backgroundColor: barColor,
        height: '8px',
        borderRadius: '4px',
    };

    const title = {
        fontSize: '12px',
        color: '#fff',
    };

    const textContainer = {
        display: 'flex',
        justifyContent: 'space-between',
        color: '#fff',
    };

    const mainContainer = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '55px',
        padding: '0 10px',
        marginBottom: '10px',
    };

    const mainContainerSelected = {
        backgroundColor: '#475563',
        // opacity: '0.27',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '55px',
        padding: '0 10px',
        color: '#fff',
        width: '100%',
        marginBottom: '10px',

        // borderRadius: '40px',
    };

    return (
        <div style={selected ? mainContainerSelected : mainContainer}>
            <div style={textContainer}>
                <p style={title}>
                    {text}
                </p>
                <p style={title}>
                    {data}
                    {typeof data === 'string' ? '%' : ''}
                </p>
            </div>
            <div style={containerStyle}>
                <div style={builtupArea ? builtup : innerBar} />
            </div>
        </div>
    );
};


export default CustomChartLegend;
