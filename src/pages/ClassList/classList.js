import React, { useState, useEffect } from "react";
import ClassHead from "../../components/ClassHead/classHead";
import ClassCard from "../../components/ClassCard/classCard";
import MainContainer from "../../components/mainContainer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//Redux
import { userLogin, userLogOut } from "../../Redux/user/userAction";
import "./classList.scss";

import { apiUri } from "../../constants/api";


const ClassList = ({ user, userLogin, userLogOut }) => {
  const [classInfo, setClassInfo] = useState([]);
  const [bookInfo, setBookInfo] = useState([]);

  const fetchClassData = async () => {
    const res = await fetch(`${apiUri}/class`, { credentials: 'include' })
    const data = await res.json()
    return data
  }

  useEffect(() => {
    (async () => {
      user.logInStatus ? userLogin(user.userInfo) : userLogOut();
      const data = await fetchClassData()
      setClassInfo(data.classInfo)
      setBookInfo(data.bookInfo)
    })()
  }, [user.logInStatus])


  return (
    <MainContainer otherClass="class-list-container d-flex flex-wrap justify-content-center">
      <ClassHead
        classImgDir={"class"}
        classImg={"class7"}
        title={"課程體驗"}
        content={`InSense提供客製化香水體驗課程,`}
        content2={"與您一起感受香氛"}
      />
      {classInfo?.map((info) => (
        <ClassCard
          key={info.classId}
          classImg={info.classImg}
          classTime={info.classTime}
          className={info.className}
          classId={info.classId}
          remainingPeople={info.remainingPeople}
          logInStatus={user.logInStatus}
          bookInfo={bookInfo}
          userId={user.userInfo.userId}
        />
      ))}
    </MainContainer>
  );
};

const mapStateToProps = (store) => {
  return { user: store.user, userToggle: store.nav };
};

//Redux引入函式
//mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ userLogin, userLogOut }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(ClassList);
