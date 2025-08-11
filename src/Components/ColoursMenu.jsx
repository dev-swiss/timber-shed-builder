import React, { useState, useEffect } from 'react';
import './ColoursMenu.css';
import {RoofColorHandler, WallColorHandler} from "../core/coreFunctions"


var scene ;
export const sceneLoaderColor = (loadedScene) => {
    scene = loadedScene;
    return scene;
}

var loaded_meshes_global = [];
export const meshLoaderColor = ( loadedMeshes ) => {
  loaded_meshes_global = loadedMeshes; 
//   console.log(loaded_meshes_global.length)
  return loaded_meshes_global;
}

const ColoursMenu = ({ itemClass }) => {
    const colors = [
        { name: 'white', color : new BABYLON.Color3.FromHexString("#8C4612"), bg: "#8C4612" } ,
        { name: 'Zinc', color: new BABYLON.Color3.FromHexString("#C0C0C0"), bg: "#C0C0C0"  },
        { name: 'Smooth Cream', color: BABYLON.Color3.FromHexString('#FDF4DC') ,  bg: "#EBD4C0"},
        { name: 'Territory', color: BABYLON.Color3.FromHexString('#4A2125'), bg: "#4A2125" },
        { name: 'Wallaby', color: BABYLON.Color3.FromHexString('#676765'), bg: "#676765" }
    ];

    const [roofColor, setRoofColor] = useState(sessionStorage.getItem('roofColor') ? JSON.parse(sessionStorage.getItem('roofColor')) : colors[0] );
    const [wallColor, setWallColor] = useState(sessionStorage.getItem('wallColor') ? JSON.parse(sessionStorage.getItem('wallColor')) : colors[0]);
    const [roofDropdownOpen, setRoofDropdownOpen] = useState(false);
    const [wallDropdownOpen, setWallDropdownOpen] = useState(false);


    const toggleRoofDropdown = () => {
        setRoofDropdownOpen(!roofDropdownOpen);
    };

    const toggleWallDropdown = () => {
        setWallDropdownOpen(!wallDropdownOpen);
    };


    
    const selectRoofColor = (color) => {
        for(let i = 0; i < loaded_meshes_global.length; i++)
        {
            console.log(loaded_meshes_global)
            loaded_meshes_global[i].forEach((element) => {
                // console.log("elements being accessed in mesh array: ", element.name)
                if (element.name === 'fRoof' || element.name === 'lRoof' || element.name === 'rRoof' || element.name === 'leanToFront'  || element.name === 'leanToBack'  
                    || element.name === 'FTop'  || element.name === 'BTop' || element.name === 'leanToLeftRoofs' || element.name === 'leanToRightRoofs' 
                    || element.name === "cantileverLeft"  || element.name === "cantileverRight" || element.name === "cantileverBack" || element.name === "cantileverFront"
                    || element.name === "leanToFrontRoof" || element.name === "leanToBackRoof") {
                    // console.log("meshes in coloring: ", element.name)
                    if (element.name === 'fRoof') {
                        // Get all children of the 'fRoof' mesh
                        const children = element.getChildMeshes();
                        var Color = color.color;
                        var Material = new BABYLON.StandardMaterial("Material", scene);
                        Material.diffuseColor = Color;   
                    
                        // You can now iterate over the children to perform actions
                        children.forEach(child => {
                            child.material = Material;
                            // console.log("children",child.name); // This will print the name of each child mesh
                        });
                    }else{
                        var Color = color.color;
                        var Material = new BABYLON.StandardMaterial("Material", scene);
                        Material.diffuseColor = Color;
                        element.material = Material;   
                        RoofColorHandler(Material);
                        if(element.name === 'BTop' || element.name === 'FTop'){
                            Material.backFaceCulling = false;
                        }
                    }
                }
            })
        }
        setRoofColor(color);
        sessionStorage.setItem('roofColor', JSON.stringify(color));
        setRoofDropdownOpen(false);
    };

    const selectWallColor = (color) => {
        for(let i = 0; i < loaded_meshes_global.length; i++)
        {
            loaded_meshes_global[i].forEach((element) => {
                if(element.name === 'Rwall' || element.name === 'Lwall' || element.name === 'BWall' || element.name === 'FWall' || element.name === "leanToLeftWalls" 
                    || element.name === "leanToRightWalls"   || element.name === 'leanToLeftPartWall' || element.name === 'leanToRightPartWall' || element.name === 'leanToRightPartWallBack'
                    || element.name === 'leanToLeftPartWallBack'|| element.name === 'leanToLeftTriangle' || element.name === 'leanToRightTriangle' || element.name === 'leanToRightTriangleBack'
                    || element.name === 'leanToLeftTriangleBack')
                {
                    var Color = color.color;
                    var Material = new BABYLON.StandardMaterial("Material", scene);
                    Material.diffuseColor = Color;
                    Material.backFaceCulling = false;
                    element.material = Material;  

                    WallColorHandler(Material);

                }
            })
        }
        setWallColor(color);
        sessionStorage.setItem('wallColor', JSON.stringify(color));
        setWallDropdownOpen(false);
    };

    // useEffect(() => {
    //     selectWallColor(roofColor);
    //     selectRoofColor(wallColor); 
    //   }, [loaded_meshes_global.length]); 

    //   useEffect(() => {
    //     console.log(roofColor, wallColor);
    // }, []);

    return (
        <div className={`colours-container ${itemClass}`}>
            <span className="colours-headings">Roof Color</span>
            <div className="color-dropdown" onClick={toggleRoofDropdown}>
                <div className="color-selected">
                    <div className="color-circle" style={{ backgroundColor: roofColor.bg }}></div>
                    <span className="color-name">{roofColor.name}</span>
                </div>
                {roofDropdownOpen && (
                    <div className="color-options">
                        {colors.map((color, index) => (
                            <div key={index} className="color-option" onClick={() => selectRoofColor(color)}>
                                <div className="color-circle" style={{ backgroundColor: color.bg }}></div>
                                <span className="color-name">{color.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <span className="colours-headings">Wall Color</span>
            <div className="color-dropdown" onClick={toggleWallDropdown}>
                <div className="color-selected">
                    <div className="color-circle" style={{ backgroundColor: wallColor.bg }}></div>
                    <span className="color-name">{wallColor.name}</span>
                </div>
                {wallDropdownOpen && (
                    <div className="color-options">
                        {colors.map((color, index) => (
                            <div key={index} className="color-option" onClick={() => selectWallColor(color)}>
                                <div className="color-circle" style={{ backgroundColor: color.bg }}></div>
                                <span className="color-name">{color.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColoursMenu;
