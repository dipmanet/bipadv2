/* eslint-disable import/prefer-default-export */
import DeathIcon from 'src/admin/resources/DeathIncident.svg';
import IncidentIcon from 'src/admin/resources/incident.svg';
import InfraIcon from 'src/admin/resources/infrastructure.svg';
import InjuredIcon from 'src/admin/resources/injured.svg';
import LivestockIcon from 'src/admin/resources/livestock.svg';
import LossIcon from 'src/admin/resources/loss.svg';
import MissingIcon from 'src/admin/resources/missing.svg';
import { nepaliRef } from 'src/admin/components/BulletinForm/formFields';


export const lossObj = [
    {
        lossKey: 'numberOfIncidents',
        logo: IncidentIcon,
        title: nepaliRef.numberOfIncidents,
        titleEn: 'Incidents',
    },
    {
        lossKey: 'numberOfDeath',
        logo: DeathIcon,
        title: nepaliRef.numberOfDeath,
        titleEn: 'Deaths',

    },
    {
        lossKey: 'numberOfMissing',
        logo: MissingIcon,
        title: nepaliRef.numberOfMissing,
        titleEn: 'Missing',


    },
    {
        lossKey: 'numberOfInjured',
        logo: InjuredIcon,
        title: nepaliRef.numberOfInjured,
        titleEn: 'Injured',


    },
    {
        lossKey: 'estimatedLoss',
        logo: LossIcon,
        title: nepaliRef.estimatedLoss,
        titleEn: 'Estimated Loss',

    },
    {
        lossKey: 'roadBlock',
        logo: InfraIcon,
        title: nepaliRef.roadBlock,
        titleEn: 'Road Block',

    },
    {
        lossKey: 'cattleLoss',
        logo: LivestockIcon,
        title: nepaliRef.cattleLoss,
        titleEn: 'Cattle Loss',
    },
];
