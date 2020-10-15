const GOOD_COLOR = '#009966';
const MODERATE_COLOR = '#ffde33';
const UNHEALTHY_FOR_SENSITIVE_COLOR = '#ff9933';
const UNHEALTHY_COLOR = '#cc0033';
const VERY_UNHEALTHY_COLOR = '#660099';
const HAZARDOUS_COLOR = '#7e0023';

const stackedBars = [
    { dataKey: 'good', stackId: 'pollution', fill: GOOD_COLOR },
    { dataKey: 'moderate', stackId: 'pollution', fill: MODERATE_COLOR },
    { dataKey: 'unhealthyForSensitive', stackId: 'pollution', fill: UNHEALTHY_FOR_SENSITIVE_COLOR },
    { dataKey: 'unhealthy', stackId: 'pollution', fill: UNHEALTHY_COLOR },
    { dataKey: 'veryUnhealthy', stackId: 'pollution', fill: VERY_UNHEALTHY_COLOR },
    { dataKey: 'hazardous', stackId: 'pollution', fill: HAZARDOUS_COLOR },
];

export default stackedBars;
