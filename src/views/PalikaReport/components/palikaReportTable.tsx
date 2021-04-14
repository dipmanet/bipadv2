import React from 'react';
import styles from './styles.scss';
import Icon from '#rscg/Icon';


const PalikaReportTable = (props) => {
    const { paginationData, tableData, tableHeader, tableHeaderDataMatch } = props;


    return (
        <div>
            {/* <h1>Responsive Table Example</h1> */}
            <div className={styles.palikaTable}>
                <table id="table-to-xls">
                    <tbody>
                        <tr>
                            {tableHeader.map((item, i) => (
                                <th key={item.i}>{item}</th>
                            ))}
                        </tr>
                        {tableData.map(data => (
                            <tr key={data.item.id}>
                                {tableHeaderDataMatch.map(title => (
                                    <td key={title}>{title === 'province' || title === 'district' || title === 'municipality' || title === 'fiscalYear' ? data[title] : String(data.item[title])}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tableData && tableData.length !== 0
                && (
                    <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button"
                        table="table-to-xls"
                        filename="tablexls"
                        sheet="tablexls"
                        buttonText="XLS"
                    />
                )}
                {tableData && tableData.length === 0
&& <p className={styles.dataUnavailable}>Data Unavailable</p>

                }
            </div>
            { }
        </div>
    );
};

export default PalikaReportTable;
