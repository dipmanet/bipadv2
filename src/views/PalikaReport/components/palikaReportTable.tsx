import React from 'react';
import styles from './styles.scss';
import Icon from '#rscg/Icon';

const PalikaReportTable = (props) => {
    console.log('This props>>>', props.tableData);
    const { paginationData, tableData, tableHeader } = props;
    console.log('What that>>>', paginationData);
    return (
        <div>
            {/* <h1>Responsive Table Example</h1> */}
            <div className={styles.palikaTable}>
                <table id="table-to-xls">
                    <tbody>
                        <tr>
                            {tableHeader.map((item => (

                                <th key={item}>{item}</th>

                            )))}
                        </tr>
                        {/* <tr>
                            <th>S/N</th>
                            <th>Province</th>
                            <th>District</th>
                            <th>Municipality</th>
                            <th>Fiscal Year</th>
                            <th>Disaster Budget (Nrs)</th>
                            <th>Other Budget (Nrs)</th>
                            <th>Total Budget (Nrs)</th>

                        </tr> */}


                        {tableData.map((item, i) => (
                            <tr key={item.item.id}>
                                <td>{i + 1}</td>
                                <td>{item.provinceName}</td>
                                <td>{item.districtName}</td>
                                <td>{item.municipalityName}</td>
                                <td>{item.item.fiscalYear}</td>
                                <td>{item.item.disasterBudgetNrs}</td>
                                <td>{item.item.otherBudgetNrs}</td>
                                <td>{item.item.totalBudgetNrs}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>

                {tableData && tableData.length === 0
&& <p className={styles.dataUnavailable}>Data Unavailable</p>

                }
            </div>
            { }
        </div>
    );
};

export default PalikaReportTable;
