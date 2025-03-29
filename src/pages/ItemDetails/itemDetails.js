import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter, Link } from "react-router-dom";

//Redux
import { userLogin, userLogOut } from "../../Redux/user/userAction";

import MyBreadcrumb from "../../components/MyBreadCrumb/myBreadCrumb";
import MainContainer from "../../components/mainContainer";
import ItemImg from "../../components/ItemImg/itemImg";
import ItemInfo from "../../components/ItemInfo/itemInfo";
import ItemSuggest from "../../components/ItemSuggest/itemSuggest";
import "./itemDetails.scss";
import { apiUri } from "../../constants/api";


const ItemDetails = (props) => {
    //Redux
    const { user, userLogin, userLogOut, history, location } = props;

    //localstate
    const itemId = props.match.params.itemId;
    // console.log(itemId);
    const [itemImgData, setItemImgData] = useState([]);
    const [itemInfosData, setItemInfosData] = useState({});
    const [itemWish, setItemWish] = useState(false);

    //僅做擷取資料用途
    const fetchItemData = async (itemId) => {
        const res = await fetch(`${apiUri}/itemdetail/${itemId}`);
        const data = await res.json();
        console.log("data", data);
        return data;
    };

    //取得願望清單
    const fetchWishList = async (itemId) => {
        const res = await fetch(
            `${apiUri}/itemdetail/wishlist/${itemId}`,
            { credentials: "include" }
        );
        const dataWish = await res.json();
        console.log("dataWish", dataWish);
        return dataWish;
    };

    useEffect(() => {
        (async () => {
            // 獲得資料data
            const rawData = (await fetchItemData(itemId))[0];
            console.log(rawData);

            //img
            const newArray = [rawData.itemImg];
            if (rawData.itemImg2 && rawData.itemImg2 != "null") {
                newArray.push(rawData.itemImg2);
            }
            //info
            // const infoData = rawData;

            setItemImgData(newArray);
            setItemInfosData(rawData);
        })();
    }, []);

    //登入/登出/載入該頁時，取得願望清單
    useEffect(() => {
        if (user.logInStatus) {
            (async () => {
                const wishData = await fetchWishList(itemId);
                const logInStatus = wishData.logInStatus;
                const userInfo = wishData.userInfo;

                // //reset user
                logInStatus ? userLogin(userInfo) : userLogOut();
                console.log(wishData);
                if (logInStatus) {
                    setItemWish(wishData.itemWish);
                }
            })();
        }
        //若已轉為登出
        if (!user.logInStatus) {
            setItemWish(false);
        }
    }, [user.logInStatus, itemId]);

    console.log(location);
    console.log(history);
    return (
        <>
            <div className="item-details-main-content">
                <div className="breadcrumb-wrapper">
                    <MyBreadcrumb itemName={itemInfosData.itemName} />
                </div>
                <div className="item-details-container d-flex">
                    {itemImgData.length ? (
                        <ItemImg
                            itemimg={`${apiUri}/images/items/${itemImgData[0]}.png`}
                            itemimg1={`${apiUri}/images/items/${itemImgData[0]}.png`}
                            itemimg2={
                                itemImgData[1]
                                    ? `${apiUri}/images/items/${itemImgData[1]}.png`
                                    : false
                            }
                        />
                    ) : (
                        ""
                    )}
                    <ItemInfo
                        itemName={itemInfosData.itemName}
                        itemSize={itemInfosData.itemSize}
                        itemPrice={itemInfosData.itemPrice}
                        itemDiscription={itemInfosData.discription}
                        fragranceDiscription={itemInfosData.fragranceDetails}
                        itemId={itemId}
                        wish={itemWish}
                        itemimg={`${apiUri}/images/items/${itemImgData[0]}.png`}
                    />
                </div>
                <div className="item-suggest-container">
                    <ItemSuggest></ItemSuggest>
                </div>
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
    return bindActionCreators({ userLogin, userLogOut }, dispatch);
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ItemDetails)
);
