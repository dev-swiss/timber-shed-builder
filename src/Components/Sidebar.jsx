import React, { useEffect } from "react";
import { useState } from "react";
import { IoColorPaletteOutline } from "react-icons/io5";
import { useOpeningDetails } from "./OpeningDetailsContext";

import { useDoorDetails } from "./Extras/PADoor/DoorDetailsContext"; 

import "./Sidebar.css";
import {
  FaMagnifyingGlass as SizeIcon,
  FaThinkPeaks as AwningsIcon,
  FaGoogleWallet as WallsIcon,
  FaMaxcdn as MezzanineIcon,
  FaEtsy as ExtrasIcon,
  FaClipboardList as QuoteIcon,
  
} from "react-icons/fa6";
import SizeMenu from "./SizeMenu";
import AwningsMenu from "./AwningsMenu";
import MezzanineMenu from "./MezzanineMenu";
import QuoteMenu from "./QuoteMenu";
import WallsMenu from "./WallsMenu";
import EditMenu from "./EditMenu";
import TypeMenu from "./TypeMenu";
import ViewsMenu from "./ViewsMenu";
import ExtrasMenu from "./Extras/openings/ExtrasMenu";
import Skylightmenu from "./Extras/skylight/skylightmenu";
import ColoursMenu from "./ColoursMenu";
import BarnWindowMenu from "./Extras/barnWindow/barWindow";
import PADoorMenu from "./Extras/PADoor/PADoorMenu";
import MetalSlidingDoorMenu from "./Extras/metalSlidingDoor/metalSlidinDoor";
import ConcreteWallMenu from "./Extras/Concrete/ConcreteWall";
import GlassSlidingDoorMenu from "./Extras/glassSlidingDoor/glassSlidingDoor";
import WindowMenu from "./Extras/window/window";
import PolycarbonateSheetMenu from "./Extras/PolycarbonateSheetMenu/PolycarbonateSheetMenu";
import RollerDoorMenu from "./Extras/rollerDoor/rollerDoor";

const Sidebar = ({ onOpeningsClick, setOpenings, openings, setDoors, doors,skyopenings,setskyopenings }) => {
  // console.log(typeof onOpeningsClick);
  const [type_display, set_type_display] = useState("");

  //   const [sizeMenu, setSizeMenu] = useState(false)

  //   const showSizeMenu = () => {
  //     if(sizeMenu == true){
  //       setSizeMenu(false)
  //     }else{
  //       setSizeMenu(true)
  //       setAwningsMenu(false)
  //       setWallsMenu(false)
  //       setQuoteMenu(false)
  //     }
  //   }

  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleActiveDropdown = (dropdownId) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const [itemClass, setItemClass] = useState("hide-item");

  const handleMouseEnter = () => {
    setItemClass("");
  };

  const handleMouseLeave = () => {
    setItemClass("hide-item");
  };

  const [showBarnWindow, setShowBarnWindow] = useState(false);

  const toggleBarnWindow = () => {
    setShowBarnWindow(!showBarnWindow); // Toggle the state to show or hide Barn Window
  };
  //   const [awningsMenu, setAwningsMenu] = useState(false)
  //   const showAwningsMenu = () => {
  //     if(awningsMenu == true){
  //       setAwningsMenu(false)

  //     }else{
  //       setSizeMenu(false)
  //       setAwningsMenu(true)
  //       setWallsMenu(false)
  //       setQuoteMenu(false)
  //     }
  //   }

  //   const [wallsMenu, setWallsMenu] = useState(false)

  //   const showWallsMenu = () => {
  //     if(wallsMenu == true){
  //       setWallsMenu(false)
  //     }else{
  //       setSizeMenu(false)
  //       setAwningsMenu(false)
  //       setWallsMenu(true)
  //       setQuoteMenu(false)
  //     }
  //   }

  //   const [quoteMenu, setQuoteMenu] = useState(false)

  //   const showQuoteMenu = () => {
  //     if(quoteMenu == true){
  //       setQuoteMenu(false)
  //     }else{
  //       setSizeMenu(false)
  //       setAwningsMenu(false)
  //       setWallsMenu(false)
  //       setQuoteMenu(true)
  //     }
  //   }
  const [typeAttributeValue, setTypeAttributeValue] = useState("");

  useEffect(() => {
    // Create a new MutationObserver
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "type"
        ) {
          // If the 'type' attribute changes, update the typeAttributeValue state variable
          setTypeAttributeValue(mutation.target.getAttribute("type"));
        }
      }
    });

    // Target the container element
    const container = document.getElementsByClassName("type__container")[0];

    // Start observing changes to the 'type' attribute of the container
    observer.observe(container, { attributes: true });
    // Cleanup function to disconnect the observer when the component unmounts
    return () => observer.disconnect();
  }, []);

  const handle_close_display = () => {
    var container = document.getElementsByClassName("type__container")[0];
    container.style.display = "none";
  };

  return (
    <>
      <div className="{'dark text-white-dark' : $store.app.semidark}">
        <nav
          x-data="sidebar"
          className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300`}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <div className="h-full bg-white dark:bg-[#0e1726]">
            <div className="flex items-center justify-between px-4 py-3">
              <a
                href="index.html"
                className="main-logo flex shrink-0 items-center"
              >
                <img
                  className="ml-[5px] w-8 flex-none"
                  src="assets/images/logo.png"
                  alt="image"
                />
                <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline"></span>
              </a>
              <a
                href="javascript:;"
                className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                onClick="$store.app.toggleSidebar()"
              >
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
              </a>
            </div>
            <ul
              className="perfect-scrollbar relative h-[calc(100vh-80px)] space-y-0.5 overflow-y-auto overflow-x-hidden p-4 py-0 font-semibold"
              x-data="{ activeDropdown: 'dashboard' }"
            >
              <li className="menu nav-item">
                <button
                  type="button"
                  className="nav-link group"
                  onClick={() => toggleActiveDropdown("size")}
                >
                  <div className="flex items-center">
                    <SizeIcon />

                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Size
                    </span>
                  </div>
                  <div className="rtl:rotate-180">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 5L15 12L9 19"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                {activeDropdown === "size" && (
                  <SizeMenu itemClass={itemClass} />
                )}
              </li>

              <li className="menu nav-item">
                <button
                  type="button"
                  className="nav-link group"
                  onClick={() => toggleActiveDropdown("awning")}
                >
                  <div className="flex items-center">
                    <AwningsIcon />

                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Awnings
                    </span>
                  </div>
                  <div className="rtl:rotate-180">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 5L15 12L9 19"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                {activeDropdown === "awning" && (
                  <AwningsMenu itemClass={itemClass} />
                )}
              </li>


              <li className="menu nav-item">
                <button
                  type="button"
                  className="nav-link group"
                  onClick={() => toggleActiveDropdown("mezzanine")}
                >
                  <div className="flex items-center">
                    <MezzanineIcon />

                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Mezzanine
                    </span>
                  </div>
                  <div className="rtl:rotate-180">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 5L15 12L9 19"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                {activeDropdown === "mezzanine" && (
                  <MezzanineMenu itemClass={itemClass} />
                )}
              </li>




              <li className="menu nav-item">
                <button
                  type="button"
                  className="nav-link group"
                  onClick={() => toggleActiveDropdown("walls")}
                >
                  <div className="flex items-center">
                    <svg
                      fill="#000000"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 298 298"
                      xmlSpace="preserve"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g>
                          {" "}
                          <path d="M278.125,33h-0.208H235v67h42.917C288.945,100,298,90.862,298,79.834V52.5C298,41.472,289.153,33,278.125,33z"></path>{" "}
                          <path d="M20.75,33C9.722,33,0,41.472,0,52.5v27.334C0,90.862,9.722,100,20.75,100H63V33H20.75z"></path>{" "}
                          <rect x="78" y="33" width="142" height="67"></rect>{" "}
                          <path d="M278.125,198h-0.208H235v67h42.917c11.028,0,20.083-9.138,20.083-20.166V217.5C298,206.472,289.153,198,278.125,198z"></path>{" "}
                          <rect x="78" y="198" width="142" height="67"></rect>{" "}
                          <path d="M20.75,198C9.722,198,0,206.472,0,217.5v27.334C0,255.862,9.722,265,20.75,265H63v-67H20.75z"></path>{" "}
                          <path d="M20.75,116C9.722,116,0,123.972,0,135v27.334C0,173.362,9.722,183,20.75,183H141v-67H20.75z"></path>{" "}
                          <path d="M278.125,116h-0.208H156v67h121.917c11.028,0,20.083-9.638,20.083-20.666V135C298,123.972,289.153,116,278.125,116z"></path>{" "}
                        </g>{" "}
                      </g>
                    </svg>

                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Walls
                    </span>
                  </div>
                  <div className="rtl:rotate-180">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 5L15 12L9 19"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                {activeDropdown === "walls" && (
                  <WallsMenu itemClass={itemClass} />
                )}
              </li>

              <li className="menu nav-item">
                {/* <button onClick={onOpeningsClick}>Openingsss</button> */}
                {/* <button
                  type="button"
                  className="nav-link group"
                  onClick={() => toggleActiveDropdown("extras")}
                >
                  <div className="flex items-center">
                    <svg
                      fill="#000000"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 486.25 486.25"
                      xml:space="preserve"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g>
                          {" "}
                          <g>
                            {" "}
                            <path d="M472.125,0L243.468,40.508L14.125,0.052v485.915l228.771-51.396l229.229,51.679V0z M217.551,414.165L39.935,453.391 V31.058l177.617,30.26L217.551,414.165L217.551,414.165z M442.875,450.005L249.1,410.646V378.88h4.15v-47.675h-4.15V154.238h4.15 v-47.673h-4.15V65.023l193.775-30.388V450.005z"></path>{" "}
                            <ellipse
                              cx="62.397"
                              cy="238.746"
                              rx="13.155"
                              ry="16.302"
                            ></ellipse>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>
                    </svg>

                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Extras
                    </span>
                  </div>
                  <div className="rtl:rotate-180">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 5L15 12L9 19"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                {activeDropdown === "extras" && (
                  <ExtrasMenu
                    setOpenings={setOpenings}
                    itemClass={itemClass}
                    openings={openings}
                  />
                )}
                {activeDropdown === "extras" && (
                  <Skylightmenu
                    setskyopenings={setskyopenings}
                    itemClass={itemClass}
                    skyopenings={skyopenings}
                  />
                )}
                {activeDropdown === "extras" && (
                  <BarnWindowMenu itemClass={itemClass} />
                )}

                
                
                {activeDropdown === "extras" && (
                  <PADoorMenu
                  setDoors= {setDoors}
                   itemClass={itemClass}
                   doors={doors}
                   />
                )}

                {activeDropdown === "extras" && (
                  <MetalSlidingDoorMenu itemClass={itemClass} />
                )}

                {activeDropdown === "extras" && (
                  <ConcreteWallMenu itemClass={itemClass} />
                )}

                {activeDropdown === "extras" && (
                  //</ul>ConcreteWallMenu itemClass={itemClass}/>
                  <GlassSlidingDoorMenu itemClass={itemClass} />
                )}

                {activeDropdown === "extras" && (
                  <PolycarbonateSheetMenu itemClass={itemClass} />
                )}

                {activeDropdown === "extras" && (
                  //</ul>ConcreteWallMenu itemClass={itemClass}/>
                  <WindowMenu itemClass={itemClass} />
                )}

                {activeDropdown === "extras" && (
                  //</ul>ConcreteWallMenu itemClass={itemClass}/>
                  <RollerDoorMenu itemClass={itemClass} />
                )} */}
              </li>

              <li className="menu nav-item">
                <button
                  type="button"
                  className="nav-link group"
                  onClick={() => toggleActiveDropdown("colours")}
                >
                  <div className="flex items-center">
                    <IoColorPaletteOutline
                      fill="#000000"
                      style={{ width: 24, height: 24 }}
                    />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Colors
                    </span>
                  </div>
                  <div className="rtl:rotate-180">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 5L15 12L9 19"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                {activeDropdown === "colours" && (
                  <ColoursMenu itemClass={itemClass} />
                )}
              </li>
              <li className="menu nav-item"></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="quote__container">
        <QuoteMenu />
      </div>
      <div className="edit__New__container">
        <EditMenu />
      </div>
      <div className="type__container">
      <button
    className="mt-1 -mr-1"
    onClick={handle_close_display}
    style={{ position: "absolute", right: "1rem", top: "1rem", width: "fit-content", zIndex: 10 }}
>
    ❌
</button>
        <TypeMenu
          type={typeAttributeValue}
          handle_close_display={handle_close_display}
        />
      </div>
      <div className="view__container">
        <ViewsMenu />
      </div>
    </>
  );
};

export default Sidebar;
