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
import { districtsSelector } from '#selectors';
import styles from './styles.scss';

interface Props {

}
const mapStateToProps = (state: AppState): PropsFromAppState => ({
    districts: districtsSelector(state),
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
        if (hazardWiseLossData) {
            const temp = {};
            Object.keys(hazardWiseLossData).map((item) => {
                temp[item] = {
                    district: '',
                    description: '',
                    deaths: hazardWiseLossData[item].deaths || 0,
                    missing: hazardWiseLossData[item].missing || 0,
                    injured: hazardWiseLossData[item].injured || 0,
                    response: '',
                };
                return null;
            });
            if (temp && Object.keys(temp).length > 0) {
                handleFeedbackChange({ ...temp });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hazardWiseLossData]);
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
                                        घटना
                                        </th>
                                        <th>
                                        जिल्ला
                                        </th>
                                        <th>
                                        घटना विवरण
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
                                        प्रतिकार्य
                                        </th>
                                    </tr>
                                    {
                                        feedback && Object.keys(feedback).map((hwL, i) => (
                                            <tr>
                                                <td>
                                                    {hwL}
                                                </td>
                                                <td>
                                                    {feedback[hwL].district}
                                                </td>

                                                <td>
                                                    {typeof feedback[hwL].deaths === 'number' ? feedback[hwL].deaths : '-'}
                                                </td>
                                                <td>
                                                    {typeof feedback[hwL].missing === 'number'
                                                        ? feedback[hwL].missing : '-'}
                                                </td>
                                                <td>
                                                    {typeof feedback[hwL].injured === 'number'
                                                        ? feedback[hwL].injured : '-'}
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
                                                                    // <FormControl fullWidth>
                                                                    //     <InputLabel>
                                                                    //         {'प्रतिकार्य'}
                                                                    //     </InputLabel>
                                                                    //     <Input
                                                                    //         type="text"
                                                                    //         value={feedback[hwL].response || ''}
                                                                    //         onChange={e => handleSubFieldChange(e.target.value, hwL, 'response')}
                                                                    //         rows={5}
                                                                    //         className={styles.select}
                                                                    //         disableUnderline
                                                                    //         inputProps={{
                                                                    //             disableUnderline: true,
                                                                    //         }}
                                                                    //         style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                                                    //     />
                                                                    // </FormControl>
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
                {/* {
                    !annex && feedback && Object.keys(feedback).length > 0
                    && (
                        <>
                            {Object.keys(feedback).map(f => (
                                <div className={styles.formSubContainer}>
                                    <div className={styles.formItemHalf}>
                                        <FormControl fullWidth>
                                            <InputLabel>
                                                {'घटना'}
                                            </InputLabel>
                                            <Input
                                                type="text"
                                                value={f || '--'}
                                                // onChange={e => handleRemarksChange(e.target.value, 'hazard')}
                                                disabled
                                                rows={5}
                                                className={styles.select}
                                                disableUnderline
                                                inputProps={{
                                                    disableUnderline: true,
                                                }}
                                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className={styles.formItemHalf}>
                                        <FormControl fullWidth>
                                            <InputLabel>
                                                {'जिल्ला'}
                                            </InputLabel>
                                            <Select
                                                labelId="hazardLabel"
                                                id="hazardInput"
                                                value={feedback[f].district || null}
                                                label="Add New Hazard Field"
                                                onChange={e => handleSubFieldChange(e.target.value, f, 'district')}
                                                style={{ borderRadius: '3px', padding: '0 10px' }}
                                                disableUnderline
                                            >
                                                <MenuItem value={null}>--</MenuItem>
                                                {
                                                    districts
                                        && districts.map(hT => (<MenuItem value={hT.title}>{hT.title}</MenuItem>))
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className={styles.formItem}>
                                        <FormControl fullWidth>
                                            <InputLabel>
                                                {'घटना विवरण'}
                                            </InputLabel>
                                            <Input
                                                type="text"
                                                value={feedback[f].description || ''}
                                                onChange={e => handleSubFieldChange(e.target.value, f, 'description')}
                                                rows={5}
                                                className={styles.select}
                                                disableUnderline
                                                inputProps={{
                                                    disableUnderline: true,
                                                }}
                                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className={styles.formItemThird}>
                                        <FormControl fullWidth>
                                            <InputLabel>
                                                {'म्रितक'}
                                            </InputLabel>
                                            <Input
                                                type="text"
                                                value={feedback[f].deaths || ''}
                                                onChange={e => handleSubFieldChange(e.target.value, f, 'deaths')}
                                                rows={5}
                                                className={styles.select}
                                                disableUnderline
                                                inputProps={{
                                                    disableUnderline: true,
                                                }}
                                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className={styles.formItemThird}>
                                        <FormControl fullWidth>
                                            <InputLabel>
                                                {'घाइते'}
                                            </InputLabel>
                                            <Input
                                                type="text"
                                                value={feedback[f].injured || ''}
                                                onChange={e => handleSubFieldChange(e.target.value, f, 'injured')}
                                                rows={5}
                                                className={styles.select}
                                                disableUnderline
                                                inputProps={{
                                                    disableUnderline: true,
                                                }}
                                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className={styles.formItemThird}>
                                        <FormControl fullWidth>
                                            <InputLabel>
                                                {'बेपता'}
                                            </InputLabel>
                                            <Input
                                                type="text"
                                                value={feedback[f].missing || ''}
                                                onChange={e => handleSubFieldChange(e.target.value, f, 'missing')}
                                                rows={5}
                                                className={styles.select}
                                                disableUnderline
                                                inputProps={{
                                                    disableUnderline: true,
                                                }}
                                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                            />
                                        </FormControl>
                                    </div>

                                    <div className={styles.formItem}>
                                        <FormControl fullWidth>
                                            <InputLabel>
                                                {'प्रतिकार्य'}
                                            </InputLabel>
                                            <Input
                                                type="text"
                                                value={feedback[f].response || ''}
                                                onChange={e => handleSubFieldChange(e.target.value, f, 'response')}
                                                rows={5}
                                                className={styles.select}
                                                disableUnderline
                                                inputProps={{
                                                    disableUnderline: true,
                                                }}
                                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                            ))}

                        </>
                    )} */}
                {/* <div className={styles.formSubContainer}>
                    <div className={styles.formItemHalf}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {'घटना'}
                            </InputLabel>
                            <Input
                                type="text"
                                value={remarks ? remarks.hazard : '--'}
                                onChange={e => handleRemarksChange(e.target.value, 'hazard')}
                                rows={5}
                                className={styles.select}
                                disableUnderline
                                inputProps={{
                                    disableUnderline: true,
                                }}
                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                            />
                        </FormControl>
                    </div>
                    <div className={styles.formItemHalf}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {'जिल्ला'}
                            </InputLabel>
                            <Select
                                labelId="hazardLabel"
                                id="hazardInput"
                                value={remarks ? remarks.district : null}
                                label="Add New Hazard Field"
                                onChange={e => handleRemarksChange(e.target.value, 'district')}
                                style={{ borderRadius: '3px', padding: '0 10px' }}
                                disableUnderline
                            >
                                <MenuItem value={null}>--</MenuItem>
                                {
                                    districts
                            && districts.map(hT => (<MenuItem value={hT.title}>{hT.title}</MenuItem>))
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.formItem}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {'घटना विवरण'}
                            </InputLabel>
                            <Input
                                type="text"
                                value={remarks ? remarks.description : ''}
                                onChange={e => handleRemarksChange(e.target.value, 'description')}
                                rows={5}
                                className={styles.select}
                                disableUnderline
                                inputProps={{
                                    disableUnderline: true,
                                }}
                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                            />
                        </FormControl>
                    </div>
                    <div className={styles.formItemHalf}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {'म्रितक'}
                            </InputLabel>
                            <Input
                                type="text"
                                value={remarks ? remarks.deaths : ''}
                                onChange={e => handleRemarksChange(e.target.value, 'deaths')}
                                rows={5}
                                className={styles.select}
                                disableUnderline
                                inputProps={{
                                    disableUnderline: true,
                                }}
                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                            />
                        </FormControl>
                    </div>
                    <div className={styles.formItemHalf}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {'घाइते'}
                            </InputLabel>
                            <Input
                                type="text"
                                value={remarks ? remarks.injured : ''}
                                onChange={e => handleRemarksChange(e.target.value, 'injured')}
                                rows={5}
                                className={styles.select}
                                disableUnderline
                                inputProps={{
                                    disableUnderline: true,
                                }}
                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                            />
                        </FormControl>
                    </div>

                    <div className={styles.formItem}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {'प्रतिकार्य'}
                            </InputLabel>
                            <Input
                                type="text"
                                value={remarks ? remarks.response : ''}
                                onChange={e => handleRemarksChange(e.target.value, 'response')}
                                rows={5}
                                className={styles.select}
                                disableUnderline
                                inputProps={{
                                    disableUnderline: true,
                                }}
                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                            />
                        </FormControl>
                    </div>
                    <div className={styles.btnContainer}>
                        <button
                            onClick={handleFeedback}
                            type="button"
                        >
                            + थप्नुहोस्
                        </button>
                    </div>
                </div> */}
            </div>
        </>


    );
};

export default connect(mapStateToProps)(Response);
