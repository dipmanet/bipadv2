import React from 'react';

const CommonToolTip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: 'transparent' }}>
                <p style={{ margin: 0, fontSize: 14, color: 'white' }}>
                    {`Count: ${payload[0].payload.count}`}
                </p>
            </div>
        );
    }
    return null;
};
export default CommonToolTip;
