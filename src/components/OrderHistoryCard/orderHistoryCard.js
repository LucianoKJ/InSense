import React, { useState, useEffect } from 'react'
import './orderHistoryCard.scss'
import { Link } from 'react-router-dom'
import { FiX } from "react-icons/fi";
import InquiryAlert from '../../components/InquiryAlert/inquiryAlert'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { cancelOrderFunc } from '../../Redux/order/orderAction'

import { apiUri } from '../../constants/api';

const OrderHistoryCard = (props) => {
  const { cancelOrderFunc, orderId, totalPrice, orderDate, orderStatus, deliveryId, itemImg, itemName, itemPrice, itemBrand } = props
  const upperBrand = itemBrand === 'Diptyque' ? itemBrand.toLowerCase() : itemBrand
  const newItemName = itemName.split(upperBrand)[1]

  //打開詢問付款
  const [openInquiry, setOpenInquiry] = useState(false);
  const [inquiryTitle, setInquiryTitle] = useState("title");
  const [inquiryContext, setInquiryContext] = useState("context");
  const handleInquiryOpen = () => {
    setInquiryTitle("確認取消");
    setInquiryContext("按下確認按鈕即取消訂單");
    setOpenInquiry(true);
  };
  const handleInquiryClose = () => {
    setOpenInquiry(false);
  };

  const cancelOrder = async () => {
    const data = {
      orderId: orderId
    }
    const response = await fetch(`${apiUri}/users/orderhistory/${orderId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    //redux狀態改變時,讓父層rerender
    cancelOrderFunc()
    handleInquiryClose()
  }

  return (
    <div className={`d-flex order-history-card-container ${orderStatus === '已取消' ? 'container-opacity' : ''}`}>
      <div className={`order-history-orderinfo ${orderStatus === '已取消' ? 'orderinfo-cancel' : ''}`}>
        <p className='order-id'>訂單編號：{orderId}</p>
        <p>總金額：{totalPrice}</p>
        <p>訂購日期：{orderDate}</p>
        <p>訂單狀況：{orderStatus}</p>
        {orderStatus === '已取消' ? '' : <Link to={`/orders/orderdetail/${orderId}`} className='link-to-order-detail'>訂單詳情</Link>}
      </div>
      <div className='order-history-deliveryinfo'>
        <p className='delivery-id'>配送編號：{deliveryId}</p>
        <p>配送方式：宅配</p>
      </div>
      <figure className='order-history-itemimg d-flex align-items-center position-relative'>
        <img src={itemImg} />
        <div>
          <p>{itemBrand}</p>
          <p>{newItemName}</p>
          <p>NT$ {itemPrice}</p>
        </div>
        {orderStatus === '已取消' ? '' : <button className='cancelOrderBtn position-absolute' onClick={handleInquiryOpen}>
          <FiX />
        </button>}
        <InquiryAlert
          openInquiry={openInquiry}
          handleInquiryClose={handleInquiryClose}
          inquiryTitle={inquiryTitle}
          inquiryContext={inquiryContext}
          leftButton={"取消"}
          rightButton={"確認"}
          leftButtonFunc={handleInquiryClose}
          rightButtonFunc={cancelOrder}
        />
      </figure>
    </div>
  )
}


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { cancelOrderFunc },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(OrderHistoryCard)