/* eslint-disable max-len */
import { useDropzone } from 'react-dropzone';
import { TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { isList } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import Navbar from 'src/admin/components/Navbar';
import MenuCommon from 'src/admin/components/MenuCommon';
import Footer from 'src/admin/components/Footer';
import { useForm, Controller } from 'react-hook-form';
import Loader from 'react-loader';
import Page from '#components/Page';

import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { SetEpidemicsPageAction } from '#actionCreators';
import { epidemicsPageSelector, userSelector } from '#selectors';
import UploadIcon from '../../resources/uploadIcon.svg';
import Ideaicon from '../../resources/ideaicon.svg';
import styles from './styles.module.scss';


const mapStateToProps = (state: AppState): PropsFromAppState => ({
    epidemmicsPage: epidemicsPageSelector(state),
    userDataMain: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEpidemicsPage: params => dispatch(SetEpidemicsPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    uploadData: {
        url: '/bulkupload/',
        method: methods.GET,
        onMount: false,
        query: () => ({
            format: 'json',
            ordering: '-last_modified_date',
        }),
        onSuccess: ({ response, props, params }) => {
            props.setEpidemicsPage({
                uploadData: response.results,
            });
            params.setLoading(false);
        },
    },
};


const baseUrl = process.env.REACT_APP_API_SERVER_URL;

const EpidemicBulkUpload = (props) => {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(null);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: '.xls,.xlsx' });
    const {
        epidemmicsPage: {
            uploadData,
        },
        userDataMain,
        uri,
    } = props;

    const {
        register,
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (userDataMain && userDataMain.profile && userDataMain.profile.role) {
            setRole(userDataMain.profile.role);
        } else if (userDataMain && userDataMain.isSuperuser) {
            setRole('superuser');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useState(() => {
        props.requests.uploadData.do({ setLoading });
    }, []);

    const removeAll = () => {
        acceptedFiles.length = 0;
        acceptedFiles.splice(0, acceptedFiles.length);
    };

    const cancelForm = () => {
        reset({ title: '', description: '' });
        removeAll();
    };
    const getDisabled = () => {
        if (!role) {
            return true;
        }
        if (role === 'validator') {
            return true;
        }
        return false;
    };

    const isFile = (input: any): input is File => (
        'File' in window && input instanceof File
    );
    const isBlob = (input: any): input is Blob => (
        'Blob' in window && input instanceof Blob
    );

    const sanitizeFormData = (value: any) => {
        if (value === null) {
            return '';
        }
        if (isFile(value) || isBlob(value) || typeof value === 'string') {
            return value;
        }
        return JSON.stringify(value);
    };

    const getFormData = (jsonData: FormDataType | undefined) => {
        const formDataNew = new FormData();
        if (!jsonData) {
            return formDataNew;
        }

        Object.entries(jsonData).forEach(
            ([key, value]) => {
                if (isList(value)) {
                    value.forEach((val: unknown) => {
                        if (val !== undefined) {
                            const sanitizedVal = sanitizeFormData(val);
                            formDataNew.append(key, sanitizedVal);
                        }
                    });
                } else if (value !== undefined) {
                    const sanitizedValue = sanitizeFormData(value);
                    formDataNew.append(key, sanitizedValue);
                }
            },
        );
        return formDataNew;
    };
    const uploadBulkFile = (formdata) => {
        setLoading(true);
        if (acceptedFiles.length === 0) {
            setLoading(false);
        } else {
            const individulaBulkData = {
                title: formdata.title,
                description: formdata.description,
                dataTemplate: 'Epidemic group admin',
                dataType: 'Group',
                file: acceptedFiles[0],
            };
            if (Object.keys(errors).length === 0 && acceptedFiles[0]) {
                axios.post(`${baseUrl}/bulkupload/`, getFormData(individulaBulkData))
                    .then(() => {
                        props.requests.uploadData.do({ setLoading });
                        removeAll();
                        reset();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                console.log('Something went wrong');
            }
        }
    };

    // template download
    const downloadFile = () => {
        axios.get(`${baseUrl}/data_template_file/`)
            .then((file) => {
                const template = file.data.results.filter(item => item.dataTemplateSlug
                    === 'heoc_admin_epidemic_group_bulk_upload');
                window.open(template[0].file);
            });
    };

    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon currentPage={'Epidemics'} layout={'common'} uri={uri} />
            <div className={styles.bulkUploadContainer}>
                <div className={styles.firstRowSection}>
                    <div className={styles.headTextAres}>
                        <h1 className={styles.generalInformation}>Bulk Upload</h1>
                        <div className={styles.ideaDescription}>
                            <img className={styles.ideaIcon} src={Ideaicon} alt="" />
                            <p className={styles.shortDescription}>
                                To upload a list of epidemic data, kindly download the
                                template sheet, fill the data in the required heading,
                                and upload it below. Do make sure that the data are in
                                excel (.xsls) format and headings provided in the template
                                are unchanged before uploading it. The bulk data uploaded
                                will be processed, and verified by the system before
                                integrating into HEOC and the user will be notified about
                                the status of the bulk upload.
                            </p>
                        </div>
                    </div>

                    <button
                        disabled={getDisabled()}
                        className={styles.downloadTemplate}
                        onClick={downloadFile}
                        type="button"
                    >
                        Download the Template
                    </button>
                </div>

                <div className={styles.secondRowSection}>
                    <div className={styles.uploadImageArea}>
                        <div className={styles.app}>
                            <section className={styles.container}>
                                <div {...getRootProps({ className: 'dropzone' })}>
                                    <input disabled={getDisabled()} {...getInputProps()} />
                                    <p>Drag drop some files here, or click to select files</p>
                                    <img src={UploadIcon} alt="" width="400px" />
                                </div>
                            </section>

                            <div>
                                {
                                    acceptedFiles.length > 0
                                        ? (
                                            <>
                                                <strong>Files:</strong>
                                                <aside>
                                                    {acceptedFiles.map(file => `${file.name} ${file.size}`)}
                                                </aside>
                                            </>
                                        ) : (
                                            'Add some file'
                                        )
                                }
                            </div>
                        </div>
                    </div>
                    <form className={styles.form}>
                        <div className={styles.formArea}>
                            <Controller
                                name={'title'}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        className={styles.datasetTitle}
                                        onChange={onChange}
                                        value={value}
                                        label={'Title'}
                                        placeholder="Title"
                                        fullWidth
                                        disabled={getDisabled()}
                                        id="outlined-basic"
                                        variant="outlined"
                                        {...register('title', { required: true })}
                                        error={errors.title}
                                        helperText={errors.title ? 'This field is required' : null}
                                    />
                                )}
                            />

                            <Controller
                                name={'description'}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        className={styles.datasetTitle}
                                        multiline
                                        rows="4"
                                        fullWidth
                                        label={'Description'}
                                        id="outlined-basic"
                                        variant="outlined"
                                        onChange={onChange}
                                        disabled={getDisabled()}
                                        placeholder="Description"
                                        value={value}
                                        {...register('description', { required: true })}
                                        error={errors.description}
                                        helperText={errors.description ? 'This field is required' : null}
                                    />
                                )}
                            />
                            <div className={styles.buttonSection}>
                                <button disabled={getDisabled()} onClick={handleSubmit(uploadBulkFile)} className={styles.uploadButton} type="submit">Upload File</button>
                                <button
                                    disabled={getDisabled()}
                                    onClick={cancelForm}
                                    className={styles.cancelButton}
                                    type="button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                {

                    loading ? (
                        <Loader options={{
                            position: 'fixed',
                            top: '48%',
                            right: 0,
                            bottom: 0,
                            left: '48%',
                            background: 'gray',
                            zIndex: 9999,
                        }}
                        />
                    ) : (
                        uploadData && uploadData.length > 0 && (
                            <div className={styles.thirdRowSection}>
                                <h1 className={styles.uploadFileDisplay}>Uploaded Files</h1>
                                <div className={styles.mainTableSection}>
                                    <table className={styles.table}>
                                        <thead className={styles.head}>
                                            <tr className={styles.row}>
                                                <td>S.N</td>
                                                <td>Title</td>
                                                <td>Description</td>
                                                <td>Date Created</td>
                                                <td>Date Modified</td>
                                                <td>Status</td>
                                                <td>Progress</td>
                                                <td>Download</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {uploadData.filter(f => f.dataTemplate === 'Epidemic group admin').map((uI, i) => (
                                                <tr className={styles.row} key={uI.id}>
                                                    <td className={styles.cell}>{i + 1}</td>
                                                    <td className={styles.cell}>{uI.title || '-'}</td>
                                                    <td className={styles.cell}>{uI.description || '-'}</td>
                                                    <td className={styles.cell}>{uI.createdOn.split('T')[0] || '-'}</td>
                                                    <td className={styles.cell}>{uI.modifiedOn.split('T')[0] || '-'}</td>
                                                    <td className={styles.cell}>{uI.status || '-'}</td>
                                                    <td className={styles.cell}>{uI.progress || '-'}</td>
                                                    <td className={styles.cell}>
                                                        <a href={uI.file}><DownloadIcon /></a>
                                                    </td>
                                                </tr>
                                            ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    )
                }
            </div>
            <Footer />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            EpidemicBulkUpload,
        ),
    ),
);
