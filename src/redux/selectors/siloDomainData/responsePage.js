import { createSelector } from 'reselect';

const emptyObject = {};
const emptyList = [];

const responsePageSelector = ({ siloDomainData }) =>
    siloDomainData.responsePage || emptyObject;

export const resourceListSelectorRP = createSelector(
    responsePageSelector,
    ({ resourceList }) => resourceList || emptyList,
);

export const dummyRP = '';
