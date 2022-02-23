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
import { districtsSelector, incidentListSelectorIP, hazardTypesSelector } from '#selectors';
import styles from './styles.scss';

interface Props {

}
const mapStateToProps = (state: AppState): PropsFromAppState => ({
    districts: districtsSelector(state),
    incidentList: incidentListSelectorIP(state),
    hazardTypes: hazardTypesSelector(state),


});
const Response = (props: Props) => {
    const {
        handleFeedbackChange,
        deleteFeedbackChange,
        feedback,
        hazardWiseLossData,
        districts,
        handleSubFieldChange,
        annex,
        incidentList,
        hazardTypes,
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

    const handleRemarksChange = (e, field) => {
        setRemarks({ ...remarks, [field]: e });
    };

    useEffect(() => {
        console.log('feedback', feedback);
    }, [feedback]);

    const handleFeedback = () => {
        if (remarks) {
            handleFeedbackChange(remarks);
        }
        setRemarks(null);
    };

    useEffect(() => {
        if (incidentList && incidentList.length > 0 && hazardTypes && Object.keys(hazardTypes).length > 0) {
            const temp = {};
            incidentList.map((item) => {
                const hazard = hazardTypes[item.hazard].titleNe;
                temp[item.id] = {
                    hazard,
                    district: item.wards[0] && item.wards[0].municipality.district.titleNe,
                    description: '',
                    deaths: item.loss.peopleDeathCount || 0,
                    missing: item.loss.peopleMissingCount || 0,
                    injured: item.loss.peopleInjuredCount || 0,
                    response: '',
                };
                return null;
            });
            if (temp && Object.keys(temp).length > 0) {
                handleFeedbackChange({ ...temp });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [incidentList, hazardTypes]);
    return (
        <>
            <div className={annex ? styles.formContainerAnnex : styles.formContainer}>
                {
                    !annex
                    && <h2>प्रतिकार्य</h2>
                }
                {
                    <div className={styles.pratikriyas}>
                        {
                            feedback && Object.keys(feedback).length > 0

                            && (
                                <table className={styles.responseTable}>
                                    <tr>
                                        <th>
                                        S.N
                                        </th>
                                        <th>
                                        घटना
                                        </th>
                                        <th>
                                        जिल्ला
                                        </th>
                                        <th>
                                        म्रितक
                                        </th>
                                        <th>
                                        बेपता
                                        </th>
                                        <th>
                                        घाइते
                                        </th>
                                        <th>
                                        घटना विवरण
                                        </th>
                                        <th>
                                        प्रतिकार्य
                                        </th>
                                    </tr>
                                    {
                                        feedback && Object.keys(feedback).map((hwL, i) => (
                                            <tr>
                                                <td>
                                                    {i + 1}
                                                </td>
                                                <td>
                                                    {feedback[hwL].hazard}
                                                </td>
                                                <td>
                                                    {feedback[hwL].district}
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
                                                                        <textarea
                                                                            placeholder="घटना विवरण"
                                                                            onChange={e => handleSubFieldChange(e.target.value, hwL, 'description')}
                                                                            value={feedback[hwL].description || ''}
                                                                            rows={5}
                                                                        />
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
                                                                        <textarea
                                                                            placeholder="प्रतिकार्य"
                                                                            onChange={e => handleSubFieldChange(e.target.value, hwL, 'response')}
                                                                            value={feedback[hwL].response || ''}
                                                                            rows={5}
                                                                        />
                                                                    </div>
                                                                )
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </table>
                            )
                        }
                    </div>
                }
            </div>
        </>


    );
};

export default connect(mapStateToProps)(Response);
