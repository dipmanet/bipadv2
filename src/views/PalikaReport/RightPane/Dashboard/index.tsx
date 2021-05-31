/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import { ADToBS } from 'bikram-sambat-js';
import styles from './styles.scss';
import Icon from '#rscg/Icon';
import Gt from '../../utils';
import Translations from '#views/PalikaReport/Constants/Translations';
import { iconNames } from '#constants';
import editIcon from '#resources/palikaicons/edit.svg';
import fileDownload from '#resources/palikaicons/file-download.svg';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';

import {
    setGeneralDataAction,
} from '#actionCreators';
import { palikaLanguageSelector } from '#selectors';

const mapStateToProps = (state, props) => ({
    drrmLanguage: palikaLanguageSelector(state),
});
const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
});

const PalikaReportTable = (props) => {
    const node = useRef();
    const [isSort, setIsSort] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const [downloadClicked, setDownloadClicked] = useState(false);
    const [reportId, setReportId] = useState();
    const { paginationData, tableData, tableHeader,
        tableHeaderDataMatch, submenuId, sortTitle, sortProvince,
        sortDistrict,
        sortMunicipality, setShowTabs,
        sortFiscalYear, setGeneralDatapp,
        sortCreatedOn, sortModifiedOn, currentPage, pageSize, drrmLanguage } = props;


    const iconName = 'sort';

    const handleEditButtonClick = (row) => {
        setGeneralDatapp(row);
        setShowTabs(false, false, true);
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
    const handleClick = (e) => {
        if (e.target.id === 'summaryReport' || e.target.id === 'fullReport') {
            return;
        }

        setDownloadClicked(false);
    };
    const handleDLReport = (e, id) => {
        setReportId(id);
        setDownloadClicked(!downloadClicked);
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {/* <h1>Responsive Table Example</h1> */}
            <div className={styles.palikaTable}>
                <table className={drrmLanguage.language === 'np' && styles.nep} id="table-to-xls">
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
                                            <td>{ index + 1}</td>
                                            <td>{item.item.title}</td>
                                            <td>{drrmLanguage.language === 'np' ? item.fiscalYearNp : item.fiscalYear}</td>
                                            <td>{drrmLanguage.language === 'np' ? item.provinceNp : item.province}</td>
                                            <td>{drrmLanguage.language === 'np' ? item.districtNp : item.district}</td>
                                            <td>{drrmLanguage.language === 'np' ? item.municipalityNp : item.municipality}</td>
                                            <td>{ADToBS(item.createdDate)}</td>
                                            <td>{ADToBS(item.modifiedDate)}</td>
                                            <td>{item.item.updatedBy.username}</td>
                                            <td>
                                                <div ref={node} className={styles.dropdown}>


                                                    <button
                                                        type="button"
                                                        onClick={e => handleDLReport(e, item.item.id)}
                                                        className={styles.dropbtn}
                                                        title={drrmLanguage.language === 'np'
                                                            ? Translations.dashboardTableDownloadTooltip.np
                                                            : Translations.dashboardTableDownloadTooltip.en}
                                                    >

                                                        <ScalableVectorGraphics
                                                            className={styles.bulletPoint}
                                                            src={fileDownload}
                                                            alt="fileDownload"

                                                        />

                                                    </button>
                                                    <div id="myDropdown" className={reportId === item.item.id && downloadClicked ? _cs(styles.dropdownContent, styles.show) : styles.dropdownContent}>

                                                        <a id="summaryReport" href="#summary_report" onClick={() => window.open(item.item.summaryFileEn)}>
                                                            {' '}
                                                            <Gt
                                                                section={Translations.dashboardTableSummaryReportDownload}
                                                            />

                                                        </a>
                                                        <a id="fullReport" href="#full_report" onClick={() => window.open(item.item.fullFileEn)}>
                                                            <Gt
                                                                section={Translations.dashboardTableFullReportDownload}
                                                            />

                                                        </a>

                                                    </div>


                                                </div>


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
                                        <th>
                                            <Gt
                                                section={Translations.dashboardTblHeaderSN}
                                            />

                                        </th>
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
                                            <td>{ index + 1}</td>
                                            <td>{data.item.title}</td>
                                            <td>{drrmLanguage.language === 'np' ? data.fiscalYearNp : data.fiscalYear}</td>
                                            <td>{ADToBS(data.createdDate)}</td>
                                            <td>{ADToBS(data.modifiedDate)}</td>
                                            <td>{data.item.updatedBy.username}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={styles.reliefBtn}
                                                    onClick={() => handleEditButtonClick(data)}
                                                    title={drrmLanguage.language === 'np'
                                                        ? Translations.dashboardTableEditTooltip.np
                                                        : Translations.dashboardTableEditTooltip.en}
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
                && (
                    <p className={styles.dataUnavailable}>
                        {' '}
                        <Gt
                            section={Translations.DashBoardNoDataMessage}
                        />
                    </p>
                )

                }
            </div>
            { }
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    PalikaReportTable,
);
