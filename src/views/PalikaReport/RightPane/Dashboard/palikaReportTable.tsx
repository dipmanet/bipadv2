/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import styles from './styles.scss';
import Icon from '#rscg/Icon';
import Gt from '../../utils';
import Translations from '#views/PalikaReport/Translations';
import { iconNames } from '#constants';
import editIcon from '#resources/palikaicons/edit.svg';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';

const PalikaReportTable = (props) => {
    const [isSort, setIsSort] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const { paginationData, tableData, tableHeader,
        tableHeaderDataMatch, submenuId, sortTitle, sortProvince,
        sortDistrict,
        sortMunicipality,
        sortFiscalYear,
        sortCreatedOn, sortModifiedOn, currentPage, pageSize } = props;


    const iconName = 'sort';
    console.log('tabledata:', tableData);
    const handleEditButtonClick = () => {
        console.log('clicked');
    };

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
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderSN}
                                            />
                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashBoardMainTitle}
                                            />
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortTitle}
                                            />
                                            {' '}

                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderFiscalYear}
                                            />
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortFiscalYear}
                                            />

                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderProvince}
                                            />
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortProvince}
                                            />

                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderDistrict}
                                            />
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortDistrict}
                                            />

                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderMunicipality}
                                            />
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortMunicipality}
                                            />

                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderPublishedOn}
                                            />
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortCreatedOn}
                                            />

                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderLastModified}
                                            />
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortModifiedOn}
                                            />

                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderLastPublishedBy}
                                            />
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}

                                            />

                                        </th>
                                        <th>

                                            <Gt
                                                section={Translations.dashboardTblHeaderLastAction}
                                            />

                                        </th>
                                    </tr>
                                    {tableData.length > 0 && tableData.map((item, index) => (
                                        <tr key={item.item.id}>
                                            <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                            <td>{item.item.title}</td>
                                            <td>{item.fiscalYear}</td>
                                            <td>{item.province}</td>
                                            <td>{item.district}</td>
                                            <td>{item.municipality}</td>
                                            <td>{item.createdDate}</td>
                                            <td>{item.modifiedDate}</td>
                                            <td>{item.item.updatedBy.username}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={styles.downloadTableXlsButton}
                                                >
                                                    <a
                                                        href={item.item.file}

                                                        download
                                                    >
                                                        <Gt
                                                            section={Translations.dashboardTblBtnDownload}
                                                        />
                                                    </a>
                                                </button>
                                            </td>
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
                                            <Gt
                                                section={Translations.dashboardTblHeaderTitle}
                                            />

                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortTitle}
                                            />

                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderFiscalYear}
                                            />
                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortFiscalYear}
                                            />
                                            {' '}

                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderPublishedOn}
                                            />

                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortCreatedOn}
                                            />

                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderLastModified}
                                            />


                                            {' '}
                                            <Icon
                                                name={iconName}
                                                className={styles.iconClassName}
                                                onClick={handleSortModifiedOn}
                                            />

                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderLastPublishedBy}
                                            />

                                        </th>
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderLastAction}
                                            />
                                        </th>
                                    </tr>

                                    {tableData.length > 0 && tableData.map((data, index) => (
                                        <tr key={data.id}>
                                            <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                            <td>{data.item.title}</td>
                                            <td>{data.fiscalYear}</td>
                                            <td>{data.createdDate}</td>
                                            <td>{data.modifiedDate}</td>
                                            <td>{data.item.updatedBy.username}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={styles.reliefBtn}
                                                    onClick={handleEditButtonClick}
                                                    title="Edit Report"
                                                >

                                                    <ScalableVectorGraphics
                                                        className={styles.bulletPoint}
                                                        src={editIcon}
                                                        alt="editPoint"
                                                    />

                                                    {/* Edit */}
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

                {tableData && tableData.length === 0
                && <p className={styles.dataUnavailable}>Data Unavailable</p>

                }
            </div>
            { }
        </div>
    );
};

export default PalikaReportTable;
