import { useDropzone } from 'react-dropzone';
import { TextareaAutosize, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { isList } from '@togglecorp/fujs';
import { connect, useDispatch } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import Navbar from 'src/admin/components/Navbar';
import MenuCommon from 'src/admin/components/MenuCommon';
import Footer from 'src/admin/components/Footer';
import styles from './styles.module.scss';
import Ideaicon from '../../resources/ideaicon.svg';
import UploadIcon from '../../resources/uploadIcon.svg';
import Page from '#components/Page';
// import { epidemicBulkUpload, getUploadData } from '../../Redux/actions';
// import { RootState } from '../../Redux/store';

import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { SetEpidemicsPageAction } from '#actionCreators';
import { epidemicsPageSelector } from '#selectors';


const mapStateToProps = (state: AppState): PropsFromAppState => ({
    epidemmicsPage: epidemicsPageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEpidemicsPage: params => dispatch(SetEpidemicsPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    incidents: {
        url: '/incident/',
        method: methods.GET,
        onMount: false,
        query: params => ({
            format: 'json',
            hazard: 9,
            offset: params.offset,
            limit: 100,
            count: true,
            expand: ['loss.peoples', 'wards', 'wards.municipality', 'wards.municipality.district', 'wards.municipality.district.province'],
            ordering: '-id',
        }),
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({
                incidentData: response.results,
                incidentCount: response.count,
            });
        },
    },
};


const baseUrl = process.env.REACT_APP_API_SERVER_URL;

const EpidemicBulkUpload = (props) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [role, setRole] = useState(null);
    const [fileNames, setFileNames] = useState([]);
    const [fileSize, setfileSize] = useState([]);
    const [formValidationError, setFormValidationError] = useState(null);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const {
        epidemmicsPage: {
            uploadData,
        },
        userDataMain,
    } = props;

    useEffect(() => {
        if (userDataMain && userDataMain.profile && userDataMain.profile.role) {
            setRole(userDataMain.profile.role);
        } else if (userDataMain && userDataMain.isSuperuser) {
            setRole('superuser');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getDisabled = () => {
        if (!role) {
            return true;
        }
        if (role === 'validator') {
            return true;
        }
        return false;
    };
    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path}
            {' '}
-
            {' '}
            {file.size}
            {' '}
bytes
        </li>
    ));

    const handleDrop = (acceptedFile) => {
        setFileNames(acceptedFile.map(file => file.name));
        setfileSize(acceptedFile.map(file => file.size));
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
    const dispatch = useDispatch();
    const uploadBulkFile = () => {
        const individulaBulkData = {
            title,
            description,
            dataTemplate: 'Epidemic group admin',
            dataType: 'Group',
            file: acceptedFiles[0],
        };
        // dispatch(epidemicBulkUpload(getFormData(individulaBulkData)));
    };

    const convertToObj = (a, b) => {
        if (a.length !== b.length || a.length === 0 || b.length === 0) {
            return null;
        }
        const obj = {};

        a.forEach((k, i) => { obj[k] = b[i]; });
        return obj;
    };

    // useState(() => {
    //     dispatch(getUploadData());
    // }, []);

    // React.useEffect(() => {
    //     if (!loadingCovid19PutBulkData) {
    //         if (errorCovid19PutBulkData) {
    //             const msgKey = Object.keys(errorCovid19PutBulkData.response.data);
    //             const msgValues = Object.values(errorCovid19PutBulkData.response.data);
    //             const result = convertToObj(msgKey, msgValues);
    //             setFormValidationError(result);
    //         }
    //     }
    // }, []);
    if (formValidationError) {
        console.log('main error', formValidationError);
    }

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
            <MenuCommon currentPage={'Epidemics'} layout={'common'} />
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
                        <div className="App">
                            {
                                formValidationError && <p style={{ color: 'red' }}>{formValidationError.file}</p>
                            }
                            <section className="container">
                                <div {...getRootProps({ className: 'dropzone' })}>
                                    <input disabled={getDisabled()} {...getInputProps()} />
                                    <p>Drag drop some files here, or click to select files</p>
                                    <img src={UploadIcon} alt="" width="400px" />
                                </div>
                            </section>

                            <div>
                                {
                                    acceptedFiles.length > 0 && <strong>Files:</strong>
                                }
                                <aside>
                                    <ul>{files}</ul>
                                </aside>
                                <ul>
                                    {fileNames.map(fileName => (
                                        <li key={fileName}>
                                            Filename :
                                            {fileName}
                                        </li>
                                    ))}
                                    {fileSize.map(fileName => (
                                        <li key={fileName}>
                                            Size:
                                            {' '}
                                            {fileName}
                                            {' '}
                                            KB
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={styles.formArea}>
                        {
                            formValidationError && <p style={{ color: 'red' }}>{formValidationError.title}</p>
                        }
                        <TextField
                            className={styles.datasetTitle}
                            fullWidth
                            disabled={getDisabled()}
                            id="outlined-basic"
                            label="Title"
                            variant="outlined"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <TextareaAutosize
                            className={styles.textArea}
                            disabled={getDisabled()}
                            aria-label="description textarea"
                            placeholder="Description"
                            style={{ height: '180px' }}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <div className={styles.buttonSection}>
                            <button disabled={getDisabled()} className={styles.uploadButton} onClick={uploadBulkFile} type="submit">Upload File</button>
                            <button disabled={getDisabled()} className={styles.cancelButton} type="submit">Cancel</button>
                        </div>
                    </div>
                </div>

                {
                    // uploadData.length > 0 && (
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
                    // )
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
