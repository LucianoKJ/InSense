import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MainContainer from "../../components/mainContainer";
import FormInput from "../../components/FormInput/FormInput";
import Address from "../../components/Address/address";
import SuccessAlert from "../../components/SuccessAlert/successAlert";

//sha256
import { sha256 } from 'js-sha256';

import "./registration.scss";
import { Redirect, withRouter } from "react-router-dom";

//Redux
import { userLogin, checkLogin } from "../../Redux/user/userAction";

//react-icon
import {
  FiCircle,
  FiCheckCircle,
  FiSquare,
  FiCheckSquare,
} from "react-icons/fi";
// import { GiSquare } from "react-icons/gi";
//material UI
import Button from "@material-ui/core/Button";

//datepicker
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { apiUri } from "../../constants/api";

const Registration = (props) => {
  //Redux
  const { user, userLogin } = props;

  //gender
  const [gender, setGender] = useState("");

  //input
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmailName] = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState("");
  const [cities, setCities] = useState("");
  const [districts, setDistricts] = useState("");
  const [postCode, setPostCode] = useState("");
  const [address, setAddress] = useState("");

  //確認
  const [confirm, setConfirm] = useState(false);

  //格式錯誤檢查
  const [formatError, setFormatError] = useState({});

  //datepicker
  const [selectedDate, setSelectedDate] = useState(
    new Date("2000-01-01T21:11:54")
  );
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //性別欄轉換
  const genderChange = (e) => {
    setGender(e.target.value);
  };

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
  const handleChange = (event) => {
    // console.log(event.target.name);

    const errorObj = { ...formatError };

    switch (event.target.name) {
      case "firstName":
        errorObj.firstName = !event.target.value.length ? "未填*" : "";
        setFirstName(event.target.value);
        break;
      case "lastName":
        errorObj.lastName = !event.target.value.length ? "未填*" : "";
        setLastName(event.target.value);
        break;
      case "email":
        errorObj.email = event.target.value.indexOf("@") < 1 ? "格式錯誤*" : "";
        errorObj.emailConfirmed =
          emailConfirmed !== event.target.value ? "信箱不相同*" : "";
        setEmailName(event.target.value);
        break;
      case "emailConfirmed":
        errorObj.emailConfirmed =
          event.target.value !== email ? "信箱不相同*" : "";
        setEmailConfirmed(event.target.value);
        break;
      case "password":
        errorObj.password = event.target.value.length < 5 ? "格式錯誤*" : "";
        errorObj.passwordConfirmed =
          passwordConfirmed !== event.target.value ? "密碼不相同*" : "";
        setPassword(event.target.value);
        break;
      case "passwordConfirmed":
        errorObj.passwordConfirmed =
          event.target.value !== password ? "密碼不相同*" : "";
        setPasswordConfirmed(event.target.value);
        break;
      default:
        break;
    }
    console.log(errorObj);
    setFormatError(errorObj);
  };

  //聲明確認
  const confirmChange = () => {
    setConfirm(!confirm);
  };

  const registrationSent = async () => {
    //檢查各式錯誤
    const errorObj = {};

    if (!lastName.length) errorObj.lastName = "未填*";
    if (!firstName.length) errorObj.firstName = "未填*";
    if (email.indexOf("@") < 1) errorObj.email = "格式錯誤*";
    if (emailConfirmed !== email) errorObj.emailConfirmed = "信箱不相同*";
    if (password.length < 5) errorObj.password = "格式錯誤*";
    if (passwordConfirmed !== password)
      errorObj.passwordConfirmed = "密碼不相同*";

    // console.log(Object.keys(errorObj).length);
    setFormatError(errorObj);

    if (!confirm) {
      console.log("confirm not checked");
      handleAlertOpen("請勾選確認欄", "請詳細檢查所有資料，並同意註冊協議");
    } else if (Object.keys(errorObj).length) {
      //若格式有誤
      console.log("format error");
      setConfirm(false);
      handleAlertOpen("填寫資料有誤", "請詳細檢查所有資料，並同意註冊協議");
    } else {
      //無誤後送出
      const data = {
        userAccount: email,
        userEmail: email,
        userPassword: sha256(password),
        userFirstName: firstName,
        userLastName: lastName,
        userGender: gender,
        userCity: cities,
        userDistrict: districts,
        userAddress: address,
        userPostCode: postCode,
        userBirthday: selectedDate.toLocaleDateString().split("/").join("-"),
      };

      const response = await fetch(`${apiUri}/users/registration`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
      });

      const obj = await response.json();
      console.log(obj);

      //若成功註冊，則自動登入
      if (obj.success) {
        if (obj.logInStatus) {
          handleAlertOpen("註冊成功", "三秒後跳轉至首頁", true, true, 3000);
          setTimeout(() => {
            userLogin(obj.userInfo);
          }, 3500);
        }
      } else {
        if (obj.errorMessage === "DUPLICATE_ACCOUNT") {
          console.log("DUPLICATE_ACCOUNT");
          handleAlertOpen("此Email已註冊過", "請使用別組email");
        }
      }
    }
  };

  // console.log(user.logInStatus);
  if (user.logInStatus) {
    return <Redirect to="/" />;
  } else if (user.logInStatus === null) {
    console.log("loading");
    return "";
  } else {
    return (
      <>
        <MainContainer>
          <div className="registration-container">
            <h2 className="registration-title">註冊會員</h2>
            <div className="registration-grid-container">
              <div className="registration-grid-item registration-grid-gender">
                <div className="registration-item">
                  <h4>性別</h4>
                  <div className="registration-gender-select d-flex align-items-center">
                    <input
                      type="radio"
                      name="gender"
                      id="registration-radio-woman"
                      className="display-none"
                      value="woman"
                      onChange={genderChange}
                    ></input>
                    <label
                      htmlFor="registration-radio-woman"
                      className="d-flex align-items-center"
                    >
                      {gender === "woman" ? (
                        <FiCheckCircle className="registration-select-circle" />
                      ) : (
                          <FiCircle className="registration-select-circle" />
                        )}
                      <p>女性</p>
                    </label>
                    <input
                      type="radio"
                      name="gender"
                      id="registration-radio-man"
                      className="display-none"
                      value="man"
                      onChange={genderChange}
                    ></input>
                    <label
                      htmlFor="registration-radio-man"
                      className=" d-flex align-items-center"
                    >
                      {gender === "man" ? (
                        <FiCheckCircle className="registration-select-circle" />
                      ) : (
                          <FiCircle className="registration-select-circle" />
                        )}
                      <p>男性</p>
                    </label>
                  </div>
                </div>
              </div>
              <div className="registration-grid-item registration-grid-birthday">
                <div className="registration-item">
                  <h4>生日</h4>
                  {/* datepicker */}
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </div>
              </div>
              <div className="registration-grid-item registration-grid-last-name">
                <div className="registration-item">
                  <FormInput
                    type="text"
                    name="lastName"
                    value={lastName}
                    handleChange={handleChange}
                    label="姓氏*"
                    maxLength={3}
                  />
                </div>
                <div
                  className={
                    !!formatError.lastName ? "error-message" : "display-none"
                  }
                >
                  <span>{formatError.lastName}</span>
                </div>
              </div>
              <div className="registration-grid-item registration-grid-first-name">
                <div className="registration-item">
                  <FormInput
                    type="text"
                    name="firstName"
                    value={firstName}
                    handleChange={handleChange}
                    label="名字*"
                    maxLength={7}
                  />
                </div>
                <div
                  className={
                    !!formatError.firstName ? "error-message" : "display-none"
                  }
                >
                  <span>{formatError.firstName}</span>
                </div>
              </div>
              <div className="registration-grid-item registration-grid-email">
                <div className="registration-item">
                  <FormInput
                    type="email"
                    name="email"
                    value={email}
                    handleChange={handleChange}
                    label="email*"
                  />
                </div>
                <div
                  className={
                    !!formatError.email ? "error-message" : "display-none"
                  }
                >
                  <span>{formatError.email}</span>
                </div>
              </div>
              <div className="registration-grid-item registration-grid-email-confirm">
                <div className="registration-item">
                  <FormInput
                    type="email"
                    name="emailConfirmed"
                    value={emailConfirmed}
                    handleChange={handleChange}
                    label="確認 email*"
                  />
                </div>
                <div
                  className={
                    !!formatError.emailConfirmed
                      ? "error-message"
                      : "display-none"
                  }
                >
                  <span>{formatError.emailConfirmed}</span>
                </div>
              </div>
              <div className="registration-grid-item registration-grid-password">
                <div className="registration-item">
                  <FormInput
                    type="password"
                    name="password"
                    value={password}
                    handleChange={handleChange}
                    label="密碼 (須大於五碼*)"
                  />
                </div>
                <div
                  className={
                    !!formatError.password ? "error-message" : "display-none"
                  }
                >
                  <span>{formatError.password}</span>
                </div>
              </div>
              <div className="registration-grid-item registration-grid-password-confirm">
                <div className="registration-item">
                  <FormInput
                    type="password"
                    name="passwordConfirmed"
                    value={passwordConfirmed}
                    handleChange={handleChange}
                    label="確認密碼*"
                  />
                </div>
                <div
                  className={
                    !!formatError.passwordConfirmed
                      ? "error-message"
                      : "display-none"
                  }
                >
                  <span>{formatError.passwordConfirmed}</span>
                </div>
              </div>
              {/* 地址 */}
              <div className="registration-grid-item registration-grid-address">
                <div className="registration-item">
                  <Address
                    setCities={setCities}
                    setDistricts={setDistricts}
                    setAddress={setAddress}
                    setPostCode={setPostCode}
                  />
                </div>
              </div>
            </div>
            <div
              className="d-flex registration-declaration"
              onClick={confirmChange}
            >
              {confirm ? <FiCheckSquare /> : <FiSquare />}
              <p>
                我確認上述資訊完整無誤，並同意上述資訊可以被 InSense
                作為商業用途使用
              </p>
            </div>
            <div className="">
              <Button
                className="registration-button"
                variant="outlined"
                onClick={registrationSent}
              >
                註冊
              </Button>
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
        </MainContainer>
      </>
    );
  }
};

const mapStateToProps = (store) => {
  return { user: store.user };
};

//Redux引入函式
//mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ userLogin, checkLogin }, dispatch);
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Registration)
);
