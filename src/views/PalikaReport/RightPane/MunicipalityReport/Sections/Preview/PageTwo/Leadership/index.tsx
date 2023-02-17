import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import {
    generalDataSelector,
    userSelector,
    municipalitiesSelector,
    districtsSelector,
    provincesSelector,
    drrmRegionSelector,
} from '#selectors';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import Gt from '../../../../../../utils';
import Translations from '../../../../../../Constants/Translations';

const mapStateToProps = state => ({
    generalData: generalDataSelector(state),
    user: userSelector(state),
    muncipalities: municipalitiesSelector(state),
    districts: districtsSelector(state),
    provinces: provincesSelector(state),
    drrmRegion: drrmRegionSelector(state),
});

interface Props{

}
const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {

    FiscalYearFetch: {
        url: '/nepali-fiscal-year/',
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let fiscalYearList: CitizenReport[] = [];
            const fiscalYearListResponse = response as MultiResponse<CitizenReport>;
            fiscalYearList = fiscalYearListResponse.results;
            params.fiscalYearList(fiscalYearList);
        },
    },

};

let municipality = '';
let district = '';
let province = '';

const Leadership = (props: Props) => {
    const {
        generalData,
        requests: { FiscalYearFetch },
        user,
        muncipalities,
        districts,
        provinces,
        drrmRegion,
    } = props;

    const [fiscalYearList, setFiscalYearList] = useState([]);
    const [fiscalYearTitle, setFYTitle] = useState('');

    if (drrmRegion.municipality) {
        municipality = drrmRegion.municipality;
        district = drrmRegion.district;
        province = drrmRegion.province;
    } else {
        municipality = user.profile.municipality;
        district = user.profile.district;
        province = user.profile.province;
    }


    const m = muncipalities.filter(mun => mun.id === municipality);
    const d = districts.filter(dis => dis.id === district);
    const p = provinces.filter(pro => pro.id === province);

    // const municipalityName = m[0].title;
    // const provinceName = p[0].title;
    // const districtName = d[0].title;

    const {
        fiscalYear,
        cao,
        mayor,
        focalPerson,
    } = generalData;

    const handleFiscalYearList = (response) => {
        setFiscalYearList(response);
    };
    FiscalYearFetch.setDefaultParams({
        fiscalYearList: handleFiscalYearList,
    });

    useEffect(() => {
        if (fiscalYearList.length > 0 && fiscalYear) {
            const FY = fiscalYearList.filter(item => item.id === Number(fiscalYear));
            setFYTitle(FY);
        }
    }, [fiscalYear, fiscalYearList]);

    return (
        <div className={styles.leadership}>

            <h2>
                {' '}
                <Gt section={Translations.MunicipalDRR} />
            </h2>
            <div className={styles.itemRow}>
                <div className={styles.leaderItem}>
                    <ul>
                        <li>
                            <span className={styles.darker}>
                                {(mayor && mayor.name)
                                || <Gt section={Translations.MayorNameUnavailable} />}
                                (
                                <Gt section={Translations.Mayor} />
)
                            </span>
                        </li>
                        <li>
                            {(mayor && mayor.email)
                            || <Gt section={Translations.MayorEmailUnavailable} />}

                        </li>
                        <li>
                            {(mayor && mayor.mobileNumber)
                            || <Gt section={Translations.MayorPhoneUnavailable} />}

                        </li>
                    </ul>
                </div>
                <div className={styles.leaderItem}>
                    <ul>
                        <li>
                            <span className={styles.darker}>
                                {(cao && cao.name)
                                || <Gt section={Translations.CaoNameUnavailable} />}
                                (
                                <Gt section={Translations.ChiefAdminstrative} />
)

                            </span>

                        </li>
                        <li>
                            {(cao && cao.email)
                             || <Gt section={Translations.CaoEmailUnavailable} />}

                        </li>
                        <li>
                            {(cao && cao.mobileNumber)
                            || <Gt section={Translations.CaoPhoneUnavailable} />}


                        </li>
                    </ul>
                </div>
                <div className={styles.leaderItem}>
                    <ul>
                        <li>
                            <span className={styles.darker}>
                                {(focalPerson && focalPerson.name)
                                || <Gt section={Translations.FocalPersonNameUnavailable} />}
                                (
                                <Gt section={Translations.DRRfocal} />
)
                            </span>
                        </li>
                        <li>
                            {(focalPerson && focalPerson.email)
                            || <Gt section={Translations.FocalPersonEmailUnavailable} />}

                        </li>
                        <li>
                            {(focalPerson && focalPerson.mobileNumber)
                            || <Gt section={Translations.FocalPersonPhoneUnavailable} />}

                        </li>
                    </ul>
                </div>
            </div>
        </div>

    );
};

export default connect(mapStateToProps, undefined)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Leadership,
        ),
    ),
);
