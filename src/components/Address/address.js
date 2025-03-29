import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

import "./address.scss";

import FormInput from "../../components/FormInput/FormInput";

//select
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import addressJSON from "../../constants/address.json";

//Select CSS(material UI)
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Address = (props) => {
  //Redux
  const user = props.user;

  //縣市區
  const [cities, setCities] = useState([]);
  const [address, setAddress] = useState("");

  //Select CSS(material UI)
  const classes = useStyles();
  //selected
  const [citiesSelected, setCitiesSelected] = useState("");
  const [districtsSelected, setDistrictsSelected] = useState("");

  //縣市區選擇
  const addressChange = (event) => {
    switch (event.target.name) {
      case "citiesSelected":
        props.setCities && props.setCities(cities[event.target.value].CityName);
        setCitiesSelected(event.target.value);
        //選完縣市後，將地區還原
        setDistrictsSelected("");
        props.setDistricts && props.setDistricts("");
        props.setPostCode && props.setPostCode("");
        break;
      case "districtsSelected":
        props.setDistricts &&
          props.setDistricts(
            cities[citiesSelected].AreaList[event.target.value].AreaName
          );
        props.setPostCode &&
          props.setPostCode(
            cities[citiesSelected].AreaList[event.target.value].ZipCode
          );
        setDistrictsSelected(event.target.value);
        break;
      case "address":
        props.setAddress && props.setAddress(event.target.value);
        setAddress(event.target.value);
        break;
      default:
        break;
    }
    console.log(props);
  };

  //取得縣市資料
  const getCities = async () => {
    const obj = addressJSON

    // console.log(obj);
    return obj;
  };

  //將縣市資料寫進狀態cities中
  useEffect(() => {
    (async () => {
      let cities = await getCities();
      // console.log("cities", cities);
      setCities(cities);
    })();
  }, []);

  //若有登入，則載入（修改資訊頁才需要）
  //尋找陣列的key
  useEffect(() => {
    // console.log("user", user);

    //若已登入，且找到cities資訊
    if (user.logInStatus && cities.length) {
      const myCompleteAddress = { myCity: "", myPostCode: "", myAddress: "" };

      // console.log(props.location.pathname);
      if (props.location.pathname === "/account/modify") {
        myCompleteAddress.myCity = user.userInfo.userCity;
        myCompleteAddress.myPostCode = user.userInfo.userPostCode;
        myCompleteAddress.myAddress = user.userInfo.userAddress;
      } else {
        //可以給地址預設值
        myCompleteAddress.myCity = !!props.myCity ? props.myCity : "";
        myCompleteAddress.myPostCode = !!props.myPostCode
          ? props.myPostCode
          : "";
        myCompleteAddress.myAddress = !!props.myAddress ? props.myAddress : "";
      }
      const newCode = { cityCode: "", districtCode: "" };

      //尋找城市key
      cities.forEach((el, index) => {
        if (el.CityName === myCompleteAddress.myCity) {
          newCode.cityCode = index;
        }
      });
      // console.log(cities[newCode.cityCode])
      //尋找地區key
      if (newCode.cityCode.toString().length) {
        // console.log(cities[newCode.cityCode].AreaList);
        cities[newCode.cityCode].AreaList.forEach((el, index) => {
          if (
            el.ZipCode.toString() === myCompleteAddress.myPostCode.toString()
          ) {
            newCode.districtCode = index;
          }
        });
      }

      console.log("newCode", newCode);
      setCitiesSelected(newCode.cityCode);
      setDistrictsSelected(newCode.districtCode);
      setAddress(
        myCompleteAddress.myAddress === null ? "" : myCompleteAddress.myAddress
      );
    }
  }, [user, cities, props.myPostCode]);

  return (
    <div className="address-container d-flex align-items-end">
      <FormControl className={classes.formControl}>
        <InputLabel id="cities-label">縣市</InputLabel>
        <Select
          labelId="cities-label"
          id="cities"
          name="citiesSelected"
          value={citiesSelected}
          onChange={addressChange}
        >
          {cities.length
            ? cities.map((el, index) => {
              return (
                <MenuItem key={el.CityName} value={index}>
                  {el.CityName}
                </MenuItem>
              );
            })
            : ""}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="districts-label">鄉市鎮區</InputLabel>
        <Select
          labelId="districts-label"
          id="districts"
          name="districtsSelected"
          value={districtsSelected}
          onChange={addressChange}
        >
          {citiesSelected !== "" ? (
            cities[citiesSelected].AreaList.map((el, index) => {
              return (
                <MenuItem key={index + el.ZipCode} value={index}>
                  {el.ZipCode} {el.AreaName}
                </MenuItem>
              );
            })
          ) : (
              <MenuItem value="">未選縣市</MenuItem>
            )}
        </Select>
      </FormControl>
      <FormInput
        type="text"
        name="address"
        value={address}
        handleChange={addressChange}
        label="地址"
        required
      />
    </div>
  );
};

const mapStateToProps = (store) => {
  return { user: store.user };
};

//Redux引入函式
//mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Address)
);
