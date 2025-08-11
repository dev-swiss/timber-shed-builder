//import React, { useState, useRef, useEffect } from "react";
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

import ExtrasMenu from "./Components/Extras/openings/ExtrasMenu";
import RightSidebar from "./Components/RightSidebar";
import Sidebar from "./Components/Sidebar";
import SceneRenderComponent from "./Components/SceneRenderComponent";
import { OpeningDetailsProvider } from "./Components/OpeningDetailsContext";
import "./App.css";

import { DoorDetailsProvider } from './Components/Extras/PADoor/DoorDetailsContext';
import { Skylightprovider } from './Components/Extras/skylight/skylight';
//import DoorDetails from './Components/Extras/PADoor/DoorDetails'; // Import the UI component


const App = () => {
  return (
    <OpeningDetailsProvider>
    <DoorDetailsProvider>
    <Skylightprovider>

  
   <div className="app-container">
     <div className="sidebar-container">
       <Sidebar />
     </div>
     <div className="scene-container">
       <RightSidebar />
       <SceneRenderComponent />
     </div>
   </div>
   </Skylightprovider>
   </DoorDetailsProvider>
 </OpeningDetailsProvider>
);
};

export default App;
