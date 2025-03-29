import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./accountModify.scss";

//sha256
import { sha256 } from 'js-sha256';

//Redux
import { userLogin, userLogOut } from "../../Redux/user/userAction";

//component
import FormInput from "../../components/FormInput/FormInput";
import Address from "../../components/Address/address";
import SuccessAlert from "../SuccessAlert/successAlert";

//react-icon
import {
  FiCircle,
  FiCheckCircle,
  FiCheckSquare,
  FiSquare,
} from "react-icons/fi";

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

const AccountModify = (props) => {
  //destructor
  const { user, userLogin, userLogOut, history } = props;
  //gender
  const [gender, setGender] = useState("");

  //input
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmed, setNewPasswordConfirmed] = useState("");
  const [cities, setCities] = useState("");
  const [districts, setDistricts] = useState("");
  const [postCode, setPostCode] = useState("");
  const [address, setAddress] = useState("");

  //確認
  const [confirm, setConfirm] = useState(false);

  //性別欄轉換
  const genderChange = (e) => {
    setGender(e.target.value);
  };

  //datepicker
  const [selectedDate, setSelectedDate] = useState(
    new Date("2000-01-01T21:11:54")
  );
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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
  const handleChange = (event) => {
    // console.log(event.target.name);
    const errorObj = { ...formatError };
    switch (event.target.name) {
      case "firstName":
        setFirstName(event.target.value);
        break;
      case "lastName":
        setLastName(event.target.value);
        break;
      case "email":
        setEmail(event.target.value);
        break;
      case "mobile":
        setMobile(event.target.value);
        break;
      case "oldPassword":
        setOldPassword(event.target.value);
        break;
      case "newPassword":
        errorObj.newPassword = event.target.value.length < 5 ? "格式錯誤*" : "";
        errorObj.newPasswordConfirmed =
          newPasswordConfirmed !== event.target.value ? "密碼不相同*" : "";
        setNewPassword(event.target.value);
        break;
      case "newPasswordConfirmed":
        errorObj.newPasswordConfirmed =
          event.target.value !== newPassword ? "密碼不相同*" : "";
        setNewPasswordConfirmed(event.target.value);
        break;
      default:
        break;
    }
    setFormatError(errorObj);
  };

  //聲明確認
  const confirmChange = () => {
    setConfirm(!confirm);
  };

  //送出更改要求
  const modificationSent = async () => {
    if (confirm) {
      console.log("sent");
      const data = {
        userAccount: email,
        userEmail: email,
        userFirstName: firstName,
        userLastName: lastName,
        userMobile: mobile,
        userGender: gender,
        userCity: cities,
        userDistrict: districts,
        userAddress: address,
        userPostCode: postCode,
        userBirthday: selectedDate.toLocaleDateString().split("/").join("-"),
      };

      //   console.log(data);
      //向後端請求更新
      const response = await fetch(`${apiUri}/users/infomodify`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
      });

      const obj = await response.json();
      console.log(obj);

      //順便更新會員資料
      if (obj.logInStatus) {
        console.log("back");
        userLogin(obj.userInfo);
      }

      // ================================== //
      //各種更新狀態
      if (obj.success) {
        console.log("update successfully");
        setConfirm(false);
        handleAlertOpen("更新成功", "已可在會員修改頁面查詢", false);
        //   =============== 若成功改變，要彈跳視窗 ===============   //
      } else if (obj.message === "NO_CHANGE") {
        console.log("NO_CHANGE");
        handleAlertOpen("無任何更新", "送出資料與原資料相同", true, true, 2000);
        //   =============== 若沒有改變，要彈跳視窗 ===============   //
      } else if (!obj.logInStatus) {
        console.log("logged out");
        userLogOut();
      }
      // ================================== //
    } else {
      // if confirm-box not checked
      console.log("not sent");
      handleAlertOpen(
        "未勾選「確認更改」",
        "請詳細檢閱資料是否正確",
        false,
        false
      );
    }
  };

  //送出密碼更改要求
  const passwordSent = async () => {
    //   =============== 要先在前端檢查密碼格式 ===============   //
    //檢查各式錯誤
    const errorObj = {};
    if (newPassword.length < 5) errorObj.newPassword = "格式錯誤*";
    if (newPasswordConfirmed !== newPassword)
      errorObj.newPasswordConfirmed = "密碼不相同*";

    console.log("errorObj", errorObj);
    setFormatError(errorObj);

    //若格式錯誤
    if (Object.keys(errorObj).length) {
      if (newPasswordConfirmed !== newPassword) {
        handleAlertOpen("確認新密碼錯誤", "請詳細檢查輸入的資訊");
        // console.log("password not changed");
      } else if (errorObj.newPassword) {
        handleAlertOpen("密碼格式錯誤", "請詳細檢查輸入的資訊");
      }
    } else {
      //若無任何格式錯誤
      //   console.log("password changed");
      const data = {
        oldPassword: sha256(oldPassword),
        newPassword: sha256(newPassword),
        newPasswordConfirmed: sha256(newPasswordConfirmed),
      };
      console.log(data);

      //向後端請求更新
      const response = await fetch(
        `${apiUri}/users/changepassword`,
        {
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify(data),
          headers: {
            "content-type": "application/json",
          },
        }
      );

      const obj = await response.json();
      console.log(obj);
      // ================================== //
      //各種更新狀態
      if (obj.success) {
        // console.log("update successfully");
        handleAlertOpen("更新成功", "可在會員資料修改頁面查詢");
      } else {
        if (!obj.logInStatus) {
          // console.log("logged out");
          userLogOut();
        } else {
          if (obj.errorMessage === "OLD_PASSWORD_INCORRECT") {
            errorObj.oldPassword = "密碼錯誤*";
            setFormatError(errorObj);
            handleAlertOpen("舊密碼錯誤", "請詳細檢查輸入的資訊");
          }
        }
      }
      // ================================== //
    }
  };

  useEffect(() => {
    // console.log("user", user);
    if (user.logInStatus) {
      setGender(user.userInfo.userGender);
      setSelectedDate(new Date(user.userInfo.userBirthday));
      setLastName(
        user.userInfo.userLastName === null ? "" : user.userInfo.userLastName
      );
      setFirstName(
        user.userInfo.userFirstName === null ? "" : user.userInfo.userFirstName
      );
      setEmail(user.userInfo.userEmail);
      setMobile(
        user.userInfo.userMobile === null ? "" : user.userInfo.userMobile
      );
      setCities(user.userInfo.userCity);
      setDistricts(user.userInfo.userDistrict);
      setPostCode(user.userInfo.userPostCode);
      setAddress(user.userInfo.userAddress);
    }
  }, [user]);

  useEffect(() => {
    if (user.logInStatus !== null && !user.logInStatus) {
      handleAlertOpen("未登入", "一秒鐘後跳轉首頁", true, true, 1000);
      setTimeout(() => {
        history.push("/");
      }, 1500);
    }
  }, [user.logInStatus]);


  return (
    <>
      <div className="account-modify-container">
        <h2 className="modify-title">會員資料修改</h2>
        {/* 基本資料更改 */}
        <div className="modify-grid-container">
          <div className="modify-grid-item modify-grid-gender">
            <div className="modify-item">
              <h4>性別*</h4>
              <div className="modify-gender-select d-flex align-items-center">
                <input
                  type="radio"
                  name="gender"
                  id="modify-radio-woman"
                  className="display-none"
                  value="woman"
                  onChange={genderChange}
                ></input>
                <label
                  htmlFor="modify-radio-woman"
                  className="d-flex align-items-center"
                >
                  {gender === "woman" ? (
                    <FiCheckCircle className="modify-select-circle" />
                  ) : (
                    <FiCircle className="modify-select-circle" />
                  )}
                  <p>女性</p>
                </label>
                <input
                  type="radio"
                  name="gender"
                  id="modify-radio-man"
                  className="display-none"
                  value="man"
                  onChange={genderChange}
                ></input>
                <label
                  htmlFor="modify-radio-man"
                  className=" d-flex align-items-center"
                >
                  {gender === "man" ? (
                    <FiCheckCircle className="modify-select-circle" />
                  ) : (
                    <FiCircle className="modify-select-circle" />
                  )}
                  <p>男性</p>
                </label>
              </div>
            </div>
          </div>
          <div className="modify-grid-item modify-grid-birthday">
            <div className="modify-item">
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
          <div className="modify-grid-item modify-grid-last-name">
            <div className="modify-item">
              <FormInput
                type="text"
                name="lastName"
                value={lastName}
                handleChange={handleChange}
                label="姓氏"
              />
            </div>
          </div>
          <div className="modify-grid-item modify-grid-first-name">
            <div className="modify-item">
              <FormInput
                type="text"
                name="firstName"
                value={firstName}
                handleChange={handleChange}
                label="名字"
              />
            </div>
          </div>
          <div className="modify-grid-item modify-grid-email">
            <div className="modify-item">
              <FormInput
                type="email"
                name="email"
                value={email}
                handleChange={handleChange}
                label="email"
                disabled
              />
            </div>
          </div>
          <div className="modify-grid-item modify-grid-mobile">
            <div className="modify-item">
              <FormInput
                type="text"
                name="mobile"
                value={mobile}
                handleChange={handleChange}
                label="手機"
              />
            </div>
          </div>
          <div className="modify-grid-item modify-grid-address">
            <div className="modify-item">
              <Address
                setCities={setCities}
                setDistricts={setDistricts}
                setAddress={setAddress}
                setPostCode={setPostCode}
              />
            </div>
          </div>
        </div>
        <div className="d-flex modify-declaration" onClick={confirmChange}>
          {confirm ? <FiCheckSquare /> : <FiSquare />}
          <p>確認更改</p>
        </div>
        <div className="">
          <Button
            className="modify-button"
            variant="outlined"
            onClick={modificationSent}
          >
            會員資料更改
          </Button>
        </div>
        {/* 更改密碼 */}
        <h2 className="modify-title password-title">密碼更改</h2>
        <div className="password-grid-container">
          <div className="password-grid-item password-grid-old-password">
            <div className="password-item">
              <FormInput
                type="password"
                name="oldPassword"
                value={oldPassword}
                handleChange={handleChange}
                label="舊密碼"
              />
            </div>
            <div
              className={
                !!formatError.oldPassword ? "error-message" : "display-none"
              }
            >
              <span>{formatError.oldPassword}</span>
            </div>
          </div>
          <div className="password-grid-item password-grid-new-password">
            <div className="password-item">
              <FormInput
                type="password"
                name="newPassword"
                value={newPassword}
                handleChange={handleChange}
                label="新密碼 (須大於五碼*)"
              />
            </div>
            <div
              className={
                !!formatError.newPassword ? "error-message" : "display-none"
              }
            >
              <span>{formatError.newPassword}</span>
            </div>
          </div>
          <div className="password-grid-item password-grid-new-password-confirm">
            <div className="password-item">
              <FormInput
                type="password"
                name="newPasswordConfirmed"
                value={newPasswordConfirmed}
                handleChange={handleChange}
                label="確認新密碼"
              />
            </div>
            <div
              className={
                !!formatError.newPasswordConfirmed
                  ? "error-message"
                  : "display-none"
              }
            >
              <span>{formatError.newPasswordConfirmed}</span>
            </div>
          </div>
        </div>
        <div className="">
          <Button
            className="modify-button"
            variant="outlined"
            onClick={passwordSent}
          >
            密碼更改
          </Button>
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

const mapStateToProps = (store) => {
  return { user: store.user };
};

//Redux引入函式
//mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ userLogin, userLogOut }, dispatch);
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AccountModify)
);
