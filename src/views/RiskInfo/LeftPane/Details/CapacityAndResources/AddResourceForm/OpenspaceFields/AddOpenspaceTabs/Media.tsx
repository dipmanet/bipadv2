import React from 'react';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import styles from './styles.scss';

interface Props {
    openspaceId: number;
    resourceId: number | undefined;
    handleTabClick: (tab: string) => void;
}

interface State {
    pristine: boolean | undefined;
    files: [];
}

class Media extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            pristine: true,
            files: [],
        };
    }

    private fileSelectedHandler = (e) => {
        // eslint-disable-next-line react/no-access-state-in-setstate
        this.setState({ files: [...this.state.files, ...e.target.files] });
    }


    private postImagesinBulk = () => {
        const { files } = this.state;
        if (files.length !== 0) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < files.length; i++) {
                this.postOpenspaceImage(files[i]);
                if (i === files.length - 1) {
                    this.setState({
                        pristine: false,
                    });
                    setTimeout(() => {
                        this.props.handleTabClick('closeModal');
                    }, 2000);
                }
            }
        } else {
            this.props.handleTabClick('closeModal');
        }
    }

    private postOpenspaceImage = (image) => {
        const { openspaceId, resourceId } = this.props;
        const formdata = new FormData();
        formdata.append('image', image);
        formdata.append('openSpace', JSON.stringify(resourceId || openspaceId));

        const requestOptions = {
            method: 'POST',
            body: formdata,
            // credentials: 'same origin'
        };
        fetch(`${process.env.REACT_APP_API_SERVER_URL}/open-media/`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log('upload success', data);
            });
    }

    public render() {
        const { pristine, files } = this.state;
        const { handleTabClick } = this.props;
        return (
            <React.Fragment>

                <input
                    type="file"
                    multiple
                    onChange={this.fileSelectedHandler}
                    style={{
                        marginTop: '12px',
                        marginBottom: '12px',
                    }}
                />
                <p>You can choose multiple files.</p>
                {
                    files.length !== 0
                    && (
                        <div className="gallery-grid">
                            <div
                                className={styles.galleryRow}
                            >

                                {
                                    files.map(file => (
                                        <div className={styles.flexRowItem}>
                                            <img
                                                id="profileOutput"
                                                height="100"
                                                width="100"
                                                alt="openspace"
                                                src={URL.createObjectURL(file)}
                                                className={styles.profileOutput}
                                            />
                                        </div>
                                    ))
                                }

                            </div>
                        </div>
                    )
                }

                <div className={styles.stepButtons}>
                    <PrimaryButton
                        type="submit"
                        disabled={pristine}
                        // disabled={pristine}
                        // pending={addResourcePending || editResourcePending}
                        onClick={() => handleTabClick('closeModal')}
                    >
                        Close
                    </PrimaryButton>
                    <PrimaryButton

                        // pending={addResourcePending || editResourcePending}
                        onClick={() => this.postImagesinBulk()}
                    >
                        Save
                    </PrimaryButton>
                </div>
            </React.Fragment>
        );
    }
}

export default Media;
