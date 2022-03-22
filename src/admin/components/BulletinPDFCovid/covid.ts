/* eslint-disable import/prefer-default-export */
import DeathIcon from 'src/admin/resources/death.svg';
import AffectedIcon from 'src/admin/resources/Cases.svg';
import RecoveredIcon from 'src/admin/resources/Recovered.svg';
import ActiveIcon from 'src/admin/resources/Tested.svg';
import FemaleIcon from 'src/admin/resources/femaleGray.svg';
import MaleIcon from 'src/admin/resources/maleGray.svg';
import { nepaliRef } from '../BulletinForm/formFields';

export const covidObj24HRs = [
    {
        lossKey: 'affected',
        logo: AffectedIcon,
        title: 'Total Affected',
    },
    {
        lossKey: 'deaths',
        logo: DeathIcon,
        title: 'Total Deaths',
    },
    {
        lossKey: 'recovered',
        logo: RecoveredIcon,
        title: 'Total Recovered',

    },
];


export const covidObjTotal = [
    {
        lossKey: 'totalAffected',
        logo: AffectedIcon,
        title: 'Total Affected',
    },
    {
        lossKey: 'totalActive',
        logo: ActiveIcon,
        title: 'Total Active',
    },
    {
        lossKey: 'totalRecovered',
        logo: RecoveredIcon,
        title: 'Total Recovered',

    },
    {
        lossKey: 'totalDeaths',
        logo: DeathIcon,
        title: 'Total Deaths',

    },
];

export const vaccineStatObj = [
    {
        title: 'First Dosage Count',
        khopKey: 'firstDosage',
    },
    {
        title: 'Second Dosage Count',
        khopKey: 'secondDosage',
    },
    {
        title: 'Third Dosage Count',
        khopKey: 'thirdDosage',
    },
];


export const covidObj24HRsRow2 = [
    {
        lossKey: 'femaleAffected',
        logo: FemaleIcon,
        title: 'Female',
    },
    {
        lossKey: 'maleAffected',
        logo: MaleIcon,
        title: 'Male',
    },
];
