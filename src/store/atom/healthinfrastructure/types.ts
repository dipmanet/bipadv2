export interface Field {
    id: number;
    title: string;
}

interface Centroid {
    type: 'Point';
    coordinates: [number, number];
}
type BBox = [number, number, number, number];

export interface HealthInfrastructurePage {
    resourceID: number;
    loadingInv: boolean;
    inventoryErr: {'message': ''};
    inventoryData: [];
    inventoryItem: [];
    invItemSuccess: boolean;
    invItemError: boolean;
    healthDataLoading: boolean;
    healthTableData: [];
    healthDataErr: {'message': ''};
    deletePending: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
    deleteError: {'message': ''};
    healthFormEditData: {};
    formDataEditPending: boolean;
    formDataEditError: {'message': ''};
    formDataEditSuccess: boolean;
    healthOverviewTableLoading: boolean;
    healthOverviewTableData: {};
    healthOverviewTableError: {'message': ''};
    healthOverviewChartLoading: boolean;
    healthOverviewChartData: {};
    healthOverviewChartError: {'message': ''};
    healthFormLoader: boolean;
    healthUploadLoading: boolean;
    healthError: boolean;
    uploadData: [];
    uploadDataLoading: boolean;
    uploadDataError: {'message': ''};
    validationError: null;
    healthDataCount: null;
}

export interface HealthInfrastructureState {
    healthInfrastructurePage: HealthInfrastructurePage;
}
// ACTION TYPES

// eslint-disable-next-line import/prefer-default-export
export enum PageType {
    SET_HEALTH_INFRASTRUCTURE_PAGE = 'page/HEALTH_INFRASTRUCTURE/HEALTH_INFRASTRUCTURE_PAGE',
}

// ACTION CREATOR INTERFACE

export interface SetHealthInfrastructurePage {
    type: typeof PageType.SET_HEALTH_INFRASTRUCTURE_PAGE;
    healthInfrastructurePage: HealthInfrastructurePage;
}

export type PageActionTypes = (
    SetHealthInfrastructurePage
);
