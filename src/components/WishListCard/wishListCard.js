import React, { useState, useEffect } from "react";
// import { connect } from "react-redux";
import "./wishListCard.scss";
import { Link } from "react-router-dom";

//react-icon
import { FiX } from "react-icons/fi";

//component
import SubmitButton from "../SubmitButton/submitButton";
import { connect } from "react-redux";
import { addItem } from "../../Redux/cart/cartAction";
import { apiUri } from "../../constants/api";

const WishListCard = (props) => {
    const { itemId, itemimg, itemName, itemSize, itemPrice, addItem } = props;

    const [deleteSuccess, setDeleteSuccess] = useState(false);
    //cancelWish
    const cancelWish = () => {
        (async () => {
            const res = await fetch(
                `${apiUri}/users/deletewish/${itemId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            const deleteWish = await res.json();

            console.log(deleteWish);

            if (deleteWish.success) {
                setDeleteSuccess(true);
            }
        })();
    };

    return (
        <>
            <div
                className={`list-card-container d-flex  ${
                    deleteSuccess ? "delete-success" : ""
                }`}
            >
                <div className="list-card-img">
                    <img
                        // src={`${apiUri}/images/items/${itemimg}.png`}
                        src={itemimg}
                        alt="商品圖片"
                    />
                </div>
                <div className="list-card-info flex-grow">
                    <Link
                        to={`/itemdetail/${itemId}`}
                        className="item-detail-url text-center"
                        role="button"
                    >
                        <div className="list-card-head d-flex">
                            <h4 className="list-card-title ">{itemName}</h4>
                        </div>
                    </Link>
                    <div className="list-card-size-container">
                        <p className="list-card-size ">{itemSize}</p>
                    </div>
                    <div className="list-card-price-container">
                        <p>NT$ {itemPrice}</p>
                    </div>
                </div>
                <div className="btns">
                    <div className="btn-del d-flex justify-content-end">
                        <FiX className="del-icon" onClick={cancelWish} />
                    </div>
                    <div className="btn-add-cart">
                        <SubmitButton onClick={() => addItem(props)}>
                            加入購物車
                        </SubmitButton>
                    </div>
                </div>
            </div>
        </>
    );
};

// const mapStateToProps = (store) => {
//     return { user: store.user };
// };

//Redux引入函式
//mapDispatchToProps
// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({ userLogin, userLogOut }, dispatch);
// };
const mapDispatchToProps = (dispatch) => ({
    addItem: (item) => dispatch(addItem(item)),
});

export default connect(null, mapDispatchToProps)(WishListCard);
