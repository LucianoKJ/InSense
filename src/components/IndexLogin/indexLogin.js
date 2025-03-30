import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./indexLogin.scss";

//alert
import SuccessAlert from "../../components/SuccessAlert/successAlert";

//sha256
import { sha256 } from "js-sha256";

//material ui
import Button from "@material-ui/core/Button";

//component
import FormInput from "../FormInput/FormInput";

//Redux
import { userLogInAsync } from "../../Redux/user/userAction";
import { closeSideBar } from "../../Redux/nav/navAction";

const IndexLogin = (props) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  //引入Redux
  const { user, userLogInAsync, closeSideBar } = props;

  //帳號
  const changeEmail = (event) => {
    setUserEmail(event.target.value);
  };

  //密碼
  const changePassword = (event) => {
    setUserPassword(event.target.value);
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

  //登入function
  const handleLogin = () => {
    userLogInAsync(
      userEmail,
      sha256(userPassword),
      function loginSuccess() {
        setTimeout(() => {
          closeSideBar();
        }, 500);
      },
      function loginFail(errorMessage) {
        if (errorMessage === "No_User_Found") {
          handleAlertOpen(
            "帳號或密碼錯誤",
            "請詳細檢查帳號及密碼，若忘記密碼可點選『忘記密碼』"
          );
        }
      }
    );
  };

  //redirect to Registration
  const redirectRegister = () => {
    props.history.push("/account/registration");
  };

  const redirectPasswordForgot = () => {
    props.history.push("/account/passwordforgot");
  };

  useEffect(() => {
    // console.log("changed");
  }, [user]);

  return (
    <>
      <div className="loginHeader d-flex">
        <p>會員登入</p>
        <FormInput
          type="email"
          name="email"
          value={userEmail}
          handleChange={changeEmail}
          label="email"
          required
        />
        <FormInput
          type="password"
          name="password"
          value={userPassword}
          handleChange={changePassword}
          label="password"
          required
        />
      </div>
      <div className="loginFooter text-center">
        <Button onClick={handleLogin}>登入</Button>
        <Button onClick={redirectRegister}>註冊</Button>
        <Button onClick={redirectPasswordForgot}>忘記密碼</Button>
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
    </>
  );
};

//Redux引入狀態
//mapStateToProps
const mapStateToProps = (store) => {
  return { user: store.user };
};

//Redux引入函式
//mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ userLogInAsync, closeSideBar }, dispatch);
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(IndexLogin)
);
