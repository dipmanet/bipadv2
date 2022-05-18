import React from 'react';

const RenderLegendRainfall = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: 'transparent' }}>
                <h2 style={{ margin: 0, fontSize: 14 }}>{payload[0].payload.month}</h2>
                {/* {payload[0].payload.Max
                    && <p>{`Maximum: ${payload[0].payload.Max} ℃`}</p>
                } */}
                <p style={{ margin: 0, fontSize: 14, color: '#ffbf00' }}>{`Average: ${payload[0].payload.Averagerainfall} mm`}</p>
                {/* {payload[0].payload.Min
                    && <p>{`Minimum: ${payload[0].payload.Min} ℃`}</p>
                } */}
            </div>
        );
    }
    return null;
};
export default RenderLegendRainfall;
