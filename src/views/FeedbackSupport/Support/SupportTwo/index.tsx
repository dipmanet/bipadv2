/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable no-return-assign */
import React, { useEffect, useState } from 'react';
import Button from 'src/vendor/react-store/v2/Action/Button';
import { navigate } from '@reach/router';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';
import Icon from '#rscg/Icon';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';


const FeedbackTwo = (props) => {
    const [dateAndTime, setdateAndTime] = useState(null);
    const [checked, setchecked] = useState(false);


    const [closeButton, setClosedButton] = useState(true);
    const { className, onNextClick, onPreviousClick, data,
        setData, error, setError } = props;

    const inputValidation = () => {
        setchecked(true);
        const invalidMessage = '* This field cannot be empty';
        const fieldNotSelected = '* Please select a field';
        const newerror = { ...error };
        if (data.description === '') {
            newerror.descriptionError = invalidMessage;
        } else {
            newerror.descriptionError = '';
        }
        if (data.date === '') {
            newerror.dateError = fieldNotSelected;
        } else {
            newerror.dateError = '';
        }
        if (data.time === '') {
            newerror.timeError = fieldNotSelected;
        } else {
            newerror.timeError = '';
        }
        setError(newerror);
    };

    useEffect(() => {
        const date = (data && data.date) && new Date(data.date).toDateString();
        const time = (data && data.time) && new Date(data.date.concat(` ${data.time}`)).toTimeString();


        if (date && time) {
            const concatDateTime = date.concat(` ${time}`);
            const dateTime = new Date(concatDateTime);
            const dateTimeIsoString = dateTime.toISOString();
            setdateAndTime(dateTimeIsoString.replace('Z', '+05:45'));
        }
    }, [data]);

    useEffect(() => {
        if (dateAndTime) {
            setData({ ...data, appointmentDateTime: dateAndTime });
        }
    }, [dateAndTime]);

    useEffect(() => {
        if (checked) {
            if (data.description
            && data.date
            && data.time
            && !error.description_error
            && !error.dateError
            && !error.timeError) {
                onNextClick();
            }
        }
    }, [checked, data, error]);


    return (
        <>

            {
                closeButton
                    ? (
                        <Modal className={_cs(styles.loginModal, className)}>
                            <ModalBody className={styles.content}>
                                <DangerButton
                                    transparent
                                    iconName="close"
                                    onClick={() => setClosedButton(false)}
                                    title="Close Modal"
                                    className={styles.closeButton}
                                />
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
                                                    <Button
                                                        className={styles.feed_btn}
                                                        onClick={() => navigate('/feedback/')}
                                                    >
                                                        FEEDBACK FORM

                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.feedback_container_second}>
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
                                                        value={data ? data.description : ''}
                                                        onChange={(e) => { setData({ ...data, description: e.target.value }); }}
                                                    />
                                                </div>

                                                {
                                                    error.descriptionError
                                                        ? (
                                                            <div className={styles.error_text}>
                                                                {error.descriptionError}
                                                            </div>
                                                        )
                                                        : null
                                                }

                                                <div className={styles.tech_support_date_time}>
                                                    <div className={styles.date_time_head}>
                                                        Enter your available date and time
                                                    </div>
                                                    <div className={styles.date_time_div}>
                                                        <div className={styles.select_date_container}>
                                                            <input
                                                                type={data.date ? 'date' : 'text'}
                                                                onFocus={e => e.target.type = 'date'}
                                                                placeholder="Select Your Date"
                                                                name="date"
                                                                id="time"
                                                                className={styles.date}
                                                                onChange={(e: any) => setData({ ...data,
                                                                    date: e.target.value })}
                                                                value={data && data.date ? data.date : ''}
                                                            />

                                                        </div>
                                                        <div className={styles.select_time_container}>
                                                            <input
                                                                type={data.time ? 'time' : 'text'}
                                                                onFocus={e => e.target.type = 'time'}
                                                                placeholder="Select Your Time"
                                                                name="time"
                                                                id="time"
                                                                className={styles.time}
                                                                onChange={(e: any) => setData({ ...data,
                                                                    time: e.target.value })}
                                                                value={data && data.time ? data.time : ''}
                                                            />
                                                        </div>


                                                    </div>
                                                </div>

                                                {
                                                    error
                                                        ? (
                                                            <div style={{ display: 'flex',
                                                                width: '100%',
                                                                justifyContent: 'space-between' }}
                                                            >
                                                                {error.dateError
                                                                    ? (
                                                                        <div
                                                                            className={styles.error_text}
                                                                            style={{ width: '45%' }}
                                                                        >
                                                                            {error.dateError}
                                                                        </div>
                                                                    )
                                                                    : null}

                                                                {
                                                                    error.timeError
                                                                        ? (
                                                                            <div
                                                                                className={styles.error_text}
                                                                                style={{ width: '45%' }}
                                                                            >
                                                                                {error.timeError}
                                                                            </div>
                                                                        )
                                                                        : null
                                                                }
                                                            </div>
                                                        )

                                                        : null
                                                }


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
                                                <Button
                                                    className={styles.back_btn}
                                                    onClick={onPreviousClick}
                                                >
                                                    back
                                                </Button>
                                                <Button
                                                    className={styles.next_btn}
                                                    onClick={inputValidation}
                                                >
                                                    next
                                                </Button>
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

export default FeedbackTwo;
