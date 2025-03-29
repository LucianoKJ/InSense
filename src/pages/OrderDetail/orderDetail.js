import React, { useState, useEffect } from 'react'
import './orderDetail.scss'
import MainContainer from '../../components/mainContainer'
import OrderProductCard from '../../components/OrderProductCard/orderProductCard'
import { withRouter } from 'react-router-dom'
import { apiUri } from "../../constants/api";

const OrderDeatil = ({ match, history }) => {
  const [orderDetail, setOrderDetail] = useState({})

  const fetchOrderDetailData = async () => {
    const response = await fetch(`${apiUri}/orders/orderdetail/${match.params.orderid}`, {
      credentials: 'include'
    })
    const data = await response.json()
    return data
  }
  useEffect(() => {
    (async () => {
      const data = await fetchOrderDetailData()
      setOrderDetail(data)
    })()
  }, [])

  const { orderId, deliveryData, orderItems, creditCardData, totalPrice, couponDiscount } = { ...orderDetail }
  console.log(totalPrice)
  return (
    <MainContainer>
      <div className="text-center position-relative order-payment-head">
        <div className="position-absolute order-payment-title">訂單明細</div>
        <div className="order-payment-step">
          <a href="#" onClick={(e) => e.preventDefault()}>
            寄送資訊{" "}
          </a>{" "}
          ＞
          <a href="#" onClick={(e) => e.preventDefault()} >
            付款資訊{" "}
          </a>{" "}
          ＞
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#d94f06' }}>
            訂單明細
          </a>
        </div>
      </div>
      <h2 className='order-title'>訂單編號：{orderId && orderId}</h2>
      <div className='d-flex order-detail-container'>
        <div className='order-detail-subContainer'>
          <ul>配送地址
            <li>{deliveryData && (deliveryData.userLastName + deliveryData.userFirstName)}<br />
              {deliveryData && deliveryData.userPostCode}<br />
              {deliveryData && (deliveryData.userCity + deliveryData.userDistrict)}<br />
              {deliveryData && deliveryData.userAddress}</li>
          </ul>
          <ul>聯絡電話
            <li>{deliveryData && deliveryData.userPhone}</li>
          </ul>
        </div>
        <div className='order-detail-subContainer'>
          <ul>付款方式
            <li>
              {creditCardData && creditCardData[0].association}<br />
              {creditCardData && creditCardData[0].cdNumber}<br />
            期限:{creditCardData && creditCardData[0].cdMonth}/{creditCardData && creditCardData[0].cdYear}</li>
          </ul>
        </div>
        <div className='order-detail-subContainer'>
          <ul>帳單地址
            <li>{creditCardData && creditCardData[0].cdHolder}<br />
              {creditCardData && creditCardData[0].billAddressPostCode}<br />
              {creditCardData && (creditCardData[0].billAddressCity + creditCardData[0].billAddressDistrict)}<br />
              {creditCardData && creditCardData[0].billAddressStreet}</li>
          </ul>
        </div>
        <div className='order-detail-subContainer'>
          <h2>金額</h2>
          <div className='order-price-cotainer'>
            <div className='d-flex justify-content-between order-price-content'>
              <p>商品小計</p>
              <p>$ {totalPrice ? !!couponDiscount ? (totalPrice + couponDiscount) : totalPrice : ''}</p>
            </div>
            <div className='d-flex justify-content-between order-price-content'>
              <p>優惠券</p>
              <p>$ {`${!!couponDiscount ? '-' + couponDiscount : 0}`}</p>
            </div>
          </div>
          <div className='order-totalPrice-container'>
            <div className='d-flex justify-content-between order-price-content'>
              <p>總金額</p>
              <p>$ {totalPrice && totalPrice}</p>
            </div>
            <div className='d-flex justify-content-between order-price-content'>
              <p>刷卡金額</p>
              <p>$ {totalPrice && totalPrice}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-center order-detail-product-title'>
        <p>商品照片</p>
        <span>商品敘述</span>
        <p>數量</p>
        <p>單價</p>
        <p>小計</p>
      </div>
      {orderItems && orderItems.map(item => <OrderProductCard key={item.itemId} itemName={item.itemName} itemId={item.itemId} itemSize={item.itemSize} quantity={item.quantity} itemPrice={item.itemPrice} itemImg={item.itemimg} />)}

      <a className='go-back-btn' onClick={(e) => (e.preventDefault(), history.push(`/account/orderhistory`))} href='' role='button'>回到訂單紀錄</a>
    </MainContainer>
  )
}

export default withRouter(OrderDeatil)