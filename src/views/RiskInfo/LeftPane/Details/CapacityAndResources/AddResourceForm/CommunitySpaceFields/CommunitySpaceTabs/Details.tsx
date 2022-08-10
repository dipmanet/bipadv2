import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import styles from '../../OpenspaceFields/AddOpenspaceTabs/styles.scss';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import NonFieldErrors from '#rsci/NonFieldErrors';
import {
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';

import { languageSelector } from '#selectors';

interface Props {
    handleTabClick: (tab: string) => void;
    handleImageChange: () => void;
    closeModal: () => void;
    openspaceId: number | undefined;
    resourceId: number | undefined;


}

interface State {
    filename: string;
    objectId: number | null;
    geoserverUrl: string | undefined;
    layerName: string | undefined;
    workspace: string | undefined;
    openspacePostError: boolean;
}
interface FaramValues {
}

interface FaramErrors {
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    getDetailsRequest: {
        url: ({ params: { resourceId } }) => `/communityspace-detail/?community_space=${resourceId}`,
        method: methods.GET,
        onSuccess: ({ response, params }) => {
            if (params.setSingleDetails) {
                params.setSingleDetails(response.results[0]);
            }
        },
    },
};

class Details extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            objectId: null,
            openspacePostError: false,
            geoserverUrl: '',
            layerName: '',
            workspace: '',
        };
    }

    public componentDidMount() {
        const {
            requests: {
                getDetailsRequest,
            }, resourceId,
        } = this.props;
        if (resourceId) {
            getDetailsRequest.do({
                setSingleDetails: this.setSingleDetails,
                resourceId,
            });
        }
    }

    private handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'coverImage') {
            this.setState({
                [name]: e.target.files[0],
            });
        } else {
            this.setState({
                [name]: value,
            });
        }
    }

    private handleImageChange = (e) => {
        const { name } = e.target;
        this.setState({ [name]: e.target.files[0] },
            () => this.submitShapeFile());
    }

    private submitShapeFile = () => {
        this.setState({
            openspacePostError: false,
        });
        const {
            shapeFile,
        } = this.state;

        const {
            openspaceId,
        } = this.props;
        const formdata = new FormData();
        formdata.append('category', 'communityspace');
        formdata.append('communityspace_id', JSON.stringify(openspaceId));
        if (shapeFile) formdata.append('shape', shapeFile);


        const requestOptions = {
            method: 'POST',
            body: formdata,
            // credentials: 'same origin'
        };
        const url = process.env.REACT_APP_API_SERVER_URL;
        const splittedUrl = url.split('/api');

        fetch(`${splittedUrl[0]}/en/api/v1/shape/`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    objectId: data.object_id,
                });
            })
            .catch(() => {
                this.setState({
                    openspacePostError: true,
                    objectId: null,
                });
            });
    }

    private submitDetails = () => {
        const {
            coverImage, geoserverUrl, layerName, workspace, objectId,
        } = this.state;

        const {
            openspaceId, closeModal, LoadingSuccessHalt, faramValueSetNull,
        } = this.props;
        LoadingSuccessHalt(true);
        const formdata = new FormData();
        formdata.append('communitySpace', JSON.stringify(openspaceId));
        if (coverImage) formdata.append('image', coverImage);
        formdata.append('geoserverUrl', geoserverUrl);
        formdata.append('layerName', layerName);
        formdata.append('workspace', workspace);

        const requestOptions = {
            method: 'PUT',
            body: formdata,
            // credentials: 'same origin'
        };

        fetch(`${process.env.REACT_APP_API_SERVER_URL}/communityspace-detail/${objectId}/`, requestOptions)
            .then(response => response.json())
            .then(() => {
                closeModal();
                LoadingSuccessHalt(false);
                faramValueSetNull();
            })
            .catch((error) => {
                this.setState({
                    openspacePostError: true,
                });
                LoadingSuccessHalt(false);
            });
    }

    private setSingleDetails = (details: DetailsResponse) => {
        const {
            id,
            geoserverUrl,
            layerName,
            workspace,
        } = details;
        this.setState({
            objectId: id,
            geoserverUrl,
            layerName,
            workspace,
        });
    }

    public render() {
        const { resourceId } = this.props;
        const { objectId, openspacePostError,
            geoserverUrl,
            layerName,
            workspace } = this.state;
        return (
            <Translation>
                {
                    t => (
                        <React.Fragment>
                            {
                                resourceId === undefined
                        && (
                            <div
                                className={styles.detailsInputGroup}
                                style={{
                                    marginTop: '12px',
                                    marginBottom: '12px',
                                }}
                            >
                                <span className={styles.detailsLabel}>
                                    {t('Add shape file(.zip extension)')}
                                </span>
                                <input
                                    name="shapeFile"
                                    onChange={e => this.handleImageChange(e)}
                                    type="file"
                                    accept=".zip,.rar,.7zip"
                                />
                            </div>
                        )
                            }


                            {
                                objectId || resourceId ? (
                                    <React.Fragment>
                                        <div
                                            className={styles.detailsInputGroup}
                                            style={{
                                                marginTop: '12px',
                                                marginBottom: '12px',
                                            }}
                                        >
                                            <span className={styles.detailsLabel}>{t('Geoserver URL')}</span>
                                            <input
                                                value={geoserverUrl}
                                                className={styles.detailsInput}
                                                name="geoserverUrl"
                                                onChange={e => this.handleChange(e)}
                                            />
                                        </div>
                                        <div className={styles.detailsInputGroup}>
                                            <span className={styles.detailsLabel}>{t('Layer Name')}</span>
                                            <input
                                                value={layerName}
                                                className={styles.detailsInput}
                                                name="layerName"
                                                onChange={e => this.handleChange(e)}
                                            />
                                        </div>
                                        <div className={styles.detailsInputGroup}>
                                            <span className={styles.detailsLabel}>{t('Workspace')}</span>
                                            <input
                                                value={workspace}
                                                className={styles.detailsInput}
                                                name="workspace"
                                                onChange={e => this.handleChange(e)}
                                            />
                                        </div>
                                        <div
                                            className={styles.detailsInputGroup}
                                            style={{
                                                marginTop: '12px',
                                                marginBottom: '12px',
                                            }}
                                        >
                                            <span className={styles.detailsLabel}>{t('Upload cover image:')}</span>
                                            <input
                                                className={styles.detailsInput}
                                                name="coverImage"
                                                type="file"
                                                onChange={e => this.handleChange(e)}
                                            />
                                        </div>
                                    </React.Fragment>
                                ) : <span>{t('Shapefile needs to be uploaded first..')}</span>
                            }
                            {
                                openspacePostError && (
                                    <NonFieldErrors
                                        faramElement
                                        errors={['Some error occured!']}
                                    />
                                )
                            }


                            <div className={styles.submitButn}>
                                {/* <PrimaryButton
                            disabled
                        >
                            Back
                        </PrimaryButton> */}
                                <PrimaryButton
                                    onClick={() => this.submitDetails()}
                                >
                                    {t('Save and Continue')}
                                </PrimaryButton>
                            </div>
                        </React.Fragment>
                    )
                }
            </Translation>

        );
    }
}

export default connect(mapStateToProps)(createRequestClient(requests)(Details));
