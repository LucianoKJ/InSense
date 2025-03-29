import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import './detailFooter.scss'
import Swal from 'sweetalert2'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux'
import { userToggleFunc } from '../../Redux/nav/navAction'
import { apiUri } from '../../constants/api';

const DetailFooter = ({ classTime, match, history, classPrice, userToggleFunc }) => {
  const [reservationPeople, setReservationPeople] = useState('')
  const [reservationTime, setReservationTime] = useState('')

  const popUp = async () => {

    // post data
    const data = {
      bookQty: reservationPeople,
      bookTime: reservationTime,
      classId: match.params.classid,
      bookTotalPrice: classPrice * reservationPeople
    }
    const response = await fetch(`${apiUri}/class/classdetail/${match.params.classid}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const res = await response.json()

    Swal.fire({
      title: res.logInStatus ? res.error === '人數超過上限' ? '人數超過上限' : res.error === '請選擇人數' ? '請選擇人數' : res.error === '請選擇時間' ? '請選擇時間' : `感謝${res.userInfo.userFirstName} 先生的預約` : '預約失敗',
      icon: res.logInStatus ? res.error ? 'info' : 'success' : 'error',
      html: res.success ?
        `<p>人數：${data.bookQty}<br/>
           日期：${classTime}<br/>
           時間：${data.bookTime}<br/></p>
          `: res.error ? '' : '<br/>請先登入在做預約的服務<br/><br/>',
      showCloseButton: true,
      showConfirmButton: false,
      focusConfirm: false,
      // confirmButtonText:
      //   res.success ? '<i class="fa fa-thumbs-up"></i> 查看預約' : '',
      // preConfirm: () =>
      //   res.success ? history.push('/account/classpage') : ''
      // ,
      customClass: {
        container: 'container-class',
        popup: 'popup-class',
        title: 'title-class',
        content: res.success ? 'content-class' : 'content-sub-class',
        confirmButton: 'confirm-button-class',
        closeButton: 'close-button-class'
      }
    })
    if (!res.logInStatus) {
      setTimeout(() => {
        Swal.close()
        userToggleFunc()
      }, 1500)
    }
    if (res.success) {
      setTimeout(() => {
        Swal.close()
        history.push('/classlist')
      }, 2000)
    }
  }
  const resetSelected = () => {
    const allSelect = document.querySelectorAll('select')
    allSelect.forEach(i => i.selectedIndex = 0)
  }
  return (
    <>
      <p className='reservation-date'>預約日期：{classTime}</p>
      <div className='reservation-wrapper d-flex'>
        <select defaultValue={'DEFAULT'} onChange={e => setReservationPeople(e.target.value)}>
          <option value={'DEFAULT'} disabled hidden>預約人數</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <select defaultValue={'DEFAULT'} onChange={e => setReservationTime(e.target.value)}>
          <option value={'DEFAULT'} disabled hidden>預約時間</option>
          <option value="13:00">13:00</option>
          <option value="14:00">14:00</option>
          <option value="15:00">15:00</option>
          <option value="16:00">16:00</option>
          <option value="17:00">17:00</option>
          <option value="18:00">18:00</option>
        </select>
      </div>
      <a className='reservation-btn text-center' onClick={() => (popUp(), resetSelected())} role='button'>預約</a>
    </>
  )
}

//Redux引入函式
//mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { userToggleFunc },
    dispatch
  );
};

export default withRouter(connect(null, mapDispatchToProps)(DetailFooter))