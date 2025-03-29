import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./creditCardBlock.scss";

//Redux
import { userLogin, userLogOut } from "../../Redux/user/userAction";

//material UI
import Button from "@material-ui/core/Button";

//react-icon
import {
  FaCcMastercard,
  FaCcVisa,
  FaCcJcb,
  FaCcDiscover,
} from "react-icons/fa";

//component
import Address from "../../components/Address/address";
import InquiryAlert from "../../components/InquiryAlert/inquiryAlert";
import { apiUri } from '../../constants/api';

//destructor
const CreditCardBlock = (props) => {
  const {
    history,
    otherClass,
    id,
    association,
    cdMonth,
    cdYear,
    billAddressCity,
    billAddressPostCode,
    billAddressDistrict,
    billAddressStreet,
    cdLastFourNumber,
    isDefault,
    setCreditCardList,
    handleAlertOpen,
    userLogin,
    userLogOut,
  } = props;

  //localstate
  const [inputOpen, setInputOpen] = useState(false);
  const [cities, setCities] = useState(billAddressCity);
  const [districts, setDistricts] = useState(billAddressDistrict);
  const [postCode, setPostCode] = useState(billAddressPostCode);
  const [address, setAddress] = useState(billAddressStreet);

  //打開詢問delete
  const [openInquiry, setOpenInquiry] = useState(false);
  const [inquiryTitle, setInquiryTitle] = useState("title");
  const [inquiryContext, setInquiryContext] = useState("context");
  const [deleteSuccesful, setDeleteSuccesful] = useState(false); //讓已刪除的有動畫效果
  const handleInquiryOpen = () => {
    setInquiryTitle("確認刪除");
    setInquiryContext("將永遠刪除此付款方式");
    setOpenInquiry(true);
  };
  const handleInquiryClose = () => {
    setOpenInquiry(false);
  };

  //變更資料
  const handleInputOpen = () => {
    setInputOpen(true);
  };

  //save
  const handleSave = () => {
    (async () => {
      const data = {
        id: id,
        billAddressCity: cities,
        billAddressPostCode: postCode,
        billAddressDistrict: districts,
        billAddressStreet: address,
      };
      // console.log("data", data);
      const res = await fetch(`${apiUri}/users/creditcardmodify`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const rawData = await res.json();
      console.log(rawData);

      //reset user
      rawData.logInStatus ? userLogin(rawData.userInfo) : userLogOut();

      if (rawData.success) {
        if (rawData.logInStatus) {
          // 若有改變
          if (rawData.newCreditCardList) {
            setCreditCardList(rawData.newCreditCardList);
            handleAlertOpen(
              "更新成功",
              "已可在付款資訊頁查詢",
              true,
              true,
              2500
            );
          }

          // 若無改變
          if (rawData.message && rawData.message === "NO_CHANGE") {
            console.log(rawData.message);
            handleAlertOpen(
              "無任何更新",
              "可在付款資訊頁查詢",
              true,
              true,
              2500
            );
          }
        }
        //不管如何，都要關閉
        setInputOpen(false);
      } else {
        if (!rawData.logInStatus) {
          handleAlertOpen(
            "請先登入，方可查詢",
            "二秒後跳轉至首頁",
            true,
            true,
            2000
          );
          //跳轉至首頁
          setTimeout(() => {
            history.push("/");
          }, 2300);
        }
      }
    })();
  };

  //close
  const handleInputClose = () => {
    setInputOpen(false);

    //重設
    setCities(billAddressCity);
    setDistricts(billAddressDistrict);
    setPostCode(billAddressPostCode);
    setAddress(billAddressStreet);
  };

  //changeDefault
  const changeDefault = async () => {
    const res = await fetch(
      `${apiUri}/users/creditcardchangedefault/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const rawData = await res.json();

    //reset user
    rawData.logInStatus ? userLogin(rawData.userInfo) : userLogOut();

    if (rawData.success) {
      if (rawData.logInStatus) {
        setCreditCardList(rawData.newCreditCardList);
      }
    } else {
      if (!rawData.logInStatus) {
        handleAlertOpen(
          "請先登入，方可查詢",
          "二秒後跳轉至首頁",
          true,
          true,
          2000
        );
        //跳轉至首頁
        setTimeout(() => {
          history.push("/");
        }, 2300);
      }
    }

    console.log(rawData);
  };

  //delete payment
  const deletePayment = async () => {
    const res = await fetch(
      `${apiUri}/users/creditcarddelete/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const rawData = await res.json();

    //reset user
    rawData.logInStatus ? userLogin(rawData.userInfo) : userLogOut();

    if (rawData.success) {
      if (rawData.logInStatus) {
        // 若有改變
        if (rawData.newCreditCardList) {
          setDeleteSuccesful(true);
          setTimeout(() => {
            setCreditCardList(rawData.newCreditCardList);
          }, 2500);
          handleAlertOpen("刪除成功", "已可在付款資訊頁查詢", true, true, 2500);
          console.log(openInquiry);
        }
        // 若無改變
        if (rawData.message && rawData.message === "DELETE_FAIL") {
          console.log(rawData.message);
          handleAlertOpen(
            "刪除失敗",
            "請刷新頁面，再嘗試看看",
            true,
            true,
            2500
          );
        }
      }
      //不管如何，都要關閉
      handleInquiryClose();
    } else {
      if (!rawData.logInStatus) {
        handleAlertOpen(
          "請先登入，方可修改資料",
          "二秒後跳轉至首頁",
          true,
          true,
          2000
        );
        //跳轉至首頁
        setTimeout(() => {
          history.push("/");
        }, 2300);
      }
    }
    console.log(rawData);
  };

  useEffect(() => {
    setCities(billAddressCity);
    setDistricts(billAddressDistrict);
    setPostCode(billAddressPostCode);
    setAddress(billAddressStreet);
  }, [
    billAddressCity,
    billAddressPostCode,
    billAddressDistrict,
    billAddressStreet,
  ]);

  useEffect(() => {
    console.log("openInquiry", openInquiry);
  }, [openInquiry]);

  return (
    <>
      <div
        className={`credit-card-block-container d-flex align-items-center ${otherClass} ${
          deleteSuccesful ? "deleteShrink" : ""
        }`}
      >
        <div className="block-default d-flex justify-content-center">
          {isDefault ? (
            <p>預設</p>
          ) : (
            <Button onClick={changeDefault}>設為預設</Button>
          )}
        </div>
        <div className="card-info">
          <h4 className="card-info-detail card-info-title">卡片資訊</h4>
          <div className="card-info-detail card-association d-flex align-items-center">
            {(() => {
              switch (association) {
                case "MasterCard":
                  return [<FaCcMastercard className="card-association-icon" />];
                case "VISA":
                  return <FaCcVisa className="card-association-icon" />;
                case "JCB":
                  return <FaCcJcb className="card-association-icon" />;
                case "DISCOVER":
                  return <FaCcDiscover className="card-association-icon" />;
                default:
                  break;
              }
            })()}
            {/* <FaCcMastercard className="card-association-icon" /> */}
            <p>{association}</p>
          </div>
          <div className="card-info-detail last-four-number">
            末四碼 {cdLastFourNumber}
          </div>
          <div className="card-info-detail card-expiration">
            期限 {cdMonth < 10 ? "0" + cdMonth.toString() : cdMonth}/{cdYear}
          </div>
        </div>
        <div className="bill-address flex-grow">
          <h4 className="bill-address-detail bill-address-title">帳單地址</h4>
          {/* districtInput */}
          {inputOpen ? (
            <Address
              myCity={cities}
              myPostCode={postCode}
              myAddress={address}
              setCities={setCities}
              setDistricts={setDistricts}
              setPostCode={setPostCode}
              setAddress={setAddress}
            />
          ) : (
            [
              <p className="bill-address-detail bill-address-district">
                {billAddressPostCode} {[billAddressCity, billAddressDistrict]}
              </p>,
              <p className="bill-address-detail bill-address-street">
                {billAddressStreet}
              </p>,
            ]
          )}
        </div>
        <div className="card-buttons d-flex align-items-center">
          {inputOpen ? (
            <Button className="card-modify-save" onClick={handleSave}>
              儲存變更
            </Button>
          ) : (
            <Button className="card-modify" onClick={handleInputOpen}>
              變更地址
            </Button>
          )}
          {inputOpen ? (
            <Button className="card-modify-cancel" onClick={handleInputClose}>
              取消
            </Button>
          ) : (
            <Button className="card-delete" onClick={handleInquiryOpen}>
              刪除
            </Button>
          )}
          <InquiryAlert
            openInquiry={openInquiry}
            handleInquiryClose={handleInquiryClose}
            inquiryTitle={inquiryTitle}
            inquiryContext={inquiryContext}
            leftButton={"取消"}
            rightButton={"確認刪除"}
            leftButtonFunc={handleInquiryClose}
            rightButtonFunc={deletePayment}
          />
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
  return bindActionCreators({ userLogin, userLogOut }, dispatch);
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreditCardBlock)
);
