import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import "./passwordForgotChange.scss";

import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
//sha256
import { sha256 } from "js-sha256";

//component
import SuccessAlert from "../../components/SuccessAlert/successAlert";

//react icon
import { AiFillUnlock } from "react-icons/ai";
import { apiUri } from "../../constants/api";

const PasswordForgotChange = (props) => {
  const { match, history } = props;
  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  }));

  //localstate
  const [verification, setVerification] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmed, setNewPasswordConfirmed] = useState("");
  const classes = useStyles();

  //格式錯誤檢查
  const [formatError, setFormatError] = useState({});

  //
  const [passwordChanged, setPasswordChanged] = useState(false);

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
    // console.log(e.target);
    const errorObj = { ...formatError };

    switch (e.target.name) {
      case "verification":
        errorObj.verification = e.target.value.length < 8 ? "格式錯誤*" : "";
        setVerification(e.target.value.slice(0, 8));
        break;
      case "newPassword":
        errorObj.newPassword = e.target.value.length < 5 ? "格式錯誤*" : "";
        errorObj.newPasswordConfirmed =
          newPasswordConfirmed !== e.target.value ? "密碼不相同*" : "";
        setNewPassword(e.target.value);
        break;
      case "newPasswordConfirmed":
        errorObj.newPasswordConfirmed =
          e.target.value !== newPassword ? "密碼不相同*" : "";
        setNewPasswordConfirmed(e.target.value);
        break;
      default:
        break;
    }
    setFormatError(errorObj);
  };

  //送出更改密碼要求
  const handlePasswordForgotChange = async () => {
    console.log("ok");
    const errorObj = {};
    if (verification.length < 8) errorObj.verification = "格式錯誤*";
    if (newPassword.length < 5) errorObj.newPassword = "格式錯誤*";
    if (newPasswordConfirmed !== newPassword)
      errorObj.newPasswordConfirmed = "密碼不相同*";

    console.log("errorObj", errorObj);
    setFormatError(errorObj);

    //若格式錯誤
    if (Object.keys(errorObj).length) {
      if (newPasswordConfirmed !== newPassword) {
        handleAlertOpen("密碼不相同", "請詳細檢查輸入的資訊");
        // console.log("password not changed");
      } else if (errorObj.newPassword) {
        handleAlertOpen("密碼格式錯誤", "請詳細檢查輸入的資訊");
      }
    } else {
      //若所有格式皆正確
      const data = {
        userId: match.params.userId,
        newPassword: sha256(newPassword),
        verification: verification,
      };
      const responsePasswordForgotChange = await fetch(
        `${apiUri}/passwordissue/passwordforgotchange`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const obj = await responsePasswordForgotChange.json();
      console.log(obj);

      if (obj.success) {
        setPasswordChanged(true);
      } else {
        if (obj.message === "VERIFICATION_INCORRECT") {
          const errorObj = { ...formatError };
          errorObj.verification = "認證碼錯誤*";
          setFormatError(errorObj)
        }
      }
    }
  };

  //back to hompage
  const handleToHompage = () => {
    history.push("/");
  };

  useEffect(() => {
    console.log(match.params.userId);
  });

  return (
    <>
      <div className=" position-relative password-forgot-change-wrapper">
        <div className="all-page">
          <figure>
            <img src="/images/banner/password-page.jpg" alt="banner" />
          </figure>
        </div>
        {/* <MainContainer> */}
        <div className="rotate-container position-absolute">
          <div
            className={`password-container  ${
              !passwordChanged ? "" : "turn-back"
            }`}
          >
            <div className="password-front">
              <h2 className="password-title">更改密碼</h2>
              <h4 className="password-context">請務必記下新密碼</h4>
              <form className={classes.root} noValidate autoComplete="off">
                <FormControl>
                  <InputLabel htmlFor="component-simple">認證碼*</InputLabel>
                  <Input
                    type="text"
                    name="verification"
                    value={verification}
                    onChange={handleChange}
                  />
                  <div
                    className={
                      !!formatError.verification
                        ? "error-message"
                        : "display-none"
                    }
                  >
                    <span>{formatError.verification}</span>
                  </div>
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="component-simple">新密碼*</InputLabel>
                  <Input
                    type="text"
                    name="newPassword"
                    value={newPassword}
                    onChange={handleChange}
                  />
                  <div
                    className={
                      !!formatError.newPassword
                        ? "error-message"
                        : "display-none"
                    }
                  >
                    <span>{formatError.newPassword}</span>
                  </div>
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="component-simple">
                    確認新密碼*
                  </InputLabel>
                  <Input
                    type="text"
                    name="newPasswordConfirmed"
                    value={newPasswordConfirmed}
                    onChange={handleChange}
                  />
                  <div
                    className={
                      !!formatError.newPasswordConfirmed
                        ? "error-message"
                        : "display-none"
                    }
                  >
                    <span>{formatError.newPasswordConfirmed}</span>
                  </div>
                </FormControl>
              </form>
              <div className="">
                <Button
                  className="password-button"
                  variant="outlined"
                  onClick={handlePasswordForgotChange}
                >
                  送出密碼更改
                </Button>
              </div>
            </div>
            <div className="password-back ">
              <div className="password-back-message">
                <h2>密碼更改完成</h2>
                <h4>現在即可用新密碼登入</h4>
                <AiFillUnlock className="mail-icon" />
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

export default withRouter(PasswordForgotChange);
