/* eslint-disable*/
import React from 'react';
import styles from '../styles.scss';
import './Details.css';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import {
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';

interface EnvironmentAttribute {
    id: number;
    iconName: string;
    name: string;
}

interface EnvironmentAttributeResponse {
    results: EnvironmentAttribute[];
}
interface State {
    isActive: [];
    allEia: EnvironmentAttribute[];
    allEiaToPost: [];
}

interface Props {
    handleTabClick: (tab: string) => void;
    openspaceId: number;
    resourceId: number | undefined;
}


interface ReduxProps { }
interface Params { }
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    getAllAmenitiesRequest: {
        url: '/eia/',
        method: methods.GET,
        onSuccess: ({ response, params }) => {
            if (params && params.setAllEiaList) {
                params.setAllEiaList(response.results);
            }
        },
    },
    getSingleAmenitiesRequest: {
        url: ({ props: { openspaceId } }) => `/open-eia/?open_space=${openspaceId}`,
        // url: `/open-eia/?open_space=49`,
        method: methods.GET,
        onSuccess: ({ response, params }) => {
            if (params.setSingleEiaList) {
                params.setSingleEiaList(response.results);
            }
        },
    },
    addEiaRequest: {
        url: '/open-eia/',
        // url: ({ params: { id } }) => `/open-eia/${id}/`,
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ response }) => {
            console.log(response);
        },
    },
    editEiaRequest: {
        // url: '/open-eia/',
        url: ({ params: { id } }) => `/open-eia/${id}/`,
        method: methods.PUT,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ response }) => {
            console.log(response);
        },
    },
};

class EnvironmentChecklist extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            isActive: [],
            allEia: [],
            allEiaToPost: [],
        };
    }

    public componentDidMount() {
        const {
            requests: {
                getSingleAmenitiesRequest,
                getAllAmenitiesRequest,
            },
        } = this.props;
        getSingleAmenitiesRequest.do({
            setSingleEiaList: this.setSingleEiaList,
        });
        getAllAmenitiesRequest.do({
            setAllEiaList: this.setAllEiaList,
        });
    }

    private setAllEiaList = (allEia: EnvironmentAttribute[]) => {
        const { openspaceId } = this.props;
        const allEiaToPost = [];
        allEia.map((eia) => {
            const obj = {
                openSpace: openspaceId,
                eia: eia.id,
                isAvailable: false,
            };
            allEiaToPost.push(obj);
        });
        this.setState({
            allEia,
            allEiaToPost,
        });
    }

    private handleEiaChange = (e, listItem: EnvironmentAttribute) => {
        const { openspaceId } = this.props;
        const obj = {
            openSpace: openspaceId,
            eia: listItem.id,
            isAvailable: e.target.checked,
        };

        const EiaToPost = this.state.allEiaToPost;
        EiaToPost.forEach((element, index) => {
            if (element.eia === obj.eia) {
                EiaToPost[index] = obj;
            }
        });
        this.setState({
            allEiaToPost: EiaToPost,
        });
    };

    private postEia = () => {
        const { allEiaToPost } = this.state;
        const {
            handleTabClick,LoadingSuccessHalt
        } = this.props;
        LoadingSuccessHalt(true)
        if (allEiaToPost.length !== 0) {
            for (let i = 0; i < allEiaToPost.length; i++) {
                const requestOptions = {
                    method: 'POST',
                    body: JSON.stringify(allEiaToPost[i]),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                };
                fetch(`${process.env.REACT_APP_API_SERVER_URL}/open-eia/`, requestOptions)
                    .then(response => response.json())
                    .then(() => {
                        if (i === allEiaToPost.length - 1) {
                            handleTabClick('media');
                            LoadingSuccessHalt(false)
                        }
                    });
            }
        } else {
            handleTabClick('media');
            LoadingSuccessHalt(false)
        }
    }

    private handleEditEiaChange = (e, listItem: EnvironmentAttribute, latestValue) => {
        const { checked } = e.target;
        const { openspaceId } = this.props;
        const { id, eia } = latestValue;

        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify({
                openSpace: openspaceId,
                eia,
                isAvailable: checked,
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };
        fetch(`${process.env.REACT_APP_API_SERVER_URL}/open-eia/${id}/`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log('PUT success..');
            });
    }

    private setSingleEiaList = (eiaList: string | any[]) => {
        this.setState({
            singleEiaList: eiaList,
        });
    }


    public render() {
        const { allEia, singleEiaList } = this.state;
        const { handleTabClick, resourceId } = this.props;

        return (
            <React.Fragment>
                {
                    resourceId === undefined ? (
                        allEia && allEia.map((listItem: EnvironmentAttribute) => (
                            <React.Fragment key={listItem.id}>
                                <div className={styles.environmentCheckDiv}>
                                    {listItem.name}
                                    <label className={styles.switch}>
                                        <input
                                            type="checkbox"
                                            value=""
                                            onClick={e => this.handleEiaChange(e, listItem)}
                                        />
                                        <span className={styles.slider} />
                                    </label>
                                </div>
                                <hr />
                            </React.Fragment>
                        ))

                    ) : (
                            allEia && singleEiaList && allEia.map((listItem: EnvironmentAttribute) => {
                                const eiaAvailability = singleEiaList && singleEiaList.filter(el => el.eia === listItem.id);
                                return (
                                    <React.Fragment key={listItem.id}>
                                        <div className={styles.environmentCheckDiv}>
                                            {listItem.name}
                                            <label className={styles.switch}>
                                                <input
                                                    type="checkbox"
                                                    value=""
                                                    defaultChecked={eiaAvailability.length !== 0 ? eiaAvailability[0].isAvailable : false}
                                                    onClick={e => this.handleEditEiaChange(e, listItem, eiaAvailability[0])}
                                                />
                                                <span className={styles.slider} />
                                            </label>
                                        </div>
                                        <hr />
                                    </React.Fragment>
                                );
                            })

                        )}


                <div className={styles.stepButtons}>
                    {/* <PrimaryButton
                        onClick={() => handleTabClick('onSiteAmenties')}
                    >
                        Back
                    </PrimaryButton> */}
                    <PrimaryButton
                        // disabled={pristine}
                        // pending={addResourcePending || editResourcePending}
                        onClick={() => (
                            resourceId === undefined ? this.postEia()
                                : handleTabClick('media'))}
                    >
                        Save and Continue
                    </PrimaryButton>
                </div>
            </React.Fragment>
        );
    }
}

export default createRequestClient(requests)(EnvironmentChecklist);
