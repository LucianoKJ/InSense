import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./wishList.scss";

//Redux
import { userLogin, userLogOut } from "../../Redux/user/userAction";

//引入component
import WishListCard from "../WishListCard/wishListCard";
import SuccessAlert from "../SuccessAlert/successAlert";

import { apiUri } from '../../constants/api';

const WishList = (props) => {
  const { user, history } = props;
  const [myWishList, setMyWishList] = useState([]);

  //alert
  const [openAlert, setOpenAlert] = useState(false);
  const [alertName, setAlertName] = useState("");
  const [alertContext, setAlertContext] = useState("");
  const [alertLinearProgress, setAlertLinearProgress] = useState(false);
  const [alertAutoClose, setAlertAutoClose] = useState(false);
  const [alertDuration, setAlertDuration] = useState("");
  const handleAlertOpen = (
    alertName = "alertName",
    alertContext = "alertContext",
    alertAutoClose = false,
    linearProgress = false,
    duration
  ) => {
    setAlertName(alertName);
    setAlertContext(alertContext);
    setAlertLinearProgress(linearProgress);
    setAlertAutoClose(alertAutoClose);
    setAlertDuration(duration);
    setOpenAlert(true);
  };
  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  //取得願望清單
  const fetchAllWishList = async (brandOrCategory, name) => {
    const res = await fetch(`${apiUri}/users/wishlist`, {
      credentials: "include",
    });
    const dataWish = await res.json();

    // console.log("dataWish", dataWish);
    return dataWish;
  };

  useEffect(() => {
    if (user.logInStatus) {
      (async () => {
        const wishList = await fetchAllWishList();
        console.log("itemsWished", wishList.itemsWished);

        // reset user
        wishList.logInStatus ? userLogin(wishList.userInfo) : userLogOut();

        if (wishList.logInStatus) {
          setMyWishList(wishList.itemsWished);
        }
      })();
    } else {
      if (user.logInStatus !== null) {
        setMyWishList([]);
        handleAlertOpen("未登入", "一秒鐘後跳轉首頁", true, true, 1000);
        setTimeout(() => {
          history.push("/");
        }, 1500);
      }
    }
  }, [user.logInStatus]);

  return (
    <>
      <div className="list-container">
        <h2 className="list-title ">我的願望清單</h2>
        <div className="card-group-container d-flex flex-wrap">
          {myWishList.length ? (
            myWishList.map((el) => {
              return (
                <WishListCard
                  key={el.itemId}
                  itemId={el.itemId}
                  itemimg={`${apiUri}/images/items/${el.itemImg}.png`}
                  itemName={el.itemName}
                  itemPrice={el.itemPrice}
                />
              );
            })
          ) : (
              <p>沒有收藏商品</p>
            )}
        </div>
      </div>
      <SuccessAlert
        alertName={alertName}
        alertContext={alertContext}
        openAlert={openAlert}
        handleAlertClose={handleAlertClose}
        alertLinearProgress={alertLinearProgress} //有無時間條
        alertAutoClose={alertAutoClose} // 自行關閉
        alertDuration={alertDuration} //時間間隔
      />
    </>
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(WishList)
);
