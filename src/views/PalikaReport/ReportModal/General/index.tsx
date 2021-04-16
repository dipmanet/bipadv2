import React, { useState, useEffect } from 'react';
import { _cs } from '@togglecorp/fujs';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import styles from './styles.scss';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import 'nepali-datepicker-reactjs/dist/index.css';

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

interface Location{
    municipalityId: number;
    districtId: number;
    provinceId: number;
}

const General = (props: Props) => {
    const [municipality, setMunicipality] = useState<number>(27010);
    const [district, setDistrict] = useState<number>(27);
    const [province, setProvince] = useState<number>(3);
    const [dateto, setDateTo] = useState<string>('');
    const [datefrom, setDateFrom] = useState<string>('');

    const handleFormRegion = (location: Location) => {
        setMunicipality(location.municipalityId);
        setDistrict(location.districtId);
        setProvince(location.provinceId);
    };

    const {
        reportTitle,
        mayor,
        cao,
        focalPerson,
        formationDate,
        memberCount,
        setreportTitle,
        setmayor,
        setcao,
        setfocalPerson,
        setformationDate,
        setmemberCount,

    } = props;
    console.log(props);
    return (
        <div className={styles.mainPageDetailsContainer}>
            <div className={styles.formContainer}>
                <h2>Please enter Disaster Profile details</h2>
                <div className={styles.inputContainer}>
                    <StepwiseRegionSelectInput
                        className={styles.stepwiseRegionSelectInput}
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
                            <NepaliDatePicker
                                inputClassName="form-control"
                                className=""
                                value={datefrom}
                                onChange={(value: string) => setDateFrom(value)}
                                options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <NepaliDatePicker
                                inputClassName="form-control"
                                className=""
                                value={dateto}
                                onChange={(value: string) => setDateTo(value)}
                                options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                            />
                            {/* <input
                                type="text"
                                className={styles.inputElement}
                                placeholder="To Date (BS)"
                                onChange={setdateTo}
                                value={dateTo || ''}
                            /> */}
                        </div>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                className={styles.inputElement}
                                placeholder="Mayor or Chairperson"
                                onChange={setmayor}
                                value={mayor || ''}
                            />
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
    );
};

export default General;
