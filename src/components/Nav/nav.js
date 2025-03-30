import React, { useState, useEffect } from "react";
import {
  FiMenu,
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import { Link, withRouter } from "react-router-dom";

//Redux
import { checkLogin } from "../../Redux/user/userAction";
import { userToggleFunc, closeSideBar } from "../../Redux/nav/navAction";
import { toggleCartHidden, toggleCartShow } from "../../Redux/cart/cartAction";

import "./nav.scss";
import IndexMenuItem from "../IndexMenuItem/indexMenuItem";
import IndexMenuSideBar from "../IndexMenuSideBar/indexMenuSideBar";
import IndexRightSideBar from "../IndexRightSideBar/indexRightSideBar";
import IndexLogin from "../IndexLogin/indexLogin";
// import IndexShoppingCart from "../IndexShoppingCart/indexShoppingCart";
import AccountRightBar from "../AccountRightBar/accountRightBar";

//import CartIcon to replace FiShoppingCart
import { connect } from "react-redux";
// import { selectCurrentUser } from '../../redux/user/userSelectors';
import CartIcon from "../CartIcon/cartIcon";
import CartDropdwon from "../CartDropdown/cartDropdown";
import { bindActionCreators } from "redux";

const Nav = ({
  location,
  user,
  userToggleFunc,
  closeSideBar,
  userToggle,
  checkLogin,
  toggle,
  toggleCartHidden,
  toggleCartShow,
}) => {
  // state change
  // test info
  const menuItem = [
    { itemName: "代理品牌", name: "brand" },
    { itemName: "身體保養", name: "body" },
    { itemName: "個人香氛", name: "self" },
    {
      itemName: "室內香氣",
      name: "home-scents",
      pathUrl: "/itemlist/category/home-scents",
    },
    { itemName: "體驗課程", name: "class", pathUrl: "/classlist" },
    { itemName: 'FAQ', name: 'faq', pathUrl: '/FaqAccordion' }
  ];
  const brandItem = [
    {
      itemName: "BYREDO",
      name: "byredo",
      pathUrl: "/itemlist/brand/byredo",
    },
    {
      itemName: "CHANEL",
      name: "chanel",
      pathUrl: "/itemlist/brand/chanel",
    },
    {
      itemName: "Diptyque",
      name: "diptyque",
      pathUrl: "/itemlist/brand/diptyque",
    },
    {
      itemName: "Jo Malone London",
      name: "jomalone",
      pathUrl: "/itemlist/brand/jomalone",
    },
    {
      itemName: "LeLabo",
      name: "lelabo",
      pathUrl: "/itemlist/brand/lelabo",
    },
  ];
  const bodyItem = [
    {
      itemName: "沐浴清潔",
      name: "body-wash",
      pathUrl: "/itemlist/category/body-wash",
    },
    {
      itemName: "乳液與保養油",
      name: "lotions-oils",
      pathUrl: "/itemlist/category/lotions-oils",
    },
    {
      itemName: "手部保養",
      name: "hands-care",
      pathUrl: "/itemlist/category/hands-care",
    },
  ];
  const selfItem = [
    {
      itemName: "香水",
      name: "perfume",
      pathUrl: "/itemlist/category/perfume",
    },
    {
      itemName: "髮香噴霧與隨身香水",
      name: "hair-mist-travel-size",
      pathUrl: "/itemlist/category/hair-mist-travel-size",
    },
  ];

  const [subMenu, setSubMenu] = useState([]);
  const [burgerToggle, setBurgerToggle] = useState(false);
  const [subMenuToggle, setSubMenuToggle] = useState(false);
  const [searchToggle, setSearchToggle] = useState(false);
  const [scrollTop, setScrollTop] = useState(false);
  //  event handler
  let SideBar = (event) => {
    switch (event.currentTarget.dataset.name) {
      case "brand":
        setSubMenu(brandItem);
        setSubMenuToggle(true);
        break;
      case "body":
        setSubMenu(bodyItem);
        setSubMenuToggle(true);
        break;
      case "self":
        setSubMenu(selfItem);
        setSubMenuToggle(true);
        break;
    }
  };

  const clickFunction = () => {
    toggleCartShow();
    closeSideBar();
    setBurgerToggle(false);
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      setBurgerToggle(false);
      setSubMenuToggle(false);
      closeSideBar();
      toggleCartHidden();
    }
    window.addEventListener("scroll", function () {
      this.scrollY > 0 ? setScrollTop(true) : setScrollTop(false);
    });
    //一開始載入網頁，驗證身份
    checkLogin();
  }, [location.pathname]);

  useEffect(() => {
    const leftSideBar = document.querySelector(".menu-item");
    const cartDropdown = document.querySelector(".cart-dropdown");
    const rightSideBar = document.querySelector(".right-side-bar");
    const clickFunction = (e) => {
      if (e.offsetX >= +leftSideBar.clientWidth - +leftSideBar.offsetLeft) {
        setBurgerToggle(false);
        setSubMenuToggle(false);
      }

      if (userToggle || toggle.hidden) {
        if (e.screenX <= +cartDropdown.offsetLeft - +cartDropdown.clientWidth) {
          closeSideBar();
        }
      }
      if (toggle.hidden) {
        if (e.screenX <= +rightSideBar.offsetLeft - rightSideBar.clientWidth) {
          toggleCartHidden();
        }
      }
    };

    if (toggle.hidden || userToggle) {
      window.addEventListener("click", clickFunction);
    } else {
      window.removeEventListener("click", clickFunction)
    }
    console.log(toggle.hidden, userToggle)
  }, [toggle.hidden, userToggle])

  return (
    <>
      <nav
        className={`${
          location.pathname === "/" ? "position-fix" : "position-sticky"
          } nav d-flex justify-content-between align-items-center ${
          scrollTop || location.pathname !== "/" ? "scroll-down" : ""
          }`}
      >
        {/* Menu  */}
        <div
          className={`position-absolute menu-item d-flex align-items-center justify-content-around ${
            burgerToggle ? "left-side-bar-open" : ""
            }`}
        >
          <div className="menu-title position-absolute d-flex align-items-center">
            <span
              onClick={() => setBurgerToggle(false) || setSubMenuToggle(false)}
            >
              <FiX />
            </span>
            <p className="menu-char">MENU</p>
          </div>
          <ul>
            {menuItem.map((item, index) => {
              return (
                <IndexMenuItem
                  menuItem={item}
                  key={index}
                  changeState={(e) => SideBar(e)}
                />
              );
            })}
          </ul>
          <ul style={{ opacity: 0, cursor: 'auto', pointerEvents: 'none' }}>
            <Link className="menu-link" to="/FaqAccordion">
              <li className="d-flex align-items-center">
                <FiChevronRight className="chevron-right" />
                FAQ
              </li>
            </Link>
          </ul>
        </div>
        <IndexMenuSideBar subMenu={subMenu} state={subMenuToggle} />
        {/* Search */}
        <div
          className={`position-absolute search-block ${
            searchToggle ? "left-side-bar-open" : ""
            }`}
        >
          <div className="search-title position-absolute d-flex align-items-center">
            <span onClick={() => setSearchToggle(false)}>
              <FiX />
            </span>
            <p className="menu-char">Search</p>
          </div>
          <div className="d-flex serach-input position-absolute">
            <input type="text" placeholder="search" />
            <FiSearch />
          </div>
        </div>
        <div className="leftItem">
          <a
            onClick={() => (
              setBurgerToggle(true), closeSideBar(), toggleCartHidden()
            )}
            role="button"
          >
            <FiMenu />
          </a>
          <a
            role="button"
            data-name="search"
            style={{ opacity: "0", cursor: "auto" }}
          >
            <FiSearch />
          </a>
        </div>
        <Link to="/" className="index-logo">
          <p className="index-nav-title">InSense</p>
        </Link>

        <IndexRightSideBar btnClose={() => closeSideBar()} state={userToggle}>
          {userToggle ? (
            user.logInStatus ? (
              <AccountRightBar />
            ) : (
                <IndexLogin />
              )
          ) : (
              ""
            )}
        </IndexRightSideBar>
        <div className="rightItem d-flex align-items-center">
          {/* 會員登入 */}
          <a
            onClick={() => (
              userToggleFunc(),
              setBurgerToggle(false),
              setSubMenuToggle(false),
              toggleCartHidden()
            )}
            role="button"
            data-name="user"
          >
            <FiUser />
          </a>
          <CartIcon toggleCartHidden={clickFunction} role="button" />
          {/* </a> */}
        </div>
        <CartDropdwon />
      </nav>
    </>
  );
};

const mapStateToProps = (store) => {
  return { user: store.user, userToggle: store.nav, toggle: store.cart };
};

//Redux引入函式
//mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      userToggleFunc,
      closeSideBar,
      checkLogin,
      toggleCartHidden,
      toggleCartShow,
    },
    dispatch
  );
};

//Use the connect function in react-redux project. To prevent update blocking issue, using compose, 看不懂去問
const compose = (f, g) => (x) => f(g(x));

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Nav);
