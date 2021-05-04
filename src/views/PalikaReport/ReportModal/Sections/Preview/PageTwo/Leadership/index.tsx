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

const Leadership = (props: Props) => {
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
            <h2>Municipal DRR Leadership</h2>
            <div className={styles.itemRow}>
                <div className={styles.leaderItem}>
                    <ul>
                        <li>
                            <span className={styles.darker}>
                                {mayor.split(',')[0] || 'Name Unavailable'}
                                (Mayor)
                            </span>
                        </li>
                        <li>
                            {mayor.split(',')[1] || 'Email Available'}

                        </li>
                        <li>
                            {mayor.split(',')[2] || 'Phone Available'}

                        </li>
                    </ul>
                </div>
                <div className={styles.leaderItem}>
                    <ul>
                        <li>
                            <span className={styles.darker}>
                                {cao.split(',')[0] || 'Name Unvailable'}
                                (CAO)

                            </span>

                        </li>
                        <li>
                            {cao.split(',')[1] || 'Email Unavailable'}

                        </li>
                        <li>
                            {cao.split(',')[2] || 'Phone Unavailable'}


                        </li>
                    </ul>
                </div>
                <div className={styles.leaderItem}>
                    <ul>
                        <li>
                            <span className={styles.darker}>
                                {focalPerson.split(',')[0] || 'Name Unvailable'}
                            (Focal Person)
                            </span>
                        </li>
                        <li>
                            {focalPerson.split(',')[1] || 'Email Unvailable'}

                        </li>
                        <li>
                            {focalPerson.split(',')[2] || 'Phone Unvailable'}

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
