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
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import Gt from '../../../../../../utils';
import Translations from '../../../../../../Translations';

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

const Footer = (props: Props) => {
    const {
        generalData,
        requests: { FiscalYearFetch },
        user,
        muncipalities,
        districts,
        provinces,
        drrmRegion,
    } = props;

    if (drrmRegion.municipality) {
        municipality = drrmRegion.municipality;
        district = drrmRegion.district;
        province = drrmRegion.province;
    } else {
        municipality = user.profile.municipality;
        district = user.profile.district;
        province = user.profile.province;
    }

    const [fiscalYearList, setFiscalYearList] = useState([]);
    const [fiscalYearTitle, setFYTitle] = useState('');


    const m = muncipalities.filter(mun => mun.id === municipality);
    const d = districts.filter(dis => dis.id === district);
    const p = provinces.filter(pro => pro.id === province);

    const municipalityName = m[0].title;
    const provinceName = p[0].title;
    const districtName = d[0].title;

    const {
        fiscalYear,
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
        <div className={styles.footer}>
            <div className={styles.leftContainer}>
                <h2><Gt section={Translations.ContactUs} /></h2>
                <hr className={styles.horizontalLine} />
                <div className={styles.address}>
                    <ul>
                        <li className={styles.munTitle}>
                            {`${municipalityName} Municipality`}
                            ,
                            {' '}

                        </li>
                        <li className={styles.munTitle}>
                            {' '}
                            {`${districtName} District`}
                            ,
                            {' '}
                            {`${provinceName}`}
                        </li>
                        {/* <li className={styles.munTitle}>POB: 213311</li> */}
                        {/* <li className={styles.munTitle}>PHONE: +977-1-449354</li> */}
                        <li className={styles.munTitle}>{`WEB: https://www.${municipalityName.toLowerCase()}mun.gov.np/en`}</li>
                    </ul>
                </div>
            </div>
            <div className={styles.rightContainer}>

                <ul>
                    <li>
                        <Gt section={Translations.ContactMessageGenerated} />
                    </li>
                    <li className={styles.smallNote}>
                        <Gt section={Translations.ContactNote} />
                    </li>
                </ul>
            </div>
        </div>

    );
};

export default connect(mapStateToProps, undefined)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Footer,
        ),
    ),
);
