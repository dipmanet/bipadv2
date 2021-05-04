import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import govtlogo from '#views/PalikaReport/govtLogo.svg';

import styles from './styles.scss';
import {
    generalDataSelector,
    userSelector,
    municipalitiesSelector,
    districtsSelector,
    provincesSelector,
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
    user: userSelector(state),
    muncipalities: municipalitiesSelector(state),
    districts: districtsSelector(state),
    provinces: provincesSelector(state),
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
    } = props;

    const [fiscalYearList, setFiscalYearList] = useState([]);
    const [fiscalYearTitle, setFYTitle] = useState('');

    if (user && user.profile) {
        const {
            municipality: munfromprops,
            province: provfromprops,
            district: districtfromprops,
        } = user.profile;


        const m = muncipalities.filter(mun => mun.id === munfromprops);
        const d = districts.filter(dis => dis.id === districtfromprops);
        const p = provinces.filter(pro => pro.id === provfromprops);

        municipality = m[0].title;
        province = p[0].title;
        district = d[0].title;
    }

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
                            <li className={styles.munTitle}>{`${municipality} Municipality`}</li>
                            <li className={styles.desc}>
                                {`${district} District`}
                                {' '}
,
                                {' '}
                                {`${province}`}
                            </li>

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
