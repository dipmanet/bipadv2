/* eslint-disable max-len */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState } from 'react';
import { navigate } from '@reach/router';
import Button from 'src/vendor/react-store/v2/Action/Button';
import Page from '#components/Page';
import styles from './styles.scss';

const FeedbackOne = () => {
    const [data, setdata] = useState({
        institutionType: '',
        specify: '',
        priorityLevel: '',
    });

    const [checkbox, setcheckbox] = useState({
        TechnicalTroubleshoot: false,
        OverviewOfBIPADPortal: false,
        DataEntryinBIPADPortal: false,
        BIPADDataUse: false,
        BIPADsTechnicalSpecification: false,
        OthersSpecify: false,
    });

    const formHandler = (e: any) => {
        setdata({
            ...data,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <>
            <Page
                hideFilter
                hideMap
            />
            <div className={styles.mainDiv}>
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
                                    <Button className={styles.feed_btn} onClick={() => navigate('/feedback-support/')}>
                                        FEEDBACK FORM
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.feedback_container_second}>
                            {/* <div className={styles.cross_button}>
            <button className={styles.cross_btn}>
              <i className="fas fa-times fa-3x"></i>
            </button>
          </div> */}
                            <div className={styles.feedback_input_wrapper}>
                                <h1 className={styles.feedback_input_head}>
                                    Please provide the following details
                                </h1>

                                <div className={styles.feedback_institution}>
                                    <h3 className={styles.institution_head}>INSTITUTION TYPE</h3>
                                    <div className={styles.institution_select_wrapper}>
                                        <select
                                            name="institutionType"
                                            id="institution"
                                            className={styles.institution_select}
                                            value={data.institutionType}
                                            onChange={formHandler}
                                        >
                                            <option value="Government Institution">Government Institution</option>
                                            <option value="Private Institution">Private Institution</option>
                                            <option value="Academic Sector">Academic Sector</option>
                                            <option value="I/NGOs">I/NGOs</option>
                                            <option value="UN Agency">UN Agency</option>
                                            <option value="Others (Specify)">Others (Specify)</option>
                                        </select>
                                    </div>
                                </div>
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
                                                name="technical"

                                                className={styles.class_checkbox}
                                                onChange={(e: any) => setcheckbox({ ...checkbox, TechnicalTroubleshoot: e.target.checked })}
                                            />
                                            <label htmlFor="technical" className={styles.label_technical}>
                                                Technical Troubleshoot
                                            </label>
                                        </div>
                                        <div className={styles.checkbox_wrapper}>
                                            <input
                                                type="checkbox"
                                                id="overview"
                                                name="overview"

                                                className={styles.class_checkbox}
                                                onChange={(e: any) => setcheckbox({ ...checkbox, OverviewOfBIPADPortal: e.target.checked })}
                                            />
                                            <label htmlFor="overview" className={styles.label_technical}>
                                                Overview of BIPAD Portal
                                            </label>
                                        </div>
                                        <div className={styles.checkbox_wrapper}>
                                            <input
                                                type="checkbox"
                                                id="data-entry"
                                                name="data-entry"

                                                className={styles.class_checkbox}
                                                onChange={(e: any) => setcheckbox({ ...checkbox, DataEntryinBIPADPortal: e.target.checked })}
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
                                                name="bipad-data-use"

                                                className={styles.class_checkbox}
                                                onChange={(e: any) => setcheckbox({ ...checkbox, BIPADDataUse: e.target.checked })}
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
                                                name="bipad-technical-specification"

                                                className={styles.class_checkbox}
                                                onChange={(e: any) => setcheckbox({ ...checkbox, BIPADsTechnicalSpecification: e.target.checked })}
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
                                                name="others-specify"
                                                className={styles.class_checkbox}
                                                onChange={(e: any) => setcheckbox({ ...checkbox, OthersSpecify: e.target.checked })}
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
                                <div className={styles.specify_input}>
                                    <input
                                        type="text"
                                        className={styles.please_specify}
                                        placeholder="Please Specify"
                                        name="specify"
                                        value={data.specify}
                                        onChange={formHandler}
                                    />
                                </div>
                                <div className={styles.priority_level}>
                                    <h3 className={styles.priority_level_head}>PRIORITY LEVEl</h3>
                                    <div className={styles.priority_level_select}>
                                        <select
                                            name="priorityLevel"
                                            id="priority"
                                            className={styles.priority_select}
                                            value={data.priorityLevel}
                                            onChange={formHandler}
                                        >
                                            <option value="Very High">Very High</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.next_button}>
                                <Button
                                    className={styles.nxt_btn}
                                    onClick={() => {
                                        console.log(data);
                                        console.log(checkbox);
                                        navigate('/feedback-2/');
                                    }}
                                >
                                    NEXT
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default FeedbackOne;
