import React from 'react';
import { _cs } from '@togglecorp/fujs';
import style from './styles.scss';

const TableRow = ({ data }: any) => (
    <tr className={style.fedRow}>
        {data.map((item: any, index: any) => (
            <td
                className={_cs(style.fedTh)}
                key={item}
            >
                {item}
            </td>
        ))}
    </tr>

);

export default TableRow;
