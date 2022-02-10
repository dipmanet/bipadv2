/* eslint-disable max-len */
/* eslint-disable no-return-assign */
import React, { useState } from 'react';
import Button from 'src/vendor/react-store/v2/Action/Button';
import { navigate } from '@reach/router';
import Page from '#components/Page';
import styles from './styles.scss';
import Icon from '#rscg/Icon';


const FeedbackTwo = () => {
    const [data, setdata] = useState({ feedback: '', date: '', time: '' });
    console.log(data);
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
                    <button className={styles.cross_btn}>
                        <i className="fas fa-times fa-3x" />
                    </button>
                </div> */}
                            <div className={styles.tech_support_wrapper}>
                                <div className={styles.tech_support_head}>
                                    Technical Support Request Form
                                </div>
                                <div className={styles.tech_support_input}>
                                    <div className={styles.tech_support_input_head}>
                                        Kindly specify what kind of technical support you need.
                                    </div>
                                    <textarea
                                        type="text"
                                        className={styles.tech_support}
                                        placeholder="Please type.."
                                        value={data.feedback}
                                        onChange={(e) => { setdata({ ...data, feedback: e.target.value }); }}
                                    />
                                </div>
                                <div className={styles.tech_support_date_time}>
                                    <div className={styles.date_time_head}>
                                        Enter your available date and time
                                    </div>
                                    <div className={styles.date_time_div}>
                                        <div className={styles.select_date_container}>
                                            {/* <div className={styles.select_date_wrapper}> */}
                                            {/* <div className={styles.date_select}>
                                                Select Your Date
                                            </div>
                                            <img src={Calender} alt="" /> */}
                                            <input
                                                type="text"
                                                onFocus={e => e.target.type = 'date'}
                                                placeholder="Select Your Date"
                                                name="date"
                                                id="time"
                                                className={styles.date}
                                                onChange={e => setdata({ ...data, date: e.target.value })}
                                            />
                                            {/* </div> */}
                                        </div>

                                        <div className={styles.select_time_container}>
                                            {/* <div className={styles.select_time_wrapper}> */}
                                            {/* <div className={styles.time_select}>
                                                Select Your Time
                                            </div>
                                            <img src={Clock} alt="" /> */}
                                            <input
                                                type="text"
                                                onFocus={e => e.target.type = 'time'}
                                                placeholder="Select Your Time"
                                                name="time"
                                                id="time"
                                                className={styles.time}
                                                onChange={e => setdata({ ...data, time: e.target.value })}
                                            />
                                            {/* </div> */}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.tech_support_date_time_text}>
                                    <Icon
                                        name="info"
                                        className={styles.info_icon}

                                    />
                                    <span className={styles.info_text}>
                                        Select the date and time of your availability. You will have
                                        30 minutes allocated time per appointment. As per goverment
                                        working hours
                                    </span>

                                </div>
                            </div>
                            <div className={styles.back_next_button}>
                                <Button className={styles.back_btn} onClick={() => navigate('/feedback-1/')}>
                                    back
                                </Button>
                                <Button className={styles.next_btn} onClick={() => navigate('/feedback-3/')}>
                                    next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeedbackTwo;
