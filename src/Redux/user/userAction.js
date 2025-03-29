import { apiUri } from "../../constants/api";


//登入
export const userLogin = (userInfo) => {
  return { type: "LOG_IN", userInfo };
};

//登入頁
export const userLogInAsync = (
  userEmail,
  userPassword,
  loginSuccess = () => { },
  loginFail = () => { }
) => {
  return async function getUserInfoFromServer(dispatch) {
    // 注意header資料格式要設定，伺服器才知道是json格式

    const data = {
      userEmail,
      userPassword,
    };

    //到後端判斷
    const request = new Request(`${apiUri}/users/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
    });

    const response = await fetch(request);
    const obj = await response.json();
    // console.log("obj", obj);

    //成功與否，執行callback
    if (obj.logInStatus) {
      loginSuccess();
    } else {
      loginFail(obj.errorMessage);
    }

    //更動redux state
    dispatch({
      type: obj.logInStatus ? "LOG_IN" : "LOG_OUT",
      userInfo: obj.userInfo ? obj.userInfo : {},
    });
  };
};

//檢查登入
export const checkLogin = (cbLogIn = () => { }) => {
  return async function checkLoginFromServer(dispatch) {
    const request = new Request(`${apiUri}/users/checklogin`, {
      method: "POST",
      credentials: "include",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
    });

    const response = await fetch(request);
    const obj = await response.json();
    console.log("obj", obj);
    console.log("action");

    //execute callback, eg: redirect
    obj.logInStatus && cbLogIn();

    //更動redux state
    dispatch({
      type: obj.logInStatus ? "LOG_IN" : "LOG_OUT",
      userInfo: obj.userInfo ? obj.userInfo : {},
    });
  };
};

//登出
export const userLogOut = () => {
  return {
    type: "LOG_OUT",
    userInfo: {},
  };
};
