import React, { useState } from "react";
import { useskylightdetail } from "./skylight";
import "../openings/ExtrasMenu.css";
import "../../rightbar.css";

const skylightdetail = ({ itemClass, id, isLocked, onLockChange }) => {
  const {
    handlePositionX,
    skyopeningInstances,
    handleWidth,
    handleHeight,
    handlePositionY,
    handleCut,
    handleClose,
    toggleInstanceOpen,handlePositionZ,
  } = useskylightdetail();

  const openingInstance = skyopeningInstances.find(
    (instance) => instance.id === id
  );

  if (!openingInstance) {
    return <div>No opening instance found for ID: {id}</div>;
  }

  const handleInputChange = (handler, value) => {
    handler(id, value);
  };


  const [width, setWidth] = useState(openingInstance.width || 1);
  const [height, setHeight] = useState(openingInstance.height || 1);
  const [positionY, setPositionY] = useState(openingInstance.positionY || 1);
  const [positionX, setPositionX] = useState(openingInstance.positionX || 1);
  const [positionZ, setPositionZ] = useState(openingInstance.positionZ || 1);
  return (
    <div className={`extras-container ${itemClass}`}>

      {openingInstance.isOpen && (
        <>
          <span className="extra-headings">
            <p style={{ position: "relative", left: 20 }}>skylight</p>
            <a
              href="javascript:;"
              className={`collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 dark:text-white-light dark:hover:bg-dark-light/10 ${
                isLocked ? "rotate-180" : ""
              }`}
              onClick={() => onLockChange(id)}
              style={{ position: "absolute", top: 5, left: 0 }}
            >
              {isLocked ? (
                <svg
                  className="m-auto h-5 w-5"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 19L7 12L13 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    opacity="0.5"
                    d="M16.9998 19L10.9998 12L16.9998 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="m-auto h-5 w-5"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 19L7 12L13 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    opacity="0.5"
                    d="M16.9998 19L10.9998 12L16.9998 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </a>
            <svg
              onClick={() => {
                toggleInstanceOpen(id);
                handleClose(id);
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-x-circle"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </span>

          {/* Width Control */}
          <div className="field-box">
            <span className="inner-headings">Width</span>
            <div className="range-box">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={width}
                onChange={(e) => {
                  setWidth(e.target.value);
                  handleWidth(openingInstance.id, e.target.value);
                }}
              />
              <input
                type="number"
                min={1}
                max={10}
                value={width}
                onChange={(e) => {
                  setWidth(e.target.value);
                  handleWidth(openingInstance.id, e.target.value);
                }}
                style={{ marginLeft: "10px" }}
              />
            </div>
          </div>

          {/* Height Control */}
          <div className="field-box">
            <span className="inner-headings">Height</span>
            <div className="range-box">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  handleHeight(openingInstance.id, e.target.value);
                }}
              />
              <input
                type="number"
                min={1}
                max={10}
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  handleHeight(openingInstance.id, e.target.value);
                }}
                style={{ marginLeft: "10px" }}
              />
            </div>
          </div>

          {/* Position Y Control */}
          <div className="field-box">
            <span className="inner-headings">Position X</span>
            <div className="range-box">
              <input
                type="range"
                min={1}
                max={10}
                step={1} 
                value={positionX}
                onChange={(e) => {
                  setPositionX(e.target.value);
                  handlePositionX(openingInstance.id, e.target.value);
                }}
              />
              <input
                type="number"
                min={1}
                max={10}
                step={1} 
                value={positionX}
                onChange={(e) => {
                  setPositionX(e.target.value);
                  handlePositionX(openingInstance.id, e.target.value);
                }}
                style={{ marginLeft: "10px" }}
              />
            </div>
          </div>
          <div className="field-box">
            <span className="inner-headings">Position Z</span>
            <div className="range-box">
              <input
                type="range"
                min={-10}
                max={10}
                step={1} 
                value={positionZ}
                onChange={(e) => {
                  setPositionZ(e.target.value);
                  handlePositionZ(openingInstance.id, e.target.value);
                }}
              />
              <input
                type="number"
                min={-10}
                max={10}
                step={1} 
                value={positionZ}
                onChange={(e) => {
                  setPositionZ(e.target.value);
                  handlePositionZ(openingInstance.id, e.target.value);
                }}
                style={{ marginLeft: "10px" }}
              />
            </div>
          </div>
          {/* Action Button */}
          <button onClick={() => handleCut(id)} className="cut-button">
            OK
          </button>
        </>
      )}
    </div>
  );
};

export default skylightdetail;