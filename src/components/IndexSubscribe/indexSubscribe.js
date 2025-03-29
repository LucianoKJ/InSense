import React, { useState } from "react";
import "./indexSubscribe.scss";
import SuccessAlert from '../../components/SuccessAlert/successAlert'

import { apiUri } from '../../constants/api';

const IndexSubscribe = () => {
  const [email, setEmail] = useState("")
  //alert
  const [openAlert, setOpenAlert] = useState(false);
  const [alertName, setAlertName] = useState("");
  const [alertContext, setAlertContext] = useState("");
  const [alertLinearProgress, setAlertLinearProgress] = useState(false);
  const [alertAutoClose, setAlertAutoClose] = useState(false);
  const [alertDuration, setAlertDuration] = useState("");
  const handleAlertOpen = (
    alertName = "alertName",
    alertContext = "alertContext",
    alertAutoClose = false,
    linearProgress = false,
    duration
  ) => {
    setAlertName(alertName);
    setAlertContext(alertContext);
    setAlertLinearProgress(linearProgress);
    setAlertAutoClose(alertAutoClose);
    setAlertDuration(duration);
    setOpenAlert(true);
  };
  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  async function sendEmail() {
    const data = {
      userEmail: email
    }
    const response = await fetch(`${apiUri}/coupon/sendcoupon`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json"
      }
    })
    const res = await response.json()
    const { success } = { ...res }

    if (success) handleAlertOpen("訂閱成功,優惠券已寄出", true, true, 2000)
  }

  return (
    <div className="index-subscribe-container text-center">
      <p>訂閱我們送新客優惠券</p>
      <div className='email-input'>
        <input value={email} onChange={(e) => { setEmail(e.target.value) }} type="text" placeholder="your email address*" />
      </div>
      <a className="button-link" onClick={sendEmail} role="button">
        SUBSCRIBE
      </a>
      <SuccessAlert
        alertName={alertName}
        alertContext={alertContext}
        openAlert={openAlert}
        handleAlertClose={handleAlertClose}
        alertLinearProgress={alertLinearProgress}//有無時間條
        alertAutoClose={alertAutoClose} // 自行關閉
        alertDuration={alertDuration} //時間間隔
      />
    </div>
  );
};
export default IndexSubscribe;
