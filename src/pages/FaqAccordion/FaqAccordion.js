import React, { useState, useEffect } from "react";
import "./FaqAccordion.scss";
import FaqAccordionTitle from "../../components/FaqAccordionTitle/FaqAccordionTitle";
import FaqAccordionSubtitle from "../../components/FaqAccordionSubtitle/FaqAccordionSubtitle";
import FaqAccordionHead from "../../components/FaqAccordionHead/FaqAccordionHead"
import MainContainer from '../../components/mainContainer'

import { apiUri } from "../../constants/api";

const FaqAccordion = (props) => {
  const [titleDropDownToggle, setTitleDropDownToggle] = useState({});
  const [title, setTitle] = useState([]);
  const [value, setValue] = useState("");
  const [subtitle, setSubtitle] = useState([]);
  const [id, setId] = useState("");
  const [allClose, setAllClose] = useState([]);





  const titleAccordion = (e) => {


    //重設state
    const newObj = { ...titleDropDownToggle }
    newObj[e.target.id] = !titleDropDownToggle[e.target.id]

    setTitleDropDownToggle(newObj)
    setAllClose(Object.values(titleDropDownToggle))
    // console.log(Object.values(titleDropDownToggle))

  };

  const subtitleAccordion = (e) => {


  }

  async function getData() {
    const request = new Request(`${apiUri}/faq`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "appliaction/json",
      }),
    });
    const res = await fetch(request);
    const data = await res.json();
    // 設定資料
    return data;
  }

  useEffect(() => {
    (async () => {
      const data = await getData();
      setTitle(data[0]);

      //initially false
      const newObj = {};
      data[0].forEach((el) => {
        const titleId = el.titleId;
        newObj[titleId] = false;
      });
      setTitleDropDownToggle(newObj);
      setSubtitle(data[1]);
    })();
  }, []);


  useEffect(() => {
    if (props.titleId === " ") {
      setTitleDropDownToggle("")
    }

  }, [props.titleId])

  return (
    <>
      <MainContainer>
        <FaqAccordionHead />
        <div className="faq-wrapper">
          {title.map((el, item) => [
            <FaqAccordionTitle
              onClick={(e) => titleAccordion(e)}
              key={item}
              value={el.id}
              id={el.id}
              titleId={el.titleId}
              title={el.title}
            />,
            subtitle
              .filter((subData, item) => subData.titleId === el.titleId)
              .map(
                (props, index) => (

                  (
                    <FaqAccordionSubtitle
                      onClickSub={(e) => subtitleAccordion(e)}
                      key={index}
                      allClose={allClose}
                      subtitle={props.subtitle}
                      data-title={props.faqTitle}
                      subtitleContent={props.subtitleContent}
                      active={titleDropDownToggle[props.titleId]}
                      value={props.id}
                      id={props.id}
                      titleId={props.titleId}
                    />
                  )
                )
              ),
          ])}
        </div>
        <div className="white-space"></div>

        <div className="bottom d-flex">
          <div className="email">
            <p className="text">與我們聯繫</p>
            <a className="button" href="mailto:insenseofficial2020@gmail.com">
              <p >
                通過電子郵件
              </p>
            </a>
          </div>

          <div className="tel ">
            <p className="text">透過電話
            </p>

            <p className="tel-number">
              0800-067-157
            </p>

          </div>
        </div>
      </MainContainer>
    </>

  );
};

export default FaqAccordion;
