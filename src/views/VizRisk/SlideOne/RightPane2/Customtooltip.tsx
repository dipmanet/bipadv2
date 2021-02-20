import React from 'react';

const CustomTooltip = () => ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        console.log('payload', payload);
        // console.log('payload', payload);
        return (
            <div className="custom-tooltip">
                <h2>{payload[0].payload.name}</h2>
                {`Average Max: ${payload[0].payload.AvgMax} ℃`}
                {' '}
                <br />
                {`Average Min: ${payload[0].payload.AvgMin} ℃`}
                {' '}
                <br />
                {`Daily Avg: ${payload[0].payload.DailyAvg} ℃`}
                {/* <p className="label">{`${label} : ${payload[0].value}℃`}</p> */}
                {/* <p className="intro">{getIntroOfPage(label)}</p> */}
                {/* <p className="desc">Anything you want can be displayed here.</p> */}
            </div>
        );
    }

    return null;
};

export default CustomTooltip;
