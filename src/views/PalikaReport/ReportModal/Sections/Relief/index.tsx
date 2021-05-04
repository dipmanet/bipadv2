/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { BarChart,
    Bar, Cell,
    XAxis, YAxis,
    CartesianGrid, Tooltip,
    Legend, PieChart,
    Pie } from 'recharts';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import { provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    userSelector,
    hazardTypesSelector } from '#selectors';
import NextPrevBtns from '../../NextPrevBtns';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';

import IncidentIcon from '../../Icons/incident.svg';
import EstimatedLossIcon from '../../Icons/loss.svg';
import DeathIcon from '../../Icons/death.svg';
import MissingIcon from '../../Icons/missing.svg';
import InjredIcon from '../../Icons/injured.svg';
import InfraIcon from '../../Icons/infrastructure.svg';
import LivestockIcon from '../../Icons/livestock.svg';
import HouseAffIcon from '../../Icons/house_partial.svg';
import HouseDmgIcon from '../../Icons/house_complete.svg';

interface Props{

}
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
    hazardTypes: hazardTypesSelector(state),
});

const COLORS = ['rgb(0,177,117)', 'rgb(198,233,232)'];
const genderWiseDeathData = [
    { name: 'DRR funding of municipality', value: 10 },
    { name: 'Other DRR related funding', value: 30 },
];


const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportInventoriesReport: {
        url: ({ params }) => `${params.url}`,
        query: ({ params, props }) => {
            if (params && params.user) {
                return {
                    province: params.user.profile.province,
                    district: params.user.profile.district,
                    municipality: params.user.profile.municipality,
                    limit: params.Ward,
                    resource_type: params.inventories,
                    expand: params.fields,
                };
            }
            return { limit: params.Ward,
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
        },
    },
};

const Relief = (props: Props) => {
    const handleDataSave = () => {
        props.updateTab();
    };
    const [fetchedData, setFetechedData] = useState([]);
    const [url, setUrl] = useState('/incident/');
    const {
        requests: { PalikaReportInventoriesReport },
        provinces,
        districts,
        municipalities,
        user,
        hazardTypes,
    } = props;
    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');
    const [fields, setfields] = useState('loss');
    const [meta, setMeta] = useState(true);
    const [showRelief, setShowRelief] = useState(false);

    const [familiesBenefited, setfamiliesBenefited] = useState('');
    const [namesofBeneficiaries, setnamesofBeneficiaries] = useState('');
    const [reliefDate, setreliefDate] = useState('');
    const [reliefAmount, setreliefAmount] = useState('');
    const [currentRelief, setCurrentRelief] = useState({});

    const [incidentCount, setIncidentsCount] = useState(0);
    const [totalEstimatedLoss, setTotalEstimatedLoss] = useState(0);

    const [deathCount, setDeathCount] = useState(0);
    const [missing, setMissing] = useState(0);
    const [injured, setInjured] = useState(0);

    const [infraDestroyed, setInfraDestroyed] = useState(0);
    const [livestockDestroyed, setLivestockDestroyed] = useState(0);
    const [hazardwiseImpact, sethazardwiseImpact] = useState([]);

    const [deathGenderChartData, setdeathGenderChartData] = useState([]);

    const [maleDeath, setMaleDeath] = useState(0);
    const [femaleDeath, setFemaleDeath] = useState(0);

    const [houseAffected, setHouseAffected] = useState(0);
    const [houseDamaged, setHouseDamaged] = useState(0);

    const [wardWiseImpact, setWardWiseImpact] = useState([]);

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

    const handleReliefAdd = (data) => {
        setShowRelief(true);
        setCurrentRelief(data);
    };

    useEffect(() => {
        if (fetchedData.length > 0) {
            setIncidentsCount(fetchedData.length);

            const estimatedLoss = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.estimatedLoss)
                .filter(item => item !== undefined)
                .reduce((a, b) => a + b);
            setTotalEstimatedLoss(estimatedLoss);

            const deathTotal = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.peopleDeathCount)
                .filter(item => item !== undefined)
                .reduce((a, b) => a + b);
            setDeathCount(deathTotal);

            const missingTotal = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.peopleMissingCount)
                .filter(item => item !== undefined)
                .reduce((a, b) => a + b);
            setMissing(missingTotal);


            const injuredTotal = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.peopleInjuredCount)
                .filter(item => item !== undefined)
                .reduce((a, b) => a + b);
            setInjured(injuredTotal);


            const infra = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.infrastructureDestroyedCount)
                .filter(item => item !== undefined)
                .reduce((a, b) => a + b);
            setInfraDestroyed(infra);


            const livestock = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.livestockDestroyedCount)
                .filter(item => item !== undefined)
                .reduce((a, b) => a + b);
            setLivestockDestroyed(livestock);


            const hazards = [...new Set(fetchedData.map(item => item.hazard))]
                .filter(hazar => hazar !== undefined);

            const hazardwiseImpactData = hazards.map(item => ({
                name: hazardTypes[item].titleitem,
                'No. of Incidents': fetchedData.filter(inc => inc.hazard === item).length,
                'People Death': fetchedData.filter(inc => inc.hazard === item)
                    .map(losses => losses.loss)
                    .filter(a => a !== undefined)
                    .map(lose => lose.peopleDeathCount)
                    .filter(count => count !== undefined)
                    .reduce((a, b) => a + b),
            }));

            const deathMaleData = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.peopleDeathMaleCount)
                .filter(item => item !== undefined)
                .reduce((a, b) => a + b);

            setMaleDeath(deathMaleData);

            const deathFemaleData = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.peopleDeathFemaleCount)
                .filter(item => item !== undefined)
                .reduce((a, b) => a + b);
            setFemaleDeath(deathFemaleData);

            const houseAffectedData = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.infrastructureAffectedHouseCount)
                .filter(item => item !== undefined)
                .reduce((a, b) => a + b);
            setHouseAffected(houseAffectedData);

            const houseDamagedData = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.infrastructureDestroyedHouseCount)
                .filter(item => item !== undefined)
                .reduce((a, b) => a + b);
            setHouseDamaged(houseDamagedData);

            setdeathGenderChartData(
                [
                    { name: 'Male', value: deathMaleData },
                    { name: 'Female', value: deathFemaleData },
                ],
            );
            sethazardwiseImpact(hazardwiseImpactData);


            const wards = [...new Set(fetchedData.map(item => item.wards[0]))]
                .filter(ward => ward !== undefined);

            const wardWiseImpactData = wards.map(wardItem => fetchedData.filter(e => e.wards[0] !== undefined && e.wards[0] === wardItem)
                .map(item => item.loss)
                .filter(iitems => iitems !== undefined)
                .reduce((a, b) => ({
                    ward: wardItem,
                    Death: (a.peopledeathCount || 0) + (b.peopledeathCount || 0),
                    Injured: (a.peopleInjuredCount || 0) + (b.peopledeathCount || 0),
                    Missing: (a.peopleMissingCount || 0) + (b.peopledeathCount || 0),
                })));
            setWardWiseImpact(wardWiseImpactData);
        }
    }, [deathCount, fetchedData, hazardTypes, incidentCount, infraDestroyed, injured, livestockDestroyed, missing, totalEstimatedLoss]);


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
        url,
        inventories: defaultQueryParameter,
        fields,
        user,
        meta,

    });

    return (
        <>
            {!props.previewDetails && !props.hazardwiseImpact
         && (
             <div className={styles.tabsWardContainer}>
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
                                            <td>{currentRelief.incidentOn.split('T')[0]}</td>
                                            <td>{currentRelief.reportedOn.split('T')[0]}</td>
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
                                            <td>{currentRelief.loss ? currentRelief.loss.livestockDestroyedCount : 0}</td>
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
         )
            }

            {
                props.previewDetails
            && (
                <>
                    <div className={styles.budgetPreviewContainer}>
                        <div className={styles.lossSection}>
                            <div className={styles.lossElement}>
                                <ScalableVectorGraphics
                                    className={styles.lossIcon}
                                    src={IncidentIcon}
                                    alt="Bullet Point"
                                />

                                <ul>
                                    <p className={styles.darkerText}>{incidentCount}</p>
                                    <p className={styles.smallerText}>Incident</p>
                                </ul>
                            </div>
                            <div className={styles.lossElement}>
                                <ScalableVectorGraphics
                                    className={styles.lossIcon}
                                    src={EstimatedLossIcon}
                                    alt="Bullet Point"
                                />
                                <ul>
                                    <p className={styles.darkerText}>{`${(totalEstimatedLoss / 1000000).toFixed(2)}m`}</p>
                                    <p className={styles.smallerText}>ESTIMATED LOSS (RS)</p>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.lossSection}>
                            <div className={styles.lossElement}>
                                <ScalableVectorGraphics
                                    className={styles.lossIcon}
                                    src={DeathIcon}
                                    alt="Bullet Point"
                                />
                                <ul>
                                    <p className={styles.darkerText}>{deathCount}</p>
                                    <p className={styles.smallerText}>DEATH</p>
                                </ul>
                            </div>
                            <div className={styles.lossElement}>
                                <ScalableVectorGraphics
                                    className={styles.lossIcon}
                                    src={MissingIcon}
                                    alt="Bullet Point"
                                />
                                <ul>
                                    <p className={styles.darkerText}>{missing}</p>
                                    <p className={styles.smallerText}>MISSING</p>
                                </ul>
                            </div>
                            <div className={styles.lossElement}>
                                <ScalableVectorGraphics
                                    className={styles.lossIcon}
                                    src={InjredIcon}
                                    alt="Bullet Point"
                                />
                                <ul>
                                    <p className={styles.darkerText}>{injured}</p>
                                    <p className={styles.smallerText}>INJURED</p>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.lossSection}>
                            <div className={styles.lossElement}>
                                <ScalableVectorGraphics
                                    className={styles.lossIcon}
                                    src={InfraIcon}
                                    alt="Bullet Point"
                                />
                                <ul>
                                    <p className={styles.darkerText}>{infraDestroyed}</p>
                                    <p className={styles.smallerText}>INFRASTRUCTURE DESTROYED</p>
                                </ul>
                            </div>
                            <div className={styles.lossElement}>
                                <ScalableVectorGraphics
                                    className={styles.lossIcon}
                                    src={LivestockIcon}
                                    alt="Bullet Point"
                                />
                                <ul>
                                    <p className={styles.darkerText}>{livestockDestroyed}</p>
                                    <p className={styles.smallerText}>LIVE STOCK DESTROYED</p>
                                </ul>
                            </div>
                        </div>

                    </div>
                </>
            )}

            {
                props.hazardwiseImpact
                && (
                    <div className={styles.incidentImpactRow}>
                        <div className={styles.incidentSection}>
                            <h2>
                             Hazardwise Impact
                            </h2>
                            <BarChart
                                width={250}
                                height={200}
                                data={hazardwiseImpact.slice(0, 5)}
                                margin={{ left: 0, right: 5, top: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    fill="rgb(198,233,232)"
                                    dataKey="People Death"
                                />
                                <Bar
                                    dataKey="No. of Incidents"
                                    fill="rgb(0,173,115)"

                                />
                            </BarChart>
                        </div>

                        <div className={styles.incidentMiddleSection}>
                            <h2>
                             Genderwise Death
                            </h2>
                            <div className={styles.chartandlegend}>

                                <PieChart width={200} height={200}>
                                    <Pie
                                        data={deathGenderChartData}
                                        cx={80}
                                        cy={95}
                                        innerRadius={40}
                                        outerRadius={60}
                                        fill="#8884d8"
                                        paddingAngle={1}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={450}
                                    >
                                        {genderWiseDeathData.map((entry, index) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>

                                <div className={styles.legend}>
                                    <div className={styles.legenditem}>

                                        <div className={styles.legendColorContainer}>
                                            <div
                                                style={{ backgroundColor: COLORS[0] }}
                                                className={styles.legendColor}
                                            />
                                        </div>
                                        <div className={styles.numberRow}>
                                            <ul>
                                                <li>
                                                    <span className={styles.bigerNum}>


                                                        {
                                                            (Number(maleDeath)
                                                / (Number(maleDeath)
                                                + Number(femaleDeath))
                                                * 100).toFixed(0)
                                                        }
                                                        {
                                                            '%'
                                                        }

                                                    </span>
                                                </li>
                                                <li className={styles.light}>
                                                    <span>Male</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className={_cs(styles.legenditem, styles.bottomRow)}>
                                        <div className={styles.legendColorContainer}>
                                            <div
                                                style={{ backgroundColor: COLORS[1] }}
                                                className={styles.legendColor}
                                            />
                                        </div>

                                        <div className={styles.numberRow}>
                                            <ul>
                                                <li>
                                                    <span className={styles.bigerNum}>

                                                        {
                                                            (Number(femaleDeath)
                                                / (Number(femaleDeath)
                                                + Number(maleDeath))
                                                * 100).toFixed(0)
                                                        }
                                                        {
                                                            '%'
                                                        }
                                                    </span>
                                                </li>
                                                <li className={styles.light}>
                                                    <span>Female</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className={styles.houseData}>
                                <p>House Damaged</p>
                                <div className={styles.houseRow}>
                                    <div className={styles.houseElement}>

                                        <ScalableVectorGraphics
                                            className={styles.houseIcon}
                                            src={HouseAffIcon}
                                            alt="Bullet Point"
                                        />
                                        <ul>
                                            <span className={styles.darker}>{houseAffected}</span>
                                            <li>PARTIAL</li>
                                        </ul>

                                    </div>
                                    <div className={styles.houseElement}>

                                        <ScalableVectorGraphics
                                            className={styles.houseIcon}
                                            src={HouseDmgIcon}
                                            alt="Bullet Point"
                                        />
                                        <ul>
                                            <li><span className={styles.darker}>{houseDamaged}</span></li>
                                            <li>FULLY</li>
                                        </ul>

                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className={styles.incidentSection}>
                            <h2>
                             Wardwise Human Impact
                            </h2>
                            <BarChart
                                width={250}
                                height={250}
                                data={wardWiseImpact}
                                margin={{ left: 0, right: 5, top: 10, bottom: 20 }}

                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend wrapperStyle={{
                                    paddingTop: '5px',
                                    paddingLeft: '5px',
                                }}
                                />
                                <Bar
                                    dataKey="Death"
                                    stackId="a"
                                    fill="rgb(143,212,221)"
                                    barSize={10}

                                />
                                <Bar
                                    dataKey="Missing"
                                    stackId="a"
                                    fill="rgb(0,82,52)"
                                    barSize={10}

                                />
                                <Bar
                                    dataKey="Injured"
                                    stackId="a"
                                    fill="rgb(0,177,117)"
                                    barSize={10}
                                />
                            </BarChart>
                        </div>

                    </div>

                )


            }

        </>
    );
};


export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Relief,
        ),
    ),
);
