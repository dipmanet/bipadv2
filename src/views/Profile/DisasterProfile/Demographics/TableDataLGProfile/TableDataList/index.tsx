/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-plusplus */
import React, { useEffect } from 'react';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';
import { TableHeader } from '../TableHeader';

const TableDataList = ({ selectedTable, lgProfileWardLevelData, language }) => {
    const TableHead = TableHeader();
    const selectedTableHead = TableHead.find(item => item.id === selectedTable);
    const { data: selectedTableHeader } = selectedTableHead;

    return (
        <>

            <div style={{ overflow: 'auto', marginTop: '20px', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' }}>
                <table className={_cs(styles.contacts, language === 'np' && styles.languageFont)}>
                    <thead>
                        <tr>
                            {selectedTableHeader && selectedTableHeader
                                .map(item => (item.subCategory.length
                                    ? (
                                        <th key={item.category} style={{ textAlign: 'center' }} colSpan={item.subCategory.length} scope="colgroup">
                                            {language === 'en' ? item.category : item.categoryNe}
                                        </th>
                                    )
                                    : (
                                        <th style={{ position: 'sticky', left: '0', background: 'white', borderLeft: 'none' }} key={item.category} rowSpan="2">
                                            {language === 'en' ? item.category : item.categoryNe}
                                        </th>
                                    )))}

                        </tr>
                        <tr>
                            {
                                language === 'en'

                                    ? selectedTableHeader && selectedTableHeader.map(data => (
                                        data.subCategory ? data.subCategory.map(i => <th key={i} scope="col">{i}</th>) : ''))
                                    : selectedTableHeader && selectedTableHeader.map(data => (
                                        data.subCategoryNe ? data.subCategoryNe.map(i => <th key={i} scope="col">{i}</th>) : ''))
                            }


                        </tr>
                    </thead>
                    <tbody>
                        {lgProfileWardLevelData.map(item => (
                            <tr key={item.ward}>
                                <td style={{ position: 'sticky', left: '0', background: 'white' }}>
                                    {language === 'en' ? 'Ward' : 'वार्ड'}
                                    {' '}
                                    {item.ward}
                                </td>
                                {selectedTableHeader
                                    .map(i => (
                                        i.key.length ? i.key.map(keys => (
                                            <td key={keys}>{item[i.keyHeader][keys] ? item[i.keyHeader][keys] : '-'}</td>
                                        )) : ''
                                    ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    );
};


export default TableDataList;
