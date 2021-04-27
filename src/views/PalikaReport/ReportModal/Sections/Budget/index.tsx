import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import styles from './styles.scss';
import 'nepali-datepicker-reactjs/dist/index.css';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import {
    setGeneralDataAction,
    setBudgetDataAction,
} from '#actionCreators';
import {
    generalDataSelector,
    budgetDataSelector,
    userSelector,
} from '#selectors';
import NextPrevBtns from '../../NextPrevBtns';


interface Props{
    reportTitle: string;
    datefrom: string;
    dateTo: string;
    mayor: string;
    cao: string;
    focalPerson: string;
    formationDate: string;
    memberCount: string;
    setreportTitle: React.ChangeEventHandler<HTMLInputElement>;
    setdatefrom: React.ChangeEventHandler<HTMLInputElement>;
    setdateTo: React.ChangeEventHandler<HTMLInputElement>;
    setmayor: React.ChangeEventHandler<HTMLInputElement>;
    setcao: React.ChangeEventHandler<HTMLInputElement>;
    setfocalPerson: React.ChangeEventHandler<HTMLInputElement>;
    setformationDate: React.ChangeEventHandler<HTMLInputElement>;
    setmemberCount: React.ChangeEventHandler<HTMLInputElement>;
}

interface Location{
    municipalityId: number;
    districtId: number;
    provinceId: number;
}

const mapStateToProps = state => ({
    generalData: generalDataSelector(state),
    budgetData: budgetDataSelector(state),
    user: userSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
    setBudgetDatapp: params => dispatch(setBudgetDataAction(params)),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    BudgetGetRequest: { url: '/annual-budget/',
        query: ({ params, props }) => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            fiscal_year: params.fiscalYear,
            district: params.district,
            municipality: params.municipality,
            province: params.province,
        }),
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.finalAnnualBudgetData) {
                params.finalAnnualBudgetData(citizenReportList);
            }
        } },
    BudgetPostRequest: {
        url: '/annual-budget/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            console.log('This is response', response);
        },


    },

};

const currentFiscalYear = new Date().getFullYear() + 56;

const options = Array.from(Array(10).keys()).map(item => ({
    value: currentFiscalYear - item,
}));


const Budget = (props: Props) => {
    const {
        generalData,
        budgetData,
        updateTab,
        setBudgetDatapp,
        user,
    } = props;
    console.log('Final props fiscal year>>>', generalData);
    const {
        municipalBudget: mb,
        drrFund: df,
        additionalFund: af,
    } = budgetData;

    console.log('budge data', user);
    const [municipalBudget, setmunicipalBudget] = useState(mb);
    const [drrFund, setdrrFund] = useState(df);
    const [additionalFund, setadditionalFund] = useState(af);
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [municipality, setMunicipality] = useState(null);
    const [budgetTitle, setBudgetTitle] = useState('Demo Budget Title');
    const [fiscal, setFiscal] = useState(1);
    const [annualBudgetData, setAnnualBudgetData] = useState([]);
    // const [fiscalYear, setFiscalYear] = useState(2);
    const { user: { profile }, requests: { BudgetPostRequest, BudgetGetRequest } } = props;


    const handleSaveAnnualBudgetData = (response) => {
        setAnnualBudgetData(response);
    };

    BudgetGetRequest.setDefaultParams({
        fiscalYear: generalData.fiscalYear,
        district: profile.district,
        municipality: profile.municipality,
        province: profile.province,
        finalAnnualBudgetData: handleSaveAnnualBudgetData,

    });

    console.log('This is annual>>>', annualBudgetData);
    const handleSelectedProvince = (response) => {
        const selectedProvince = response.filter(item => item.id === profile.district);

        setProvince(selectedProvince[0].province);
        setDistrict(profile.district);
        setMunicipality(profile.municipality);
    };
    useEffect(() => {
        setProvince(profile.province);
        setDistrict(profile.district);
        setMunicipality(profile.municipality);
    }, [profile.district, profile.municipality, profile.province]);


    console.log('This profile>>>', profile);
    const handleMunicipalBudget = (budgetVal) => {
        setmunicipalBudget(budgetVal.target.value);
    };
    const handleDRRFund = (fundVal) => {
        setdrrFund(fundVal.target.value);
    };
    const handleAddFund = (addFundVal) => {
        setadditionalFund(addFundVal.target.value);
    };

    const handleDataSave = () => {
        setBudgetDatapp({
            municipalBudget,
            drrFund,
            additionalFund,
        });
        updateTab();
    };

    const selectStyles = {
        option: (provided, state) => ({
            ...provided,
            borderBottom: '1px dotted gray',
            color: state.isSelected ? 'white' : 'gray',
            padding: 10,
        }),
        control: () => ({
            // none of react-select's styles are passed to <Control />
            width: 200,
        }),
        singleValue: (provided, state) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = 'opacity 900ms';

            return { ...provided, opacity, transition };
        },
    };
    const handleNextClick = () => {
        BudgetPostRequest.do({

            body: {
                title: budgetTitle,
                totalBudgetNrs: Number(drrFund),
                disasterBudgetNrs: Number(municipalBudget),
                otherBudgetNrs: Number(additionalFund),
                fiscalYear: fiscal,
                province,
                district,
                municipality,
            },

        });
        // props.handleNextClick();
    };
    const handleChange = (e) => {
        setProvince(e.target.value);
    };
    return (
        <div>

            <h2 className={styles.title}>Please enter Disaster Profile details</h2>
            <div className={styles.palikaTable}>
                <table id="table-to-xls">
                    <tbody>


                        <>
                            {annualBudgetData.length > 0
                                ? (
                                    <tr>

                                        <th>SN</th>


                                        <th>
                                Total municipal budget


                                        </th>
                                        <th>
                                DRR fund of municipality


                                        </th>
                                        <th>
                                Other DRR related funding


                                        </th>
                                        <th>
                               Updated By


                                        </th>
                                        <th>
                                Updated On


                                        </th>


                                    </tr>
                                ) : (
                                    <tr>

                                        <th>SN</th>


                                        <th>
Total municipal budget


                                        </th>
                                        <th>
DRR fund of municipality


                                        </th>
                                        <th>
Other DRR related funding


                                        </th>


                                    </tr>
                                )}
                            {annualBudgetData.length > 0 ? annualBudgetData.map((item, i) => (
                                <tr key={item.id}>
                                    <td>{i + 1}</td>
                                    <td>{item.totalBudgetNrs}</td>
                                    <td>{item.disasterBudgetNrs}</td>
                                    <td>{item.otherBudgetNrs}</td>
                                    <td>{item.updatedBy}</td>
                                    <td>{item.modifiedOn}</td>


                                </tr>
                            )) : (
                                <tr>
                                    <td>1</td>
                                    <td>
                                        <input type="text" value={municipalBudget} placeholder="Total Budget" onChange={handleMunicipalBudget} />
                                        {' '}
                                    </td>
                                    <td>
                                        <input type="text" value={drrFund} placeholder="Disaster Budget" onChange={handleDRRFund} />
                                        {' '}
                                    </td>
                                    <td>
                                        <input type="text" value={additionalFund} placeholder="Other Budget" onChange={handleAddFund} />
                                        {' '}
                                    </td>


                                </tr>
                            )
                            }


                        </>


                    </tbody>
                </table>


                {/* <div className={styles.inputContainer}>
                        <span className={styles.dpText}>Total Municipal Budget of FY</span>
                        {' '}
                        { `${generalData.fiscalYear}`}
                        <input
                            type="number"
                            className={styles.inputElement}
                            onChange={handleMunicipalBudget}
                            placeholder={'Kindly specify total municipal budget in numbers (NPR)'}
                            value={municipalBudget}
                        />


                    </div>
                    <div className={styles.inputContainer}>

                        <span className={styles.dpText}>Total DRR Fund for FY</span>
                        { `${generalData.fiscalYear}`}
                        <input
                            type="number"
                            className={styles.inputElement}
                            onChange={handleDRRFund}
                            value={drrFund}
                            placeholder={'Kindly specify total DRR fund for FY in numbers (NPR)'}
                        />


                    </div>
                    <div className={styles.inputContainer}>

                        <span className={styles.dpText}>Other DRR related funding</span>
                        { `${generalData.fiscalYear}`}

                        <input
                            type="number"
                            className={styles.inputElement}
                            onChange={handleAddFund}
                            placeholder=
                            {'Kindly specify other DRR related funding in numbers (NPR)'}
                            value={additionalFund}
                        />


                    </div> */}
                <NextPrevBtns
                    handlePrevClick={props.handlePrevClick}
                    handleNextClick={handleNextClick}
                />

            </div>
        </div>


    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Budget,
        ),
    ),
);
