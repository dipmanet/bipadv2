/* eslint-disable import/prefer-default-export */
import DeathIcon from '../../resources/death.svg';
import IncidentIcon from '../../resources/incident.svg';
import MissingIcon from '../../resources/missing.svg';
import FemaleIcon from '../../resources/femaleGray.svg';
import MaleIcon from '../../resources/maleGray.svg';
import { nepaliRef } from '../Bulletin/formFields';

export const covidObj24HRs = [
    {
        lossKey: 'affected',
        logo: IncidentIcon,
        title: nepaliRef.affected,
    },
    {
        lossKey: 'deaths',
        logo: DeathIcon,
        title: nepaliRef.deaths,
    },
    {
        lossKey: 'recovered',
        logo: MissingIcon,
        title: nepaliRef.recovered,

    },
];


export const covidObjTotal = [
    {
        lossKey: 'totalAffected',
        logo: IncidentIcon,
        title: nepaliRef.totalAffected,
    },
    {
        lossKey: 'totalActive',
        logo: DeathIcon,
        title: nepaliRef.totalActive,
    },
    {
        lossKey: 'totalRecovered',
        logo: MissingIcon,
        title: nepaliRef.totalRecovered,

    },
    {
        lossKey: 'totalDeaths',
        logo: MissingIcon,
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
