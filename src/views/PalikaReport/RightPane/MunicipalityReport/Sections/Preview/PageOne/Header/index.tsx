import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import govtlogo from '#resources/palikaicons/govtLogo.svg';

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

import Gt from '#views/PalikaReport/utils';
import Translations from '#views/PalikaReport/Translations';

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

const Header = (props: Props) => {
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

    const municipalityName = m[0].title;
    const provinceName = p[0].title;
    const districtName = d[0].title;
    // }

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
            console.log('fy obj', FY);
            console.log('fiscalYearList', fiscalYearList);
            console.log('fiscalyear', fiscalYear);
            setFYTitle(FY);
        }
    }, [fiscalYear, fiscalYearList]);

    return (
        <div className={styles.header}>
            <div className={styles.leftContainer}>
                <div className={styles.logoAndAddress}>
                    <ScalableVectorGraphics
                        className={styles.logo}
                        src={govtlogo}
                        alt="Nepal Government"
                    />

                    <div className={styles.address}>
                        <ul>
                            <li className={styles.munTitle}>{`${municipalityName} Municipality`}</li>
                            <li className={styles.desc}>
                                {`${districtName} District`}
                                {' '}
,
                                {' '}
                                {`${provinceName}`}
                            </li>

                        </ul>

                    </div>

                </div>
                <div className={styles.titleAndFY}>
                    <ul>
                        <li className={styles.title}>
                            <Gt section={Translations.dashBoardHeading} />

                        </li>
                        <li className={styles.fy}>
                            <Gt section={Translations.FY} />
                            {' '}
                            {fiscalYearTitle && fiscalYearTitle[0].titleEn}
                        </li>
                    </ul>
                </div>
            </div>


            <div className={styles.dates}>
                <ul>
                    <li>
                        <Gt section={Translations.dashboardTblHeaderPublishedOn} />
                        {':'}
                        {new Date().toISOString().split('T')[0]}
                    </li>
                    <li>
                        <Gt section={Translations.dashboardTblHeaderLastModified} />
                        {':'}
                        {new Date().toISOString().split('T')[0]}
                    </li>

                </ul>

            </div>

        </div>

    );
};

export default connect(mapStateToProps, undefined)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Header,
        ),
    ),
);
