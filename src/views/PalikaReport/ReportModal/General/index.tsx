import React, { useState, useEffect } from 'react';
import { _cs } from '@togglecorp/fujs';
import Icon from '#rscg/Icon';

import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import {
    setAuthAction,
    setUserDetailAction,
} from '#actionCreators';

import {
    NewProps,
} from '#request';
import styles from './styles.scss';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';


interface Props{
    reportTitle: string;
    datefrom: string;
    dateTo: string;
    mayor: string;
    cao: string;
    focalPerson: string;
    formationDate: string;
    memberCount: string;
    setreportTitle: React.ChangeEventHandler<HTMLInputElement>;
    setdatefrom: React.ChangeEventHandler<HTMLInputElement>;
    setdateTo: React.ChangeEventHandler<HTMLInputElement>;
    setmayor: React.ChangeEventHandler<HTMLInputElement>;
    setcao: React.ChangeEventHandler<HTMLInputElement>;
    setfocalPerson: React.ChangeEventHandler<HTMLInputElement>;
    setformationDate: React.ChangeEventHandler<HTMLInputElement>;
    setmemberCount: React.ChangeEventHandler<HTMLInputElement>;
}

const General = (props: Props) => {
    const [municipality, setMunicipality] = useState(27010);
    const [district, setDistrict] = useState(27);
    const [province, setProvince] = useState(3);

    const handleFormRegion = (location: number) => {
        setMunicipality(location.municipalityId);
        setDistrict(location.districtId);
        setProvince(location.provinceId);
    };

    const {
        reportTitle,
        datefrom,
        dateTo,
        mayor,
        cao,
        focalPerson,
        formationDate,
        memberCount,
        setreportTitle,
        setdatefrom,
        setdateTo,
        setmayor,
        setcao,
        setfocalPerson,
        setformationDate,
        setmemberCount,

    } = props;
    console.log(props);
    return (
        <div className={styles.mainPageDetailsContainer}>
            <div className={styles.detailsFormContainer}>
                <div className={styles.formContainer}>
                    <h2>Please enter Disaster Profile details</h2>
                    <div className={styles.inputContainer}>
                        <StepwiseRegionSelectInput
                            className={
                                _cs(styles.activeView, styles.stepwiseRegionSelectInput)}
                            faramElementName="region"
                            wardsHidden
                            onChange={handleFormRegion}
                            initialLoc={{ municipality,
                                district,
                                province }}
                            disabled
                            provinceInputClassName={styles.snprovinceinput}
                            districtInputClassName={styles.sndistinput}
                            municipalityInputClassName={styles.snmuniinput}
                        />
                    </div>
                    <div className={styles.newSignupForm}>
                        <div className={styles.formColumn}>
                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    placeholder="Report Title"
                                    onChange={setreportTitle}
                                    value={reportTitle || ''}
                                />
                            </div>

                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    placeholder="From Date (BS)"
                                    onChange={setdatefrom}
                                    value={datefrom || ''}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    placeholder="To Date (BS)"
                                    onChange={dateTo}
                                    value={setdateTo || ''}
                                />
                            </div>
                            <div className={styles.multinputContainer}>
                                <div className={styles.biggerElements}>
                                    <input
                                        type="text"
                                        className={styles.inputElement}
                                        placeholder="Mayor or Chairperson"
                                        onChange={setmayor}
                                        value={mayor || ''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.formColumn}>
                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    placeholder="Chief Administrative Officer"
                                    onChange={setcao}
                                    value={cao || ''}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    placeholder="DRR Focal Person"
                                    onChange={setfocalPerson}
                                    value={focalPerson || ''}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    placeholder="DRRM committee formation date in B.S."
                                    onChange={setformationDate}
                                    value={formationDate || ''}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    placeholder="Number of DRRM committee members:"
                                    onChange={setmemberCount}
                                    value={memberCount || ''}
                                />
                            </div>
                        </div>
                    </div>
                    {/* <p className={styles.moreInfo}>
                        <Icon
                            name="info"
                            className={styles.infoIcon}
                        />
                            This is extra info, incase we need some
                    </p> */}
                </div>
            </div>
        </div>
    );
};

export default General;
