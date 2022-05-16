import React from 'react';

const RenderLegend = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: 'transparent' }}>
                <h2 style={{ margin: 0, fontSize: 14 }}>{payload[0].payload.name}</h2>
                {/* {payload[0].payload.Max
                    && <p>{`Maximum: ${payload[0].payload.Max} ℃`}</p>
                } */}
                <p style={{ margin: 0, fontSize: 14, color: '#00d725' }}>{`Average: ${payload[0].payload.Avg} ℃`}</p>
                {/* {payload[0].payload.Min
                    && <p>{`Minimum: ${payload[0].payload.Min} ℃`}</p>
                } */}
            </div>
        );
    }
    return null;
};
export default RenderLegend;
