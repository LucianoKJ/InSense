import React, { useState, useEffect } from "react";
import "./MyCoupon.scss";
import FormInput from "../FormInput/FormInput";
import { apiUri } from '../../constants/api';

const MyCoupon = (props) => {
  const [couponCode, setCouponCode] = useState();
  const [couponDiscount, setCouponDiscount] = useState();
  const [codeValue, setCodeValue] = useState();
  const [Data, setData] = useState([]);
  const [DisCountValue, setDiscountValue] = useState(0);

  async function getData() {
    const request = new Request(`${apiUri}/coupon`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "appliaction/json",
      }),
    });
    const res = await fetch(request);
    const data = await res.json();

    return data;
  }
  useEffect(() => {
    (async () => {

      const data = await getData();
      setData(data);
      
    })();
  }, [codeValue]);

  useEffect(() => {
    Data.filter(
      (el) => (el.couponCode.toString() === codeValue)).forEach((element) => setDiscountValue(element.couponDiscount));
  }, [couponCode, codeValue,DisCountValue, Data]);

  return (
    <>
      <div className="container d-flex">
        <p className="text-coupon-code">優惠碼</p>
        <input
          className="code-input"
          onChange={(e) => setCodeValue(e.target.value)}
        ></input>
      </div>

      <div className="container d-flex">
        <p>折扣</p>
        <p>-NT${DisCountValue}</p>
        <p></p>
      </div>
    </>
  );
};

export default MyCoupon;
