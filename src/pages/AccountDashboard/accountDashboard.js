import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withRouter } from "react-router-dom";

//Redux
import { userLogin, checkLogin, userLogOut } from "../../Redux/user/userAction";

//scss
import "./accountDashboard.scss";

//引入component
import MainContainer from "../../components/mainContainer";
import AccountSideBar from "../../components/AccountSideBar/accountSideBar";
import ProgressBoard from "../../components/ProgressBoard/progressBoard";
import LevelBoard from "../../components/LevelBoard/levelBoard";
import SuccessAlert from "../../components/SuccessAlert/successAlert";

import { apiUri } from "../../constants/api";

const AccountDashboard = (props) => {
  const { user, history, userLogin, userLogOut } = props;
  const [level, setLevel] = useState(0);
  // const [percentage, setPercentage] = useState(0);
  const [annualAmount, setAnnualAmount] = useState(0);

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

  useEffect(() => {
    if (user.logInStatus) {
      (async () => {
        const response = await fetch(`${apiUri}/users/dashboard`, {
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
        });
        const obj = await response.json();
        // console.log(obj);

        //reset user
        obj.logInStatus ? userLogin(obj.userInfo) : userLogOut();

        setLevel(obj.level);
        // setPercentage(obj.progress);
        setAnnualAmount(obj.totalAmount);
      })();
    } else {
      if (user.logInStatus !== null) {
        handleAlertOpen("未登入", "一秒鐘後跳轉首頁", true, true, 1000);
        setTimeout(() => {
          history.push("/");
        }, 1500);
      }
    }
  }, [user.logInStatus]);

  return (
    <>
      <MainContainer>
        <div className="d-flex dash-board-wrapper">
          <AccountSideBar />
          <div className="card-container d-flex justify-content-center flex-wrap">
            <div className="level-board-container">
              <LevelBoard level={level} />
            </div>
            <div className="progress-board-container">
              <ProgressBoard
                // percentage={percentage}
                annualAmount={annualAmount}
              />
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
      </MainContainer>
    </>
  );
};

const mapStateToProps = (store) => {
  return { user: store.user };
};

//Redux引入函式
//mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ userLogin, checkLogin, userLogOut }, dispatch);
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AccountDashboard)
);
