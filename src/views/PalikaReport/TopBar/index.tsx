/* eslint-disable max-len */
import React from 'react';
import { connect } from 'react-redux';
import { isDefined, _cs } from '@togglecorp/fujs';

import {
    setPalikaLanguageAction,
} from '#actionCreators';
import {
    districtsSelector,
    drrmRegionSelector,
    municipalitiesSelector,
    palikaLanguageSelector,
    provincesSelector,
    userSelector,
} from '#selectors';
import { AppState } from '#store/types';
import * as PageTypes from '#store/atom/page/types';
import { User } from '#store/atom/auth/types';
import Gt from '#views/PalikaReport/utils';
import Translations from '#views/PalikaReport/Constants/Translations';
import styles from './styles.scss';

interface Props {
    palikaLanguage: PageTypes.PalikaLanguage;
    setPalikaLanguage: typeof setPalikaLanguageAction;
    drrmRegion: PageTypes.DrrmRegion;
    user: User;
    municipalities: PageTypes.Municipality[];
    districts: PageTypes.District[];
    provinces: PageTypes.Province[];
    drrmLanguage: PageTypes.PalikaLanguage;
}

interface PropsFromDispatch {
    setPalikaLanguage: typeof setPalikaLanguageAction;
}

const mapStateToProps = (state: AppState) => ({
    palikaLanguage: palikaLanguageSelector(state),
    drrmRegion: drrmRegionSelector(state),
    user: userSelector(state),
    municipalities: municipalitiesSelector(state),
    districts: districtsSelector(state),
    provinces: provincesSelector(state),
    drrmLanguage: palikaLanguageSelector(state),

});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setPalikaLanguage: params => dispatch(setPalikaLanguageAction(params)),
});


let province = 0;
let district = 0;
let municipality = 0;

let municipalityName = 'Not defined';
let provinceName = 'Not Defined';
let districtName = 'Not Defined';

const TopBar = (props: Props) => {
    const {
        palikaLanguage,
        setPalikaLanguage,
        drrmRegion,
        user,
        municipalities,
        districts,
        provinces,
        drrmLanguage,
    } = props;

    const {
        language,
    } = palikaLanguage;

    const handleLangButton = () => {
        if (language === 'en') {
            setPalikaLanguage({ language: 'np' });
        } else {
            setPalikaLanguage({ language: 'en' });
        }
    };

    if (isDefined(drrmRegion.municipality)) {
        const {
            municipality: munFromProps,
            district: districtFromProps,
            province: provinceFromProps,
        } = drrmRegion;
        municipality = munFromProps;
        district = districtFromProps;
        province = provinceFromProps;
    } else if (isDefined(user) && isDefined(user.profile)) {
        const {
            profile: {
                municipality: munFromUser,
                district: districtFromUser,
                province: provinceFromUser,
            },
        } = user;
        if (munFromUser && districtFromUser && provinceFromUser) {
            municipality = munFromUser;
            district = districtFromUser;
            province = provinceFromUser;
        }
    }


    const m = municipalities.filter(mun => mun.id === municipality);
    const d = districts.filter(dis => dis.id === district);
    const p = provinces.filter(pro => pro.id === province);


    if (drrmLanguage.language === 'en' && m[0] && m[0].title) {
        municipalityName = m[0].title;
        provinceName = p[0].title;
        districtName = d[0].title;
    } else if (drrmLanguage.language === 'np' && m[0] && m[0].title) {
        municipalityName = m[0].title_ne;
        provinceName = p[0].title_ne;
        districtName = d[0].title_ne;
    }

    return (
        <div className={municipalityName !== 'Not defined' ? styles.toBarContainer : styles.notLoggedIn}>
            {
                municipalityName !== 'Not defined'
                    ? (
                        <p>
                            {municipalityName}
                            {' '}
                            <Gt section={Translations.MunicipalitySingle} />
                            ,
                            {' '}
                            {districtName}
                            {' '}
                            <Gt section={Translations.dashboardTblHeaderDistrict} />
                            ,
                            {' '}
                            {provinceName}
                            {' '}
                            <Gt section={Translations.dashboardTblHeaderProvince} />
                        </p>
                    )
                    : ''
            }
            <div className={styles.languageButton}>
                <button
                    onClick={handleLangButton}
                    className={language === 'en'
                        ? _cs(styles.engButton, styles.selectedLanguage)
                        : styles.engButton}
                    type="button"
                >
                    EN
                </button>
                <button
                    onClick={handleLangButton}
                    className={language === 'np' ? _cs(styles.nepButton, styles.selectedLanguage) : styles.nepButton}

                    type="button"
                >
                    ने
                </button>
            </div>

        </div>

    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    TopBar,
);
