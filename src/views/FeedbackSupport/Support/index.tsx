/* eslint-disable @typescript-eslint/camelcase */
import React, { useState } from 'react';
import SupportOne from './SupportOne';
import SupportTwo from './SupportTwo';
import SupportThree from './SupportThree';

const Support = () => {
    const [formElementsPosition, setformElementsPosition] = useState(0);
    const [data, setdata] = useState({
        institutionType: '',
        typeOfTechSupport: null,
        technicalTroubleshoot: false,
        overviewOfBipadPortal: false,
        dataEntryInBipadPortal: false,
        bipadDataUse: false,
        bipadTechnicalSpecification: false,
        othersSpecify: false,
        otherTechSupport: '',
        priorityLevel: '',
        description: '',
        appointmentDateTime: null,
        date: '',
        time: '',
        fullName: '',
        designation: '',
        nameOfTheInstitution: '',
        email: '',
        phoneNumber: '',

    });


    const [error, setError] = useState({
        institutionError: '',
        techSupportError: '',
        otherSpecifyError: '',
        priorityLevelError: '',
        descriptionError: '',
        dateError: '',
        timeError: '',
        firstNameError: '',
        designationError: '',
        institutionNameError: '',
        phoneNumberError: '',
        emailError: '',
    });

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
                    <SupportOne
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
                    <SupportTwo
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
                formElementsPosition === 2
                && (
                    <SupportThree
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
export default Support;
