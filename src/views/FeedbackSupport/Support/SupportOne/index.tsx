/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */
import React, { useState } from 'react';
import Button from 'src/vendor/react-store/v2/Action/Button';
import { navigate } from '@reach/router';
import Page from '#components/Page';
import styles from './styles.scss';

const SupportOne = () => {
  const [checked, setChecked] = useState(false);
  const [data, setdata] = useState({
    fullName: '',
    designation: '',
    institutionName: '',
    email: '',
  });

  const formHandler = (e: any) => {
    setdata({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Page
        hideFilter
        hideMap
      />
      <div className={styles.mainDiv}>
        <div className={styles.container_leave_support}>
          <div className={styles.wrapper_leave_support}>
            <div className={styles.feedback_container}>
              <div className={styles.feedback_wrapper}>
                <div className={styles.feed_head_container}>
                  <div className={styles.feed_head_wrapper}>
                    technical support request
                    { }
                  </div>
                </div>
                <div className={styles.feed_desc}>
                  To request for technical support regarding BIPAD portal
                </div>
                <div className={styles.feedback_button}>
                  <Button
                    className={styles.feedback_btn}
                    onClick={() => navigate('/feedback-support/')}
                  >
                    TECHNICAL SUPPORT REQUEST FORM
                  </Button>
                </div>
              </div>
            </div>

            <div className={styles.support_container}>
              {/* <div className={styles.cross_button}>
                <button className={styles.cross_btn}>
                  <i className="fas fa-times fa-3x" />
                </button>
              </div> */}
              <div className={styles.tech_support_wrapper}>
                <div className={styles.tech_support_head}>
                  Please provide the following details
                </div>
                <div className={styles.tech_support_input}>
                  <div className={styles.input_name}>
                    <input
                      type="text"
                      name="fullName"
                      className={styles.fname}
                      placeholder="Full Name"
                      value={data.fullName}
                      onChange={formHandler}
                    />
                  </div>
                  <div className={styles.input}>
                    <input
                      type="text"
                      name="designation"
                      className={styles.designation}
                      placeholder="Designation (eg. IT Officer)"
                      value={data.designation}
                      onChange={formHandler}
                    />
                  </div>
                  <div className={styles.input}>
                    <input
                      type="text"
                      name="institutionName"
                      className={styles.insname}
                      placeholder="Name of the Institution"
                      value={data.institutionName}
                      onChange={formHandler}
                    />
                  </div>

                  <div className={styles.input}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Official Email"
                      autoComplete="off"
                      className={styles.email}
                      value={data.email}
                      onChange={formHandler}
                    />
                  </div>

                  <div className={styles.verify_head}>
                    Select anonymous if you do not want to provide your personal
                    details.
                  </div>

                  <div className={styles.input_checkbox}>
                    <div className={styles.checkbox}>
                      <input
                        type="checkbox"
                        id="verify"
                        className={styles.checkbox_verify}
                        name="verify"
                        onChange={(e: any) => setChecked(e.target.checked)}
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
                  disabled={!checked}
                  onClick={() => navigate('/support-2/')}
                >
                  next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportOne;
