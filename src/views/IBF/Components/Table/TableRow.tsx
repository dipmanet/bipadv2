import { _cs } from '@togglecorp/fujs';
import React from 'react';
import style from './styles.scss';

const TableRow = ({ data }) => (
    <tr className={style.row}>
        {data.map((item, index) => <td className={index === 0 ? _cs(style.first, style.col) : ''} key={item}>{item}</td>)}
    </tr>

);

export default TableRow;
