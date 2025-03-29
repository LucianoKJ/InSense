import React, { useState, useEffect } from "react";
import ClassHead from "../components/ClassHead/classHead";
import MainContainer from "../components/mainContainer";
import DetailContent from "../components/ClassDetailContent/detailContent";
import DetailFooter from "../components/ClassDetailFooter/detailFooter";
import { withRouter } from "react-router-dom";

import { apiUri } from "../constants/api";

const ClassDetail = ({ match }) => {
  const [detail, setDetail] = useState([]);

  const fetchClassDetailData = async () => {
    const res = await fetch(
      `${apiUri}/class/classdetail/${match.params.classid}`
    );
    const data = res.json();
    return data;
  };
  useEffect(() => {
    (async () => {
      const data = await fetchClassDetailData();
      setDetail(data);
    })();
  }, []);

  return (
    <>
      {detail.map((info, index) => {
        return (
          <React.Fragment key={index}>
            <MainContainer>
              <ClassHead
                title={info.className}
                classImg={info.classImg}
                classImgDir={"class"}
              />
              <DetailContent storeInfo={info} />
              <DetailFooter
                classTime={info.classTime}
                classPrice={info.classPrice}
              />
            </MainContainer>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default withRouter(ClassDetail);
