/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';
import Button from 'src/vendor/react-store/v2/Action/Button';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';
import Icon from '#rscg/Icon';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';


const FeedbackOne = (props) => {
    const [closeButton, setCloseButton] = useState(true);
    const [checked, setChecked] = useState(false);


    const { className, onNextClick, data,
        setData, error, setError } = props;


    const inputValidation = () => {
        setChecked(true);
        const invalidMessage = '* Please provide a valid input';
        const fieldNotSelected = '* Please select a field';
        const newerror = { ...error };
        const validNameRegex = new RegExp(/^(?![ .]+$)[a-zA-Z .]*$/);

        if (!data.technicalTroubleshoot
            && !data.overviewOfBipadPortal
            && !data.dataEntryInBipadPortal
            && !data.bipadDataUse
            && !data.bipadTechnicalSpecification
            && !data.othersSpecify
        ) {
            newerror.techSupportError = fieldNotSelected;
        } else {
            newerror.techSupportError = '';
        }

        if (data.othersSpecify) {
            if (!validNameRegex.test(data.otherTechSupport)
                || data.otherTechSupport === '') {
                newerror.otherSpecifyError = invalidMessage;
            } else {
                newerror.otherSpecifyError = '';
            }
        }
        if (!data.othersSpecify) {
            setData({ ...data, otherTechSupport: '' });
            newerror.otherSpecifyError = '';
        }

        if (!data.institutionType) {
            newerror.institutionError = fieldNotSelected;
        } else {
            newerror.institutionError = '';
        }

        if (!data.priorityLevel) {
            newerror.priorityLevelError = fieldNotSelected;
        } else {
            newerror.priorityLevelError = '';
        }
        setError(newerror);
    };

    useEffect(() => {
        if (error) {
            setChecked(false);
        }
    }, [error]);

    useEffect(() => {
        if (checked) {
            if (data.institutionType
                && data.priorityLevel
                && !error.institutionError
                && !error.techSupportError
                && !error.priorityLevelError
                && !error.otherSpecifyError) {
                onNextClick();
            }
        }
    }, [data, error, checked]);


    return (
        <>
            {
                closeButton ? (
                    <Modal className={_cs(styles.loginModal, className)} closeOnOutsideClick>
                        <ModalBody className={styles.content}>
                            <DangerButton
                                transparent
                                iconName="close"
                                onClick={() => setCloseButton(false)}
                                title="Close Modal"
                                className={styles.closeButton}
                            />
                            <div className={styles.container_tech_support}>
                                <div className={styles.wrapper_tech_support}>
                                    <div className={styles.feedback_container_first}>
                                        <div className={styles.feedback_wrapper}>
                                            <div className={styles.feed_head_container}>
                                                <h1 className={styles.feed_head_wrapper}>Leave Feedback</h1>
                                            </div>
                                            <p className={styles.feedback_intro}>
                                                To send feedback/comments for the improvement of the BIPAD portal
                                            </p>
                                            <div className={styles.feedback_button}>
                                                <Button className={styles.feed_btn} onClick={() => navigate('/feedback/')}>
                                                    FEEDBACK FORM
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.feedback_container_second}>
                                        <div className={styles.feedback_input_wrapper}>
                                            <h1 className={styles.feedback_input_head}>
                                                Please provide the following details
                                            </h1>

                                            <div className={styles.feedback_institution}>
                                                <h3 className={styles.institution_head}>INSTITUTION TYPE</h3>
                                                <div className={styles.institution_select_wrapper}>
                                                    <select
                                                        name="institution_type"
                                                        id="institution"
                                                        className={styles.institution_select}
                                                        value={data.institutionType}
                                                        onChange={e => setData({ ...data, institutionType: e.target.value })}
                                                    >
                                                        <option value="" disabled>Select Institution Type</option>
                                                        <option value="Government Institution">Government Institution</option>
                                                        <option value="Private Institution">Private Institution</option>
                                                        <option value="Academic Sector">Academic Sector</option>
                                                        <option value="I/NGOs">I/NGOs</option>
                                                        <option value="UN Agency">UN Agency</option>
                                                        <option value="Others (Specify)">Others (Specify)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {
                                                error.institutionError
                                                    ? <div className={styles.error_text}>{error.institutionError}</div>
                                                    : null
                                            }
                                            <div className={styles.feedback_support_category}>
                                                <h3 className={styles.tech_support_head}>
                                                    What technical support would you like to request from BIPAD
                                                    Team?
                                                </h3>
                                                <div className={styles.checkbox_tech_support}>

                                                    <div className={styles.checkbox_wrapper_top}>
                                                        <input
                                                            type="checkbox"
                                                            id="technical"
                                                            name="Technical Troubleshoot"
                                                            checked={data.technicalTroubleshoot}
                                                            className={styles.class_checkbox}
                                                            onChange={e => setData({ ...data, technicalTroubleshoot: e.target.checked })}
                                                        />
                                                        <label htmlFor="technical" className={styles.label_technical}>
                                                            Technical Troubleshoot
                                                        </label>
                                                    </div>
                                                    <div className={styles.checkbox_wrapper}>
                                                        <input
                                                            type="checkbox"
                                                            id="overview"
                                                            name="Overview of BIPAD Portal"
                                                            className={styles.class_checkbox}
                                                            checked={data.overviewOfBipadPortal}
                                                            onChange={e => setData({ ...data, overviewOfBipadPortal: e.target.checked })}
                                                        />
                                                        <label htmlFor="overview" className={styles.label_technical}>
                                                            Overview of BIPAD Portal
                                                        </label>
                                                    </div>
                                                    <div className={styles.checkbox_wrapper}>
                                                        <input
                                                            type="checkbox"
                                                            id="data-entry"
                                                            name="Data Entry in BIPAD Portal"
                                                            checked={data.dataEntryInBipadPortal}
                                                            className={styles.class_checkbox}
                                                            onChange={e => setData({ ...data, dataEntryInBipadPortal: e.target.checked })}
                                                        />
                                                        <label
                                                            htmlFor="data-entry"
                                                            className={styles.label_technical}
                                                        >
                                                            Data Entry in BIPAD Portal
                                                        </label>
                                                    </div>
                                                    <div className={styles.checkbox_wrapper}>
                                                        <input
                                                            type="checkbox"
                                                            id="bipad-data-use"
                                                            name="BIPAD Data Use"
                                                            checked={data.bipadDataUse}
                                                            onChange={e => setData({ ...data, bipadDataUse: e.target.checked })}
                                                            className={styles.class_checkbox}

                                                        />
                                                        <label
                                                            htmlFor="bipad-data-use"
                                                            className={styles.label_technical}
                                                        >
                                                            BIPAD Data Use
                                                        </label>
                                                    </div>
                                                    <div className={styles.checkbox_wrapper}>
                                                        <input
                                                            type="checkbox"
                                                            id="bipad-technical-specification"
                                                            name="BIPAD's Technical Specification"
                                                            checked={data.bipadTechnicalSpecification}
                                                            className={styles.class_checkbox}
                                                            onChange={e => setData({ ...data, bipadTechnicalSpecification: e.target.checked })}
                                                        />
                                                        <label
                                                            htmlFor="bipad-technical-specification"
                                                            className={styles.label_technical}
                                                        >
                                                            BIPAD's Technical Specification
                                                        </label>
                                                    </div>
                                                    <div className={styles.checkbox_wrapper}>
                                                        <input
                                                            type="checkbox"
                                                            id="others-specify"
                                                            name="Others (Specify)"
                                                            checked={data.othersSpecify}
                                                            className={styles.class_checkbox}
                                                            onChange={e => setData({ ...data, othersSpecify: e.target.checked })}
                                                        />
                                                        <label
                                                            htmlFor="others-specify"
                                                            className={styles.label_technical}
                                                        >
                                                            Others (Specify)
                                                        </label>
                                                    </div>

                                                </div>
                                            </div>

                                            {
                                                data.othersSpecify
                                                    ? (
                                                        <div className={styles.specify_input}>
                                                            <input
                                                                type="text"
                                                                className={styles.please_specify}
                                                                placeholder="Please Specify"
                                                                name="other_tech_support"
                                                                value={data.otherTechSupport}
                                                                onChange={e => setData({
                                                                    ...data,
                                                                    otherTechSupport: e.target.value,
                                                                })}

                                                            />
                                                        </div>
                                                    )
                                                    : null
                                            }

                                            {
                                                error.otherSpecifyError
                                                    ? (
                                                        <div className={styles.error_text}>
                                                            {error.otherSpecifyError}
                                                        </div>
                                                    )
                                                    : null
                                            }

                                            {
                                                error.techSupportError
                                                    ? (
                                                        <div className={styles.error_text}>
                                                            {error.techSupportError}
                                                        </div>
                                                    )
                                                    : null

                                            }
                                            <div className={styles.priority_level}>
                                                <h3 className={styles.priority_level_head}>PRIORITY LEVEl</h3>
                                                <div className={styles.priority_level_select}>
                                                    <select
                                                        name="priority_level"
                                                        id="priority"
                                                        className={styles.priority_select}
                                                        value={data.priorityLevel}
                                                        onChange={e => setData({ ...data, priorityLevel: e.target.value })}
                                                    >
                                                        <option value="" disabled>Select Priority Level</option>
                                                        <option value="Very High">Very High</option>
                                                        <option value="High">High</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="Low">Low</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {
                                                error.priorityLevelError
                                                    ? <div className={styles.error_text}>{error.priorityLevelError}</div>
                                                    : null
                                            }
                                            <div className={
                                                error.priorityLevelError
                                                    ? styles.next_button_on_error
                                                    : styles.next_button
                                            }
                                            >
                                                <Button
                                                    className={styles.nxt_btn}
                                                    onClick={inputValidation}
                                                >
                                                    NEXT
                                                </Button>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                ) : navigate('/')
            }

        </>
    );
};
export default FeedbackOne;
