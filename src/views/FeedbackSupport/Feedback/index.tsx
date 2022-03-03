/* eslint-disable @typescript-eslint/camelcase */
import React, { useState } from 'react';
import FeedbackOne from './FeedbackOne';
import FeedbackTwo from './FeedbackTwo';

const Feedback = () => {
    const [formElementsPosition, setformElementsPosition] = useState(0);

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
        />
    )
            }

        </>
    );
};
export default Feedback;
