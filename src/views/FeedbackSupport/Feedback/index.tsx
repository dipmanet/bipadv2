/* eslint-disable @typescript-eslint/camelcase */
import React, { useState } from 'react';
import FeedbackOne from './FeedbackOne';
import FeedbackTwo from './FeedbackTwo';

const Feedback = (props) => {
    const [formElementsPosition, setformElementsPosition] = useState(0);
    const { setPosition, closeModal } = props;
    const inputDatas = {
        fullName: '',
        designation: '',
        nameOfTheInstitution: '',
        email: '',
        isAnonymous: false,
        feedback: '',
        screenshot: '',
    };
    const inputError = {
        fullNameError: '',
        designationError: '',
        nameOfTheInstitutionError: '',
        emailError: '',
        feedbackError: '',
        screenshotError: '',
    };
    const [data, setdata] = useState(inputDatas);
    const [error, setError] = useState(inputError);


    const onPreviousClick = () => {
        setformElementsPosition(formElementsPosition - 1);
    };


    const onNextClick = () => {
        setformElementsPosition(formElementsPosition + 1);
    };

    return (

        <>
            {
                formElementsPosition === 0
            && (
                <FeedbackOne
                    onNextClick={onNextClick}
                    onPreviousClick={onPreviousClick}
                    data={data}
                    setData={setdata}
                    error={error}
                    setError={setError}
                    setPosition={setPosition}
                    closeModal={closeModal}
                />
            )
            }
            {
                formElementsPosition === 1
    && (
        <FeedbackTwo
            onNextClick={onNextClick}
            onPreviousClick={onPreviousClick}
            data={data}
            setData={setdata}
            error={error}
            setError={setError}
            setPosition={setPosition}
            closeModal={closeModal}
        />
    )
            }

        </>
    );
};
export default Feedback;
