/* eslint-disable import/prefer-default-export */
import DeathIcon from 'src/admin/resources/death.svg';
import AffectedIcon from 'src/admin/resources/cases.svg';
import RecoveredIcon from 'src/admin/resources/Recovered.svg';
import ActiveIcon from 'src/admin/resources/Tested.svg';
import FemaleIcon from 'src/admin/resources/femaleGray.svg';
import MaleIcon from 'src/admin/resources/maleGray.svg';
import { nepaliRef } from '../BulletinForm/formFields';

export const covidObj24HRs = [
    {
        lossKey: 'affected',
        logo: AffectedIcon,
        title: nepaliRef.affected,
    },
    {
        lossKey: 'deaths',
        logo: DeathIcon,
        title: nepaliRef.deaths,
    },
    {
        lossKey: 'recovered',
        logo: RecoveredIcon,
        title: nepaliRef.recovered,

    },
];


export const covidObjTotal = [
    {
        lossKey: 'totalAffected',
        logo: AffectedIcon,
        title: nepaliRef.totalAffected,
    },
    {
        lossKey: 'totalActive',
        logo: ActiveIcon,
        title: nepaliRef.totalActive,
    },
    {
        lossKey: 'totalRecovered',
        logo: RecoveredIcon,
        title: nepaliRef.totalRecovered,

    },
    {
        lossKey: 'totalDeaths',
        logo: DeathIcon,
        title: nepaliRef.totalDeaths,

    },
];

export const vaccineStatObj = [
    {
        title: 'पहिलो मात्रा खोप लगएको संख्या',
        khopKey: 'firstDosage',
    },
    {
        title: 'दोस्रो मात्रा खोप लगएको संख्या',
        khopKey: 'secondDosage',
    },
];


export const covidObj24HRsRow2 = [
    {
        lossKey: 'femaleAffected',
        logo: FemaleIcon,
        title: nepaliRef.female,
    },
    {
        lossKey: 'maleAffected',
        logo: MaleIcon,
        title: nepaliRef.male,
    },
];
