import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
// import TextField from "@material-ui/core/TextField";

//scss
import "./creditCardAdd.scss";

//Dialog
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";

//Redux
import { userLogin, userLogOut } from "../../Redux/user/userAction";

//component
import Address from "../../components/Address/address";
import CreditCardNumber from "../../components/CreditCardNumber/creditCardNumber";
import CreditCardAssociation from "../../components/CreditCardAssociation/creditCardAssociation";
import CreditCardExpiration from "../../components/CreditCardExpiration/creditCardExpiration";

import { apiUri } from '../../constants/api';

const FormDialog = function (props) {
  // const [open, setOpen] = React.useState(false);
  const {
    user,
    open,
    setOpen,
    handleClose,
    handleAlertOpen,
    setCreditCardList,
    setCreditCardFormState,
    creditCardFormState,
    history,
  } = props;

  //card association
  const [association, setAssociation] = useState("");

  //信用卡號
  const [cardNumberFirst, setCardNumberFirst] = useState("");
  const [cardNumberSecond, setCardNumberSecond] = useState("");
  const [cardNumberThird, setCardNumberThird] = useState("");
  const [cardNumberForth, setCardNumbeForth] = useState("");

  //持有人
  const [cardHolder, setCardHolder] = useState("");

  //期限
  const [cdMonth, setCdMonth] = useState("");
  const [cdYear, setCdYear] = useState("");

  //帳單地址
  const [billCity, setBillCity] = useState("");
  const [billDistrict, setBillDistrict] = useState("");
  const [billPostCode, setBillPostCode] = useState("");
  const [billAddress, setBillAddress] = useState("");

  //格式錯誤陣列
  const [errMessage, setErrMessage] = useState([]);

  //card holder
  const handleCardHolderChange = (event) => {
    setCardHolder(event.target.value);
  };

  //新增付款方式
  const creditCardAddSent = async () => {
    // 先將卡號結合
    const cardNum = [
      cardNumberFirst,
      cardNumberSecond,
      cardNumberThird,
      cardNumberForth,
    ].join("-");

    if (!user.logInStatus) {
    }

    if (user.logInStatus) {
      // console.log("cdAddSent")
      //若所有格式正確
      if (
        !!association.length &&
        cardNum.length === 19 &&
        !!cardHolder.length &&
        cdMonth.length === 2 &&
        cdYear.length === 2 &&
        !!billCity &&
        !!billPostCode &&
        !!billAddress.length
      ) {
        const data = {
          association: association,
          cdNumber: cardNum,
          cdHolder: cardHolder,
          cdMonth: cdMonth,
          cdYear: cdYear,
          billAddressCity: billCity,
          billAddressPostCode: billPostCode,
          billAddressDistrict: billDistrict,
          billAddressStreet: billAddress,
        };

        //向後端請求新增
        const response = await fetch(
          `${apiUri}/users/creditcardadd`,
          {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            headers: {
              "content-type": "application/json",
            },
          }
        );
        const obj = await response.json();
        console.log(obj);

        //reset user
        obj.logInStatus ? userLogin(obj.userInfo) : userLogOut();

        if (obj.success) {
          if (obj.logInStatus) {
            // 若有改變
            if (obj.newCreditCardList) {
              setCreditCardList(obj.newCreditCardList);
              setOpen(false);
              //重新產生新的component，以便清空欄位
              setCreditCardFormState(creditCardFormState + 1);
              handleAlertOpen(
                "新增成功",
                "新增信用卡已可在付款資訊頁面查詢",
                false,
                false
              );
            }

            // 若無增加
            if (obj.message && obj.message === "NOTHING_ADDED") {
              console.log(obj.message);
              handleAlertOpen("無任何新增", "信用卡資訓可在付款資訊頁面查詢", false, false);
            }
          }
        } else {
          if (!obj.success) {
            handleAlertOpen("請先登入", "二秒後跳轉至首頁", true, true);
            setOpen(false);
            setTimeout(() => {
              history.push("/");
            }, 2000);
          }
        }
      } else {
        const newArray = [];

        //有錯誤的，加在陣列
        if (!association.length) {
          newArray.push("creditCardAssociation");
        }
        if (cardNum.length !== 19) {
          newArray.push("creditCardNumber");
        }
        if (!cardHolder.length) {
          newArray.push("creditCardHolder");
        }
        if (cdMonth.length < 2 || cdYear.length < 2) {
          newArray.push("creditCardExpiration");
        }
        if (!billCity || !billPostCode || !billAddress.length) {
          newArray.push("creditCardAddress");
        }
        //若有任何錯誤
        if (newArray.length) {
          setErrMessage(newArray);
        }

        console.log("not sent");
      }
    } else {
      console.log("not log in");
      setOpen(false);
      handleAlertOpen("請先登入，方可查詢", "二秒後跳轉至首頁");
      setTimeout(() => {
        history.push("/");
      }, 2000);
    }
    // handleClose();
  };

  useEffect(() => {
    console.log(
      cardNumberFirst,
      "-",
      cardNumberSecond,
      "-",
      cardNumberThird,
      "-",
      cardNumberForth
    );
  });

  useEffect(() => {
    // console.log(billCity, billDistrict, billPostCode, billAddress);
  });
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="credit-card-add-dialog-title">新增信用卡</DialogTitle>
        <DialogContent>
          <DialogContentText className="credit-card-add-dialog-content-text">
            請務必填妥所有資訊*
          </DialogContentText>
          <div className="credit-card-add-form d-flex flex-wrap">
            <div className="credit-card-add-block credit-card-add-association">
              <CreditCardAssociation
                association={association}
                setAssociation={setAssociation}
              />
              <div
                className={`invisible-error-bar  ${
                  errMessage.findIndex((el) => {
                    return el === "creditCardAssociation";
                  }) !== -1
                    ? "error-bar"
                    : ""
                }`}
              ></div>
            </div>
            <div className="credit-card-add-block credit-card-add-card-number">
              <CreditCardNumber
                open={open} //為了再看看要不要清空
                cardNumberFirst={cardNumberFirst}
                cardNumberSecond={cardNumberSecond}
                cardNumberThird={cardNumberThird}
                cardNumberForth={cardNumberForth}
                setCardNumberFirst={setCardNumberFirst}
                setCardNumberSecond={setCardNumberSecond}
                setCardNumberThird={setCardNumberThird}
                setCardNumbeForth={setCardNumbeForth}
              />
              <div
                className={`invisible-error-bar  ${
                  errMessage.findIndex((el) => {
                    return el === "creditCardNumber";
                  }) !== -1
                    ? "error-bar"
                    : ""
                }`}
              ></div>
            </div>
            <div className="credit-card-add-block credit-card-add-card-holder">
              <FormControl>
                <InputLabel htmlFor="card-holder" className="input-card-holder">
                  持有人
                </InputLabel>
                <Input
                  type="text"
                  id="card-holder"
                  name="card-holder"
                  value={cardHolder}
                  onChange={handleCardHolderChange}
                />
              </FormControl>
              <div
                className={`invisible-error-bar  ${
                  errMessage.findIndex((el) => {
                    return el === "creditCardHolder";
                  }) !== -1
                    ? "error-bar"
                    : ""
                }`}
              ></div>
            </div>
            <div className="credit-card-add-block credit-card-add-expiration">
              <CreditCardExpiration
                cdMonth={cdMonth}
                cdYear={cdYear}
                setCdMonth={setCdMonth}
                setCdYear={setCdYear}
              />
              <div
                className={`invisible-error-bar  ${
                  errMessage.findIndex((el) => {
                    return el === "creditCardExpiration";
                  }) !== -1
                    ? "error-bar"
                    : ""
                }`}
              ></div>
            </div>
            <div className="credit-card-add-block credit-card-add-bill-address">
              <Address
                myCity={billCity}
                myPostCode={billPostCode}
                myAddress={billAddress}
                setCities={setBillCity}
                setDistricts={setBillDistrict}
                setPostCode={setBillPostCode}
                setAddress={setBillAddress}
              />
              <div
                className={`invisible-error-bar  ${
                  errMessage.findIndex((el) => {
                    return el === "creditCardAddress";
                  }) !== -1
                    ? "error-bar"
                    : ""
                }`}
              ></div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="credit-card-add-btns">
          <div
            className={`incomplete-message ${
              errMessage.length ? "incomplete-active" : ""
            }`}
          >
            *有未填欄位
          </div>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={creditCardAddSent} color="primary">
            確定新增
          </Button>
        </DialogActions>
      </Dialog>
    </div>
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
  connect(mapStateToProps, mapDispatchToProps)(FormDialog)
);
