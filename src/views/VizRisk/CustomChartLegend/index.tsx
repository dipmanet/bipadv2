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
    } = props;

    const innerbarLength = parseInt(data, 10);

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

    const title = {
        fontSize: '12px',
        color: '#ddd',
    };

    const textContainer = {
        display: 'flex',
        justifyContent: 'space-between',
        color: '#ddd',
    };

    const mainContainer = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '55px',
        padding: '0 10px',
    };

    const mainContainerSelected = {
        backgroundColor: '#444',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '55px',
        padding: '0 10px',
    };

    return (
        <div style={selected ? mainContainerSelected : mainContainer}>
            <div style={textContainer}>
                <p style={title}>
                    {text}
                </p>
                <p style={title}>
                    {data}
                    %
                </p>
            </div>
            <div style={containerStyle}>
                <div style={innerBar} />
            </div>
        </div>
    );
};


export default CustomChartLegend;
