/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Translation } from 'react-i18next';
import { _cs } from '@togglecorp/fujs';
import { setBulletinFeedbackAction, setBulletinCumulativeAction } from '#actionCreators';
import { districtsSelector, bulletinPageSelector, bulletinEditDataSelector, incidentListSelectorIP, hazardTypesSelector, languageSelector } from '#selectors';
import styles from './styles.scss';

interface Props {

}
const mapStateToProps = (state: AppState): PropsFromAppState => ({
    districts: districtsSelector(state),
    incidentList: incidentListSelectorIP(state),
    hazardTypes: hazardTypesSelector(state),
    language: languageSelector(state),
    bulletinEditData: bulletinEditDataSelector(state),
    bulletinData: bulletinPageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setBulletinFeedback: params => dispatch(setBulletinFeedbackAction(params)),
    setCumulativeRedux: params => dispatch(setBulletinCumulativeAction(params)),
});

const Response = (props: Props) => {
    const {
        handleFeedbackChange,
        deleteFeedbackChange,
        // feedback,
        hazardWiseLossData,
        districts,
        handleSubFieldChange,
        annex,
        incidentList,
        hazardTypes,
        language: { language },
        setBulletinFeedback,
        bulletinEditData,
        bulletinData: {
            feedback,
        },
        setCumulativeRedux,
    } = props;


    const [remarks, setRemarks] = useState({
        hazard: '',
        district: '',
        description: '',
        deaths: 0,
        missing: 0,
        injured: 0,
        response: '',
    });

    const [cumulative, setCumulative] = useState();

    const handleRemarksChange = (e, field) => {
        setRemarks({ ...remarks, [field]: e });
    };


    const handleFeedback = () => {
        if (remarks) {
            handleFeedbackChange(remarks);
        }
        setRemarks(null);
    };

    const getHazard = (h) => {
        const filtered = Object.values(hazardTypes).filter(item => item.titleNe === h || item.titleEn === h);
        if (filtered.length > 0 && language === 'np') {
            return filtered[0].titleNe;
        }
        if (filtered.length > 0 && language === 'en') {
            return filtered[0].title;
        }
        return '-';
    };

    const getDistrict = (d) => {
        const filtered = districts.filter(item => item.title_ne === d || item.title_en === d);
        if (filtered.length > 0 && language === 'np') {
            return filtered[0].title_ne;
        }
        if (filtered.length > 0 && language === 'en') {
            return filtered[0].title_en;
        }
        return '-';
    };


    useEffect(() => {
        if (bulletinEditData && Object.keys(bulletinEditData).length > 0) {
            console.log('doing nth');
            // nothing needs to be done here
            // if (bulletinEditData.language === 'nepali') {
            //     handleFeedbackChange(bulletinEditData.feedbackNe);
            // } else {
            //     handleFeedbackChange(bulletinEditData.feedback);
            // }
        } else if (incidentList && incidentList.length > 0 && hazardTypes && Object.keys(hazardTypes).length > 0) {
            const temp = {};
            incidentList.map((item) => {
                const hazardNp = hazardTypes[item.hazard].titleNe;
                const hazardEn = hazardTypes[item.hazard].title;
                temp[item.id] = {
                    hazardNp,
                    hazardEn,
                    hazard: hazardNp,
                    district: language === 'np' ? item.wards[0] && item.wards[0].municipality.district.titleNe : item.wards[0] && item.wards[0].municipality.district.title,
                    description: '',
                    deaths: item.loss.peopleDeathCount || 0,
                    missing: item.loss.peopleMissingCount || 0,
                    injured: item.loss.peopleInjuredCount || 0,
                    response: '',
                };
                return null;
            });

            console.log('temp', temp);
            if (temp && Object.keys(temp).length > 0) {
                handleFeedbackChange({ ...temp });
                setBulletinFeedback({ feedback: { ...feedback, ...temp } });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [incidentList, hazardTypes, language]);


    // part is just to add in the end of the table
    useEffect(() => {
        if (!annex && feedback && Object.keys(feedback).length > 0) {
            const getIncidents = () => Object.keys(feedback).length;
            const getDistricts = () => {
                const aD = Object.keys(feedback)
                    .map(item => feedback[item].district);
                return [...new Set(aD)].length;
            };
            const cumulativeData = Object.keys(feedback)
                .map(item => feedback[item])
                .reduce((acc, cur) => ({
                    deaths: Number(acc.deaths) + Number(cur.deaths || 0),
                    missing: Number(acc.missing) + Number(cur.missing || 0),
                    injured: Number(acc.injured) + Number(cur.injured || 0),
                }), { deaths: 0, missing: 0, injured: 0 });
            const other = {
                district: getDistricts(),
                incidents: getIncidents(),
            };
            setCumulative({ ...cumulativeData, ...other });
            setCumulativeRedux({ cumulative: { ...cumulativeData, ...other } });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [annex, feedback]);

    useEffect(() => {
        console.log('changing feedback and in response', feedback, cumulative);
    }, [cumulative, feedback]);

    return (
        <>
            <div className={_cs(
                (annex ? styles.formContainerAnnex : styles.formContainer),
                (language === 'np' ? styles.formContainerNepali : styles.formContainerEnglish),
            )
            }
            >
                {
                    !annex
                    && (
                        <h2>
                            <Translation>
                                {
                                    t => <span>{t('Response')}</span>
                                }
                            </Translation>

                        </h2>
                    )
                }
                {
                    <div className={styles.pratikriyas}>
                        {
                            cumulative && Object.keys(cumulative).length > 0 && feedback && Object.keys(feedback).length > 0

                            && (
                                <table className={styles.responseTable}>
                                    <tr>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('S.N')}</span>
                                                }
                                            </Translation>
                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('Incidents')}</span>
                                                }
                                            </Translation>

                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('District')}</span>
                                                }
                                            </Translation>

                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('death')}</span>
                                                }
                                            </Translation>

                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('missing')}</span>
                                                }
                                            </Translation>

                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('injured')}</span>
                                                }
                                            </Translation>

                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('Incident Details')}</span>
                                                }
                                            </Translation>

                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('Response')}</span>
                                                }
                                            </Translation>

                                        </th>
                                    </tr>
                                    {
                                        feedback && Object.keys(feedback).map((hwL, i) => (
                                            <tr>
                                                <td>
                                                    {i + 1}
                                                </td>
                                                <td>
                                                    {getHazard(feedback[hwL].hazard) }
                                                </td>
                                                <td>
                                                    {getDistrict(feedback[hwL].district)}
                                                </td>

                                                <td>
                                                    {
                                                        feedback[hwL].deaths
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        feedback[hwL].missing
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        feedback[hwL].injured
                                                    }
                                                </td>
                                                <td>
                                                    <div className={styles.formItemHalf}>
                                                        {
                                                            annex
                                                                ? feedback[hwL].description || ''
                                                                : (
                                                                    <div className={styles.inputContainer}>
                                                                        <Translation>
                                                                            {
                                                                                t => (
                                                                                    <textarea
                                                                                        placeholder={t('Incident Details')}
                                                                                        onChange={e => handleSubFieldChange(e.target.value, hwL, 'description')}
                                                                                        value={feedback[hwL].description || ''}
                                                                                        rows={5}
                                                                                    />
                                                                                )
                                                                            }
                                                                        </Translation>

                                                                    </div>
                                                                )
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={styles.formItemHalf}>
                                                        {
                                                            annex
                                                                ? feedback[hwL].response || ''
                                                                : (
                                                                    <div className={styles.inputContainer}>
                                                                        <Translation>
                                                                            {
                                                                                t => (
                                                                                    <textarea
                                                                                        placeholder={t('Response')}
                                                                                        onChange={e => handleSubFieldChange(e.target.value, hwL, 'response')}
                                                                                        value={feedback[hwL].response || ''}
                                                                                        rows={5}
                                                                                    />
                                                                                )

                                                                            }
                                                                        </Translation>


                                                                    </div>
                                                                )
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    <tr className={styles.lastRow}>
                                        <td>
                                            <Translation>
                                                {
                                                    t => <span>{t('Total')}</span>
                                                }
                                            </Translation>

                                        </td>
                                        <td>{cumulative.incidents}</td>
                                        <td>{cumulative.district}</td>
                                        <td>{cumulative.deaths}</td>
                                        <td>{cumulative.missing}</td>
                                        <td>{cumulative.injured}</td>
                                        <td>{' '}</td>
                                        <td>{' '}</td>
                                    </tr>
                                </table>
                            )
                        }
                    </div>
                }
            </div>
        </>


    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Response);
