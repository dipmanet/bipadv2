import React from 'react';

const TableHeader = ({ item, className }) => (
    <th title={item} className={className} key={item}>
        {item}
    </th>
);

export default TableHeader;
