/*eslint-disable*/
import React from 'react';
import NonFieldErrors from '#rsci/NonFieldErrors';
import styles from '../styles.scss';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

interface Props {
    handleSuggestedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTabClick: (tab: string) => void;
    openspaceId: number | undefined;

}

interface SuggestedUse {
    id: number;
    openSpace: number;
    icon: string;
    suggestedUse: number;
    suggestedUseName: string;
}

interface SuggestedUseList {
    results: SuggestedUse[];
}
interface State {
    suggestedUsesList: SuggestedUse[];
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
    error: false;
    checkedSuggestedUses: [];
    singleSuggestedUses: SuggestedUse[];
    singleSuggestedUsesIds: number[] | null;

}
interface FaramValues {
}

interface FaramErrors {
}

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    addSuggestedUsesRequest: {
        url: '/open-suggested/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
    },
    deleteSuggestedUsesRequest: {
        url: ({ params }) => `/open-suggested/${params.deleteId}`,
        method: methods.DELETE,
        onSuccess: ({ response }) => {
            console.log('delete sucess', response);
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
    },
    singleSuggestedUsesRequest: {
        url: ({ props }) => `/open-suggested/?open_space=${props.openspaceId}`,
        method: methods.GET,
    },


};

class SuggestedUses extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            suggestedUsesList: [],
            checkedSuggestedUses: [],
            singleSuggestedUses: [],
            singleSuggestedUsesIds: null,
            pristine: false,
            error: false,
        };
    }


    private getSuggestedUsesList = () => {
        fetch(`${process.env.REACT_APP_API_SERVER_URL}/suggested-use`)
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    suggestedUsesList: data.results,
                });
            })
            .catch(error => this.setState({ error: true }));
    }

    getSingleSuggestedList = () => {
        const { openspaceId } = this.props;
        fetch(`${process.env.REACT_APP_API_SERVER_URL}/open-suggested/?open_space=${openspaceId}`)
            .then(response => response.json())
            .then((data) => {
                const singleSuggestedUsesIds = data.results.map((use: SuggestedUse) => use.suggestedUse);
                this.setState({
                    singleSuggestedUses: data.results,
                    singleSuggestedUsesIds,
                });
            });
    }

    private handleEditSuggestedChange = (e: ChangeEvent<HTMLInputElement>, id: number, use: SuggestedUse) => {
        const {
            requests: {
                addSuggestedUsesRequest, deleteSuggestedUsesRequest, singleSuggestedUsesRequest,
            }, openspaceId,
        } = this.props;
        const { singleSuggestedUses } = this.state;
        let matchedId = [];
        const matchedIds = singleSuggestedUses && singleSuggestedUses.filter(s => s.suggestedUse === use.id);
        if (matchedIds) matchedId = matchedIds[0];
        const { checked } = e.target;


        if (checked) {
            addSuggestedUsesRequest.do({
                body: {
                    openSpace: openspaceId,
                    suggestedUse: id,
                },
            });
        } else {
            const deleteId = matchedId.id;
            deleteSuggestedUsesRequest.do({
                deleteId,
            });
        }
    }

    private postAllSuggestedUses = () => {
        this.setState({
            pristine: true,
        });
        const { checkedSuggestedUses } = this.state;
        const { handleTabClick } = this.props;

        if (checkedSuggestedUses.length !== 0) {
            for (let i = 0; i < checkedSuggestedUses.length; i++) {
                const requestOptions = {
                    method: 'POST',
                    body: JSON.stringify(checkedSuggestedUses[i]),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                };
                fetch(`${process.env.REACT_APP_API_SERVER_URL}/open-suggested/`, requestOptions)
                    .then(response => response.json())
                    .then(() => {
                        if (i === checkedSuggestedUses.length - 1) {
                            this.setState({
                                pristine: false,
                            });
                            handleTabClick('onSiteAmenties');
                        }
                    });
            }
        } else {
            handleTabClick('onSiteAmenties');
        }
    }

    private handleSuggestedChange = (e: ChangeEvent<HTMLInputElement>, id: number) => {
        const { openspaceId } = this.props;
        const obj = {
            openSpace: openspaceId,
            suggestedUse: id,
        };
        this.setState(prevState => ({
            checkedSuggestedUses: prevState.checkedSuggestedUses.find(
                item => item.suggestedUse === id,
            )
                ? prevState.checkedSuggestedUses.filter(item => item.suggestedUse !== id)
                : [...prevState.checkedSuggestedUses, obj],
        }));
    }

    public componentDidMount() {
        this.getSuggestedUsesList();
        this.getSingleSuggestedList();
    }

    public render() {
        const { handleTabClick, openspaceId, resourceId } = this.props;

        const { suggestedUsesList, singleSuggestedUses, pristine, singleSuggestedUsesIds, error } = this.state;
        return (
            <React.Fragment>
                {
                    resourceId !== undefined
                        ? (
                            suggestedUsesList && singleSuggestedUsesIds
                            && suggestedUsesList.map((item) => {
                                const checkDefault = singleSuggestedUses && singleSuggestedUsesIds.includes(item.id);
                                return (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingBottom: '10px',

                                    }} key={item.id}>
                                        <i
                                            className={item.iconName}
                                            style={{
                                                color: 'rgba(0,0,0,0.6)',
                                                height: '18px',
                                                width: '18px',
                                                verticalAlign: 'middle',
                                            }}
                                        />
                                        <input
                                            style={{ margin: '0 5px' }}
                                            type="checkbox"
                                            defaultChecked={checkDefault && checkDefault}

                                            onClick={(e) => {
                                                this.handleEditSuggestedChange(e, item.id, item);
                                            }}
                                        />
                                        <p
                                            style={{
                                                lineHeight: '0'
                                            }}
                                        >{item.suggestedUse}</p>
                                    </div>
                                );
                            })
                        )
                        : (
                            suggestedUsesList
                            && suggestedUsesList.map(item => (
                                <div key={item.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingBottom: '10px',
                                    }}>
                                    <i
                                        className={item.iconName}
                                        style={{
                                            color: 'rgba(0,0,0,0.6)',
                                            height: '18px',
                                            width: '18px',
                                            verticalAlign: 'middle',
                                        }}
                                    />
                                    <input
                                        style={{ margin: '0 5px' }}
                                        type="checkbox"
                                        onClick={e => this.handleSuggestedChange(e, item.id)}
                                    />
                                    <p
                                        style={{
                                            lineHeight: '0'
                                        }}
                                    >{item.suggestedUse}</p>
                                </div>
                            )))
                }
                {
                    error && (
                        <NonFieldErrors
                            faramElement
                            errors={['Some error occured!']}
                        />
                    )
                }
                <div className={styles.stepButtons}>
                    <PrimaryButton
                        onClick={() => handleTabClick('details')}
                    >
                        Back
                    </PrimaryButton>
                    <PrimaryButton
                        onClick={
                            resourceId === undefined
                                ? this.postAllSuggestedUses
                                : () => handleTabClick('onSiteAmenties')
                        }
                        disabled={pristine}
                    // pending={addResourcePending || editResourcePending}
                    >
                        Save and Continue
                    </PrimaryButton>
                </div>
            </React.Fragment>
        );
    }
}

export default createRequestClient(requests)(SuggestedUses);
