/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react';
import Button from 'src/vendor/react-store/v2/Action/Button';
import { navigate } from '@reach/router';
import { connect } from 'react-redux';
import Page from '#components/Page';
import styles from './styles.scss';
import Icon from '#rscg/Icon';
import { createConnectedRequestCoordinator, createRequestClient, methods } from '#request';


const requestOptions: { [key: string]: ClientAttributes<PropsWithRedux, Params> } = {
  TechnicalSupportPostRequest: {
    url: '/technical-support/',
    method: methods.POST,
    body: ({ params }) => params && params.body,
    onSuccess: ({ response, params }) => {
      console.log('This is response', response.results);
      if (params && params.receivedResponse) {
        params.receivedResponse(response.results);
      }
    },
    onFailure: ({ error, params }) => {
      if (params && params.receivedResponse) {
        params.receivedResponse(error);
      }
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
    extras: { hasFile: true },
  },
};


const SupportTwo = (props) => {
  const [checked, setChecked] = useState(false);
  const [finalData, setFinalData] = useState({});
  const [screenShotImage, setScreenShotImage] = useState();
  const [message, setMessage] = useState('');

  const { location: { state: { data } }, requests: { TechnicalSupportPostRequest } } = props;

  const fileHandler = (e: any) => {
    setScreenShotImage(e.target.files[0]);
  };


  useEffect(() => {
    if (screenShotImage) {
      setFinalData({ ...finalData, screenshot: screenShotImage });
    }
  }, [screenShotImage]);


  useEffect(() => {
    setFinalData(data);
  }, [data]);
  console.log('This is location', data);
  console.log('final data', finalData);

  const receivedSuccessFulOrErrorMessage = (messageFromBackend) => {
    setMessage(messageFromBackend);
  };


  const handleSubmit = () => {
    TechnicalSupportPostRequest.do({
      body: finalData,
      receivedResponse: receivedSuccessFulOrErrorMessage,

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
                  </div>
                </div>
                <div className={styles.feed_desc}>
                  To request for technical support regarding BIPAD portal
                </div>
                <div className={styles.feedback_button}>
                  <Button className={styles.feedback_btn}>
                    TECHNICAL SUPPORT REQUEST FORM
                  </Button>
                </div>
              </div>
            </div>
            <div className={styles.tech_support_container}>
              {/* <div className={styles.cross_button}>
            <button className={styles.cross_btn}>
              <i className="fas fa-times fa-3x" />
            </button>
          </div> */}
              <div className={styles.tech_support_wrapper}>
                <div className={styles.tech_support_head}>Leave Feedback</div>

                <div className={styles.comment}>
                  <div className={styles.comment_head}>
                    Kindly specify Your Feedback:
                  </div>
                  <div className={styles.comment_input}>
                    <textarea
                      type="text"
                      name="feedback"
                      placeholder="Please Specify.."
                      className={styles.input_comment}
                      value={finalData ? finalData.feedback : ''}
                      onChange={(e => setFinalData({ ...finalData, feedback: e.target.value }))}
                    />
                  </div>
                </div>

                <div className={styles.screenshot}>
                  <div className={styles.screenshot_head}>
                    Attach the screenshot
                  </div>
                  <div className={styles.screenshot_container}>
                    <div className={styles.choose_button}>
                      <input
                        name="screenshot"
                        type="file"
                        placeholder="Photo "
                        className={styles.choose_btn}
                        onChange={e => fileHandler(e)}
                      />

                    </div>
                  </div>
                </div>

                <div className={styles.tech_support_file_choose}>
                  <Icon
                    name="info"
                    className={styles.info_icon}
                  />
                  <span className={styles.info_text}>
                    Please choose a file less than 2MB.
                  </span>
                </div>

                <div className={styles.input_checkbox}>
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="verify"
                      className={styles.verify}
                      name="verify"
                      onChange={e => setChecked(e.target.checked)}
                    />
                  </div>
                  <label htmlFor="verify" className={styles.verify_text}>
                    I hereby give my consent to store my personal details in BIPAD
                    portal.
                  </label>
                </div>
              </div>
              <div className={styles.back_submit_button}>
                <Button className={styles.back_btn} onClick={() => navigate('/support-1/')}>
                  Back
                </Button>
                <Button
                  className={styles.submit_btn}
                  disabled={!checked}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default connect()(
  createConnectedRequestCoordinator()(
    createRequestClient(requestOptions)(
      SupportTwo,
    ),
  ),
);
