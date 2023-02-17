import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import govtlogo from '#resources/palikaicons/govtLogo.svg';

import styles from './styles.scss';
import {
    generalDataSelector,
    municipalitiesSelector,
    provincesSelector,
    districtsSelector,
} from '#selectors';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

const mapStateToProps = state => ({
    generalData: generalDataSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
});

interface Props{

}

let province = 0;
let district = 0;
let municipality = 0;

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

const Header = (props: Props) => {
    const {
        generalData,
        requests: { FiscalYearFetch },
        municipalities,
        provinces,
        districts,
    } = props;
    const [fiscalYearList, setFiscalYearList] = useState([]);
    const [fiscalYearTitle, setFYTitle] = useState('');

    const {
        fiscalYear,
    } = generalData;

    const handleFiscalYearList = (response) => {
        setFiscalYearList(response);
    };
    FiscalYearFetch.setDefaultParams({
        fiscalYearList: handleFiscalYearList,
    });

    if (drrmRegion.municipality) {
        municipality = drrmRegion.municipality;
        district = drrmRegion.district;
        province = drrmRegion.province;
    } else {
        municipality = user.profile.municipality;
        district = user.profile.district;
        province = user.profile.province;
    }


    const m = municipalities.filter(mun => mun.id === municipality);
    const d = districts.filter(dis => dis.id === district);
    const p = provinces.filter(pro => pro.id === province);

    const municipalityName = m[0].title;
    const provinceName = p[0].title;
    const districtName = d[0].title;

    useEffect(() => {
        if (fiscalYearList.length > 0 && fiscalYear) {
            const FY = fiscalYearList.filter(item => item.id === Number(fiscalYear));
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
                            <li className={styles.desc}>{`${districtName} District, ${provinceName}`}</li>

                        </ul>

                    </div>

                </div>
                <div className={styles.titleAndFY}>
                    <ul>
                        <li className={styles.title}>
                    Disaster Risk Reduction
                    and Management Report
                        </li>
                        <li className={styles.fy}>
                    FY:
                            {' '}
                            {fiscalYearTitle && fiscalYearTitle[0].titleEn}
                        </li>
                    </ul>
                </div>
            </div>


            <div className={styles.dates}>
                <ul>
                    <li>
                         Generated on:
                        {new Date().toISOString().split('T')[0]}
                    </li>
                    <li>
                        Last Modified on:
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
