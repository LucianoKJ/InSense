import React, { useState, useEffect } from "react";
import "./classes.scss";
import ClassItem from "../classItem";

import { apiUri } from '../../constants/api';

const Classes = () => {
  const [myClassList, setMyClassList] = useState([])
  const [allClassList, setAllClassList] = useState([])
  const [myClassSelected, setMyClassSelected] = useState(true)
  const [allClassSelected, setAllClassSelected] = useState(false)
  const [classes, setClasses] = useState([])
  const [cancelBtn, setCancelBtn] = useState(true)
  const [changeState, setChangeState] = useState(false)


  const changeSelectHandler = (e) => {
    switch (e.target.dataset.select) {
      case "myClass":
        setMyClassSelected(true);
        setAllClassSelected(false);
        setClasses(myClassList);
        setCancelBtn(true);
        break;
      case "allClass":
        setAllClassSelected(true);
        setMyClassSelected(false);
        setClasses(allClassList);
        setCancelBtn(false);
        break;
      default:
        break;
    }
  }
  const fetchMyClassData = async () => {
    const res = await fetch(`${apiUri}/users/classlist`, {
      credentials: "include",
    });
    const data = await res.json();
    return data;
  };
  const fetchAllClassDate = async () => {
    const res = await fetch(`${apiUri}/users/allclasslist`, {
      credentials: "include",
    });
    const data = await res.json();
    return data;
  };
  const fetchCancelBook = async (e) => {
    const info = {
      bookId: e.currentTarget.id
    }
    await fetch(`${apiUri}/users/classlist`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(info)
    })
  }
  const confirmCancel = async (e) => {
    await fetchCancelBook(e)
    setChangeState(!changeState)
  }
  useEffect(() => {
    (async () => {
      const classData = await fetchMyClassData()
      const allClassData = await fetchAllClassDate()
      setMyClassList(classData)
      setAllClassList(allClassData)
      setClasses(classData)
    })()
  }, [changeState])




  return (
    <>
      <div className='class-wrapper'>
        <div className='change-btn d-flex'>
          <a className={`${myClassSelected ? 'btn-selected' : ''}`} onClick={(event) => changeSelectHandler(event)} role='button' data-select='myClass'>已報名</a>
          <a className={`${allClassSelected ? 'btn-selected' : ''}`} onClick={(event) => changeSelectHandler(event)} role='button' data-select='allClass'>課程紀錄</a>
        </div>
        <div className='d-flex class-item text-center'>
          <p>日期</p>
          <p>時間</p>
          <p>課程分類</p>
          <p>課程名稱</p>
          <p>課程單價</p>
          <p>報名人數</p>
          <p>課程狀態</p>
          {cancelBtn ? <p></p> : ''}
        </div>
        {classes.map((item, index) => <ClassItem key={index} cancelBtn={cancelBtn} classInfo={item} confirmCancel={confirmCancel} />)}
        {/* {classes.map((item, index) => <ClassItem key={index} cancelBtn={cancelBtn} classInfo={item} cancel={(e) => (fetchCancelBook(e), setChangeState(!changeState))} />)} */}
      </div>
    </>
  )
}

export default Classes;
