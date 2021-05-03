/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
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
    userSelector } from '#selectors';
import NextPrevBtns from '../../NextPrevBtns';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';

import IncidentIcon from '../../Icons/incident.svg';
import EstimatedLossIcon from '../../Icons/loss.svg';
import DeathIcon from '../../Icons/death.svg';
import MissingIcon from '../../Icons/missing.svg';
import InjredIcon from '../../Icons/injured.svg';
import InfraIcon from '../../Icons/infrastructure.svg';
import LivestockIcon from '../../Icons/livestock.svg';

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
        }
    }, [deathCount, fetchedData, incidentCount, infraDestroyed, injured, livestockDestroyed, missing, totalEstimatedLoss]);
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
            {!props.previewDetails
         && (
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
            )}


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
