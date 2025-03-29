import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./savedItems.scss";
import { FiBookmark } from "react-icons/fi";

//Redux
import { userLogin, userLogOut } from "../../Redux/user/userAction";
import { userToggleFunc } from "../../Redux/nav/navAction";

import { apiUri } from '../../constants/api';

function SavedItems(props) {

  const { user, userLogin, userLogOut, userToggleFunc, name } = props;
  //點擊收藏按鈕
  const [savedStatus, setSavedStatus] = useState(props.wish);
  // console.log(props.itemId, !!props.wish);

  //像後端請求
  const toggleWishListAsync = async () => {
    const data = {
      itemId: props.itemId,
    };
    const res = await fetch(`${apiUri}/itemdetail/togglebookmark`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const obj = await res.json();
    return obj;
  };

  const changeSavedStatus = async (e) => {
    // console.log("itemId", props.itemId);

    e.stopPropagation()

    if (user.logInStatus) {
      const responseWishList = await toggleWishListAsync();
      console.log("responseWishList", responseWishList);

      const logInStatus = responseWishList.logInStatus;
      const userInfo = responseWishList.userInfo;

      //reset user
      logInStatus ? userLogin(userInfo) : userLogOut();

      //若為登出，則彈出登入頁
      if (!logInStatus) {
        userToggleFunc();
        // ================= 告知會員現在為登出狀態 ================= //
      }

      if (responseWishList.message === "WISH_ADD") {
        setSavedStatus(true);
      } else if (responseWishList.message === "WISH_REMOVE") {
        setSavedStatus(false);
      }
    } else {
      userToggleFunc();
    }
  };


  //savedStatus
  useEffect(() => {
    setSavedStatus(!!props.wish);
  }, [props.wish, name]);

  //若改變為登出，則將savedStatus設為false
  useEffect(() => {
    if (!user.logInStatus) {
      setSavedStatus(false);
    }
  }, [user.logInStatus]);

  return (
    <>
      <FiBookmark
        className={`saved-icon ${
          savedStatus ? "saved-icon saved-filled" : "saved-icon"
          } `}
        onClick={changeSavedStatus}
      />
    </>
  );
}

const mapStateToProps = (store) => {
  return { user: store.user };
};

//Redux引入函式
//mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { userLogin, userLogOut, userToggleFunc },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedItems);
