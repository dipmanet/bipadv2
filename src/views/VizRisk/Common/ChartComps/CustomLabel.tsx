import React from 'react';

const CustomLabel = ({ viewBox, value1, value2 }) => {
    const { cx, cy } = viewBox;
    return (
        <>
            <text x={cx} y={cy} fill="#ddd" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
                <tspan alignmentBaseline="middle" fontSize="12">{value1}</tspan>
                <tspan fontSize="12">{value2}</tspan>

            </text>
        </>
    );
};

export default CustomLabel;
