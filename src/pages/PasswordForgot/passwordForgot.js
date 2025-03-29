import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import "./passwordForgot.scss";

import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";

import SuccessAlert from "../../components/SuccessAlert/successAlert";

//material ui
import CircularProgress from "@material-ui/core/CircularProgress";

//react
import { FcSurvey } from "react-icons/fc";
import { apiUri } from "../../constants/api";

const PasswordForgot = (props) => {
  const { history } = props;
  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  }));

  //localstate
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const classes = useStyles();

  //格式錯誤檢查
  const [formatError, setFormatError] = useState({});

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

  //文字欄
  const handleChange = (e) => {
    // console.log(e.target.value);
    const errorObj = { ...formatError };
    errorObj.email = e.target.value.indexOf("@") < 1 ? "格式錯誤*" : "";
    setFormatError(errorObj);

    setEmail(e.target.value);
  };

  const handlePasswordForgot = async () => {
    // console.log("sent");

    const errorObj = {};
    if (email.indexOf("@") < 1) errorObj.email = "格式錯誤*";

    console.log("errorObj", errorObj);
    setFormatError(errorObj);

    if (email.indexOf("@") < 1) {
      console.log("wrong format");
      handleAlertOpen("格式錯誤", "請務必檢查填入之Email");
    } else {
      const data = { userEmail: email };
      //先開啟progress
      setProcessing(true);
      const responsePasswordForgot = await fetch(
        `${apiUri}/passwordissue/passwordforgot`,
        {
          method: "POST",
          body: JSON.stringify(data),
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const obj = await responsePasswordForgot.json();
      //   console.log(obj);
      //關閉progress
      setProcessing(false);
      if (obj.success) {
        setEmailSent(true);
        // 頁面顯示發送信件成功
      } else {
        if (obj.message === "NO_USER_FOUND") {
          console.log("NO_USER_FOUND");
          handleAlertOpen("未找到該帳號", "請務必檢查填入之Email");
        }
      }
    }
  };

  //back to hompage
  const handleToHompage = () => {
    history.push("/");
  };

  useEffect(() => {
    console.log("ok");
  });

  return (
    <>
      <div className=" position-relative password-forgot-wrapper">
        <div className="all-page">
          <figure>
            <img src="/images/banner/password-page.jpg" alt="banner" />
          </figure>
        </div>
        {/* <MainContainer> */}
        <div className="rotate-container position-absolute">
          <div
            className={`password-container  ${!emailSent ? "" : "turn-back"}`}
          >
            <div className="password-front">
              <h2 className="password-title">忘記密碼</h2>
              <h4 className="password-context">
                我們將會寄送『更改密碼連結』至您註冊的Email*
              </h4>
              <form className={classes.root} noValidate autoComplete="off">
                <FormControl>
                  <InputLabel htmlFor="component-simple">Email*</InputLabel>
                  <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                  />
                  <div
                    className={
                      !!formatError.email ? "error-message" : "display-none"
                    }
                  >
                    <span>{formatError.email}</span>
                  </div>
                </FormControl>
              </form>
              <div className="password-button-container">
                <Button
                  className="password-button"
                  variant="outlined"
                  onClick={handlePasswordForgot}
                >
                  送出
                  {processing ? (
                    <div className="processing position-absolute">
                      <CircularProgress />
                    </div>
                  ) : (
                    ""
                  )}
                </Button>
              </div>
            </div>
            <div className="password-back ">
              <div className="password-back-message">
                <h2>要求已提交</h2>
                <h4>『密碼更改連結』將盡快寄至您註冊之Email</h4>
                <FcSurvey className="mail-icon" />
              </div>
              <Button
                className="password-back-button"
                variant="outlined"
                onClick={handleToHompage}
              >
                回至首頁
              </Button>
            </div>
          </div>
        </div>
        <SuccessAlert
          alertName={alertName}
          alertContext={alertContext}
          openAlert={openAlert}
          handleAlertClose={handleAlertClose}
          alertLinearProgress={alertLinearProgress} //有無時間條
          alertAutoClose={alertAutoClose} // 自行關閉
          alertDuration={alertDuration} //時間間隔
        />
      </div>
    </>
  );
};

export default withRouter(PasswordForgot);
