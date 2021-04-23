/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { reverseRoute, _cs } from '@togglecorp/fujs';
import { useTheme } from '@material-ui/core';
import { Item } from 'semantic-ui-react';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import styles from './styles.scss';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    userSelector } from '#selectors';
import NextPrevBtns from '../../NextPrevBtns';


interface Props{

}
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportInventoriesReport: {
        url: ({ params }) => `${params.url}`,
        query: ({ params, props }) => {
            if (params && params.user) {
                return {
                    province: params.user.profile.province,
                    district: params.user.profile.district,
                    municipality: params.user.profile.municipality,
                    limit: params.page,
                    resource_type: params.inventories,
                    expand: params.fields,


                };
            }


            return { limit: params.page,
                offset: params.offset,
                resource_type: params.inventories,
                expand: params.fields };
        },
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.organisation) {
                params.organisation(citizenReportList);
            }
            if (params && params.paginationParameters) {
                params.paginationParameters(response);
            }
        },
    },
};

const Relief = (props: Props) => {
    const handleDataSave = () => {
        props.updateTab();
    };
    const [fetchedData, setFetechedData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(props.page);
    const [offset, setOffset] = useState(0);
    const [url, setUrl] = useState('/incident/');
    const { requests: { PalikaReportInventoriesReport }, provinces,
        districts,
        municipalities,
        user } = props;
    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');
    const [fields, setfields] = useState('loss');
    const [meta, setMeta] = useState(true);
    const [showRelief, setShowRelief] = useState(false);

    const [familiesBenefited, setfamiliesBenefited] = useState('');
    const [namesofBeneficiaries, setnamesofBeneficiaries] = useState('');
    const [reliefDate, setreliefDate] = useState('');
    const [reliefAmount, setreliefAmount] = useState('');
    const [currentRelief, setCurrentRelief] = useState({});

    const handleFamiliesBenefited = (data) => {
        setfamiliesBenefited(data.target.value);
    };
    const handleNameofBeneficiaries = (data) => {
        setnamesofBeneficiaries(data.target.value);
    };
    const handleReliefAmount = (data) => {
        setreliefAmount(data.target.value);
    };


    const handleFetchedData = (response) => {
        setFetechedData(response);
    };
    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };
    const handlePageClick = (e) => {
        const selectedPage = e.selected;

        setOffset(selectedPage * 2);
    };

    const handleReliefAdd = (data) => {
        setShowRelief(true);
        setCurrentRelief(data);
        console.log(data);
    };

    const [maleBenefited, setmaleBenefited] = useState('');
    const [femaleBenefited, setfemaleBenefited] = useState('');
    const [miorities, setmiorities] = useState('');
    const [dalits, setdalits] = useState('');
    const [madhesis, setmadhesis] = useState('');
    const [disabilities, setdisabilities] = useState('');
    const [janajatis, setjanajatis] = useState('');


    const handlemaleBenefited = (data) => {
        setmaleBenefited(data.target.value);
    };
    const handlefemaleBenefited = (data) => {
        setfemaleBenefited(data.target.value);
    };
    const handleMinorities = (data) => {
        setmiorities(data.target.value);
    };
    const handleDalit = (data) => {
        setdalits(data.target.value);
    };
    const handleMadhesis = (data) => {
        setmadhesis(data.target.value);
    };
    const handleDisabilities = (data) => {
        setdisabilities(data.target.value);
    };
    const handleJanajaties = (data) => {
        setjanajatis(data.target.value);
    };


    PalikaReportInventoriesReport.setDefaultParams({
        organisation: handleFetchedData,
        paginationParameters: handlePaginationParameters,
        url,
        page: paginationQueryLimit,
        inventories: defaultQueryParameter,
        fields,
        user,
        meta,

    });

    useEffect(() => {
        PalikaReportInventoriesReport.do({
            offset,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);
    // Finding Header for table data

    return (
        <div className={styles.tabsPageContainer}>
            {!showRelief
                && (
                    <>
                        <h2>
                            <strong>
                                Incidents
                            </strong>
                        </h2>
                        <div className={styles.palikaTable}>
                            <table id="table-to-xls">
                                <tbody>
                                    <tr>

                                        <th>S.N</th>
                                        <th>Title</th>
                                        <th>Hazard</th>
                                        <th>Incident On</th>
                                        <th>Reported On</th>
                                        <th>Total Death</th>
                                        <th>Total Injured</th>
                                        <th>Total Missing</th>
                                        <th>Family Affected</th>
                                        <th>Infrastructure Affected</th>
                                        <th>Infrastructure Destroyed</th>
                                        <th>Livestock Destroyed</th>

                                    </tr>

                                    {fetchedData.map((item, i) => (
                                        <tr key={item.id}>
                                            <td>{i + 1}</td>
                                            <td>{item.title}</td>
                                            <td>{item.hazard}</td>
                                            <td>{item.incidentOn.split('T')[0]}</td>
                                            <td>{item.reportedOn.split('T')[0]}</td>
                                            <td>{item.loss ? item.loss.peopleDeathCount : 0}</td>
                                            <td>{item.loss ? item.loss.peopleInjuredCount : 0}</td>
                                            <td>{item.loss ? item.loss.peopleMissingCount : 0}</td>
                                            <td>{item.loss ? item.loss.familyAffectedCount : 0}</td>
                                            <td>
                                                {Number(item.loss
                                                    ? item.loss.infrastructureAffectedBridgeCount : 0)
                                        + Number(item.loss
                                            ? item.loss.infrastructureAffectedElectricityCount : 0)
                                        + Number(item.loss ? item.loss.infrastructureAffectedHouseCount : 0)
                                        + Number(item.loss ? item.loss.infrastructureAffectedRoadCount : 0)}
                                            </td>
                                            <td>{item.loss ? item.loss.infrastructureDestroyedCount : 0}</td>
                                            <td>{item.loss ? item.loss.livestockDestroyedCount : 0}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => handleReliefAdd(item)}
                                                    className={styles.reliefBtn}
                                                >
                                                     Add Relief
                                                </button>

                                            </td>

                                        </tr>
                                    ))}


                                </tbody>
                            </table>
                            {/* {paginationParameters && paginationParameters.count !== 0
                            && (
                                <div className={styles.paginationRight}>
                                    <ReactPaginate
                                        previousLabel={'prev'}
                                        nextLabel={'next'}
                                        breakLabel={'...'}
                                        breakClassName={'break-me'}
                                        onPageChange={handlePageClick}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        pageCount={Math.ceil(paginationParameters.count
                                         / paginationQueryLimit)}
                                        containerClassName={styles.pagination}
                                        subContainerClassName={_cs(styles.pagination)}
                                        activeClassName={styles.active}
                                    />
                                </div>
                            )}
                    {fetchedData && fetchedData.length === 0
                && <p className={styles.dataUnavailable}>Data Unavailable</p>

                    } */}
                        </div>
                        <NextPrevBtns
                            handlePrevClick={props.handlePrevClick}
                            handleNextClick={props.handleNextClick}
                        />
                    </>
                )
            }

            {showRelief
                && (
                    <>
                        {' '}
                        <h3>Incident Selected</h3>

                        <div className={styles.incidentDetails}>
                            <table id="table-to-xls">
                                <tbody>
                                    <tr>

                                        <th>Title</th>
                                        <th>Hazard</th>
                                        <th>Incident On</th>
                                        <th>Reported On</th>
                                        <th>Total Death</th>
                                        <th>Total Injured</th>
                                        <th>Total Missing</th>
                                        <th>Family Affected</th>
                                        <th>Infrastructure Affected</th>
                                        <th>Infrastructure Destroyed</th>
                                        <th>Livestock Destroyed</th>


                                    </tr>

                                    {
                                        <tr key={currentRelief.id}>
                                            <td>{currentRelief.title}</td>
                                            <td>{currentRelief.hazard}</td>
                                            <td>{currentRelief.incidentOn}</td>
                                            <td>{currentRelief.reportedOn}</td>
                                            <td>{currentRelief.loss ? currentRelief.loss.peopleDeathCount : 0}</td>
                                            <td>{currentRelief.loss ? currentRelief.loss.peopleInjuredCount : 0}</td>
                                            <td>{currentRelief.loss ? currentRelief.loss.peopleMissingCount : 0}</td>
                                            <td>{currentRelief.loss ? currentRelief.loss.familyAffectedCount : 0}</td>
                                            <td>
                                                {Number(currentRelief.loss
                                                    ? currentRelief.loss.infrastructureAffectedBridgeCount : 0)
                                        + Number(currentRelief.loss
                                            ? currentRelief.loss.infrastructureAffectedElectricityCount : 0)
                                        + Number(currentRelief.loss ? currentRelief.loss.infrastructureAffectedHouseCount : 0)
                                        + Number(currentRelief.loss ? currentRelief.loss.infrastructureAffectedRoadCount : 0)}
                                            </td>
                                            <td>{currentRelief.loss ? currentRelief.loss.infrastructureDestroyedCount : 0}</td>


                                        </tr>
                                    }


                                </tbody>
                            </table>
                        </div>
                        <h3>Please add relief detail for the above incident</h3>

                        <div className={styles.inputContainer}>
                            <span className={styles.dpText}>Number of Beneficiary Families</span>
                            <input
                                type="number"
                                className={styles.inputElement}
                                onChange={handleFamiliesBenefited}
                                value={familiesBenefited}
                                placeholder={'Kindly specify number of families benefited'}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <span className={styles.dpText}>Names of beneficiaries</span>
                            <textarea
                                className={styles.inputElement}
                                onChange={handleNameofBeneficiaries}
                                value={namesofBeneficiaries}
                                placeholder={'Kindly specify the names of beneficiaries'}
                                rows={10}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <span className={styles.dpText}>Date of relief distribution</span>
                            <NepaliDatePicker
                                inputClassName="form-control"
                                className={styles.datepicker}
                                value={reliefDate}
                                onChange={date => setreliefDate(date)}
                                options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <span className={styles.dpText}>Relief Amount (NPR)</span>
                            <input
                                type="number"
                                className={styles.inputElement}
                                onChange={handleReliefAmount}
                                value={reliefAmount}
                                placeholder={'Kindly specify Relief amount'}
                            />
                        </div>


                        <h3><strong>People benefited from the relief Distribution</strong></h3>
                        <div className={styles.inputContainer}>
                            <span className={styles.dpText}>Male</span>
                            <input
                                type="number"
                                className={styles.inputElement}
                                onChange={handlemaleBenefited}
                                value={maleBenefited}
                                placeholder={'Kindly specify a number'}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <span className={styles.dpText}>Female</span>
                            <input
                                type="number"
                                className={styles.inputElement}
                                onChange={handlefemaleBenefited}
                                value={femaleBenefited}
                                placeholder={'Kindly specify a number'}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <span className={styles.dpText}>Minorities</span>
                            <input
                                type="number"
                                className={styles.inputElement}
                                onChange={handleMinorities}
                                value={miorities}
                                placeholder={'Kindly specify a number'}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <span className={styles.dpText}>Dalit</span>
                            <input
                                type="number"
                                className={styles.inputElement}
                                onChange={handleDalit}
                                value={dalits}
                                placeholder={'Kindly specify a number'}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <span className={styles.dpText}>Madhesis</span>
                            <input
                                type="number"
                                className={styles.inputElement}
                                onChange={handleMadhesis}
                                value={madhesis}
                                placeholder={'Kindly specify a number'}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <span className={styles.dpText}>Person with disabilities</span>
                            <input
                                type="number"
                                className={styles.inputElement}
                                onChange={handleDisabilities}
                                value={disabilities}
                                placeholder={'Kindly specify a number'}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <span className={styles.dpText}>Relief Amount (NPR)</span>
                            <input
                                type="number"
                                className={styles.inputElement}
                                onChange={handleJanajaties}
                                value={janajatis}
                                placeholder={'Kindly specify a number'}
                            />
                        </div>

                        <button
                            type="button"
                            className={styles.savebtn}
                            onClick={() => setShowRelief(false)}
                        >
                            Save
                        </button>
                    </>
                )
            }


        </div>
    );
};


export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Relief,
        ),
    ),
);
