import React from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import styles from './styles.scss';

const PalikaReportTable = (props) => {
    console.log('This props>>>', props.tableData);
    return (
        <div>
            {/* <h1>Responsive Table Example</h1> */}
            <div className={styles.palikaTable}>
                <table id="table-to-xls">
                    <tbody>
                        <tr>
                            <th>S/N</th>
                            <th>Province</th>
                            <th>District</th>
                            <th>Municipality</th>
                            <th>Fiscal Year</th>
                            <th>Disaster Budget (Nrs)</th>
                            <th>Other Budget (Nrs)</th>
                            <th>Total Budget (Nrs)</th>

                        </tr>
                        {props.tableData.map((item, i) => (
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
            </div>
            <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button"
                table="table-to-xls"
                filename="tablexls"
                sheet="tablexls"
                buttonText="Download as XLS"
            />
        </div>
    );
};

export default PalikaReportTable;
