import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./accountRightBar.scss";
import { FiChevronRight } from "react-icons/fi";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

//Redux
import { userLogOut } from "../../Redux/user/userAction";

import { apiUri } from "../../constants/api";

const AccountRightBar = (props) => {
  //引入Redux
  const { user, userLogOut } = props;

  const handleLogOut = () => {
    (async () => {
      const logOut = { success: false };

      //到後端判斷
      try {
        const request = new Request(
          `${apiUri}/users/logout`,
          {
            method: "POST",
            credentials: "include",
            headers: new Headers({
              Accept: "application/json",
              "Content-Type": "application/json",
            }),
          }
        );

        const response = await fetch(request);
        const obj = await response.json();
        console.log("obj", obj);

        //更改logOut
        logOut.success = true;
      } catch (e) {
        console.log(e);

        //錯誤資訊
        logOut.errorMessage = e;
      }

      if (logOut.success) userLogOut();
      console.log(logOut.errorMessage);
    })();
  };

  return (
    <div className="right-bar-wrapper">
      <h2>{user.userInfo.userFirstName} 你好</h2>
      <div className="menu-bar">
        <ul className="accountMenu">
          <li className="d-flex align-item-center">
            <Link
              to="/account"
              className="d-flex align-item-center account-link"
            >
              <FiChevronRight className="icon" />
              <p>帳戶資訊</p>
            </Link>
          </li>
          <li className="d-flex align-item-center">
            <Link
              to="/account/classpage"
              className="d-flex align-item-center account-link"
            >
              <FiChevronRight className="icon" />
              <p>我的課程</p>
            </Link>
          </li>
          <li className="d-flex align-item-center">
            <Link
              to="/account/creditcard"
              className="d-flex align-item-center account-link"
            >
              <FiChevronRight className="icon" />
              <p>付款資訊</p>
            </Link>
          </li>
          <li className="d-flex align-item-center">
            <Link
              to="/account/orderhistory"
              className="d-flex align-item-center account-link"
            >
              <FiChevronRight className="icon" />
              <p>訂單記錄</p>
            </Link>
          </li>
          <li className="d-flex align-item-center">
            <Link
              to="/account/wishlist"
              className="d-flex align-item-center account-link"
            >
              <FiChevronRight className="icon" />
              <p>願望清單</p>
            </Link>
          </li>
          <li className="d-flex align-item-center">
            <Link
              to="/account/modify"
              className="d-flex align-item-center account-link"
            >
              <FiChevronRight className="icon" />
              <p>會員資料更改</p>
            </Link>
          </li>
          <li className="d-flex align-item-center">
            <Link
              to="/FaqAccordion"
              className="d-flex align-item-center account-link"
            >
              <FiChevronRight className="icon" />
              <p>FAQ</p>
            </Link>
          </li>
          <li className="d-flex align-item-center">
            <Button onClick={handleLogOut}>登出</Button>
          </li>
        </ul>
      </div>
    </div>
  );
};
//Redux引入狀態
//mapStateToProps
const mapStateToProps = (store) => {
  return { user: store.user };
};

//Redux引入函式
//mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ userLogOut }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountRightBar);
