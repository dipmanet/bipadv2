/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { navigate } from '@reach/router';
import Button from 'src/vendor/react-store/v2/Action/Button';
import Page from '#components/Page';
import styles from './styles.scss';


const FeedbackThree = () => {
    const [checked, setChecked] = useState(false);
    const [data, setdata] = useState({
        fullName: '',
        designation: '',
        institutionName: '',
        phoneNumber: '',
        email: '',
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
                                    <div className={styles.feed_head_wrapper}>Leave Feedback</div>
                                </div>
                                <div className={styles.feedback_intro}>
                                    To send feedback/comments for the improvement of the BIPAD portal
                                </div>
                                <div className={styles.feedback_button}>
                                    <Button className={styles.feed_btn}>FEEDBACK FORM</Button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.feedback_container_second}>
                            {/* <div className={styles.cross_button}>
                    <Button className={styles.cross_btn}>
                        <i className="fas fa-times fa-3x" />
                    </Button>
                </div> */}
                            <div className={styles.tech_support_wrapper}>
                                <div className={styles.tech_support_head}>
                                    Please provide the following details
                                </div>
                                <div className={styles.tech_support_input}>
                                    <div className={styles.input_name}>
                                        <input
                                            name="fullName"
                                            type="text"
                                            className={styles.fname}
                                            placeholder="Full Name"
                                            value={data.fullName}
                                            onChange={formHandler}
                                        />
                                    </div>
                                    <div className={styles.input_designation}>
                                        <input
                                            name="designation"
                                            type="text"
                                            className={styles.designation}
                                            placeholder="Designation (eg. IT Officer)"
                                            value={data.designation}
                                            onChange={formHandler}
                                        />
                                    </div>
                                    <div className={styles.input_institute_name}>
                                        <input
                                            name="institutionName"
                                            type="text"
                                            className={styles.insname}
                                            placeholder="Name of the Institution"
                                            value={data.institutionName}
                                            onChange={formHandler}
                                        />
                                    </div>
                                    <div className={styles.input_number_container}>
                                        <div className={styles.country_code}>+977</div>
                                        <div className={styles.phone_number}>
                                            <label htmlFor="phone-no" className={styles.phone_number_text}>Phone No</label>
                                            <input
                                                name="phoneNumber"
                                                type="tel"
                                                className={styles.phone_no}
                                                id="phone-no"
                                                value={data.phoneNumber}
                                                onChange={formHandler}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.input_email}>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Official Email"
                                            className={styles.email}
                                            value={data.email}
                                            onChange={formHandler}
                                        />
                                    </div>
                                </div>

                                <div className={styles.checkbox_items}>
                                    <input
                                        type="checkbox"
                                        id="verify"
                                        className={styles.verify}
                                        name="verify"
                                        onChange={(e: any) => setChecked(e.target.checked)}
                                    />
                                    <label htmlFor="verify" className={styles.verify_text}>
                                        I hereby give my consent to store my personal details in BIPAD
                                        portal.
                                    </label>
                                </div>
                            </div>

                            <div className={styles.back_submit_button}>
                                <Button className={styles.back_btn} onClick={() => navigate('/feedback-2/')}>
                                    back
                                </Button>
                                <Button
                                    className={styles.submit_btn}
                                    disabled={!checked}
                                    onClick={() => console.log(data)}
                                >
                                    submit

                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeedbackThree;
