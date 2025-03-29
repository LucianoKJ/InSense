import React, { useState, useEffect } from "react";
import MainContainer from "../../components/mainContainer";
import "./orderPayMent.scss";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Input, FormControl, InputLabel } from "@material-ui/core";
import CreditCardNumber from "../../components/CreditCardNumber/creditCardNumber";
import CreditCardExpiration from "../../components/CreditCardExpiration/creditCardExpiration";
import CreditCardAssociation from "../../components/CreditCardAssociation/creditCardAssociation";
import { clearCart, clearCouponCode } from "../../Redux/cart/cartAction";
import Address from "../../components/Address/address";
import InquiryAlert from "../../components/InquiryAlert/inquiryAlert";
import axios from "axios";
import { apiUri } from "../../constants/api";

//radio checkbox icon
import { FiSquare, FiCheckSquare } from "react-icons/fi";

//redux selector
import {
  selectCartItems,
  selectCartTotal,
  selectUserLogin,
  selectUserInfo,
  selectCouponCode
} from "../../Redux/cart/cartSelectors";

import Button from "@material-ui/core/Button";

const OrderPayMent = ({
  history,
  selectCartItems,
  selectCartTotal,
  selectUserLogin,
  selectUserInfo,
  selectCouponCode,
  clearCart,
  clearCouponCode
}) => {
  const UserInfo = { ...selectUserInfo };
  console.log(selectCartTotal)
  const orderDelivery = history.location.state;
  const [getOrderDelivery, setGetOrderDelivery] = useState(orderDelivery);

  const [saveCreditCard, setSaveCreditCard] = useState(false);
  const [agree, setAgree] = useState(false);

  //持卡人
  const [cdHolder, setcdHolder] = useState("");

  //信用卡號
  const [cardNumberFirst, setCardNumberFirst] = useState("");
  const [cardNumberSecond, setCardNumberSecond] = useState("");
  const [cardNumberThird, setCardNumberThird] = useState("");
  const [cardNumberForth, setCardNumbeForth] = useState("");

  //期限
  const [cdMonth, setcdMonth] = useState("");
  const [cdYear, setcdYear] = useState("");

  //安全碼
  const [safeCode, setSafeCode] = useState("");

  //卡別
  const [association, setassociation] = useState('')

  //地址
  const [billCity, setBillCity] = useState("");
  const [billDistrict, setBillDistrict] = useState("");
  const [billPostCode, setBillPostCode] = useState("");
  const [billAddress, setBillAddress] = useState("");

  const [isDefault, setisDefault] = useState(0);

  //取得信用卡資訊
  const [getCreditCardInfo, setGetCreditCardInfo] = useState({});

  //格式錯誤檢查
  const [formatError, setFormatError] = useState({});

  //控制翻牌
  const [rotateCard, setRotateCard] = useState(false)

  //打開詢問付款
  const [openInquiry, setOpenInquiry] = useState(false);
  const [inquiryTitle, setInquiryTitle] = useState("title");
  const [inquiryContext, setInquiryContext] = useState("context");

  const handleInquiryOpen = () => {
    if (Object.keys(formatError).length || !agree) {
      setInquiryTitle("資料不正確");
      setInquiryContext("確認資料欄位輸入無誤或是有無勾選");
      setOpenInquiry(true);
    } else {
      setInquiryTitle("確認付款");
      setInquiryContext("按下確認按鈕即送出訂單");
      setOpenInquiry(true);
    }
  }
  const handleInquiryClose = () => {
    setOpenInquiry(false);
  };

  const handleChange = (event) => {
    const errObj = {}
    if (!event.target.value.length) {
      errObj.cdHolder = '未填*'
    } else {
      delete errObj.cdHolder
    }
    setFormatError(errObj)

    switch (event.target.name) {
      case "cdHolder":
        setcdHolder(event.target.value);
        break;
      case "isDefault":
        setisDefault(event.target.value);
        break;
    }
  };

  const changeSafeCode = (e) => {
    const errObj = {}
    //先取出數字陣列
    const inputNumList = e.target.value.match(/\d+/g);
    // console.log("inputNumList", inputNumList);

    //將陣列合併成字串
    const insertRawNum = !!inputNumList ? inputNumList.join("") : "";
    // console.log("insertRawNum", insertRawNum);

    //取出前四個數字
    const insertNum = !!insertRawNum.match(/\d{1,3}/g)
      ? insertRawNum.match(/\d{1,3}/g)[0]
      : "";
    if (e.target.value.length < 3) {
      errObj.safeCode = '請填滿3碼*'
    } else {
      delete errObj.safeCode
    }
    setFormatError(errObj)
    setSafeCode(insertNum);

  };
  const paymentdata = {
    userId: UserInfo.userId,
    cdHolder: cdHolder,
    cdMonth: cdMonth,
    cdYear: cdYear,
    cdNumber: `${cardNumberFirst}-${cardNumberSecond}-${cardNumberThird}-${cardNumberForth}`,
    association: association,
    billAddressCity: billCity,
    billAddressPostCode: billPostCode,
    billAddressDistrict: billDistrict,
    billAddressStreet: billAddress,
    isDefault: isDefault,
  };

  const getSavedCreditCardInfo = async () => {
    const res = await fetch(`${apiUri}/orders/getCreditCardInfo`, {
      credentials: "include",
    });
    const data = await res.json();
    return data;
  };

  const addordersToSever = async () => {
    const res = await axios.post(`${apiUri}/orders/orderList`, {
      paymentdata: paymentdata,
      selectCartItems: selectCartItems,
      selectCartTotal: selectCartTotal,
      orderDelivery: getOrderDelivery,
      selectCouponCode: selectCouponCode
    });
    const { data } = res;
    return data;
  };

  const confirmToPay = async (e) => {
    e.preventDefault();
    const data = await addordersToSever();
    clearCart();
    clearCouponCode()
    history.push(`/orders/orderdetail/${data.orderId}`);
  };
  //當saveCreditCard 改變時 從資料庫撈資料或變成空物件
  useEffect(() => {
    (async () => {
      if (saveCreditCard) {
        const data = await getSavedCreditCardInfo();
        setGetCreditCardInfo(data);
      } else {
        setGetCreditCardInfo({});
      }
    })();
  }, [saveCreditCard]);

  useEffect(() => {
    const input = document.querySelector('.payment-safe-code .MuiFormControl-root .MuiInputBase-root input')
    input.addEventListener('focus', function () {
      setRotateCard(true)
    })
    input.addEventListener('blur', function () {
      setRotateCard(false)
    })
  }, [])

  //取得預設的credit card 資料
  useEffect(() => {
    const { creditCardInfo } = { ...getCreditCardInfo };
    setassociation(creditCardInfo && creditCardInfo.association);
    setCardNumberFirst(
      creditCardInfo ? creditCardInfo.cdNumber.split("-")[0] : ""
    );
    setCardNumberSecond(
      creditCardInfo ? creditCardInfo.cdNumber.split("-")[1] : ""
    );
    setCardNumberThird(
      creditCardInfo ? creditCardInfo.cdNumber.split("-")[2] : ""
    );
    setCardNumbeForth(
      creditCardInfo ? creditCardInfo.cdNumber.split("-")[3] : ""
    );
    setcdMonth(creditCardInfo ? creditCardInfo.cdMonth : "");
    setcdYear(creditCardInfo ? creditCardInfo.cdYear : "");
    setcdHolder(creditCardInfo ? creditCardInfo.cdHolder : "");
    setBillCity(creditCardInfo && creditCardInfo.billAddressCity);
    setBillDistrict(creditCardInfo && creditCardInfo.billAddressDistrict);
    setBillPostCode(creditCardInfo && creditCardInfo.billAddressPostCode);
    setBillAddress(creditCardInfo && creditCardInfo.billAddressStreet);
  }, [getCreditCardInfo]);

  return (
    <MainContainer>
      <div className="text-center position-relative order-payment-head">
        <div className="position-absolute order-payment-title">付款資訊</div>
        <div className="order-payment-step">
          <a href="#" onClick={(e) => e.preventDefault()}>
            寄送資訊{" "}
          </a>{" "}
          ＞
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#d94f06' }}>
            付款資訊{" "}
          </a>{" "}
          ＞
          <a href="#" onClick={(e) => e.preventDefault()}>
            訂單明細
          </a>
        </div>
      </div>
      {/* 卡片 */}
      <div className="d-flex order-payment-content">
        <div className={`order-payment-subcontent subcontent-left ${rotateCard ? 'rotateActive' : ''}`}>
          <div className='credit-card-demo1'>
            <CreditCardNumber
              cardNumberFirst={cardNumberFirst}
              cardNumberSecond={cardNumberSecond}
              cardNumberThird={cardNumberThird}
              cardNumberForth={cardNumberForth}
              setCardNumberFirst={(e) => setCardNumberFirst(e.target.value)}
              setCardNumberSecond={setCardNumberSecond}
              setCardNumberThird={setCardNumberThird}
              setCardNumbeForth={setCardNumbeForth}
            />
            <CreditCardExpiration
              cdMonth={cdMonth}
              cdYear={cdYear}
              setCdMonth={setcdMonth}
              setCdYear={setcdYear}
              formatError={formatError}
              setFormatError={setFormatError}
            />
          </div>
          <div className='credit-card-demo2'>
            <div className='black-strip'></div>
            <FormControl>
              <InputLabel htmlFor="my-input">安全碼*</InputLabel>
              <Input id="my-input" value={safeCode} onChange={changeSafeCode} aria-describedby="my-helper-text" />
            </FormControl>
          </div>

        </div>
        <div className="order-payment-subcontent subcontent-center">
          {/* 卡別 */}
          <div className='position-relative'>
            <CreditCardAssociation
              association={association}
              setAssociation={setassociation}
              formatError={formatError}
              setFormatError={setFormatError}
            />
            <div
              className={
                !!formatError.association ? "error-message" : "display-none"
              }
            >
              <span>{formatError.association}</span>
            </div>
          </div>
          <div className='position-relative'>
            <CreditCardNumber
              cardNumberFirst={cardNumberFirst}
              cardNumberSecond={cardNumberSecond}
              cardNumberThird={cardNumberThird}
              cardNumberForth={cardNumberForth}
              formatError={formatError}
              setCardNumberFirst={setCardNumberFirst}
              setCardNumberSecond={setCardNumberSecond}
              setCardNumberThird={setCardNumberThird}
              setCardNumbeForth={setCardNumbeForth}
              setFormatError={setFormatError}

            />
            <div
              className={
                !!formatError.cardNumber ? "error-message" : "display-none"
              }
            >
              <span>{formatError.cardNumber}</span>
            </div>
          </div>
          <div className='position-relative'>
            <div className="d-flex align-items-center payment-safe-code">
              <FormControl>
                <InputLabel htmlFor="my-input">安全碼*</InputLabel>
                <Input
                  id="my-input"
                  value={safeCode}
                  onChange={changeSafeCode}
                  aria-describedby="my-helper-text"
                />
              </FormControl>
              <p> (3碼) </p>
            </div>
            <div
              className={
                !!formatError.safeCode ? "error-message" : "display-none"
              }
            >
              <span>{formatError.safeCode}</span>
            </div>
          </div>
          <div className="subcontent-date position-relative">
            到期日期
            <div className="credit-card-date">
              <CreditCardExpiration
                cdMonth={cdMonth}
                cdYear={cdYear}
                setCdMonth={setcdMonth}
                setCdYear={setcdYear}
                formatError={formatError}
                setFormatError={setFormatError}
              />
            </div>
            <div
              className={
                !!formatError.cdDate ? "error-message" : "display-none"
              }
            >
              <span>{formatError.cdDate}</span>
            </div>
          </div>
        </div>
        <div className="order-payment-subcontent subcontent-right">
          <div className='position-relative'>
            <FormControl>
              <InputLabel htmlFor="my-input">持有人*</InputLabel>
              <Input
                value={cdHolder}
                name="cdHolder"
                onChange={handleChange}
                id="my-input"
                aria-describedby="my-helper-text"
              />
            </FormControl>
            <div
              className={
                !!formatError.cdHolder ? "error-message" : "display-none"
              }
            >
              <span>{formatError.cdHolder}</span>
            </div>
          </div>
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
            className="credit-card-checkedBtn d-flex align-items-center"
            onClick={() => setSaveCreditCard(!saveCreditCard)}
          >
            {saveCreditCard ? (
              <FiCheckSquare className="order-payment-square" />
            ) : (
                <FiSquare className="order-payment-square" />
              )}
            <p>使用預設已儲存的信用卡</p>
          </div>
          <div
            className="credit-card-checkedBtn d-flex align-items-center"
            onClick={() => setAgree(!agree)}
          >
            {agree ? (
              <FiCheckSquare className="order-payment-square" />
            ) : (
                <FiSquare className="order-payment-square" />
              )}
            <p>
              我確認上述資訊完整無誤並同意上述資訊
              <br />
              可以被InSense作為商業用途使用
            </p>
          </div>
          <Button
            className="MuiButtonBase-root MuiButton-root MuiButton-outlined confirm-btn"
            href="#"
            onClick={handleInquiryOpen}
          >
            確認付款
          </Button>
          <InquiryAlert
            openInquiry={openInquiry}
            handleInquiryClose={handleInquiryClose}
            inquiryTitle={inquiryTitle}
            inquiryContext={inquiryContext}
            leftButton={Object.keys(formatError).length || !agree ? '' : "取消"}
            rightButton={Object.keys(formatError).length || !agree ? '取消' : "確認"}
            leftButtonFunc={handleInquiryClose}
            rightButtonFunc={Object.keys(formatError).length || !agree ? handleInquiryClose : confirmToPay}
          />
        </div>
      </div>
    </MainContainer>
  );
};
const mapStateToProps = createStructuredSelector({
  selectCartItems: selectCartItems,
  selectCartTotal: selectCartTotal,
  selectUserLogin: selectUserLogin,
  selectUserInfo: selectUserInfo,
  selectCouponCode: selectCouponCode
});

const mapDispatchToProps = (dispatch) => ({
  clearCart: () => dispatch(clearCart()),
  clearCouponCode: () => dispatch(clearCouponCode())
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OrderPayMent)
);
