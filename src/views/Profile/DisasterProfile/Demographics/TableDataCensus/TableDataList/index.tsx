/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-plusplus */
import React, { useEffect } from 'react';
import styles from './styles.scss';


const TableDataList = ({ population, literacy, householdSummary, ageGroup, selectedCategory }) => (
    <>

        <div style={{ overflow: 'auto', marginTop: '20px', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' }}>
            {selectedCategory === 1 ? (
                <table className={styles.contacts}>
                    <thead>
                        <tr>
                            <th colSpan="5" scope="colgroup" style={{ textAlign: 'center' }}>Population</th>
                        </tr>
                        <tr>
                            {householdSummary.map(item => (

                                <th scope="col" key={item.key}>{item.label}</th>

                            ))}
                            {population.map(data => (

                                <th scope="col" key={data.key}>{data.label}</th>

                            ))}


                        </tr>
                    </thead>
                    <tbody>
                        {householdSummary.map(item => (

                            <td key={item.key}>{item.value}</td>

                        ))}
                        {population.map(data => (

                            <td key={data.key}>{data.value}</td>

                        ))}

                    </tbody>
                </table>
            ) : ''}
            {
                selectedCategory === 2
                    ? (
                        <table className={styles.contacts}>
                            <thead>
                                <tr>
                                    <th colSpan="4" scope="colgroup" style={{ textAlign: 'center' }}>Population By Age Group</th>
                                </tr>
                                <tr>


                                    <th scope="col">Age Group</th>
                                    <th scope="col">Male</th>
                                    <th scope="col">Female</th>
                                    <th scope="col">Others</th>


                                </tr>
                            </thead>
                            <tbody>
                                {ageGroup.map(data => (
                                    <tr key={data.key}>
                                        <td>{data.label}</td>
                                        <td>{data.male}</td>
                                        <td>{data.female}</td>
                                        <td>{data.other ? data.other : '-'}</td>
                                    </tr>

                                ))}


                            </tbody>
                        </table>
                    ) : ''
            }
            {selectedCategory === 3 ? (
                <table className={styles.contacts}>
                    <thead>
                        <tr>
                            <th colSpan={literacy.length} scope="colgroup" style={{ textAlign: 'center' }}>Literacy Rate</th>
                        </tr>
                        <tr>
                            {literacy.map(item => (

                                <th scope="col" key={item.key}>{item.label}</th>

                            ))}


                        </tr>
                    </thead>
                    <tbody>
                        {literacy.map(item => (

                            <td key={item.key}>{item.value}</td>

                        ))}


                    </tbody>
                </table>
            ) : ''}

        </div>

    </>
);


export default TableDataList;
