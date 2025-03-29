import React from "react";
import { FiShare2 } from "react-icons/fi";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import { userToggleFunc } from '../../Redux/nav/navAction'
import "./classCard.scss";

import { apiUri } from "../../constants/api";

const ClassCard = ({ logInStatus, classImg, classTime, className, classId, remainingPeople, userToggleFunc, bookInfo }) => {
  const selectClassId = bookInfo && bookInfo.filter(i => i.classId === classId && i.bookStatus === '預約成功')
  const newClassArray = []
  selectClassId.forEach(element => {
    newClassArray.push(element.classId)
  });
  return (
    <>
      <div className={`class-card-wrapper`}>
        {remainingPeople === 0 ? <div className='card-block'><p>人數已滿</p></div> : ''}
        <div className={`card-img`}>
          <img src={`${apiUri}/images/class/${classImg}.png`} />
        </div>
        <div className="card-content d-flex justify-content-between align-items-center">
          <p>{classTime}</p>
          <FiShare2 className="share-icon" />
        </div>
        <div className='d-flex justify-content-between align-items-center class-card-tile'>
          <p className="card-name">{className}</p>
          <p className='countPeople'>剩餘 {remainingPeople}位</p>
        </div>
        {newClassArray.indexOf(classId) !== -1 ?
          (<Link key={classId} to={`/classdetail/${classId}`}
            onClick={(e) => logInStatus ? '' : (e.preventDefault(), userToggleFunc())}
            className="card-btn text-center cantClick"
            role="button"
          >
            已參加
          </Link>) : (<Link key={classId} to={`/classdetail/${classId}`}
            className="card-btn text-center"
            role="button"
          >
            參加
          </Link>)
        }
      </div>
    </>
  );
};


const mapStateToProps = (store) => {
  return { user: store.user, userToggle: store.nav };
};

//Redux引入函式
//mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ userToggleFunc }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(ClassCard);
