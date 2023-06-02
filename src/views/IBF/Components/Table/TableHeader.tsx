import React from 'react';
import { _cs } from '@togglecorp/fujs';
import style from './styles.scss';


const TableHeader = ({ item }: any) => (
    <th title={item} className={_cs(style.fedTh)} key={item}>
        {item}
    </th>
);

export default TableHeader;
