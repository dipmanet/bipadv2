/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { createRequestClient, ClientAttributes, methods } from '#request';
import {
    filtersSelector,
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
} from '#selectors';
import {
    District,
    Province,
    Municipality,
    // HazardType,
} from '#store/atom/page/types';
import { FiltersElement } from '#types';
import { AppState } from '#store/types';
import styles from './styles.scss';


interface State {
    allOpenspaces: unknown;
    allOpenspacesBackup: unknown;
}

interface PropsFromAppState {
    filters: FiltersElement;
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
}

interface ComponentProps {
    requests: any;
}

type Props = PropsFromAppState &ComponentProps;

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    allOpenspacesGetRequest: {
        url: '/open-table/',
        method: methods.GET,
        onMount: false,
    },
};

const mapStateToProps = (state: AppState) => ({
    filters: filtersSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
});

class OpenspaceSummary extends React.PureComponent<Props, State> {
    public constructor(props: any) {
        super(props);
        this.state = {
            allOpenspaces: [],
            allOpenspacesBackup: [],
        };

        const {
            requests: { allOpenspacesGetRequest },
        } = this.props;

        allOpenspacesGetRequest.do({
            openspaceId: 1,
        });
    }


    public componentDidUpdate(prevProps) {
        const {
            requests: {
                allOpenspacesGetRequest: { response },
            },
            filters,
        } = this.props;

        if (response !== prevProps.requests.allOpenspacesGetRequest.response) {
            const { results } = response;

            this.setDataOnState(results);
        }

        if (filters !== prevProps.filters) {
            this.handleFilter();
        }
    }

    private setDataOnState = (data: SetStateMethod) => {
        this.setState({
            allOpenspaces: data,
            allOpenspacesBackup: data,
        });
    }

    private handleFilter = () => {
        const { allOpenspacesBackup } = this.state;
        const { filters, districts, municipalities, provinces } = this.props;
        const { region } = filters;
        this.setState({
            allOpenspaces: allOpenspacesBackup,
        }, () => {
            const { allOpenspaces } = this.state;
            if (region.adminLevel) {
                const filteredData = allOpenspaces.filter(
                    openspace => openspace.province === region.geoarea,
                );

                this.setState({
                    allOpenspaces: filteredData,
                });
            } else {
                this.setState({
                    allOpenspaces: allOpenspacesBackup,
                });
            }
        });
    }


    public render() {
        const { allOpenspaces } = this.state;

        const totalArea = allOpenspaces.reduce(
            (accumulator: number, openspace: any[]) => accumulator + openspace.totalArea, 0,
        );
        const totalUsableArea = allOpenspaces.reduce(
            (accumulator: number, openspace: any[]) => accumulator + openspace.usableArea, 0,
        );
        const totalOpenspaces = allOpenspaces.length;
        return (
            <React.Fragment>
                <div className={styles.communitySpaceCard}>
                    <h2 className={styles.title}>Open Space Summary</h2>
                    <ul className={styles.dataWrap}>
                        <li className={styles.data}>
                            <span className={styles.dataCount}>{totalOpenspaces || '0'}</span>
                            <span className={styles.dataLabel}>Total Open spaces</span>
                        </li>
                        <li className={styles.data}>
                            <span className={styles.dataCount}>
                                {totalArea.toFixed() || '0'}
                                {' '}
sq. m
                            </span>
                            <span className={styles.dataLabel}>Total Area</span>
                        </li>

                        <li className={styles.data}>
                            <span className={styles.dataCount}>
                                {totalUsableArea ? totalUsableArea.toFixed() : '0'}
                                {' '}
sq. m
                            </span>
                            <span className={styles.dataLabel}>Total usuable area</span>
                        </li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
export default connect(mapStateToProps)(
    createRequestClient(requestOptions)(
        OpenspaceSummary,
    ),
);
