/* eslint-disable import/prefer-default-export */
import DeathIcon from '../../resources/death.svg';
import IncidentIcon from '../../resources/incident.svg';
import InfraIcon from '../../resources/infrastructure.svg';
import InjuredIcon from '../../resources/injured.svg';
import LivestockIcon from '../../resources/livestock.svg';
import LossIcon from '../../resources/loss.svg';
import MissingIcon from '../../resources/missing.svg';
import { nepaliRef } from '../Bulletin/formFields';


export const lossObj = [
    {
        lossKey: 'numberOfIncidents',
        logo: IncidentIcon,
        title: nepaliRef.numberOfIncidents,
    },
    {
        lossKey: 'numberOfDeath',
        logo: DeathIcon,
        title: nepaliRef.numberOfDeath,
    },
    {
        lossKey: 'numberOfMissing',
        logo: MissingIcon,
        title: nepaliRef.numberOfMissing,

    },
    {
        lossKey: 'numberOfInjured',
        logo: InjuredIcon,
        title: nepaliRef.numberOfInjured,

    },
    {
        lossKey: 'estimatedLoss',
        logo: LossIcon,
        title: nepaliRef.estimatedLoss,

    },
    {
        lossKey: 'roadBlock',
        logo: InfraIcon,
        title: nepaliRef.roadBlock,

    },
    {
        lossKey: 'cattleLoss',
        logo: LivestockIcon,
        title: nepaliRef.cattleLoss,

    },
];
