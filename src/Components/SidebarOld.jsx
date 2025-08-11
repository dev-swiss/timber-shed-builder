import React from 'react'
import './Sidebar.css'
import { 
  FaMagnifyingGlass as SizeIcon, 
  FaThinkPeaks as AwningsIcon, 
  FaGoogleWallet as WallsIcon,
  FaEtsy as ExtrasIcon
} from "react-icons/fa6";
import { BiSolidColorFill as ColoursIcon } from "react-icons/bi";

import { RiQuoteText as QuoteIcon } from "react-icons/ri";


import { useState } from 'react';

import SizeMenu from './SizeMenu';
import AwningsMenu from './AwningsMenu';
import QuoteMenu from './QuoteMenu';
import WallsMenu from './WallsMenu';


const Sidebar = () => {



  const [sizeMenu, setSizeMenu] = useState(false)

  const showSizeMenu = () => {
    if(sizeMenu == true){
      setSizeMenu(false)
    }else{
      setSizeMenu(true)
      setAwningsMenu(false)
      setWallsMenu(false)
      setQuoteMenu(false)
    }
  }

  const [awningsMenu, setAwningsMenu] = useState(false)
  const showAwningsMenu = () => {
    if(awningsMenu == true){
      setAwningsMenu(false)
      
    }else{
      setSizeMenu(false)
      setAwningsMenu(true)
      setWallsMenu(false)
      setQuoteMenu(false)
    }
  }

  const [wallsMenu, setWallsMenu] = useState(false)

  const showWallsMenu = () => {
    if(wallsMenu == true){
      setWallsMenu(false)
    }else{
      setSizeMenu(false)
      setAwningsMenu(false)
      setWallsMenu(true)
      setQuoteMenu(false)
    }
  }

  const [quoteMenu, setQuoteMenu] = useState(false)
  
  const showQuoteMenu = () => {
    if(quoteMenu == true){
      setQuoteMenu(false)
    }else{
      setSizeMenu(false)
      setAwningsMenu(false)
      setWallsMenu(false)
      setQuoteMenu(true)
    }
  }
  


  return (
    <>
    <div className="sidebar-container">
        <div className="menu" >
            
            <button onClick={showSizeMenu}>
              <span><SizeIcon /></span> 
              <br />
              Size
            </button>
            {
              sizeMenu && <SizeMenu />
            }
        </div>
        <div className="menu">

            <button onClick={showAwningsMenu}>
              <span><AwningsIcon /></span>
              Awnings
            </button>
            {
              awningsMenu && <AwningsMenu />
            }
        </div>
        <div className="menu">
            
            <button onClick={showWallsMenu}>
              <span><WallsIcon /></span>
              <br />
              Walls
            </button>
            {
              wallsMenu && <WallsMenu/>
            }
        </div>
        <div className="menu">
            <span><ExtrasIcon /></span>
            <button>Extras</button>
        </div>
        <div className="menu">
            <span><ColoursIcon /></span>
            <button>Colours</button>
        </div>

        <div className="menu">
            
            <button onClick={showQuoteMenu}>
              <span><QuoteIcon /></span>
              Quotes
            </button>
            {
              quoteMenu && <QuoteMenu />
            }
        </div>
    </div>
    </>
 )
}

export default Sidebar