import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./creditCardInfo.scss";

//Redux
import { userLogin, userLogOut } from "../../Redux/user/userAction";
import { userToggleFunc } from "../../Redux/nav/navAction";

//material UI
import Button from "@material-ui/core/Button";

//react-icon
import {
  FaCreditCard,
  FaCcMastercard,
  FaCcVisa,
  FaCcJcb,
  FaCcDiscover,
} from "react-icons/fa";

//component
import CreditCardBlock from "../CreditCardBlock/creditCardBlock";
import CreditCardAdd from "../CreditCardAdd/creditCardAdd";
import SuccessAlert from "../SuccessAlert/successAlert";

import { apiUri } from '../../constants/api';

const CreditCardInfo = (props) => {
  const { user, history } = props;
  const [creditCardList, setCreditCardList] = useState([]);

  //以重整新增信用卡頁面
  const [creditCardFormState, setCreditCardFormState] = useState(0);

  //新增信用卡Dialog
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    if (user.logInStatus) {
      setOpen(true);
    } else {
      handleAlertOpen(
        "請先登入，方可新增",
        "二秒後跳轉至首頁",
        true,
        true,
        2000
      );
      //跳轉至首頁
      setTimeout(() => {
        history.push("/");
        props.userToggleFunc()
      }, 2300);
    }
  };
  const handleClose = () => {
    setOpen(false);
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

  //fetch credit card info
  const fetchCreditCardInfo = async () => {
    const res = await fetch(`${apiUri}/users/creditcardinfo`, {
      credentials: "include",
    });
    const creditCardInfo = await res.json();
    return creditCardInfo;
  };

  //載入credit card list
  useEffect(() => {
    (async () => {
      const rawData = await fetchCreditCardInfo();
      console.log(rawData);

      //reset user
      rawData.logInStatus ? userLogin(rawData.userInfo) : userLogOut();

      if (rawData.logInStatus) {
        setCreditCardList(rawData.creditCardList);
      }
    })();

    //以防萬一
    if (user.logInStatus !== null && !user.logInStatus) {
      handleAlertOpen("未登入", "一秒鐘後跳轉首頁", true, true, 1000);
      setTimeout(() => {
        history.push("/");
      }, 1500);
    }
  }, [user.logInStatus]);

  return (
    <>
      <div className="credit-card-info-container">
        <h2 className="info-title">已儲存付款資訊</h2>
        {creditCardList.length ? (
          creditCardList.map((el, index) => {
            return (
              <CreditCardBlock
                otherClass=""
                key={el.id}
                id={el.id}
                association={el.association}
                cdMonth={el.cdMonth}
                cdYear={el.cdYear}
                billAddressCity={el.billAddressCity}
                billAddressPostCode={el.billAddressPostCode}
                billAddressDistrict={el.billAddressDistrict}
                billAddressStreet={el.billAddressStreet}
                cdLastFourNumber={el.cdLastFourNumber}
                isDefault={el.isDefault}
                setCreditCardList={setCreditCardList}
                handleAlertOpen={handleAlertOpen}
              />
            );
          })
        ) : (
          <p>沒有儲存的信用卡資訊</p>
        )}
        <div className="add-credit-card d-flex align-items-end justify-content-end">
          <div className="credit-card-icons d-flex align-items-center">
            <FaCreditCard className="card-association-icon" />
            <FaCcMastercard className="card-association-icon" />
            <FaCcVisa className="card-association-icon" />
            <FaCcJcb className="card-association-icon" />
            <FaCcDiscover className="card-association-icon" />
          </div>
          <div className="add-button">
            <Button onClick={handleClickOpen}>新增信用卡</Button>
            <CreditCardAdd
              key={creditCardFormState}
              creditCardFormState={creditCardFormState}
              setCreditCardFormState={setCreditCardFormState}
              open={open}
              handleClose={handleClose}
              setCreditCardList={setCreditCardList}
              setOpen={setOpen}
              handleAlertOpen={handleAlertOpen}
            />
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
        </div>
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
  return bindActionCreators({ userLogin, userLogOut, userToggleFunc }, dispatch);
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreditCardInfo)
);
