import React from 'react'
import './classHead.scss'

const ClassHead = (props) => {
  return (
    <>
      <div className="class-head d-flex flex-wrap align-items-center">
        <div className="headLeft">
          <img className="object-fit-cover" src={props.src} />
        </div>
        <div className="headRight">
          <p className="headTitle">{props.title}</p>
          <p className="headContent">{props.content}</p>
          <p className="headContent">{props.content2}</p>
        </div>
      </div>
    </>
  );
};

export default ClassHead;