import React, {useState, useEffect} from 'react';
// import { DoorDetailsContext } from './DoorDetailsContext';
import { useDoorDetails } from './DoorDetailsContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import './PADoor.css';
import '../../rightbar.css';


const DoorDetails = ({ itemClass, id, isLocked, onLockChange}) => {
  const [width, setWidth] = useState(0);
 
  const {
   // positionX,
    positionY,
    sizes,
    doors,
    handlePositionX,
    handlePositionY,
    handleSizeChange,
    handleUnion,
    doorInstances,
    toggleDoorOpen,
    handleClose,
  } = useDoorDetails();

  useEffect(() => {
    const width = localStorage.getItem('width');

    setWidth(width);
  }, [localStorage.getItem('width'),
  ]);

  const instance = doorInstances.find(instance => instance.id === id);
  if (!instance) return null;

  const [positionX, setPositionX] = useState(doorInstances.positionX || 1);

  return (
    <div className={`barn-door-container ${itemClass}`}>
      {instance.isOpen && (
        <>
          <span className="extra-headings">
          <p style={{ position: "relative", left: 20 }}>PA Door</p>
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
           
              onClick={() => { toggleDoorOpen(id); handleClose(id) }}
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

          <div className="field-box">
            <span className='inner-headings'>Size</span>
            <select
              onChange={(e) => handleSizeChange(id, Number(e.target.value))}
              value={sizes.findIndex(size => size === instance.selectedSize)}
            >
              {sizes.map((size, index) => (
                <option key={index} value={index}>
                  {size.width}x{size.height}
                </option>
              ))}
            </select>
          </div>

          <div className="field-box">
  <span className='inner-headings'>X</span>
  <div className="range-box">
    <input
      type="range"
      min={-10}
      max={10}
      step={1}
      value={instance.positionX}
      onChange={(e) => handlePositionX(id, Number(e.target.value))}
    />
    <input
      type="text"
      value={(instance.positionX / 10) * (width / 2)}
      readOnly
      style={{ textAlign: 'center' }}
    />
  </div>
</div>

          {/* <div className="field-box">
            <span className='inner-headings'>Y</span>
            <div className="range-box">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={instance.positionY}
                onChange={(e) => handlePositionY(id, Number(e.target.value))}
              />
              <input
                className="sizeInput"
                type="text"
                value={instance.positionY}
                readOnly
              />
            </div>
          </div> */}

          <button
            onClick={() => handleUnion(id)}
            style={{ border: '1px solid black', padding: '5px', borderRadius: '2%' }}
          >
            OK
          </button>
        </>
      )}
    </div>
  );
};

export default DoorDetails;
