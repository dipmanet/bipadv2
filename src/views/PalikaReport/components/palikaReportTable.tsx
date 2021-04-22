import React, { useEffect, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Item } from 'semantic-ui-react';
import styles from './styles.scss';
import Icon from '#rscg/Icon';
import { iconNames } from '#constants';

const PalikaReportTable = (props) => {
    const [isSort, setIsSort] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const { paginationData, tableData, tableHeader,
        tableHeaderDataMatch, submenuId, sortTitle, sortProvince,
        sortDistrict,
        sortMunicipality,
        sortFiscalYear,
        sortCreatedOn, sortModifiedOn } = props;

    const allReportData = [{ id: 1, title: 'DRR Incident Reports', fiscalYear: '2065/2066', province: 'Bagmati', district: 'kathmandu', municipality: 'kathmandu', reportDate: '2021-04-12', modifiedDate: '2021-04-13', generatedBy: 'Kathmandu' },
        { id: 2, title: 'DRR Incident Reports', fiscalYear: '2065/2066', province: 'sudurpaschim', district: 'kailali', municipality: 'Dhangadi', reportDate: '2021-04-12', modifiedDate: '2021-04-13', generatedBy: 'Dhangadi' },
        { id: 3, title: 'DRR Incident Reports', fiscalYear: '2065/2066', province: 'sudurpaschim', district: 'kailali', municipality: 'Tikapur', reportDate: '2021-04-12', modifiedDate: '2021-04-13', generatedBy: 'Tikapur' },
        { id: 4, title: 'DRR Incident Reports', fiscalYear: '2065/2066', province: 'Bagmati', district: 'kathmandu', municipality: 'kathmandu', reportDate: '2021-04-12', modifiedDate: '2021-04-13', generatedBy: 'Kathmandu' },
        { id: 5, title: 'DRR Incident Reports', fiscalYear: '2065/2066', province: 'sudurpaschim', district: 'kailali', municipality: 'Dhangadi', reportDate: '2021-04-12', modifiedDate: '2021-04-13', generatedBy: 'Dhangadi' },
        { id: 6, title: 'Disaster funding report', fiscalYear: '2065/2066', province: 'Lumbini', district: 'Bardiya', municipality: 'Rajapur', reportDate: '2021-04-12', modifiedDate: '2021-04-13', generatedBy: 'Rajapur' },
        { id: 7, title: 'Disaster Rescue report', fiscalYear: '2065/2066', province: 'Lumbini', district: 'Bardiya', municipality: 'Rajapur', reportDate: '2020-04-12', modifiedDate: '2020-04-13', generatedBy: 'Rajapur' },
        { id: 8, title: 'Relief Fund Report', fiscalYear: '2065/2066', province: 'Lumbini', district: 'Bardiya', municipality: 'Rajapur', reportDate: '2020-12-12', modifiedDate: '2020-12-18', generatedBy: 'Rajapur' },
    ];
    const municipalityData = [
        { id: 1, title: 'Disaster funding report', fiscalYear: '2065/2066', reportDate: '2021-04-12', modifiedDate: '2021-04-13', generatedBy: 'Rajapur' },
        { id: 2, title: 'Disaster Rescue report', fiscalYear: '2065/2066', reportDate: '2020-04-12', modifiedDate: '2020-04-13', generatedBy: 'Rajapur' },
        { id: 3, title: 'Relief Fund Report', fiscalYear: '2065/2066', reportDate: '2020-12-12', modifiedDate: '2020-12-18', generatedBy: 'Rajapur' },

    ];
    const iconName = 'sort';
    console.log('hang table data>>>', tableData);

    const handleSortTitle = () => {
        setIsSort(!isSort);
        setSortBy('title');
    };
    const handleSortProvince = () => {
        setIsSort(!isSort);
        setSortBy('province');
    };
    const handleSortDistrict = () => {
        setIsSort(!isSort);
        setSortBy('district');
    };
    const handleSortMunicipality = () => {
        setIsSort(!isSort);
        setSortBy('municipality');
    };
    const handleSortFiscalYear = () => {
        setIsSort(!isSort);
        setSortBy('fiscalYear');
    };
    const handleSortCreatedOn = () => {
        setIsSort(!isSort);
        setSortBy('createdOn');
    };
    const handleSortModifiedOn = () => {
        setIsSort(!isSort);
        setSortBy('modifiedOn');
    };
    useEffect(() => {
        if (sortBy === 'title') {
            sortTitle(isSort);
        }
        if (sortBy === 'fiscalYear') {
            sortFiscalYear(isSort);
        }
        if (sortBy === 'province') {
            sortProvince(isSort);
        }
        if (sortBy === 'district') {
            sortDistrict(isSort);
        }
        if (sortBy === 'municipality') {
            sortMunicipality(isSort);
        }
        if (sortBy === 'createdOn') {
            sortCreatedOn(isSort);
        }
        if (sortBy === 'modifiedOn') {
            sortModifiedOn(isSort);
        }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSort]);
    console.log('why>>>', isSort);
    return (
        <div>
            {/* <h1>Responsive Table Example</h1> */}
            <div className={styles.palikaTable}>
                <table id="table-to-xls">
                    <tbody>
                        {submenuId === 1
                            ? (
                                <>
                                    <tr>
                                        {/* {tableData
                                 && tableHeader.map((item, i) => (
                                     <th key={item.i}>{item}</th>
                                 ))} */}
                                        <th>SN</th>
                                        <th>
 Title
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortTitle}
                                            />
                                            {' '}

                                        </th>
                                        <th>
Fiscal Year
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortFiscalYear}
                                            />

                                        </th>
                                        <th>
Province
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortProvince}
                                            />

                                        </th>
                                        <th>
District
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortDistrict}
                                            />

                                        </th>
                                        <th>
Municipality
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortMunicipality}
                                            />

                                        </th>
                                        <th>
Generated On
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortCreatedOn}
                                            />

                                        </th>
                                        <th>
Modified On
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortModifiedOn}
                                            />

                                        </th>
                                        <th>
Generated by
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}

                                            />

                                        </th>
                                        <th>Action Button</th>
                                    </tr>
                                    {tableData.map(item => (
                                        <tr key={item.item.id}>
                                            <td>{item.item.id}</td>
                                            <td>{item.item.title}</td>
                                            <td>{item.fiscalYear}</td>
                                            <td>{item.province}</td>
                                            <td>{item.district}</td>
                                            <td>{item.municipality}</td>
                                            <td>{item.createdDate}</td>
                                            <td>{item.modifiedDate}</td>
                                            <td>{item.item.createdBy}</td>
                                            <td><button type="button" className={styles.downloadTableXlsButton}>Download</button></td>
                                        </tr>
                                    ))}
                                </>

                            )
                            : (
                                <>
                                    <tr>
                                        {/* {tableData
                             && tableHeader.map((item, i) => (
                                 <th key={item.i}>{item}</th>
                             ))} */}
                                        <th>SN</th>
                                        <th>
Report Title
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortTitle}
                                            />

                                        </th>
                                        <th>
Fiscal Year
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortFiscalYear}
                                            />
                                            {' '}

                                        </th>
                                        <th>
Generated On
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortCreatedOn}
                                            />

                                        </th>
                                        <th>
Modified On
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortModifiedOn}
                                            />

                                        </th>
                                        <th>Report generated by</th>
                                        <th>Action Button</th>
                                    </tr>

                                    {tableData.map(data => (
                                        <tr key={data.id}>
                                            <td>{data.item.id}</td>
                                            <td>{data.item.title}</td>
                                            <td>{data.fiscalYear}</td>
                                            <td>{data.createdDate}</td>
                                            <td>{data.modifiedDate}</td>
                                            <td>{data.item.updatedBy}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={styles.downloadTableXlsButton}
                                                >
Edit
                                                </button>

                                            </td>
                                        </tr>
                                    ))}

                                </>
                            )
                        }

                        {/* {tableData
                             && tableData.map(data => (
                                 <tr key={data.item.id}>
                                     {tableHeaderDataMatch.map(title => (
                                         <td key={title}>
                                             {title === 'province'
                                        || title === 'district'
                                         || title === 'municipality'
                                          || title === 'fiscalYear'
                                                 ? data[title] : String(data.item[title])}

                                         </td>
                                     ))}
                                 </tr>
                             ))} */}
                    </tbody>
                </table>

                {/* {tableData && tableData.length === 0
                && <p className={styles.dataUnavailable}>Data Unavailable</p>

                } */}
            </div>
            { }
        </div>
    );
};

export default PalikaReportTable;
