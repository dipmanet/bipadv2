/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react';
import Button from 'src/vendor/react-store/v2/Action/Button';
import { navigate } from '@reach/router';
import { _cs } from '@togglecorp/fujs';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import styles from './styles.scss';

const SupportOne = (props) => {
  const { className, onNextClick, data,
    setData, error, setError, setPosition, closeModal } = props;
  const [checked, setchecked] = useState(false);
  const [inputField, setInputField] = useState({
    fullName: false,
    designation: false,
    nameOfInstitution: false,
    email: false,
  });

  const formHandler = (e: any) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };


  const inputValidation = () => {
    const emailMessage = '* Please provide a valid email address.';
    const invalidMessage = '* Please provide a valid input';
    const newerror = { ...error };
    const newInputField = { ...inputField };
    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    const validNameRegex = new RegExp(/^(?![ .]+$)[a-zA-Z .]*$/);

    if (!data.isAnonymous) {
      if (!validEmailRegex.test(data.email) || data.email === '') {
        newerror.emailError = emailMessage;
      } else {
        newerror.emailError = '';
      }
      if (!validNameRegex.test(data.fullName)
        || data.fullName === '') {
        newerror.fullNameError = invalidMessage;
      } else {
        newerror.fullNameError = '';
      }

      if (!validNameRegex.test(data.designation)
        || data.designation === '') {
        newerror.designationError = invalidMessage;
      } else {
        newerror.designationError = '';
      }

      if (!validNameRegex.test(data.nameOfTheInstitution)
        || data.nameOfTheInstitution === '') {
        newerror.nameOfTheInstitutionError = invalidMessage;
      } else {
        newerror.nameOfTheInstitutionError = '';
      }


      setError(newerror);
    }
    setchecked(true);
  };

  useEffect(() => {
    if (error) {
      setchecked(false);
    }
  }, [error]);


  useEffect(() => {
    if (data.isAnonymous) {
      setInputField({
        ...inputField,
        fullName: true,
        designation: true,
        nameOfInstitution: true,
        email: true
      });
      setError({
        ...error,
        fullNameError: '',
        designationError: '',
        nameOfTheInstitutionError: '',
        emailError: ''
      });
      setData({
        ...data,
        fullName: '',
        designation: '',
        nameOfTheInstitution: '',
        email: ''
      });
    }
    if (!data.isAnonymous) {
      setInputField({
        ...inputField,
        fullName: false,
        designation: false,
        nameOfInstitution: false,
        email: false
      });
    }
  }, [data.isAnonymous]);


  useEffect(() => {
    if (checked && !data.isAnonymous) {
      if (data.fullName
        && data.designation
        && data.nameOfTheInstitution
        && data.email
        && !error.fullNameError
        && !error.designationError
        && !error.nameOfTheInstitutionError
        && !error.emailError) {
        onNextClick();
      }
    }
    if (data.isAnonymous
      && checked
    ) {
      onNextClick();
    }
  }, [checked, data, error]);

  return (

    <>
      <Modal className={_cs(styles.loginModal, className)}>
        <ModalBody className={styles.content}>
          <DangerButton
            transparent
            iconName="close"
            onClick={() => closeModal()}
            title="Close Modal"
            className={styles.closeButton}
          />
          <div className={styles.container_leave_support}>
            <div className={styles.wrapper_leave_support}>
              <div className={styles.feedback_container}>
                <div className={styles.feedback_wrapper}>
                  <div className={styles.feed_head_container}>
                    <div className={styles.feed_head_wrapper}>
                      technical support request
                    </div>
                  </div>
                  <div className={styles.feed_desc}>
                    To request for technical support regarding BIPAD portal
                  </div>
                  <div className={styles.feedback_button}>
                    <Button
                      className={styles.feedback_btn}
                      onClick={() => setPosition(0)}
                    >
                      TECHNICAL SUPPORT REQUEST FORM
                    </Button>
                  </div>
                </div>
              </div>

              <div className={styles.support_container}>
                <div className={styles.tech_support_wrapper}>
                  <div className={styles.tech_support_head}>
                    Please provide the following details
                  </div>
                  <div className={styles.tech_support_input}>
                    <div className={error.fullNameError ? styles.input_error : styles.input}>
                      <input
                        type="text"
                        name="fullName"
                        disabled={inputField.fullName}
                        className={error.fullNameError
                          ? styles.error
                          : styles.fname}
                        placeholder="Full Name"
                        value={data.fullName}
                        onChange={formHandler}
                        autoComplete="off"
                      />
                    </div>
                    <div className={error.fullNameError
                      ? styles.error_text
                      : styles.no_error}
                    >
                      {error.fullNameError}
                    </div>
                    <div className={error.designationError ? styles.input_error : styles.input}>
                      <input
                        type="text"
                        name="designation"
                        disabled={inputField.designation}
                        className={error.designationError
                          ? styles.error : styles.designation}
                        placeholder="Designation(eg.IT Officer)"
                        value={data.designation}
                        onChange={formHandler}
                        autoComplete="off"
                      />
                    </div>
                    <div className={error.designationError
                      ? styles.error_text
                      : styles.no_error}
                    >
                      {error.designationError}

                    </div>
                    <div className={error.nameOfTheInstitutionError
                      ? styles.input_error : styles.input}
                    >
                      <input
                        type="text"
                        name="nameOfTheInstitution"
                        disabled={inputField.nameOfInstitution}
                        className={error.nameOfTheInstitutionError
                          ? styles.error : styles.insname}
                        placeholder="Name of the Institution"
                        value={data.nameOfTheInstitution}
                        onChange={formHandler}
                        autoComplete="off"
                      />
                    </div>
                    <div className={error.nameOfTheInstitutionError
                      ? styles.error_text
                      : styles.no_error}
                    >
                      {error.nameOfTheInstitutionError}

                    </div>

                    <div className={error.emailError
                      ? styles.input_email_error : styles.input_email}
                    >
                      <input
                        type="email"
                        name="email"
                        disabled={inputField.email}
                        placeholder="Official Email"
                        className={error.emailError
                          ? styles.error : styles.email}
                        value={data.email}
                        onChange={formHandler}
                        autoComplete="off"
                      />
                    </div>
                    <div className={error.emailError
                      ? styles.error_text
                      : styles.no_error}
                    >
                      {error.emailError}

                    </div>

                    <div className={styles.verify_div}>

                      <span className={styles.verify_head}>
                        Select anonymous if you do not want to provide your personal
                        details.
                      </span>

                      <div className={styles.input_checkbox}>
                        <div className={styles.checkbox}>
                          <input
                            type="checkbox"
                            id="verify"
                            className={styles.checkbox_verify}
                            name="verify"
                            onChange={(e: any) => setData({ ...data, isAnonymous: e.target.checked })}
                          />
                        </div>
                        <label htmlFor="verify" className={styles.verify_text}>
                          Anonymous
                        </label>
                      </div>
                    </div>


                  </div>

                  <div className={styles.next_button}>
                    <Button
                      className={styles.next_btn}
                      onClick={inputValidation}
                    >
                      next
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SupportOne;
