/* eslint-disable react/no-array-index-key */
import React from 'react';

import { _cs } from '@togglecorp/fujs';
import TableRow from './TableRow';
import TableHeader from './TableHeader';
import style from './styles.scss';

const Table = ({ theadData, tbodyData }) => {
    tbodyData.sort((a, b) => {
        const munA = a[0].toLowerCase();
        const munB = b[0].toLowerCase();

        if (munA < munB) {
            return -1;
        }
        if (munA > munB) {
            return 1;
        }
        return 0;
    });
    return (
        <table className={style.myTable}>
            <thead className={style.head}>
                <tr className={style.row}>
                    {theadData.map((h, index) => <TableHeader key={index} className={index === 0 ? _cs(style.first, style.head) : ''} item={h} />)}
                </tr>
            </thead>
            <tbody>
                {tbodyData.map((item, index) => <TableRow key={index} data={item} />)}
            </tbody>
        </table>
    );
};

export default Table;
