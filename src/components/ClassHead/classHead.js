import React from 'react'
import './classHead.scss'
import { apiUri } from '../../constants/api';

const ClassHead = ({ classImgDir, classImg, title, content, content2 }) => {
  return (
    <>
      <div className="class-detail-head class-head">
        <div className="headLeft">
          <img className="object-fit-cover" src={`${apiUri}/images/${classImgDir}/${classImg}.png`} />
        </div>
        <div className="headRight ">
          <p className="headTitle">{title}</p>
          <p className="headContent">{content}{content2}</p>
        </div>
      </div>
    </>
  );
};

export default ClassHead;
