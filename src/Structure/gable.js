import * as structure from './structure.js';
import pitch from '../pitch/roofPitch.json'
import awningPitch from '../pitch/awningPitch.json'
import logo from '/assets/images/logo.png'
import { Vector3, Mesh, MeshBuilder, DynamicTexture, StandardMaterial, Texture, Quaternion, Axis, Color3, VertexData } from '@babylonjs/core';
import { updateAwningHeight } from '../core/coreFunctions.jsx';
import * as mezzanine from './mezzanine.js'
import * as bracing from './bracing.js'




//<=========== Bay Size Handler ==========>//
var baySizeTextCollection = [];
var defaultBaySize = 10.0 + ' m';
var finalPosition = 0;
var baySizeLocation;
export const updateLeftArrowPosition = function (position) {
    if (position) {
        finalPosition = position;
        sessionStorage.setItem("ArrowPosition_", finalPosition + 4)
    }
}
export const checkBaySize = function (baySize, loadedMeshes, scene, pos) {
    if (baySize) {
        var changedBaySize = parseFloat(baySize) + ' m';
        if (pos) {
            finalPosition = pos;
        }
        if (Array.isArray(baySizeTextCollection) && baySizeTextCollection.length > 0) {
            // Iterate over each element in the baySizeTextCollection array
            while (baySizeTextCollection.length > 0) {
                // Get the last element in the array
                const text = baySizeTextCollection.pop();
                // Dispose the text element
                if (text) {
                    text.dispose();
                }
            }
        }
        //baySizeTextCollection = [];
        loadedMeshes.forEach((meshes) => {
            meshes.forEach((mesh) => {
                if (mesh.name === 'Larrow') {
                    var textRect = MeshBuilder.CreateGround("rect", { width: 1.5, height: 1.2 }, scene);
                    textRect.position.y = 0.05;
                    textRect.position.z = mesh.position.z;
                    textRect.rotation = new Vector3(0, -1.5708, 0)
                    // Create a material with the background texture
                    var materialRect = new StandardMaterial("Material", scene);
                    var backgroundTexture = new Texture("/textures/ground/ground.jpg", scene);
                    materialRect.diffuseTexture = backgroundTexture;

                    // Create a dynamic texture for drawing text
                    var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, scene);
                    var font = "bold 150px monospace";
                    textureRect.drawText(changedBaySize, 50, 170, font, "white");

                    // Assign the dynamic texture as an emissive texture to blend with the background
                    materialRect.emissiveTexture = textureRect;
                    materialRect.useEmissiveAsIllumination = true;

                    textRect.material = materialRect;
                    textRect.name = 'leftArrow';
                    baySizeTextCollection.push(textRect);
                }
            })
        })
        baySizeTextCollection.forEach((text) => {
            if (parseFloat(sessionStorage.getItem("leftArrowPosition_")) === 0) {
                if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0 && sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
                    console.log("hitting the problematic 2")
                    text.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 4;
                } else if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) != 0) {
                    text.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 4;
                    console.log("hitting width: ", sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                } else if (sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
                    text.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 4;
                    console.log("hitting where it hurts")
                } else {
                    text.position.x = 4;
                    baySizeLocation = text.position.x;
                }
            }
            else {
                if (sessionStorage.getItem("leftArrowPosition_") != 0 && sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0 && sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
                    console.log("hitting all 3")
                    text.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 4;
                } else if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0 && sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
                    console.log("hitting the problematic 2")
                    text.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 4;
                } else if (sessionStorage.getItem("leftArrowPosition_") != 0 && sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0) {
                    console.log("invalid")
                    text.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 4;
                } else if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0) {
                    console.log("invalid")
                    text.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 4;
                } else if (sessionStorage.getItem("leftArrowPosition_") != 0) {
                    console.log("invalid")
                    text.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + 4;
                } else if (sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
                    text.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 4;
                }
            }
        })
        return baySizeTextCollection;
    }
}
//<========== Depth Change Handler =========>//
var changedDepth = 5.0 + ' m';
var textCollection = [];
export const checkDepthChange = function (depth, loadedMeshes, scene) {
    if (depth && loadedMeshes[1] && loadedMeshes[0]) {
        changedDepth = parseFloat(depth) + ' m';
        if (Array.isArray(textCollection) && textCollection.length > 0) {
            textCollection[0].dispose();
            textCollection[1].dispose();
        }
        //for front
        var textRect = MeshBuilder.CreateGround("rect", { width: 1.8, height: 1.2 }, scene);
        textRect.position.x = 0;
        textRect.position.y = 0.05
        textRect.position.z = loadedMeshes[1][20].position.z + 0.3;
        //console.log(loadedMeshes[1][20].position.z)
        textRect.rotation = new Vector3(0, 3.14159, 0)
        // Create a material with the background texture
        var materialRect = new StandardMaterial("Material", scene);
        var backgroundTexture = new Texture("/textures/ground/ground.jpg", scene);
        materialRect.diffuseTexture = backgroundTexture;

        // Create a dynamic texture for drawing text
        var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, scene);
        var font = "bold 100px monospace";
        console.log("current depth is: ", changedDepth)
        textureRect.drawText(changedDepth, 100, 170, font, "white");

        // Assign the dynamic texture as an emissive texture to blend with the background
        materialRect.emissiveTexture = textureRect;
        materialRect.useEmissiveAsIllumination = true;

        textRect.material = materialRect;
        textRect.name = 'front';

        //for back 
        var textRect1 = MeshBuilder.CreateGround("rect", { width: 1.8, height: 1.2 }, scene);
        textRect1.position.x = 0;
        textRect1.position.y = 0.05
        textRect1.position.z = loadedMeshes[0][20].position.z - 0.3;
        if(textRect1.position.z == -13.24){
            textRect1.position.z = -13.34;
        }
        //textRect1.rotation = new Vector3(0, 0, 0);
        console.log("setting text rect loc: ", textRect1.position.z)
        // Create a material with the background texture
        var materialRect1 = new StandardMaterial("Material", scene);
        var backgroundTexture1 = new Texture("/textures/ground/ground.jpg", scene);
        materialRect1.diffuseTexture = backgroundTexture1;

        // Create a dynamic texture for drawing text
        var textureRect1 = new DynamicTexture("new rect", { width: 512, height: 256 }, scene);
        var font1 = "bold 100px monospace";
        textureRect1.drawText(changedDepth, 50, 170, font1, "white");

        // Assign the dynamic texture as an emissive texture to blend with the background
        materialRect1.emissiveTexture = textureRect1;
        materialRect1.useEmissiveAsIllumination = true;
        textRect1.name = 'back';
        textRect1.material = materialRect1;

        textCollection[0] = textRect;
        textCollection[1] = textRect1;
        return textCollection;
    }
}

// <==================================== Height Arrow Construction ====================================>
// <==================================== Left Awning Height Arrow Consturction ========================>

var prevMeshesforDisposalLeft = [];
var frontBayOffsetZ = 0;
var groundPosition;
export const recieveFrontBayOffset = () => {
    return frontBayOffsetZ;
}
export const checkHeightChangeLeft = (height, loadedMeshes, scene, flag) => {

    // Dispose of previous meshes
    if (Array.isArray(prevMeshesforDisposalLeft) && prevMeshesforDisposalLeft.length > 0) {
        while (prevMeshesforDisposalLeft.length > 0) {
            const mesh = prevMeshesforDisposalLeft.pop();
            if (mesh) {
                mesh.dispose();
            }
        }
    }

    groundPosition = new Vector3(1, 0.1, 0);

    // Create arrow lines
    var arrowLine3 = MeshBuilder.CreateTube("arrowLine3", {
        path: [groundPosition, new Vector3(1, 0.9, 0)],
        radius: 0.03
    }, scene);
    var arrowLine4 = MeshBuilder.CreateTube("arrowLine4", {
        path: [new Vector3(1, 1.5, 0), new Vector3(1, 2.2, 0)],
        radius: 0.03
    }, scene);

    // Create arrowheads
    var arrowhead3 = MeshBuilder.CreateCylinder("arrowhead3", {
        height: 0.2,
        diameterTop: 0.2,
        diameterBottom: 0,
        tessellation: 24
    }, scene);
    arrowhead3.position = groundPosition;
    var arrowhead4 = MeshBuilder.CreateCylinder("arrowhead4", {
        diameterTop: 0,
        diameterBottom: 0.2,
        height: 0.2,
        tessellation: 24
    }, scene);
    arrowhead4.position = new Vector3(1, 2.2, 0);

    // Positioning arrow lines and arrowheads
    arrowLine3.position.z += 3;
    arrowLine4.position.z += 3;
    arrowhead3.position.z += 3;
    arrowhead4.position.z += 3;
    arrowLine3.position.x += 4;
    arrowLine4.position.x += 4;
    arrowhead3.position.x += 4;
    arrowhead4.position.x += 4;
    // Set materials
    arrowLine3.material = new StandardMaterial("arrowLineMat3", scene);
    arrowLine3.material.diffuseColor = new Color3(0, 0, 0);
    arrowLine4.material = new StandardMaterial("arrowLineMat4", scene);
    arrowLine4.material.diffuseColor = new Color3(0, 0, 0);
    arrowhead3.material = new StandardMaterial("arrowheadMat3", scene);
    arrowhead3.material.diffuseColor = new Color3(0, 0, 0);
    arrowhead4.material = new StandardMaterial("arrowheadMat4", scene);
    arrowhead4.material.diffuseColor = new Color3(0, 0, 0);

    // Create text rectangle
    var textRect = MeshBuilder.CreateGround("textrect", { width: 0.5, height: 0.6 }, scene);
    var midpointY = (groundPosition.y + 2.2) / 2;
    textRect.position.x = arrowLine3.position.x + 1;
    textRect.position.y = midpointY + 0.05;
    textRect.position.z = 3;
    textRect.rotation = new Vector3(-1.5708, 1.5708, 1.5708);

    // Create and set the dynamic texture
    var materialRect = new StandardMaterial("Material", scene);
    var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, scene, false, Texture.TRILINEAR_SAMPLINGMODE);
    var textureContext = textureRect.getContext();
    textureContext.clearRect(0, 0, textureRect.getSize().width, textureRect.getSize().height);
    var font = "bold 200px monospace";
    textureRect.drawText(height, 50, 170, font, "white", "transparent");
    textureRect.hasAlpha = true;
    materialRect.emissiveTexture = textureRect;
    materialRect.diffuseColor = new Color3(1, 1, 1);
    materialRect.opacityTexture = textureRect;
    materialRect.backFaceCulling = false;
    textRect.material = materialRect;

    // Create a container for the arrow
    var container_arrow_left = new Mesh("container_arrow_left", scene);
    container_arrow_left.position = new Vector3(0, 0, 0);
    arrowLine3.parent = container_arrow_left;
    arrowLine4.parent = container_arrow_left;
    arrowhead3.parent = container_arrow_left;
    arrowhead4.parent = container_arrow_left;

    // Set text rectangle parent directly to the scene or another parent to prevent scaling
    var textContainer = new Mesh("textContainer", scene);
    textRect.parent = textContainer;

    // Position the containers
    if (!sessionStorage.getItem("leftHeightArrowPosition_")) {
        sessionStorage.setItem("leftHeightArrowPosition_", container_arrow_left.position.x);
    } else {
        container_arrow_left.position.z += frontBayOffsetZ;
        if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) > 0) {
            container_arrow_left.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"));
        } else {
            container_arrow_left.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPosition_"));
        }
        //sessionStorage.setItem("leftHeightArrowPosition_",container_arrow_left.position.x);
        // if(baySizeLocation == 4){
        //     container_arrow_left.position.x = baySizeLocation;
        // }else{
        //     container_arrow_left.position.x = baySizeLocation - 2.5;
        // }
        textContainer.position = container_arrow_left.position.clone();
    }
    if (parseInt(localStorage.getItem('height')) >= 6) {
        if (parseInt(localStorage.getItem('height')) == 6) {
            container_arrow_left.scaling.y += 0.1;
            textContainer.position.y += 0.1;
        } else if (parseInt(localStorage.getItem('height')) == 7) {
            container_arrow_left.scaling.y += 0.2;
            textContainer.position.y += 0.2;
        } else if (parseInt(localStorage.getItem('height')) == 8) {
            container_arrow_left.scaling.y += 0.3;
            textContainer.position.y += 0.4;
        } else if (parseInt(localStorage.getItem('height')) == 9) {
            container_arrow_left.scaling.y += 0.4;
            textContainer.position.y += 0.4;
        } else if (parseInt(localStorage.getItem('height')) == 10) {
            container_arrow_left.scaling.y += 0.5;
            textContainer.position.y += 0.5;
        }
    }
    if (flag > 2.5) {
        container_arrow_left.scaling.y -= 0.02 * flag
        textContainer.position.y -= 0.02 * flag
    }
    // Add meshes to disposal list
    prevMeshesforDisposalLeft.push(arrowLine3, arrowLine4, arrowhead3, arrowhead4, textRect, container_arrow_left, textContainer);
    if (localStorage.getItem("leftAwning") == 'false') {
        arrowLine3.isVisible = false;
        arrowLine4.isVisible = false;
        arrowhead3.isVisible = false;
        arrowhead4.isVisible = false;
        textRect.isVisible = false;
    }

    return [arrowLine3, arrowLine4, arrowhead3, arrowhead4, textRect, container_arrow_left, textContainer];
}

var prevDepthArrowsForDisposal = [];
var positionLeft = new Vector3(1, 0.1, 0);
export const createAwningDepthMeasurementsLeft = (depth, scene) => {

    // Dispose of previous meshes
    if (Array.isArray(prevDepthArrowsForDisposal) && prevDepthArrowsForDisposal.length > 0) {
        while (prevDepthArrowsForDisposal.length > 0) {
            const mesh = prevDepthArrowsForDisposal.pop();
            if (mesh) {
                mesh.dispose();
            }
        }
    }

    // Create arrow lines representing the width of the mesh
    var width = 2.1; // Width of the arrow lines
    var startPoint = new Vector3(0, 0, 0);
    var endPoint1 = new Vector3(0, 0, -width); // Endpoint for the first arrow line
    var endPoint2 = new Vector3(0, 0, width); // Endpoint for the second arrow line

    // Create the arrow lines
    var arrowLine1 = MeshBuilder.CreateTube("arrowLine1", { path: [startPoint, endPoint1], radius: 0.05 }, scene);
    var arrowLine2 = MeshBuilder.CreateTube("arrowLine2", { path: [startPoint, endPoint2], radius: 0.05 }, scene);


    arrowLine1.rotation = new Vector3(0, 1.5708, 0);
    arrowLine2.rotation = new Vector3(0, 1.5708, 0);
    // Create arrowhead meshes
    var arrowhead1 = MeshBuilder.CreateCylinder("arrowhead1", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);
    var arrowhead2 = MeshBuilder.CreateCylinder("arrowhead2", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);


    // Position arrowhead meshes at the ends of arrow lines
    arrowhead1.position = endPoint1.add(new Vector3(-2.3, 0, width)); // Adjust position as needed
    arrowhead2.position = endPoint2.add(new Vector3(2.3, 0, -width)); // Adjust position as needed

    // Rotate arrowhead meshes to align with the direction of the arrow lines
    arrowhead1.rotationQuaternion = Quaternion.RotationAxis(Axis.Z, Math.PI / 2); // Adjust rotation as needed
    arrowhead2.rotationQuaternion = Quaternion.RotationAxis(Axis.Z, -Math.PI / 2); // Adjust rotation as needed

    // Color arrow lines and arrowhead meshes
    arrowLine1.material = new StandardMaterial("arrowLineMat1", scene);
    arrowLine1.material.diffuseColor = new Color3(1, 1, 1); // color assignment
    arrowLine2.material = new StandardMaterial("arrowLineMat2", scene);
    arrowLine2.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead1.material = new StandardMaterial("arrowheadMat1", scene);
    arrowhead1.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead2.material = new StandardMaterial("arrowheadMat2", scene);
    arrowhead2.material.diffuseColor = new Color3(1, 1, 1);

    arrowLine1.position.z += 3;
    arrowLine2.position.z += 3;
    arrowhead1.position.z += 3;
    arrowhead2.position.z += 3;

    var containerDepthArrowLeft = new Mesh("container_depth_arrow_left", scene);
    arrowLine1.setParent(containerDepthArrowLeft);
    arrowLine2.setParent(containerDepthArrowLeft);
    arrowhead1.setParent(containerDepthArrowLeft);
    arrowhead2.setParent(containerDepthArrowLeft);


    // Create text rectangle
    var textRect = MeshBuilder.CreateGround("textrect", { width: 1, height: 0.6 }, scene);
    //var midpointY = (positionLeft.y + 2.2) / 2;

    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) != 0) {
        if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) >= 0) {
            console.log("in here")
            containerDepthArrowLeft.position.x = 3.8 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
            containerDepthArrowLeft.scaling.x = 0.5
            textRect.position.x = 3.7 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"));
            textRect.position.y = 0.05;
            textRect.position.z = 3.6;
        } else {
            console.log("out here")
            containerDepthArrowLeft.position.x = 3.8
            containerDepthArrowLeft.scaling.x = 0.5
            textRect.position.x = 3.7;
            textRect.position.y = 0.05;
            textRect.position.z = 3.6;
        }
    } else {
        console.log("out here")
        containerDepthArrowLeft.position.x = 3.8
        containerDepthArrowLeft.scaling.x = 0.5
        textRect.position.x = 3.7;
        textRect.position.y = 0.05;
        textRect.position.z = 3.6;
    }
    textRect.rotation = new Vector3(0, 3.14159, 0);

    // Create and set the dynamic texture
    var materialRect = new StandardMaterial("Material", scene);
    var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, scene, false, Texture.TRILINEAR_SAMPLINGMODE);
    var textureContext = textureRect.getContext();
    textureContext.clearRect(0, 0, textureRect.getSize().width, textureRect.getSize().height);
    var font = "bold 150px monospace";
    textureRect.drawText(depth + 'm', 100, 170, font, "white", "transparent");
    textureRect.hasAlpha = true;
    materialRect.emissiveTexture = textureRect;
    materialRect.diffuseColor = new Color3(1, 1, 1);
    materialRect.opacityTexture = textureRect;
    materialRect.backFaceCulling = false;
    textRect.material = materialRect;

    // Set text rectangle parent directly to the scene or another parent to prevent scaling
    var textContainer = new Mesh("textContainer", scene);
    textRect.parent = textContainer;
    containerDepthArrowLeft.position.z += frontBayOffsetZ;
    textContainer.position.z += frontBayOffsetZ;

    prevDepthArrowsForDisposal.push(arrowLine1, arrowLine2, arrowhead1, arrowhead2, textRect);

    if (localStorage.getItem("leftAwning") == 'false') {
        arrowLine1.isVisible = false;
        arrowLine2.isVisible = false;
        arrowhead1.isVisible = false;
        arrowhead2.isVisible = false;
        textRect.isVisible = false;
    }
    if (depth == 1) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-1.2, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.05;
        //containerDepthArrowLeft.position.x -= 1.2;
        textContainer.position.x = -1.1;
        sessionStorage.setItem("depthLeftArrowPos_", -1.1)
    } else if (depth == 2) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-1.2, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.1;
        // containerDepthArrowLeft.position.x -= 1.0;
        textContainer.position.x = -0.9;
        sessionStorage.setItem("depthLeftArrowPos_", -0.9)
    } else if (depth == 3) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-1.0, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.15;
        // containerDepthArrowLeft.position.x -= 0.85;
        textContainer.position.x = -0.75;
        sessionStorage.setItem("depthLeftArrowPos_", -0.75)
    } else if (depth == 4) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-1.0, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.20;
        // containerDepthArrowLeft.position.x -= 0.70;
        textContainer.position.x = -0.55;
        sessionStorage.setItem("depthLeftArrowPos_", -0.55)
    } else if (depth == 5) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-0.8, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.25;
        // containerDepthArrowLeft.position.x -= 0.60;
        textContainer.position.x = -0.45;
        sessionStorage.setItem("depthLeftArrowPos_", -3.45)
    } else if (depth == 6) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-0.8, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.30;
        // containerDepthArrowLeft.position.x -= 0.50;
        textContainer.position.x = -0.35;
        sessionStorage.setItem("depthLeftArrowPos_", -0.35)
    } else if (depth == 7) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-0.6, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.35;
        // containerDepthArrowLeft.position.x -= 0.40;
        textContainer.position.x = -0.25;
        sessionStorage.setItem("depthLeftArrowPos_", -0.25)
    } else if (depth == 8) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-0.6, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.40;
        // containerDepthArrowLeft.position.x -= 0.30;
        textContainer.position.x = -0.15;
        sessionStorage.setItem("depthLeftArrowPos_", -0.15)
    } else if (depth == 9) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-0.4, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.45;
        // containerDepthArrowLeft.position.x -= 0.20;
        textContainer.position.x = -0.05;
        sessionStorage.setItem("depthLeftArrowPos_", -0.05)
    } else if (depth == 11) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-0.4, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.55;
        // containerDepthArrowLeft.position.x -= 0;
        textContainer.position.x = 0.15;
        sessionStorage.setItem("depthLeftArrowPos_", 0.15)
    } else if (depth == 12) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-0.2, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.60;
        // containerDepthArrowLeft.position.x += 0.10;
        textContainer.position.x = 0.25;
        sessionStorage.setItem("depthLeftArrowPos_", 0.25)
    } else if (depth == 13) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(0.4, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.65;
        // containerDepthArrowLeft.position.x += 0.20;
        textContainer.position.x = 0.35;
        sessionStorage.setItem("depthLeftArrowPos_", 0.35)
    } else if (depth == 14) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(0.6, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.70;
        // containerDepthArrowLeft.position.x += 0.30;
        textContainer.position.x = 0.45;
        sessionStorage.setItem("depthLeftArrowPos_", 0.45)
    } else if (depth == 15) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(1, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.75;
        // containerDepthArrowLeft.position.x+= 0.40;
        textContainer.position.x = 0.55;
        sessionStorage.setItem("depthLeftArrowPos_", 0.55)
    }


    return [arrowLine1, arrowLine2, arrowhead1, arrowhead2, textRect, containerDepthArrowLeft, textContainer];

}

// <==================================== Right Awning Height Arrow Construction ========================>

var prevMeshesforDisposalRight = [];
var groundPositionRight;
export const checkHeightChangeRight = (height, loadedMeshes, scene, flag) => {

    // Dispose of previous meshes
    if (Array.isArray(prevMeshesforDisposalRight) && prevMeshesforDisposalRight.length > 0) {
        while (prevMeshesforDisposalRight.length > 0) {
            const mesh = prevMeshesforDisposalRight.pop();
            if (mesh) {
                mesh.dispose();
            }
        }
    }

    groundPositionRight = new Vector3(1, 0.1, 0);

    // Create arrow lines
    var arrowLine3 = MeshBuilder.CreateTube("arrowLine3", {
        path: [groundPositionRight, new Vector3(1, 0.9, 0)],
        radius: 0.03
    }, scene);
    var arrowLine4 = MeshBuilder.CreateTube("arrowLine4", {
        path: [new Vector3(1, 1.5, 0), new Vector3(1, 2.2, 0)],
        radius: 0.03
    }, scene);

    // Create arrowheads
    var arrowhead3 = MeshBuilder.CreateCylinder("arrowhead3", {
        height: 0.2,
        diameterTop: 0.2,
        diameterBottom: 0,
        tessellation: 24
    }, scene);
    arrowhead3.position = groundPositionRight;
    var arrowhead4 = MeshBuilder.CreateCylinder("arrowhead4", {
        diameterTop: 0,
        diameterBottom: 0.2,
        height: 0.2,
        tessellation: 24
    }, scene);
    arrowhead4.position = new Vector3(1, 2.2, 0);

    // Positioning arrow lines and arrowheads
    arrowLine3.position.z += 3;
    arrowLine4.position.z += 3;
    arrowhead3.position.z += 3;
    arrowhead4.position.z += 3;
    arrowLine3.position.x -= 6;
    arrowLine4.position.x -= 6;
    arrowhead3.position.x -= 6;
    arrowhead4.position.x -= 6;
    // Set materials
    arrowLine3.material = new StandardMaterial("arrowLineMat3", scene);
    arrowLine3.material.diffuseColor = new Color3(0, 0, 0);
    arrowLine4.material = new StandardMaterial("arrowLineMat4", scene);
    arrowLine4.material.diffuseColor = new Color3(0, 0, 0);
    arrowhead3.material = new StandardMaterial("arrowheadMat3", scene);
    arrowhead3.material.diffuseColor = new Color3(0, 0, 0);
    arrowhead4.material = new StandardMaterial("arrowheadMat4", scene);
    arrowhead4.material.diffuseColor = new Color3(0, 0, 0);

    // Create text rectangle
    var textRect = MeshBuilder.CreateGround("textrect", { width: 0.5, height: 0.6 }, scene);
    var midpointY = (groundPositionRight.y + 2.2) / 2;
    textRect.position.x = arrowLine3.position.x + 1;
    textRect.position.y = midpointY + 0.05;
    textRect.position.z = 3;
    textRect.rotation = new Vector3(-1.5708, 1.5708, 1.5708);

    // Create and set the dynamic texture
    var materialRect = new StandardMaterial("Material", scene);
    var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, scene, false, Texture.TRILINEAR_SAMPLINGMODE);
    var textureContext = textureRect.getContext();
    textureContext.clearRect(0, 0, textureRect.getSize().width, textureRect.getSize().height);
    var font = "bold 200px monospace";
    textureRect.drawText(height, 50, 170, font, "white", "transparent");
    textureRect.hasAlpha = true;
    materialRect.emissiveTexture = textureRect;
    materialRect.diffuseColor = new Color3(1, 1, 1);
    materialRect.opacityTexture = textureRect;
    materialRect.backFaceCulling = false;
    textRect.material = materialRect;

    // Create a container for the arrow
    var container_arrow_right = new Mesh("container_arrow_right", scene);
    container_arrow_right.position = new Vector3(0, 0, 0);
    arrowLine3.parent = container_arrow_right;
    arrowLine4.parent = container_arrow_right;
    arrowhead3.parent = container_arrow_right;
    arrowhead4.parent = container_arrow_right;

    // Set text rectangle parent directly to the scene or another parent to prevent scaling
    var textContainer = new Mesh("textContainer", scene);
    textRect.parent = textContainer;

    // Position the containers
    if (!sessionStorage.getItem("rightHeightArrowPosition_")) {
        sessionStorage.setItem("rightHeightArrowPosition_", container_arrow_right.position.x);
    } else {
        container_arrow_right.position.z += frontBayOffsetZ;
        if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) > 0) {
            container_arrow_right.position.x = (parseFloat(sessionStorage.getItem("rightHeightArrowPosition_")) - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")));
        } else {
            container_arrow_right.position.x = parseFloat(sessionStorage.getItem("rightHeightArrowPosition_"));
        }
        textContainer.position = container_arrow_right.position.clone();
    }
    if (parseInt(localStorage.getItem('height')) >= 6) {
        if (parseInt(localStorage.getItem('height')) == 6) {
            container_arrow_right.scaling.y += 0.1;
            textContainer.position.y += 0.1;
        } else if (parseInt(localStorage.getItem('height')) == 7) {
            container_arrow_right.scaling.y += 0.2;
            textContainer.position.y += 0.2;
        } else if (parseInt(localStorage.getItem('height')) == 8) {
            container_arrow_right.scaling.y += 0.3;
            textContainer.position.y += 0.4;
        } else if (parseInt(localStorage.getItem('height')) == 9) {
            container_arrow_right.scaling.y += 0.4;
            textContainer.position.y += 0.4;
        } else if (parseInt(localStorage.getItem('height')) == 10) {
            container_arrow_right.scaling.y += 0.5;
            textContainer.position.y += 0.5;
        }
    }
    if (flag > 2.5) {
        container_arrow_right.scaling.y -= 0.02 * flag
        textContainer.position.y -= 0.02 * flag
    }
    // Add meshes to disposal list
    prevMeshesforDisposalRight.push(arrowLine3, arrowLine4, arrowhead3, arrowhead4, textRect, container_arrow_right, textContainer);
    if (localStorage.getItem("rightAwning") == 'false') {
        arrowLine3.isVisible = false;
        arrowLine4.isVisible = false;
        arrowhead3.isVisible = false;
        arrowhead4.isVisible = false;
        textRect.isVisible = false;
    }

    return [arrowLine3, arrowLine4, arrowhead3, arrowhead4, textRect, container_arrow_right, textContainer];
}

var prevDepthArrowsForDisposalRight = [];
//var positionLeft = new Vector3(1, 0.1, 0);
export const createAwningDepthMeasurementsRight = (depth, scene) => {

    // Dispose of previous meshes
    if (Array.isArray(prevDepthArrowsForDisposalRight) && prevDepthArrowsForDisposalRight.length > 0) {
        while (prevDepthArrowsForDisposalRight.length > 0) {
            const mesh = prevDepthArrowsForDisposalRight.pop();
            if (mesh) {
                mesh.dispose();
            }
        }
    }

    // Create arrow lines representing the width of the mesh
    var width = 2.1; // Width of the arrow lines
    var startPoint = new Vector3(0, 0, 0);
    var endPoint1 = new Vector3(0, 0, -width); // Endpoint for the first arrow line
    var endPoint2 = new Vector3(0, 0, width); // Endpoint for the second arrow line

    // Create the arrow lines
    var arrowLine1 = MeshBuilder.CreateTube("arrowLine1", { path: [startPoint, endPoint1], radius: 0.05 }, scene);
    var arrowLine2 = MeshBuilder.CreateTube("arrowLine2", { path: [startPoint, endPoint2], radius: 0.05 }, scene);


    arrowLine1.rotation = new Vector3(0, 1.5708, 0);
    arrowLine2.rotation = new Vector3(0, 1.5708, 0);
    // Create arrowhead meshes
    var arrowhead1 = MeshBuilder.CreateCylinder("arrowhead1", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);
    var arrowhead2 = MeshBuilder.CreateCylinder("arrowhead2", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);


    // Position arrowhead meshes at the ends of arrow lines
    arrowhead1.position = endPoint1.add(new Vector3(-2.3, 0, width)); // Adjust position as needed
    arrowhead2.position = endPoint2.add(new Vector3(2.3, 0, -width)); // Adjust position as needed

    // Rotate arrowhead meshes to align with the direction of the arrow lines
    arrowhead1.rotationQuaternion = Quaternion.RotationAxis(Axis.Z, Math.PI / 2); // Adjust rotation as needed
    arrowhead2.rotationQuaternion = Quaternion.RotationAxis(Axis.Z, -Math.PI / 2); // Adjust rotation as needed

    // Color arrow lines and arrowhead meshes
    arrowLine1.material = new StandardMaterial("arrowLineMat1", scene);
    arrowLine1.material.diffuseColor = new Color3(1, 1, 1); // color assignment
    arrowLine2.material = new StandardMaterial("arrowLineMat2", scene);
    arrowLine2.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead1.material = new StandardMaterial("arrowheadMat1", scene);
    arrowhead1.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead2.material = new StandardMaterial("arrowheadMat2", scene);
    arrowhead2.material.diffuseColor = new Color3(1, 1, 1);

    arrowLine1.position.z += 3;
    arrowLine2.position.z += 3;
    arrowhead1.position.z += 3;
    arrowhead2.position.z += 3;

    var containerDepthArrowLeft = new Mesh("container_depth_arrow_right", scene);
    arrowLine1.setParent(containerDepthArrowLeft);
    arrowLine2.setParent(containerDepthArrowLeft);
    arrowhead1.setParent(containerDepthArrowLeft);
    arrowhead2.setParent(containerDepthArrowLeft);

    // Create text rectangle
    var textRect = MeshBuilder.CreateGround("textrect", { width: 1, height: 0.6 }, scene);
    //var midpointY = (positionLeft.y + 2.2) / 2;

    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) != 0) {
        if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) >= 0) {

            containerDepthArrowLeft.position.x = -3.8 + (-(parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))))
            containerDepthArrowLeft.scaling.x = 0.5
            textRect.position.x = -3.7 + (-(parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))));
            textRect.position.y = 0.05;
            textRect.position.z = 3.6;
            textRect.rotation = new Vector3(0, 3.14159, 0);
        } else {
            containerDepthArrowLeft.position.x = -3.8
            containerDepthArrowLeft.scaling.x = 0.5
            textRect.position.x = -3.7;
            textRect.position.y = 0.05;
            textRect.position.z = 3.6;
            textRect.rotation = new Vector3(0, 3.14159, 0);
        }
    } else {
        containerDepthArrowLeft.position.x = -3.8
        containerDepthArrowLeft.scaling.x = 0.5
        textRect.position.x = -3.7;
        textRect.position.y = 0.05;
        textRect.position.z = 3.6;
        textRect.rotation = new Vector3(0, 3.14159, 0);
    }
    // Create and set the dynamic texture
    var materialRect = new StandardMaterial("Material", scene);
    var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, scene, false, Texture.TRILINEAR_SAMPLINGMODE);
    var textureContext = textureRect.getContext();
    textureContext.clearRect(0, 0, textureRect.getSize().width, textureRect.getSize().height);
    var font = "bold 150px monospace";
    textureRect.drawText(depth + 'm', 100, 170, font, "white", "transparent");
    textureRect.hasAlpha = true;
    materialRect.emissiveTexture = textureRect;
    materialRect.diffuseColor = new Color3(1, 1, 1);
    materialRect.opacityTexture = textureRect;
    materialRect.backFaceCulling = false;
    textRect.material = materialRect;

    // Set text rectangle parent directly to the scene or another parent to prevent scaling
    var textContainer = new Mesh("textContainer", scene);
    textRect.parent = textContainer;
    containerDepthArrowLeft.position.z += frontBayOffsetZ;
    textContainer.position.z += frontBayOffsetZ;

    prevDepthArrowsForDisposalRight.push(arrowLine1, arrowLine2, arrowhead1, arrowhead2, textRect);

    if (localStorage.getItem("rightAwning") == 'false') {
        arrowLine1.isVisible = false;
        arrowLine2.isVisible = false;
        arrowhead1.isVisible = false;
        arrowhead2.isVisible = false;
        textRect.isVisible = false;
    }
    if (depth == 1) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(1.2, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.05;
        //containerDepthArrowLeft.position.x -= 1.2;
        textContainer.position.x = 1.1;
        sessionStorage.setItem("depthRightArrowPos_", 1.1)
    } else if (depth == 2) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(1.2, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.1;
        // containerDepthArrowLeft.position.x -= 1.0;
        textContainer.position.x = 0.9;
        sessionStorage.setItem("depthRightArrowPos_", 0.9)
    } else if (depth == 3) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(1.0, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.15;
        // containerDepthArrowLeft.position.x -= 0.85;
        textContainer.position.x = 0.75;
        sessionStorage.setItem("depthRightArrowPos_", 0.75)
    } else if (depth == 4) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(1.0, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.20;
        // containerDepthArrowLeft.position.x -= 0.70;
        textContainer.position.x = 0.55;
        sessionStorage.setItem("depthRightArrowPos_", 0.55)
    } else if (depth == 5) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(0.8, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.25;
        // containerDepthArrowLeft.position.x -= 0.60;
        textContainer.position.x = 0.45;
        sessionStorage.setItem("depthRightArrowPos_", 0.45)
    } else if (depth == 6) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(0.8, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.30;
        // containerDepthArrowLeft.position.x -= 0.50;
        textContainer.position.x = 0.35;
        sessionStorage.setItem("depthRightArrowPos_", 0.35)
    } else if (depth == 7) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(0.6, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.35;
        // containerDepthArrowLeft.position.x -= 0.40;
        textContainer.position.x = 0.25;
        sessionStorage.setItem("depthRightArrowPos_", 0.25)
    } else if (depth == 8) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(0.6, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.40;
        // containerDepthArrowLeft.position.x -= 0.30;
        textContainer.position.x = 0.15;
        sessionStorage.setItem("depthRightArrowPos_", 0.15)
    } else if (depth == 9) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(0.4, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.45;
        // containerDepthArrowLeft.position.x -= 0.20;
        textContainer.position.x = 0.05;
        sessionStorage.setItem("depthRightArrowPos_", 0.05)
    } else if (depth == 11) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(0.4, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.55;
        // containerDepthArrowLeft.position.x -= 0;
        textContainer.position.x = -0.15;
        sessionStorage.setItem("depthRightArrowPos_", -0.15)
    } else if (depth == 12) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(0.2, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.60;
        // containerDepthArrowLeft.position.x += 0.10;
        textContainer.position.x = -0.25;
        sessionStorage.setItem("depthRightArrowPos_", -0.25)
    } else if (depth == 13) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-0.4, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.65;
        // containerDepthArrowLeft.position.x += 0.20;
        textContainer.position.x = -0.35;
        sessionStorage.setItem("depthRightArrowPos_", -0.35)
    } else if (depth == 14) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-0.6, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.70;
        // containerDepthArrowLeft.position.x += 0.30;
        textContainer.position.x = -0.45;
        sessionStorage.setItem("depthRightArrowPos_", -0.45)
    } else if (depth == 15) {
        containerDepthArrowLeft.setPivotPoint(new Vector3(-1, 0, 0));
        containerDepthArrowLeft.scaling.x = 0.75;
        // containerDepthArrowLeft.position.x+= 0.40;
        textContainer.position.x = -0.55;
        sessionStorage.setItem("depthRightArrowPos_", -0.55)
    }


    return [arrowLine1, arrowLine2, arrowhead1, arrowhead2, textRect, containerDepthArrowLeft, textContainer];

}

//<=================== FrontBay Creation Logic =====================>//
var topCenter = 0.55;
var topCenterAwningsLeft = 0.23;
var topCenterAwningsRight = 0.23;
//changes
export const createFrontBay = function (z, distance, scene, degree, awningDegree) {
    var frontBayMeshes = [];
    var leftRoof = [];
    var rightRoof = [];
    var leftSide = [];
    var rightSide = [];
    var frontSide = [];
    var leftArrows = [];
    var frontArrows = [];
    var heightArrows = [];
    var backSide = [];
    var backTop = [];

    // ============================================== Text in the Air =============================================
    // Create a plane
    // var plane = getTextPlane(scene);



    // ============================================================================================================

    //front side
    const front_container_columns = new BABYLON.Mesh("container_columns_center", scene);

    
    var colfront1 = structure.ubColumn(scene, material);
    colfront1.position.y = 1.2;
    colfront1.position.x = -2.35;
    colfront1.position.z = 2.5;
    colfront1.parent = front_container_columns;
    colfront1.id = "colfront1";
    colfront1.name = 'colfront1';

    var colfront2 = structure.ubColumn(scene, material);
    colfront2.position.y = 1.2;
    colfront2.position.x = 2.35;
    colfront2.position.z = 2.5;
    colfront2.parent = front_container_columns;
    colfront2.id = "colfront2";
    colfront2.name = 'colfront2';

    // const front_container_columns = new BABYLON.Mesh("container_columns", scene);
    // var col1 = structure.ubColumn(scene, material);
    // col1.position.y = 1.2;
    // col1.position.x = -2.35;
    // col1.position.z = 2.5;
    // col1.parent = front_container_columns;
    // col1.name = 'col1';
    // col1.id = "col1"; // Naming convention for col1
    // console.log("c0l1 name ", col1.name);  // Output: "col1"
    // console.log("c0l1 id", col1.id);    // Output: "box_merged"


    // var col2 = structure.ubColumn();
    // col2.position.y = 1.2;
    // col2.position.x = 2.35;
    // col2.position.z = 2.5;
    // frontBayMeshes.push(col2);


    if (localStorage.getItem("rafter") === "truss") {
        var rafterFront = structure.truss();
        rafterFront.position.y = 2.45;
    } else {
        var rafterFront = structure.rafter();
        rafterFront.position.y = 2.38;
    }
    rafterFront.position.z = 2.5
    rafterFront.position.x = 1.15
    rafterFront.rotation = new Vector3(0, 0, 1.48353);
    leftRoof.push(rafterFront);


    if (localStorage.getItem("rafter") === "truss") {
        var rafterFront1 = structure.truss();
        rafterFront1.position.y = 2.45;
    } else {
        var rafterFront1 = structure.rafter();
        rafterFront1.position.y = 2.38;
    }
    rafterFront1.position.z = 2.5
    rafterFront1.position.x = -1.15
    rafterFront1.rotation = new Vector3(0, 3.14159, 1.48353);
    rightRoof.push(rafterFront1);

    const fLtruss = structure.gurder();
    // Set properties
    fLtruss.name = 'fltruss';
    fLtruss.id = 'fltruss';
    fLtruss.position = new Vector3(2.2, 2.4, 0);
    fLtruss.rotation = new Vector3(0, Math.PI / 2, Math.PI / 2);
    fLtruss.isVisible = false;
     console.log('frontltruss', fLtruss);


    const AfLtruss = structure.gurder();
    // Set properties
    AfLtruss.name = 'afltruss';
    AfLtruss.id = 'afltruss';
    AfLtruss.position = new Vector3(4.9, 2.12, 0);
    AfLtruss.rotation = new Vector3(0, Math.PI / 2, Math.PI / 2);
    AfLtruss.isVisible = false;
     console.log('frontafltruss', AfLtruss);




    const fRtruss = structure.gurder();
    fRtruss.position = new Vector3(-2.3, 2.4, 0);
    fRtruss.rotation = new Vector3(0, -Math.PI / 2, Math.PI / 2);
    fRtruss.name = 'frtruss'
    fRtruss.id = 'frtruss'
     console.log('frontrtruss', fRtruss)
    fRtruss.isVisible = false;


     const AfRtruss = structure.gurder();
    AfRtruss.position = new Vector3(-4.9, 2.12, 0);
    AfRtruss.rotation = new Vector3(0, -Math.PI / 2, Math.PI / 2);
    AfRtruss.name = 'afrtruss'
    AfRtruss.id = 'afrtruss'
     console.log('frontartruss', AfRtruss)
    AfRtruss.isVisible = false;


    

    //back side
    // var col3 = structure.ubColumn();;
    // col3.position.y = 1.2;
    // col3.position.x = -2.35;
    // col3.position.z = -2.5;
    // frontBayMeshes.push(col3);

    // var col4 = structure.ubColumn();
    // col4.position.y = 1.2;
    // col4.position.x = 2.35;
    // col4.position.z = -2.5;
    // frontBayMeshes.push(col4);

    // var rafterBack = structure.rafter();
    // rafterBack.position.y = 2.38;
    // rafterBack.position.z = 2.5
    // rafterBack.position.x= 1.15
    // rafterBack.rotation = new Vector3(0,0,1.48353);
    // leftRoof.push(rafterBack);

    // var rafterBack1 = structure.rafter();
    // rafterBack1.position.y = 2.38;
    // rafterBack1.position.z = 2.5
    // rafterBack1.position.x= -1.15
    // rafterBack1.rotation = new Vector3(0,3.14159,1.48353);
    // rightRoof.push(rafterBack1);

    //gritLeft
    var gritBox = structure.createPurlin();
    gritBox.rotation = new Vector3(0, 0, 3.14159)
    gritBox.position.y = 1
    gritBox.position.x = 2.47
    leftSide.push(gritBox);

    var gritBox1 = structure.createPurlin();;
    gritBox1.rotation = new Vector3(0, 0, 3.14159)
    gritBox1.position.y = 1.43
    gritBox1.position.x = 2.47
    leftSide.push(gritBox1);

    var gritBox2 = structure.createPurlin();;
    gritBox2.rotation = new Vector3(0, 0, 3.14159)
    gritBox2.position.y = 0.5
    gritBox2.position.x = 2.47
    leftSide.push(gritBox2);

    var gritBox3 = structure.createPurlin();;
    gritBox3.rotation = new Vector3(0, 0, 3.14159)
    gritBox3.position.y = 1.88
    gritBox3.position.x = 2.47
    leftSide.push(gritBox3);

    //gritRight
    var gritBoxRight = structure.createPurlin();;
    gritBoxRight.rotation = new Vector3(0, 0, 3.14159)
    gritBoxRight.position.y = 1
    gritBoxRight.position.x = - 2.47
    rightSide.push(gritBoxRight);

    var gritBoxRight1 = structure.createPurlin();;
    gritBoxRight1.rotation = new Vector3(0, 0, 3.14159)
    gritBoxRight1.position.y = 1.43
    gritBoxRight1.position.x = - 2.47
    rightSide.push(gritBoxRight1);

    var gritBoxRight2 = structure.createPurlin();;
    gritBoxRight2.rotation = new Vector3(0, 0, 3.14159)
    gritBoxRight2.position.y = 0.5
    gritBoxRight2.position.x = - 2.47
    rightSide.push(gritBoxRight2);

    var gritBoxRight3 = structure.createPurlin();;
    gritBoxRight3.rotation = new Vector3(0, 0, 3.14159)
    gritBoxRight3.position.y = 1.88
    gritBoxRight3.position.x = - 2.47
    rightSide.push(gritBoxRight3);

    //roof purlins left
    var roofPurlinsLeft5 = structure.createPurlin();;
    roofPurlinsLeft5.position.y = 2.4;
    roofPurlinsLeft5.position.x = 2.36;
    roofPurlinsLeft5.rotation = new Vector3(0, 0, 4.53786);
    leftRoof.push(roofPurlinsLeft5);

    var roofPurlinsLeft = structure.createPurlin();;
    roofPurlinsLeft.position.y = 2.43;
    roofPurlinsLeft.position.x = 2;
    roofPurlinsLeft.rotation = new Vector3(0, 0, 4.53786);
    leftRoof.push(roofPurlinsLeft);

    var roofPurlinsLeft1 = structure.createPurlin();;
    roofPurlinsLeft1.rotation = new Vector3(0, 0, 4.53786);
    roofPurlinsLeft1.position.y = 2.48;
    roofPurlinsLeft1.position.x = 1.5;
    leftRoof.push(roofPurlinsLeft1);

    var roofPurlinsLeft2 = structure.createPurlin();;
    roofPurlinsLeft2.rotation = new Vector3(0, 0, 4.53786);
    roofPurlinsLeft2.position.y = 2.52;
    roofPurlinsLeft2.position.x = 1;
    leftRoof.push(roofPurlinsLeft2);

    var roofPurlinsLeft3 = structure.createPurlin();;
    roofPurlinsLeft3.rotation = new Vector3(0, 0, 4.53786);
    roofPurlinsLeft3.position.y = 2.57;
    roofPurlinsLeft3.position.x = 0.5;
    leftRoof.push(roofPurlinsLeft3);

    var roofPurlinsLeft4 = structure.createPurlin();;
    roofPurlinsLeft4.rotation = new Vector3(0, 0, 4.53786);
    roofPurlinsLeft4.position.y = 2.6;
    roofPurlinsLeft4.position.x = 0.08;
    leftRoof.push(roofPurlinsLeft4);

    //roof Purlins right
    var roofPurlinsRight5 = structure.createPurlin();;
    roofPurlinsRight5.rotation = new Vector3(0, 0, 1.5708);
    roofPurlinsRight5.position.y = 2.4
    roofPurlinsRight5.position.x = - 2.38
    rightRoof.push(roofPurlinsRight5);

    var roofPurlinsRight = structure.createPurlin();;
    roofPurlinsRight.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight.position.y = 2.43
    roofPurlinsRight.position.x = - 2
    rightRoof.push(roofPurlinsRight);


    var roofPurlinsRight1 = structure.createPurlin();;
    roofPurlinsRight1.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight1.position.y = 2.48
    roofPurlinsRight1.position.x = -1.5
    rightRoof.push(roofPurlinsRight1);

    var roofPurlinsRight2 = structure.createPurlin();;
    roofPurlinsRight2.rotation = new Vector3(0, 0, 1.5708);
    roofPurlinsRight2.position.y = 2.52
    roofPurlinsRight2.position.x = -1
    rightRoof.push(roofPurlinsRight2);

    var roofPurlinsRight3 = structure.createPurlin();;
    roofPurlinsRight3.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight3.position.y = 2.57
    roofPurlinsRight3.position.x = -0.5
    rightRoof.push(roofPurlinsRight3);

    var roofPurlinsRight4 = structure.createPurlin();;
    roofPurlinsRight4.rotation = new Vector3(0, 0, 1.5708);
    roofPurlinsRight4.position.y = 2.6
    roofPurlinsRight4.position.x = -0.08
    rightRoof.push(roofPurlinsRight4);

    var frontgrit = structure.createPurlin();;
    frontgrit.rotation = new Vector3(0, 11, 9.4)
    frontgrit.position.y = 1.88
    frontgrit.position.x = 0
    frontgrit.position.z = 2.62
    frontgrit.scaling.z = 0.98
    frontSide.push(frontgrit);

    var frontgrit1 = structure.createPurlin();;
    frontgrit1.rotation = new Vector3(0, 11, 9.4)
    frontgrit1.position.y = 1.43
    frontgrit1.position.x = 0
    frontgrit1.position.z = 2.62
    frontgrit1.scaling.z = 0.98
    frontSide.push(frontgrit1);

    var frontgrit2 = structure.createPurlin();;
    frontgrit2.rotation = new Vector3(0, 11, 9.4)
    frontgrit2.position.y = 1.00
    frontgrit2.position.x = 0
    frontgrit2.position.z = 2.62;
    frontgrit2.scaling.z = 0.98
    frontSide.push(frontgrit2);

    var frontgrit3 = structure.createPurlin();;
    frontgrit3.rotation = new Vector3(0, 11, 9.4)
    frontgrit3.position.y = 0.5
    frontgrit3.position.x = 0
    frontgrit3.position.z = 2.62
    frontgrit3.scaling.z = 0.98
    frontSide.push(frontgrit3);
    //front cover
    // Define the vertices of the triangle
    if (degree != null) {
        var pitchInfo = pitch[degree];
        topCenter = pitchInfo.topCenter;
    }
    var positions = [
        2.5, 0.1, 0,   // Vertex 1: Bottom left corner
        -2.5, 0.1, 0,   // Vertex 2: Bottom right corner
        0, topCenter, 0  // Vertex 3: Top center corner
    ];

    // Define the indices that make up the triangle
    var indices = [
        0, 1, 2  // Indices to form a triangle with the defined vertices
    ];

    // Create a VertexData object
    var vertexData = new VertexData();

    // Assign the positions and indices to the VertexData object
    vertexData.positions = positions;
    vertexData.indices = indices;

    // Apply the VertexData to a mesh
    var triangle = new Mesh("triangle", scene);
    vertexData.applyToMesh(triangle);

    // Create a standard material for the triangle
    var material = new StandardMaterial("triangleMaterial", scene);
    // material.diffuseColor = new Color3(1, 0, 0); // Red color for the triangle
    material.backFaceCulling = false; // Make the material double-sided
    triangle.material = material;
    triangle.position.y = 2.35;
    triangle.position.z = 2.675;
    triangle.scaling.z = 10;

    var flatFront = MeshBuilder.CreateBox("box", { width: 5, height: 2.9, depth: 0.01 }, scene);
    flatFront.position.y = 1;
    flatFront.position.z = 2.67;
    var frontTop = [];
    frontTop.push(triangle);
    frontSide.push(flatFront);

    var backgrit = structure.createPurlin();;
    backgrit.rotation = new Vector3(0, 1.5708, 3.14159)
    backgrit.position.y = 1.88
    backgrit.position.x = 0
    backgrit.position.z = -2.62
    backgrit.scaling.z = 0.98
    backSide.push(backgrit);

    var backgrit1 = structure.createPurlin();;
    backgrit1.rotation = new Vector3(0, 1.5708, 3.14159)
    backgrit1.position.y = 1.43
    backgrit1.position.x = 0
    backgrit1.position.z = -2.62
    backgrit1.scaling.z = 0.98
    backSide.push(backgrit1);

    var backgrit2 = structure.createPurlin();;
    backgrit2.rotation = new Vector3(0, 1.5708, 3.14159)
    backgrit2.position.y = 1.00
    backgrit2.position.x = 0
    backgrit2.position.z = -2.62;
    backgrit2.scaling.z = 0.98
    backSide.push(backgrit2);

    var backgrit3 = structure.createPurlin();;
    backgrit3.rotation = new Vector3(0, 1.5708, 3.14159)
    backgrit3.position.y = 0.5
    backgrit3.position.x = 0
    backgrit3.position.z = -2.62
    backgrit3.scaling.z = 0.98
    backSide.push(backgrit3);

    //backt cover
    if (degree != null) {
        var pitchInfo = pitch[degree];
        topCenter = pitchInfo.topCenter;
    }
    // Define the vertices of the triangle
    var positions = [
        2.5, 0.1, 0,   // Vertex 1: Bottom left corner
        -2.5, 0.1, 0,   // Vertex 2: Bottom right corner
        0, topCenter, 0  // Vertex 3: Top center corner
    ];

    // Define the indices that make up the triangle
    var indices = [
        0, 1, 2  // Indices to form a triangle with the defined vertices
    ];

    // Create a VertexData object
    var vertexData = new VertexData();

    // Assign the positions and indices to the VertexData object
    vertexData.positions = positions;
    vertexData.indices = indices;

    // Apply the VertexData to a mesh
    var triangle = new Mesh("triangle", scene);
    vertexData.applyToMesh(triangle);

    // Create a standard material for the triangle
    var material = new StandardMaterial("triangleMaterial", scene);
    material.backFaceCulling = false; // Make the material double-sided
    material.diffuseColor = new Color3(0.55, 0.27, 0.07);
    triangle.material = material;
    triangle.position.y = 2.35;
    triangle.position.z = -2.675;
    // triangle.scaling.z = 10;

    var box = MeshBuilder.CreateBox("box", { width: 5, height: 2.9, depth: 0.01 }, scene);
    box.position.y = 1;
    box.position.z = -2.67;
    backTop.push(triangle);
    backSide.push(box);

    //roof cover
    var roofLeft = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 5.22 }, scene);
    roofLeft.position.y = 2.55;
    roofLeft.position.x = 1.25;
    roofLeft.position.z = 0.06;
    roofLeft.rotation = new Vector3(0, 0, -0.0872665);
    leftRoof.push(roofLeft);

    var roofRight = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 5.22 }, scene);
    roofRight.position.y = 2.55;
    roofRight.position.x = -1.25;
    roofRight.position.z = 0.06;
    roofRight.rotation = new Vector3(0, 0, 0.0872665);
    rightRoof.push(roofRight);

    //walls
    var wallLeft = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.45, depth: 5.22 }, scene);
    wallLeft.position.y = 1.2;
    wallLeft.position.x = 2.51
    wallLeft.position.z = 0.06;
    wallLeft.rotation = new Vector3(0, 0, 29.85)
    leftSide.push(wallLeft);

    var wallRight = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.45, depth: 5.22 }, scene);
    wallRight.position.y = 1.2;
    wallRight.position.x = - 2.51
    wallRight.position.z = 0.06;
    wallRight.rotation = new Vector3(0, 0, 29.85)
    rightSide.push(wallRight);

    var leftAwning = [];
    var rightAwning = [];


    //Lean to left
    var leanToLeftWalls = [];
    var leanToLeftRoofs = [];
    var leanToRightWalls = [];
    var leanToRightRoofs = [];
    var leantoleftcols = [];
    var leantorightcols = [];

    var leanToLeftCol3 = structure.ubColumn();
    leanToLeftCol3.position.y = 1;
    leanToLeftCol3.position.x = 4.9;
    leanToLeftCol3.position.z = 2.5;
    leanToLeftCol3.scaling.y = 0.98;
    leantoleftcols.push(leanToLeftCol3);

    //    var leanToLeftCol4 = structure.ubColumn();
    //    leanToLeftCol4.position.y = 1;
    //    leanToLeftCol4.position.x = 4.9;
    //    leanToLeftCol4.position.z = -2.5;
    //    leanToLeftCol4.scaling.y = 0.98;
    //    leantoleftcols.push(leanToLeftCol4);


    if (localStorage.getItem("rafter") === "truss") {
        var leanToLeftRafter = structure.truss();
    } else {
        var leanToLeftRafter = structure.rafter();
    }
    leanToLeftRafter.position.y = 2.15;
    leanToLeftRafter.position.z = 2.5
    leanToLeftRafter.position.x = 3.7
    leanToLeftRafter.rotation = new Vector3(0, 0, 1.48353);
    leanToLeftRafter.scaling.y = 1
    leanToLeftRoofs.push(leanToLeftRafter)

    //    var leanToLeftRafter1 = structure.rafter();
    //    leanToLeftRafter1.position.y = 2.15;
    //    leanToLeftRafter1.position.z = -2.5
    //    leanToLeftRafter1.position.x= 3.7
    //    leanToLeftRafter1.rotation = new Vector3(0,0,1.48353);
    //    leanToLeftRafter1.scaling.y = 1
    //    leanToLeftRoofs.push(leanToLeftRafter1);

    var leanToLeftPurlin = structure.createPurlin();;
    leanToLeftPurlin.position.y = 2.38;
    leanToLeftPurlin.position.x = 2.56;
    leanToLeftPurlin.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin);

    var leanToLeftPurlin1 = structure.createPurlin();;
    leanToLeftPurlin1.position.y = 2.33;
    leanToLeftPurlin1.position.x = 3.06;
    leanToLeftPurlin1.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin1);

    var leanToLeftPurlin2 = structure.createPurlin();;
    leanToLeftPurlin2.position.y = 2.28;
    leanToLeftPurlin2.position.x = 3.56;
    leanToLeftPurlin2.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin2);

    var leanToLeftPurlin3 = structure.createPurlin();;
    leanToLeftPurlin3.position.y = 2.25;
    leanToLeftPurlin3.position.x = 4.06;
    leanToLeftPurlin3.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin3);

    var leanToLeftPurlin4 = structure.createPurlin();;
    leanToLeftPurlin4.position.y = 2.20;
    leanToLeftPurlin4.position.x = 4.56;
    leanToLeftPurlin4.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin4);

    var leanToLeftPurlin5 = structure.createPurlin();;
    leanToLeftPurlin5.position.y = 2.16;
    leanToLeftPurlin5.position.x = 4.90;
    leanToLeftPurlin5.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin5);

    var leanToLeftRoof = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 5.35 }, scene);
    leanToLeftRoof.position.y = 2.33;
    leanToLeftRoof.position.x = 3.75;
    leanToLeftRoof.rotation = new Vector3(0, 0, -0.0872665);
    leanToLeftRoofs.push(leanToLeftRoof);

    var leanToLeftwall = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.2, depth: 5.35 }, scene);
    leanToLeftwall.position.y = 1.1;
    leanToLeftwall.position.x = 5;
    leanToLeftwall.rotation = new Vector3(0, 0, 29.85)
    leanToLeftWalls.push(leanToLeftwall);

    var leanToLeftPartWall = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 2.2 }, scene);
    leanToLeftPartWall.position.y = 1.1;
    leanToLeftPartWall.position.x = 3.75;
    leanToLeftPartWall.position.z = 2.66;
    leanToLeftPartWall.rotation = new Vector3(1.5708, 0, 0)

    var leanToLeftPartWallPurlins = [];
    var leanToLeftPartWallPurlin = structure.createPurlin();
    leanToLeftPartWallPurlin.rotation = new Vector3(0, 11, 9.4)
    leanToLeftPartWallPurlin.position.y = 1.88;
    leanToLeftPartWallPurlin.scaling.z = 0.49;
    leanToLeftPartWallPurlin.position.z = 2.6;
    leanToLeftPartWallPurlin.position.x = 3.75;
    leanToLeftPartWallPurlins.push(leanToLeftPartWallPurlin);
    var leanToLeftPartWallPurlin1 = structure.createPurlin();
    leanToLeftPartWallPurlin1.rotation = new Vector3(0, 11, 9.4)
    leanToLeftPartWallPurlin1.position.y = 1.43;
    leanToLeftPartWallPurlin1.scaling.z = 0.49;
    leanToLeftPartWallPurlin1.position.z = 2.6;
    leanToLeftPartWallPurlin1.position.x = 3.75;
    leanToLeftPartWallPurlins.push(leanToLeftPartWallPurlin1);
    var leanToLeftPartWallPurlin2 = structure.createPurlin();
    leanToLeftPartWallPurlin2.position.y = 1.00;
    leanToLeftPartWallPurlin2.scaling.z = 0.49;
    leanToLeftPartWallPurlin2.position.z = 2.6;
    leanToLeftPartWallPurlin2.position.x = 3.75;
    leanToLeftPartWallPurlin2.rotation = new Vector3(0, 11, 9.4)
    leanToLeftPartWallPurlins.push(leanToLeftPartWallPurlin2);
    var leanToLeftPartWallPurlin3 = structure.createPurlin();
    leanToLeftPartWallPurlin3.position.y = 0.5;
    leanToLeftPartWallPurlin3.scaling.z = 0.49;
    leanToLeftPartWallPurlin3.position.z = 2.6;
    leanToLeftPartWallPurlin3.position.x = 3.75;
    leanToLeftPartWallPurlin3.rotation = new Vector3(0, 11, 9.4)
    leanToLeftPartWallPurlins.push(leanToLeftPartWallPurlin3);

    if (awningDegree != null) {
        var pitchInfo = awningPitch[localStorage.getItem("leftAwningPitch")];
        topCenterAwningsLeft = pitchInfo.topCenterLeft;
    }
    // Define the vertices of the triangle
    var positions = [
        -1, 0, 0,   // Vertex 1: Bottom left corner
        1.5, 0, 0,    // Vertex 2: Bottom right corner
        -1, topCenterAwningsLeft, 0    // Vertex 3: Top left corner
    ];

    // Define the indices that make up the triangle
    var indices = [
        0, 1, 2  // Indices to form a triangle with the defined vertices
    ];

    // Create a VertexData object
    var vertexData = new VertexData();

    // Assign the positions and indices to the VertexData object
    vertexData.positions = positions;
    vertexData.indices = indices;

    // Apply the VertexData to a mesh
    var leftAwningTriangle = new Mesh("triangle", scene);
    vertexData.applyToMesh(leftAwningTriangle);

    // Create a standard material for the triangle
    var material = new StandardMaterial("triangleMaterial", scene);
    material.backFaceCulling = false; // Make the material double-sided
    leftAwningTriangle.material = material;
    leftAwningTriangle.position.z = 2.67;
    leftAwningTriangle.position.x = 3.4;
    leftAwningTriangle.position.y = 2.2;

    //Lean To right

    var leanToRightCol3 = structure.ubColumn();
    leanToRightCol3.position.y = 1;
    leanToRightCol3.position.x = -4.9;
    leanToRightCol3.position.z = 2.5;
    leanToRightCol3.scaling.y = 0.98;
    leantorightcols.push(leanToRightCol3);

    // var leanToRightCol4 = structure.ubColumn();
    // leanToRightCol4.position.y = 1;
    // leanToRightCol4.position.x = -4.9;
    // leanToRightCol4.position.z = -2.5;
    // leanToRightCol4.scaling.y = 0.98;
    // leantorightcols.push(leanToRightCol4);

    var leanToRightPurlin = structure.createPurlin();;
    leanToRightPurlin.position.y = 2.38;
    leanToRightPurlin.position.x = -2.56;
    leanToRightPurlin.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin);

    var leanToRightPurlin1 = structure.createPurlin();;
    leanToRightPurlin1.position.y = 2.33;
    leanToRightPurlin1.position.x = -3.06;
    leanToRightPurlin1.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin1);

    var leanToRightPurlin2 = structure.createPurlin();;
    leanToRightPurlin2.position.y = 2.28;
    leanToRightPurlin2.position.x = -3.56;
    leanToRightPurlin2.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin2);

    var leanToRightPurlin3 = structure.createPurlin();;
    leanToRightPurlin3.position.y = 2.25;
    leanToRightPurlin3.position.x = -4.06;
    leanToRightPurlin3.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin3);

    var leanToRightPurlin4 = structure.createPurlin();;
    leanToRightPurlin4.position.y = 2.20;
    leanToRightPurlin4.position.x = -4.56;
    leanToRightPurlin4.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin4);

    var leanToRightPurlin5 = structure.createPurlin();;
    leanToRightPurlin5.position.y = 2.16;
    leanToRightPurlin5.position.x = -4.90;
    leanToRightPurlin5.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin5);


    if (localStorage.getItem("rafter") === "truss") {
        var leanToRightRafter = structure.truss();
    } else {
        var leanToRightRafter = structure.rafter();
    }
    leanToRightRafter.position.y = 2.15;
    leanToRightRafter.position.z = 2.5
    leanToRightRafter.position.x = - 3.7
    leanToRightRafter.rotation = new Vector3(0, 3.14159, 1.48353);
    leanToRightRafter.scaling.y = 1
    leanToRightRoofs.push(leanToRightRafter)

    // var leanToRightRafter1 = structure.rafter();
    // leanToRightRafter1.position.y = 2.15;
    // leanToRightRafter1.position.z = -2.5
    // leanToRightRafter1.position.x= - 3.7
    // leanToRightRafter1.rotation = new Vector3(0,3.14159,1.48353);
    // leanToRightRafter1.scaling.y = 1
    // leanToRightRoofs.push(leanToRightRafter1);

    var leanToRightRoof = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 5.35 }, scene);
    leanToRightRoof.position.y = 2.33;
    leanToRightRoof.position.x = -3.75;
    leanToRightRoof.rotation = new Vector3(0, 0, 0.0872665);
    leanToRightRoofs.push(leanToRightRoof);

    var leanToRightWall = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.2, depth: 5.35 }, scene);
    leanToRightWall.position.y = 1.1;
    leanToRightWall.position.x = - 5;
    leanToRightWall.rotation = new Vector3(0, 0, 29.85)
    leanToRightWalls.push(leanToRightWall);

    var leanToRightPartWall = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 2.2 }, scene);
    leanToRightPartWall.position.y = 1.1;
    leanToRightPartWall.position.x = -3.75;
    leanToRightPartWall.position.z = 2.67;
    leanToRightPartWall.rotation = new Vector3(1.5708, 0, 0)

    var leanToRightPartWallPurlins = [];
    var leanToRightPartWallPurlin = structure.createPurlin();
    leanToRightPartWallPurlin.rotation = new Vector3(0, 11, 9.4)
    leanToRightPartWallPurlin.position.y = 1.88;
    leanToRightPartWallPurlin.scaling.z = 0.49;
    leanToRightPartWallPurlin.position.z = 2.6;
    leanToRightPartWallPurlin.position.x = -3.75;
    leanToRightPartWallPurlins.push(leanToRightPartWallPurlin);
    var leanToRightPartWallPurlin1 = structure.createPurlin();
    leanToRightPartWallPurlin1.rotation = new Vector3(0, 11, 9.4)
    leanToRightPartWallPurlin1.position.y = 1.43;
    leanToRightPartWallPurlin1.scaling.z = 0.49;
    leanToRightPartWallPurlin1.position.z = 2.6;
    leanToRightPartWallPurlin1.position.x = -3.75;
    leanToRightPartWallPurlins.push(leanToRightPartWallPurlin1);
    var leanToRightPartWallPurlin2 = structure.createPurlin();
    leanToRightPartWallPurlin2.position.y = 1.00;
    leanToRightPartWallPurlin2.scaling.z = 0.49;
    leanToRightPartWallPurlin2.position.z = 2.6;
    leanToRightPartWallPurlin2.position.x = -3.75;
    leanToRightPartWallPurlin2.rotation = new Vector3(0, 11, 9.4)
    leanToRightPartWallPurlins.push(leanToRightPartWallPurlin2);
    var leanToRightPartWallPurlin3 = structure.createPurlin();
    leanToRightPartWallPurlin3.position.y = 0.5;
    leanToRightPartWallPurlin3.scaling.z = 0.49;
    leanToRightPartWallPurlin3.position.z = 2.6;
    leanToRightPartWallPurlin3.position.x = -3.75;
    leanToRightPartWallPurlin3.rotation = new Vector3(0, 11, 9.4)
    leanToRightPartWallPurlins.push(leanToRightPartWallPurlin3);

    if (awningDegree != null) {
        var pitchInfo = awningPitch[localStorage.getItem("rightAwningPitch")];
        topCenterAwningsRight = pitchInfo.topCenterLeft;
    }
    // Define the vertices of the triangle
    var positions = [
        -1, 0, 0,   // Vertex 1: Bottom left corner
        1.5, 0, 0,    // Vertex 2: Bottom right corner
        -1, topCenterAwningsRight, 0    // Vertex 3: Top left corner
    ];

    // Define the indices that make up the triangle
    var indices = [
        0, 1, 2  // Indices to form a triangle with the defined vertices
    ];

    // Create a VertexData object
    var vertexData = new VertexData();

    // Assign the positions and indices to the VertexData object
    vertexData.positions = positions;
    vertexData.indices = indices;

    // Apply the VertexData to a mesh
    var rightAwningTriangle = new Mesh("triangle", scene);
    vertexData.applyToMesh(rightAwningTriangle);

    // Create a standard material for the triangle
    var material = new StandardMaterial("triangleMaterial", scene);
    material.backFaceCulling = false; // Make the material double-sided
    rightAwningTriangle.material = material;
    rightAwningTriangle.position.z = 2.68;
    rightAwningTriangle.position.x = -3.4;
    rightAwningTriangle.position.y = 2.2;
    rightAwningTriangle.rotation = new Vector3(0, 3.14159, 0)
    //create left measurement items
    // Create arrow lines representing the width of the mesh
    var width = 2.15; // Width of the arrow lines
    // var height = 3.15;
    var startPoint = new Vector3(3, 0.1, 0);
    var endPoint1 = new Vector3(3, 0.1, -width); // Endpoint for the first arrow line
    var endPoint2 = new Vector3(3, 0.1, width); // Endpoint for the second arrow line
    // var groundPosition = new Vector3(1, 0.1, 0);
    // Create the arrow lines
    var arrowLine1 = MeshBuilder.CreateTube("arrowLine1", { path: [startPoint, endPoint1], radius: 0.05 }, scene);
    var arrowLine2 = MeshBuilder.CreateTube("arrowLine2", { path: [startPoint, endPoint2], radius: 0.05 }, scene);
    // var arrowLine3 = MeshBuilder.CreateTube("arrowLine3", { 
    //     path: [groundPosition, new Vector3(1, 0.9, 0)], // Start from ground and extend vertically
    //     radius: 0.03 
    // }, scene);
    // var arrowLine4 = MeshBuilder.CreateTube("arrowLine4", { 
    //     path: [new Vector3(1,1.5, 0), new Vector3(1, 2.2, 0)], // Start from ground and extend vertically
    //     radius: 0.03 
    // }, scene);

    // Create arrowhead meshes
    var arrowhead1 = MeshBuilder.CreateCylinder("arrowhead1", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);
    var arrowhead2 = MeshBuilder.CreateCylinder("arrowhead2", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);
    // var arrowhead3 = MeshBuilder.CreateCylinder("arrowhead3", { 
    //     height: 0.2, // Set the height of the arrowhead
    //     diameterTop: 0.2, 
    //     diameterBottom: 0, 
    //     tessellation: 24 
    // }, scene);
    // arrowhead3.position = groundPosition; 
    // var arrowhead4 = MeshBuilder.CreateCylinder("arrowhead4", { 
    //     diameterTop: 0, 
    //     diameterBottom: 0.2, 
    //     height: 0.2, 
    //     tessellation: 24 
    // }, scene);
    // arrowhead4.position = new Vector3(1, 2.2, 0); // Position at the top end of the arrow line


    // Position arrowhead meshes at the ends of arrow lines
    arrowhead1.position = endPoint1;
    arrowhead2.position = endPoint2;
    // arrowLine3.position.z += 3;
    // arrowLine4.position.z += 3;
    // arrowhead3.position.z += 3;
    // arrowhead4.position.z += 3;
    // arrowLine3.position.x += heightarrow_width;
    // arrowhead3.position.x += heightarrow_width;
    // arrowhead4.position.x += heightarrow_width;

    arrowhead1.rotationQuaternion = Quaternion.RotationAxis(Axis.X, -Math.PI / 2); // rotation adjustment - important
    arrowhead2.rotationQuaternion = Quaternion.RotationAxis(Axis.X, Math.PI / 2);

    // Color arrow lines and arrowhead meshes
    arrowLine1.material = new StandardMaterial("arrowLineMat1", scene);
    arrowLine1.material.diffuseColor = new Color3(1, 1, 1); // color assignment
    arrowLine2.material = new StandardMaterial("arrowLineMat2", scene);
    arrowLine2.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead1.material = new StandardMaterial("arrowheadMat1", scene);
    arrowhead1.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead2.material = new StandardMaterial("arrowheadMat2", scene);
    arrowhead2.material.diffuseColor = new Color3(1, 1, 1);
    // arrowLine3.material = new StandardMaterial("arrowLineMat3", scene);
    // arrowLine3.material.diffuseColor = new Color3(0, 0, 0);
    // arrowLine4.material = new StandardMaterial("arrowLineMat4", scene);
    // arrowLine4.material.diffuseColor = new Color3(0, 0, 0);
    // arrowhead3.material = new StandardMaterial("arrowheadMat3", scene);
    // arrowhead3.material.diffuseColor = new Color3(0, 0, 0); 
    // arrowhead4.material = new StandardMaterial("arrowheadMat4", scene);
    // arrowhead4.material.diffuseColor = new Color3(0, 0, 0);
    // var textRect = MeshBuilder.CreateGround("rect", { width: 1.5, height: 1.2 }, scene);
    // textRect.position.x = 4;
    // textRect.position.y = 0.05
    // textRect.rotation = new Vector3(0,-1.5708,0)

    // // Create a material with the background texture
    // var materialRect = new StandardMaterial("Material", scene);
    // var backgroundTexture = new Texture("/textures/ground/ground.jpg", scene);
    // materialRect.diffuseTexture = backgroundTexture;

    // // Create a dynamic texture for drawing text
    // var textureRect = new DynamicTexture("new rect", {width:512, height:256}, scene);   
    // var textureContext = textureRect.getContext();
    // var font = "bold 200px monospace";
    // textureRect.drawText(defaultBaySize, 50, 170, font, "white");

    // // Assign the dynamic texture as an emissive texture to blend with the background
    // materialRect.emissiveTexture = textureRect;
    // materialRect.useEmissiveAsIllumination = true;
    //textRect.material = materialRect;

    leftArrows.push(arrowLine1);
    leftArrows.push(arrowLine2);
    leftArrows.push(arrowhead1);
    leftArrows.push(arrowhead2);
    //leftArrows.push(textRect);
    // heightArrows.push(arrowLine3);
    // heightArrows.push(arrowLine4);
    // heightArrows.push(plane);
    // heightArrows.push(arrowhead3);
    // heightArrows.push(arrowhead4);

    //<===================================== arrows along width =========================================>//

    // Create arrow lines representing the width of the mesh
    var arrowOffsetFront = 3;
    var width = 2.1; // Width of the arrow lines
    var startPoint = new Vector3(0, 0, 0);
    var endPoint1 = new Vector3(0, 0, -width); // Endpoint for the first arrow line
    var endPoint2 = new Vector3(0, 0, width); // Endpoint for the second arrow line

    // Create the arrow lines
    var arrowLine1 = MeshBuilder.CreateTube("arrowLine1", { path: [startPoint, endPoint1], radius: 0.05 }, scene);
    var arrowLine2 = MeshBuilder.CreateTube("arrowLine2", { path: [startPoint, endPoint2], radius: 0.05 }, scene);


    arrowLine1.rotation = new Vector3(0, 1.5708, 0);
    arrowLine2.rotation = new Vector3(0, 1.5708, 0);
    // Create arrowhead meshes
    var arrowhead1 = MeshBuilder.CreateCylinder("arrowhead1", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);
    var arrowhead2 = MeshBuilder.CreateCylinder("arrowhead2", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);

    // Position arrowhead meshes at the ends of arrow lines
    arrowhead1.position = endPoint1.add(new Vector3(-2.3, 0, width)); // Adjust position as needed
    arrowhead2.position = endPoint2.add(new Vector3(2.3, 0, -width)); // Adjust position as needed

    // Rotate arrowhead meshes to align with the direction of the arrow lines
    arrowhead1.rotationQuaternion = Quaternion.RotationAxis(Axis.Z, Math.PI / 2); // Adjust rotation as needed
    arrowhead2.rotationQuaternion = Quaternion.RotationAxis(Axis.Z, -Math.PI / 2); // Adjust rotation as needed

    // Color arrow lines and arrowhead meshes
    arrowLine1.material = new StandardMaterial("arrowLineMat1", scene);
    arrowLine1.material.diffuseColor = new Color3(1, 1, 1); // color assignment
    arrowLine2.material = new StandardMaterial("arrowLineMat2", scene);
    arrowLine2.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead1.material = new StandardMaterial("arrowheadMat1", scene);
    arrowhead1.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead2.material = new StandardMaterial("arrowheadMat2", scene);
    arrowhead2.material.diffuseColor = new Color3(1, 1, 1);

    frontArrows.push(arrowLine1);
    frontArrows.push(arrowLine2);
    frontArrows.push(arrowhead1);
    frontArrows.push(arrowhead2);

    //<===================================for drawing text=================================> 
    var ground = MeshBuilder.CreateGround("ground", { width: 6, height: 2 }, scene);
    var textPositionOffest = 6;
    ground.position.y = 0.05;
    ground.position.x = 0.5;
    ground.rotation = new Vector3(0, 3.14159, 0);

    // Create a material with the background texture
    var materialGround = new StandardMaterial("Mat", scene);
    var backgroundTexture = new Texture("/textures/ground/ground.jpg", scene);
    materialGround.diffuseTexture = backgroundTexture;

    // Create a dynamic texture for drawing text
    var textureGround = new DynamicTexture("dynamic texture", { width: 512, height: 256 }, scene);
    var textureContext = textureGround.getContext();
    var font = "bold 60px monospace";
    var text = "Front"
    textureGround.drawText(text, 200, 170, font, "white");

    // Assign the dynamic texture as an emissive texture to blend with the background
    materialGround.emissiveTexture = textureGround;
    materialGround.useEmissiveAsIllumination = true;

    ground.material = materialGround;

    //<============================for drawing logos====================================>
    // Create a plane mesh
    const frontLogo = MeshBuilder.CreatePlane('plane', { size: 2 }, scene);

    // Create a material
    const materiallogo = new StandardMaterial('material', scene);

    // Load logo texture
    const texture = new Texture(logo, scene);
    materiallogo.diffuseTexture = texture;

    // Apply material to the plane mesh
    frontLogo.material = materiallogo;

    // Position and scale the plane mesh
    frontLogo.rotation = new Vector3(1.5708, 3.1416, 0);
    frontLogo.position = new Vector3(0, 0.05, 0); // Adjust scale as needed
    frontLogo.scaling = new Vector3(1.2, 1.2, 1.2)

    var leantoleftcolsmesh = Mesh.MergeMeshes(leantoleftcols, true, true, undefined, false, true);
    leantoleftcolsmesh.name = "leantoleftcols";
    var leantorightcolsmesh = Mesh.MergeMeshes(leantorightcols, true, true, undefined, false, true);
    leantorightcolsmesh.name = "leantorightcols";
    // var frontMesh = Mesh.MergeMeshes(frontBayMeshes, true, true, undefined, false, true);
    //
    var leftRoofMesh = Mesh.MergeMeshes(leftRoof, true, true, undefined, false, true);
    leftRoofMesh.name = 'lRoof';
    var rightRoofMesh = Mesh.MergeMeshes(rightRoof, true, true, undefined, false, true);
    rightRoofMesh.name = 'rRoof';
    var leftWallMesh = Mesh.MergeMeshes(leftSide, true, true, undefined, false, true);
    var rightWallMesh = Mesh.MergeMeshes(rightSide, true, true, undefined, false, true);
    var frontWallMesh = Mesh.MergeMeshes(frontSide, true, true, undefined, false, true);
    var backWallMesh = Mesh.MergeMeshes(backSide, true, true, undefined, false, true);
    // var leftAwningMesh = Mesh.MergeMeshes(leftAwning, true, true, undefined, false, true); 
    // var rightAwningMesh = Mesh.MergeMeshes(rightAwning, true, true, undefined, false, true); 
    //var frontAwningMesh = Mesh.MergeMeshes(FrontAwning, true, true, undefined, false, true); 
    // var leanToLeftMesh = Mesh.MergeMeshes(leanToLeft, true, true, undefined, false, true);
    // var leanToRightMesh = Mesh.MergeMeshes(leanToRight, true, true, undefined, false, true);
    //var leanToFrontMesh = Mesh.MergeMeshes(leanToFront, true, true, undefined, false, true);
    var leanToLeftWallsMesh = Mesh.MergeMeshes(leanToLeftWalls, true, true, undefined, false, true);
    leanToLeftWallsMesh.name = "leanToLeftWalls";
    var leanToLeftRoofMesh = Mesh.MergeMeshes(leanToLeftRoofs, true, true, undefined, false, true);
    var leanToLeftPartWallPurlinsMesh = Mesh.MergeMeshes(leanToLeftPartWallPurlins, true, true, undefined, false, true);
    leanToLeftRoofMesh.name = "leanToLeftRoofs";
    leanToLeftPartWall.name = "leanToLeftPartWall";
    leftAwningTriangle.name = "leanToLeftTriangle";
    leanToLeftPartWallPurlinsMesh.name = "leanToLeftPurlins"
    var leanToRightWallsMesh = Mesh.MergeMeshes(leanToRightWalls, true, true, undefined, false, true);
    leanToRightWallsMesh.name = "leanToRightWalls";
    var leanToRightRoofMesh = Mesh.MergeMeshes(leanToRightRoofs, true, true, undefined, false, true);
    var leanToRightPartWallPurlinsMesh = Mesh.MergeMeshes(leanToRightPartWallPurlins, true, true, undefined, false, true);
    leanToRightRoofMesh.name = "leanToRightRoofs";
    leanToRightPartWall.name = "leanToRightPartWall";
    rightAwningTriangle.name = "leanToRightTriangle";
    leanToRightPartWallPurlinsMesh.name = "leanToRightPurlins"
    var leftArrowsMesh = Mesh.MergeMeshes(leftArrows, true, true, undefined, false, true);
    // var heightArrowsMeshLeft = Mesh.MergeMeshes(heightArrows, true, true, undefined, false, true);
    // var heightArrowsMeshRight = Mesh.MergeMeshes(heightArrows, true, true, undefined, false, true);
    var frontArrowsMesh = Mesh.MergeMeshes(frontArrows, true, true, undefined, false, true);
    var frontTopMesh = Mesh.MergeMeshes(frontTop, true, true, undefined, false, true);
    var backTopMesh = Mesh.MergeMeshes(backTop, true, true, undefined, false, true);
    var roofCollection = [leftRoofMesh, rightRoofMesh];
    
    var leanToLeftCollection = [leanToLeftWallsMesh, leanToLeftRoofMesh, leantoleftcolsmesh, leanToLeftPartWall, leftAwningTriangle, leanToLeftPartWallPurlinsMesh,  AfLtruss];
    leanToLeftCollection.name = "leanToLeftcollection";
    var leanToRightCollection = [leanToRightWallsMesh, leanToRightRoofMesh, leantorightcolsmesh, leanToRightPartWall, rightAwningTriangle, leanToRightPartWallPurlinsMesh, AfRtruss];
    leanToRightCollection.name = "leanToRightcollection";
    // var heightArrowsMeshRight = heightArrowsMeshLeft.clone();
    var roof_container = new Mesh("fRoof", scene);
        // Assign the material to the roof_container mesh
        roofCollection[0].setParent(roof_container);
        roofCollection[1].setParent(roof_container);
        roof_container.position.y = 0.435;
        console.log("roof container pos: ", roof_container.position, " roof collection 0 pos = ", roofCollection[0].position, " roof collection 1 pos = ", roofCollection[1].position)            
    if (degree != null) {
        var pitchInfo = pitch[degree];
        rightRoofMesh.rotation = new Vector3(0, 0, pitchInfo.rightRoofMesh.rotation[2]);
        rightRoofMesh.position = new Vector3(pitchInfo.rightRoofMesh.position.x, 0, 0);
        rightRoofMesh.scaling = new Vector3(pitchInfo.rightRoofMesh.scaling.x, 1, 1);


        leftRoofMesh.rotation = new Vector3(0, 0, pitchInfo.leftRoofMesh.rotation[2]);
        leftRoofMesh.position = new Vector3(pitchInfo.leftRoofMesh.position.x, 0, 0);
        leftRoofMesh.scaling.x = pitchInfo.leftRoofMesh.scaling.x;

        roof_container.position.y = pitchInfo.leftRoofMesh.position.y;
    }

    var leftAwningFlag = localStorage.getItem("leftAwning");
    var leftCantileverFlag = localStorage.getItem("leftCantilever");
    var rightAwningFlag = localStorage.getItem("rightAwning");
    var rightCantileverFlag = localStorage.getItem("rightCantilever");
    if (awningDegree != null) {
        var pitchInfo = awningPitch[localStorage.getItem("leftAwningPitch")];
        //for lean to frame
        leanToLeftRoofMesh.rotation = new Vector3(0, 0, pitchInfo.leanToLeftRoofMesh.rotation[2]);
        leanToLeftRoofMesh.position = new Vector3(-0.45, pitchInfo.leanToLeftRoofMesh.position.y, 0);
        leanToLeftRoofMesh.scaling = new Vector3(pitchInfo.leanToLeftRoofMesh.scaling.x, 1, 1);
        leanToLeftWallsMesh.position = new Vector3(0, pitchInfo.leanToLeftWallsMesh.position.y, 0);
        leantoleftcolsmesh.position = new Vector3(0, pitchInfo.leanToLeftWallsMesh.position.y, 0);
        leanToLeftPartWall.position.y = pitchInfo.leanToLeftPartition.position.y;
        leftAwningTriangle.position.y = pitchInfo.leanToLeftTriangle.position.y;
        AfLtruss.position.y = pitchInfo.leanToLeftTriangle.position.y
    }

    if (awningDegree != null) {
        var pitchInfo = awningPitch[localStorage.getItem("rightAwningPitch")];
        leanToRightRoofMesh.rotation = new Vector3(0, 0, pitchInfo.leanToRightRoofMesh.rotation[2]);
        leanToRightRoofMesh.position = new Vector3(pitchInfo.leanToRightRoofMesh.position.x, pitchInfo.leanToRightRoofMesh.position.y, 0);
        leanToRightRoofMesh.scaling = new Vector3(pitchInfo.leanToRightRoofMesh.scaling.x, 1, 1);
        leanToRightWallsMesh.position = new Vector3(0, pitchInfo.leanToRightWallsMesh.position.y, 0);
        leantorightcolsmesh.position = new Vector3(0, pitchInfo.leanToRightWallsMesh.position.y, 0);
        leanToRightPartWall.position.y = pitchInfo.leanToLeftPartition.position.y;
        rightAwningTriangle.position.y = pitchInfo.leanToLeftTriangle.position.y;
        AfRtruss.position.y = pitchInfo.leanToLeftTriangle.position.y;;
    

        //for cantilever frame
        // rightAwningMesh.rotation = new Vector3(0,0,pitchInfo.leanToRightRoofMesh.rotation[2]);
        // rightAwningMesh.position = new Vector3 (pitchInfo.leanToRightRoofMesh.position.x,pitchInfo.leanToRightRoofMesh.position.y,0);
        // rightAwningMesh.scaling = new Vector3 (pitchInfo.leanToRightRoofMesh.scaling.x,1,1);
    }
    //changes
    var container_left = new BABYLON.Mesh("container_left", scene);
    container_left.position = new BABYLON.Vector3(0, 0, 0); // Set container_left's initial position
    // container_left.name = "container_left";
    var container_right = new BABYLON.Mesh("container_right", scene);
    container_right.position = new BABYLON.Vector3(0, 0, 0); // Set container_right's initial position
    var container_front = new BABYLON.Mesh("container_front", scene);
    container_front.position = new BABYLON.Vector3(0, 0, 0); // Set container_right's initial position

    const leftAwningGroundTile = MeshBuilder.CreateBox("leftAwningGroundTile", {
        height: 1,   // The thickness of the ground tile
        width: 2.6,      // The width of the ground tile
        depth: 5.3     // The depth of the ground tile
    });
    leftAwningGroundTile.position.x = 3.7;
    const rightAwningGroundTile = MeshBuilder.CreateBox("rightAwningGroundTile", {
        height: 1,   // The thickness of the ground tile
        width: 2.6,      // The width of the ground tile
        depth: 5.3     // The depth of the ground tile
    });
    rightAwningGroundTile.position.x = -3.7;
    // Add child meshes to the container_left
    leanToLeftWallsMesh.parent = container_left;
    leanToLeftPartWall.parent = container_left;
    leftAwningTriangle.parent = container_left;
    leanToLeftRoofMesh.parent = container_left;
    // leantoleftcolsmesh.parent = container_left;
    leanToLeftPartWallPurlinsMesh.parent = container_left;

    // Add child meshes to the container_right
    leanToRightWallsMesh.parent = container_right;
    leanToRightPartWall.parent = container_right;
    rightAwningTriangle.parent = container_right;
    leanToRightRoofMesh.parent = container_right;
    // leantorightcolsmesh.parent = container_right;
    leanToRightPartWallPurlinsMesh.parent = container_right;

    // var leanToLeftMesh = Mesh.MergeMeshes(leanToLeftCollection, true, true, undefined, false, true);
    // var leanToRightMesh = Mesh.MergeMeshes(leanToRightCollection, true, true, undefined, false, true);
    var leantofrontleftclone = roofCollection[0].clone();
    var leantofrontrightclone = roofCollection[1].clone();
    var leantofrontroofmesh = [leantofrontleftclone, leantofrontrightclone]
    var leanToFrontRoof = Mesh.MergeMeshes(leantofrontroofmesh, true, true, undefined, false, true);
    leanToFrontRoof.scaling.z = 0.725;
    leanToFrontRoof.position.z += 0.7;
    var leanToFrontCols = [];

    //creating columns for front bay
    var colFront = structure.ubColumn();
    colFront.scaling.y = 1.5;
    colFront.position.y = 0.6;
    colFront.position.x = -2.35;
    colFront.position.z = 2.5;
    leanToFrontCols.push(colFront);

    var colFront1 = structure.ubColumn();
    colFront1.scaling.y = 1.5;
    colFront1.position.y = 0.6;
    colFront1.position.x = 2.35;
    colFront1.position.z = 2.5;
    leanToFrontCols.push(colFront1);

    //Merging new front column array
    var leanToFrontColsMesh = Mesh.MergeMeshes(leanToFrontCols, true, true, undefined, false, true);
    leanToFrontRoof.name = 'leanToFrontRoof';
    // leanToFrontRoof.position.y = -0.435
    leanToFrontColsMesh.name = 'leanToFrontCols'
    leanToFrontRoof.parent = container_front;
    leanToFrontColsMesh.parent = container_front;
    var leanToFrontMesh = [leanToFrontRoof, leanToFrontColsMesh];
    var frontAwningMesh = leanToFrontRoof.clone();
    // Calculate the offset based on the total depth of the front bay
    frontBayOffsetZ = z * distance;

    //Applying positional offsets to meshes
    frontAwningMesh.scaling.z -= 0.5

    const groundTile = MeshBuilder.CreateBox("groundTile", {
        height: 1,   // The thickness of the ground tile
        width: 5,      // The width of the ground tile
        depth: 5.3     // The depth of the ground tile
    });
    
    groundTile.position.y = -0.2;
    if (localStorage.getItem('slab') === 'Disable') {
        groundTile.isVisible = false;
        leftAwningGroundTile.isVisible = false;
        rightAwningGroundTile.isVisible = false;
        container_left.position.y = 0;
        container_right.position.y = 0;
        container_front.position.y = 0;
        front_container_columns.position.y = 0
        roofCollection[0].position.y = 0
        roofCollection[1].position.y = 0;
        leftWallMesh.position.y = 0
        rightWallMesh.position.y = 0
        frontWallMesh.position.y = 0
        backWallMesh.position.y = 0
        fRtruss.position.y += 0;
        fLtruss.position.y += 0;
        AfRtruss.position.y += 0;
        AfLtruss.position.y += 0;
        // leanToLeftWallsMesh
        // leanToLeftRoofMesh 
        // leanToLeftPartWallPurlinsMesh
        // leanToRightWallsMesh
        // leanToRightRoofMesh
        // leanToRightPartWallPurlinsMesh
        frontTopMesh.position.y = 0
        backTopMesh.position.y = 0
    }

    //reAdjusting positions to include slab
    // leantoleftcolsmesh
    // leantorightcolsmesh
    if(localStorage.getItem('leftAwning') === 'true' && localStorage.getItem('slab') === 'Enable'){
        leftAwningGroundTile.isVisible = true;
    }else{
        leftAwningGroundTile.isVisible = false;
    }
    if(localStorage.getItem('rightAwning') === 'true' && localStorage.getItem('slab') === 'Enable'){
        console.log("true")
        rightAwningGroundTile.isVisible = true;
    }else{
        rightAwningGroundTile.isVisible = false;
    }
    // if (localStorage.getItem('slab') === 'Enable') {
    //     container_left.position.y = 0.3;
    //     container_right.position.y = 0.3;
    //     leantoleftcolsmesh.position.y = 0.3;
    //     leantorightcolsmesh.position.y = 0.3;
    //     front_container_columns.position.y = 0.3
    //     roofCollection[0].position.y = 0.3;
    //     roofCollection[1].position.y = 0.3;
    //     leftWallMesh.position.y = 0.3
    //     rightWallMesh.position.y = 0.3
    //     frontWallMesh.position.y = 0.3
    //     backWallMesh.position.y = 0.3
    //     // leanToLeftWallsMesh
    //     // leanToLeftRoofMesh 
    //     // leanToLeftPartWallPurlinsMesh
    //     // leanToRightWallsMesh
    //     // leanToRightRoofMesh
    //     // leanToRightPartWallPurlinsMesh
    //     frontTopMesh.position.y = 0.3
    //     backTopMesh.position.y = 0.3
    // }

    if (parseInt(localStorage.getItem("slabSize")) > 150 && localStorage.getItem('slab') === 'Enable') {
        //reAdjusting positions to include slab
        // leantoleftcolsmesh
        // leantorightcolsmesh
        groundTile.position.y = 0;
        leftAwningGroundTile.position.y = 0;
        rightAwningGroundTile.position.y = 0;
        container_left.position.y = 0.4;
        container_right.position.y = 0.4;
        container_front.position.y = 0.4;
        leantoleftcolsmesh.position.y += 0.4;
        leantorightcolsmesh.position.y += 0.4;
        front_container_columns.position.y = 0.4
        roofCollection[0].position.y = 0.4;
        roofCollection[1].position.y = 0.4;
        leftWallMesh.position.y = 0.4
        rightWallMesh.position.y = 0.4
        frontWallMesh.position.y = 0.4
        backWallMesh.position.y = 0.4
        fRtruss.position.y += 0.4;
        fLtruss.position.y += 0.4;
        AfRtruss.position.y += 0.4;
        AfLtruss.position.y += 0.4;
        frontTopMesh.position.y += 0.4
        backTopMesh.position.y += 0.4
    } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100 && localStorage.getItem('slab') === 'Enable') {
        //reAdjusting positions to include slab
        // leantoleftcolsmesh
        // leantorightcolsmesh
        groundTile.position.y = -0.3;
        leftAwningGroundTile.position.y = -0.3;
        rightAwningGroundTile.position.y = -0.3;
        container_left.position.y = 0.2;
        container_right.position.y = 0.2;
        container_front.position.y = 0.2;
        leantoleftcolsmesh.position.y += 0.2;
        leantorightcolsmesh.position.y += 0.2;
        front_container_columns.position.y = 0.2
        roofCollection[0].position.y = 0.2;
        roofCollection[1].position.y = 0.2;
        leftWallMesh.position.y = 0.2
        rightWallMesh.position.y = 0.2
        frontWallMesh.position.y = 0.2
        backWallMesh.position.y = 0.2
        fRtruss.position.y += 0.2;
        fLtruss.position.y += 0.2;
        AfRtruss.position.y += 0.2;
        AfLtruss.position.y += 0.2;
        frontTopMesh.position.y += 0.2
        backTopMesh.position.y += 0.2
    } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50 && localStorage.getItem('slab') === 'Enable') {
        //reAdjusting positions to include slab
        // leantoleftcolsmesh
        // leantorightcolsmesh
        groundTile.position.y = -0.2;
        leftAwningGroundTile.position.y = -0.2;
        rightAwningGroundTile.position.y = -0.2;
        container_left.position.y = 0.1;
        container_right.position.y = 0.1;
        container_front.position.y = 0.1;
        leantoleftcolsmesh.position.y += 0.1;
        leantorightcolsmesh.position.y += 0.1;
        front_container_columns.position.y = 0.1
        roofCollection[0].position.y = 0.1
        roofCollection[1].position.y = 0.1;
        leftWallMesh.position.y = 0.1
        rightWallMesh.position.y = 0.1
        frontWallMesh.position.y = 0.1
        backWallMesh.position.y = 0.1
        fRtruss.position.y += 0.1;
        fLtruss.position.y += 0.1;
        AfRtruss.position.y += 0.1;
        AfLtruss.position.y += 0.1;
        frontTopMesh.position.y += 0.1
        backTopMesh.position.y += 0.1
    } else if (parseInt(localStorage.getItem("slabSize")) < 50 && localStorage.getItem('slab') === 'Enable') {
        //reAdjusting positions to include slab
        // leantoleftcolsmesh
        // leantorightcolsmesh
        groundTile.position.y = -0.3;
        leftAwningGroundTile.position.y = -0.3;
        rightAwningGroundTile.position.y = -0.3;
        container_left.position.y = 0;
        container_front.position.y = 0;
        container_right.position.y = 0;
        leantoleftcolsmesh.position.y += 0;
        leantorightcolsmesh.position.y += 0;
        front_container_columns.position.y = 0
        roofCollection[0].position.y = 0;
        roofCollection[1].position.y = 0;
        leftWallMesh.position.y = 0
        rightWallMesh.position.y = 0
        frontWallMesh.position.y = 0
        backWallMesh.position.y = 0
        fRtruss.position.y += 0;
        fLtruss.position.y += 0;
        AfRtruss.position.y += 0;
        AfLtruss.position.y += 0;
        frontTopMesh.position.y += 0
        backTopMesh.position.y += 0
    }
    frontLogo.position.z += frontBayOffsetZ + textPositionOffest + 5;
    leanToFrontMesh.forEach((mesh) => {
        mesh.isVisible = false;
    })
    groundTile.position.z += frontBayOffsetZ;
    container_front.position.z += frontBayOffsetZ + 3.95 - 0.5;
    frontAwningMesh.position.z += frontBayOffsetZ + 3.95;
    frontArrowsMesh.position.z += frontBayOffsetZ + arrowOffsetFront;
    ground.position.z += frontBayOffsetZ + textPositionOffest;
    leftArrowsMesh.position.z += frontBayOffsetZ;
    if (sessionStorage.getItem("leftArrowPosition_") != 0 && sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0 && sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
        console.log("hitting all 3")
        leftArrowsMesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"));
    }
    else if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0 && sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
        console.log("hitting the problematic 2")
        leftArrowsMesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_"));
    } else if (sessionStorage.getItem("leftArrowPosition_") != 0 && sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0) {
        leftArrowsMesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"));
    } else if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0) {
        leftArrowsMesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"));
    } else if (sessionStorage.getItem("leftArrowPosition_") != 0) {
        leftArrowsMesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_"));
    } else if (sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
        leftArrowsMesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_"));
    }
    front_container_columns.position.z += frontBayOffsetZ;
    leftAwningGroundTile.position.z += frontBayOffsetZ;
    rightAwningGroundTile.position.z += frontBayOffsetZ;
    roofCollection[0].position.z += frontBayOffsetZ;
    roofCollection[1].position.z += frontBayOffsetZ;
    leftWallMesh.position.z += frontBayOffsetZ;
    rightWallMesh.position.z += frontBayOffsetZ;
    frontWallMesh.position.z += frontBayOffsetZ;
    fLtruss.position.z += frontBayOffsetZ;
    fRtruss.position.z += frontBayOffsetZ;
    leanToLeftCollection.forEach((mesh) => {
        mesh.position.z += frontBayOffsetZ;
    })
    leanToRightCollection.forEach((mesh) => {
        mesh.position.z += frontBayOffsetZ;
    })
    frontTopMesh.position.z += frontBayOffsetZ;

    //Assigning visibility to hidden by default meshes
    if (leftAwningFlag === 'false') {
        leanToLeftCollection.forEach((mesh) => {
            mesh.isVisible = false;
        })
    } else {
        leanToLeftCollection.forEach((mesh) => {
            if (mesh.name === 'leantoLeftTriangle' || mesh.name === "leanToLeftPartWall" || mesh.name === "leanToLeftPurlins"
            ) {
                mesh.isVisible = false;
            }
        })
    }

    if (rightAwningFlag === 'false') {
        leanToRightCollection.forEach((mesh) => {
            mesh.isVisible = false;
        })
    }
    else {
        leanToRightCollection.forEach(mesh => {
            if (mesh.name === 'leantoRightTriangle' || mesh.name === "leanToRightPartWall" || mesh.name === "leanToRightPurlins") {
                mesh.isVisible = false;
            }
        })
    }

    frontAwningMesh.isVisible = false;
    backWallMesh.isVisible = false;
    backTopMesh.isVisible = false;
    leanToFrontMesh.isVisible = false;

    frontArrowsMesh.name = 'arrow';
    leftArrowsMesh.name = 'Larrow';
    frontAwningMesh.name = 'cantileverFront'
    frontWallMesh.name = 'FWall';
    backWallMesh.name = 'BWall';
    frontTopMesh.name = 'FTop';
    backTopMesh.name = 'BTop';
    leftWallMesh.name = 'Lwall';

    rightWallMesh.name = 'Rwall';
    ground.name = 'fGround';

    frontLogo.name = 'fLogo';
    var leftAwningMesh = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 2.2 }, scene);
    leftAwningMesh.isVisible = false;
    var rightAwningMesh = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 2.2 }, scene);
    rightAwningMesh.isVisible = false;

    if (localStorage.getItem("LeftWallsVisible") == "false") {
        leftWallMesh.isVisible = false
    }
    if (localStorage.getItem("RightWallsVisible") == "false") {
        rightWallMesh.isVisible = false
    }
    if (localStorage.getItem("LeftAwningWallsVisible") == "false") {
        leanToLeftWallsMesh.isVisible = false
    }
    if (localStorage.getItem("RightAwningWallsVisible") == "false") {
        leanToRightWallsMesh.isVisible = false
    }
    var rightMezzanine = mezzanine.rightMezzanine(scene);
    var leftMezzanine = mezzanine.leftMezzanine(scene);
    rightMezzanine.position.z += frontBayOffsetZ;
    leftMezzanine.position.z += frontBayOffsetZ;

    var left_bracing = bracing.left_bracing(scene);
    var right_bracing = bracing.right_bracing(scene);
    left_bracing.position.z += frontBayOffsetZ;
    right_bracing.position.z += frontBayOffsetZ;

    return [front_container_columns,roof_container, leftWallMesh, rightWallMesh, leftAwningMesh, rightAwningMesh, frontAwningMesh, leanToLeftCollection[0], leanToLeftCollection[1], leanToLeftCollection[2], leanToRightCollection[0], leanToRightCollection[1], leanToRightCollection[2], leanToFrontMesh[0], leanToFrontMesh[1], backWallMesh, backTopMesh, frontWallMesh, frontTopMesh, ground, frontArrowsMesh, leftArrowsMesh, frontLogo, leanToLeftCollection[3], leanToLeftCollection[4], leanToRightCollection[3], leanToRightCollection[4], container_left, container_right, container_front, leanToLeftCollection[5], leanToRightCollection[5], rightMezzanine, leftMezzanine, left_bracing, right_bracing, colfront1, colfront2, fRtruss, AfRtruss, fLtruss, AfLtruss, groundTile, leftAwningGroundTile, rightAwningGroundTile];
};

//<=================== CenterBay Creation Logic =====================>//
export const createCenterBay = function (frontBayDimensions, frontBayPosition, distance, scene, degree, awningDegree) {
    var centerBayMeshes = [];
    var leftRoof = [];
    var rightRoof = [];
    var leftSide = [];
    var rightSide = [];
    var arrows = [];
    var frontSide = [];
    var frontTop = [];
    var backSide = [];
    var backTop = [];

    //front side
    const centercontainer_columns = new BABYLON.Mesh("container_columns_center", scene);

    // Front side
    var colCenter1 = structure.ubColumn(scene, material);
    colCenter1.isVisible = true;
    colCenter1.position.y = 1.2;
    colCenter1.position.x = -2.35;
    colCenter1.position.z = 2.5;
    colCenter1.parent = centercontainer_columns;
    colCenter1.name = 'colCenter1';
    colCenter1.id = "colCenter1"; // Naming convention for colCenter1
    // console.log("colCenter1 name ", colCenter1.name);  // Output: "colCenter1"
    // console.log("colCenter1 id", colCenter1.id);    // Output: "colCenter1"
    // console.log("colCenter1", colCenter1.isVisible);

    var colCenter2 = structure.ubColumn(scene, material);
    colCenter2.isVisible = true;
    colCenter2.position.y = 1.2;
    colCenter2.position.x = 2.35;
    colCenter2.position.z = 2.5;
    colCenter2.parent = centercontainer_columns;
    colCenter2.id = "colCenter2";
    colCenter2.name = 'colCenter2'; // Naming convention for colCenter2
    // console.log("colCenter2:", colCenter2);

    centercontainer_columns.parent = container_center;
    // console.log("container_columns_center:", centercontainer_columns);
    // console.log('Children of column_container_center:', centercontainer_columns.getChildMeshes());

    var container_center = new BABYLON.Mesh("container_back", scene);

    if (localStorage.getItem("rafter") === "truss") {
        var rafterFront = structure.truss();
        rafterFront.position.y = 2.45;
    } else {
        var rafterFront = structure.rafter();
        rafterFront.position.y = 2.38;
    }
    rafterFront.position.z = 2.5
    rafterFront.position.x = 1.15
    rafterFront.rotation = new Vector3(0, 0, 1.48353);
    leftRoof.push(rafterFront);

    const Rtruss = structure.gurder();
    Rtruss.position = new Vector3(-2.25, 2.4, 0);
    Rtruss.name = 'rtruss'
    Rtruss.id = 'rtruss'
     console.log("Rtruss: ", Rtruss);
    // scene.addMesh(Rtruss);
    Rtruss.rotation = new Vector3(0, Math.PI / 2, Math.PI / 2);
    Rtruss.isVisible = false;



    const ARtruss = structure.gurder();
    ARtruss.position = new Vector3(-4.9, 2.12, 0);
    ARtruss.name = 'ratruss'
    ARtruss.id = 'ratruss'
     console.log("ARtruss: ", ARtruss);
    // scene.addMesh(ARtruss);
    ARtruss.rotation = new Vector3(0, Math.PI / 2, Math.PI / 2);
    ARtruss.isVisible = false;




    const Ltruss = structure.gurder();
    Ltruss.position = new Vector3(2.25, 2.4, 0);
    // Adjust the rotation to make it horizontal
    Ltruss.rotation = new Vector3(0, -Math.PI / 2, Math.PI / 2);
    Ltruss.name = 'ltruss'
    Ltruss.id = 'ltruss'
     console.log("Ltruss: ", Ltruss);
    Ltruss.isVisible = false;



    const ALtruss = structure.gurder();
    ALtruss.position = new Vector3(4.9, 2.12, 0);
    // Adjust the rotation to make it horizontal
    ALtruss.rotation = new Vector3(0, -Math.PI / 2, Math.PI / 2);
    ALtruss.name = 'altruss'
    ALtruss.id = 'altruss'
     console.log("ALtruss: ", ALtruss);
    ALtruss.isVisible = false;

    //timber material for rafter
    // var timberMaterial = new StandardMaterial("timberMaterial", scene);
    // timberMaterial.diffuseColor = new Color3(0.55, 0.27, 0.07);
    if (localStorage.getItem("rafter") === "truss") {
        var rafterFront1 = structure.truss();
        rafterFront1.position.y = 2.45;
    } else {
        var rafterFront1 = structure.rafter();
        rafterFront1.position.y = 2.38;
    }
    // rafterFront1.material = timberMaterial;
    rafterFront1.position.z = 2.5
    rafterFront1.position.x = -1.15
    rafterFront1.rotation = new Vector3(0, 3.14159, 1.48353);
    rightRoof.push(rafterFront1);

    //back side
    //    var col3 = structure.ubColumn();;
    //    col3.position.y = 1.2;
    //    col3.position.x = -2.35;
    //    col3.position.z = -2.5;
    //    centerBayMeshes.push(col3);

    //    var col4 = structure.ubColumn();;
    //    col4.position.y = 1.2;
    //    col4.position.x = 2.35;
    //    col4.position.z = -2.5;
    //    centerBayMeshes.push(col4);

    //    var rafterBack = structure.rafter();;
    //    rafterBack.position.y = 2.38;
    //    rafterBack.position.z = 2.5
    //    rafterBack.position.x= 1.15
    //    rafterBack.rotation = new Vector3(0,0,1.48353);
    //    leftRoof.push(rafterBack);

    //    var rafterBack1 = structure.rafter();;
    //    rafterBack1.position.y = 2.38;
    //    rafterBack1.position.z = 2.5
    //    rafterBack1.position.x= -1.15
    //    rafterBack1.rotation = new Vector3(0,3.14159,1.48353);
    //    rightRoof.push(rafterBack1);

    //gritLeft
    var gritBox = structure.createPurlin();;
    gritBox.rotation = new Vector3(0, 0, 3.14159)
    gritBox.position.y = 1
    gritBox.position.x = 2.47
    leftSide.push(gritBox);

    var gritBox1 = structure.createPurlin();;
    gritBox1.rotation = new Vector3(0, 0, 3.14159)
    gritBox1.position.y = 1.43
    gritBox1.position.x = 2.47
    leftSide.push(gritBox1);

    var gritBox2 = structure.createPurlin();;
    gritBox2.rotation = new Vector3(0, 0, 3.14159)
    gritBox2.position.y = 0.5
    gritBox2.position.x = 2.47
    leftSide.push(gritBox2);

    var gritBox3 = structure.createPurlin();;
    gritBox3.rotation = new Vector3(0, 0, 3.14159)
    gritBox3.position.y = 1.88
    gritBox3.position.x = 2.47
    leftSide.push(gritBox3);

    //gritRight
    var gritBoxRight = structure.createPurlin();;
    gritBoxRight.rotation = new Vector3(0, 0, 3.14159)
    gritBoxRight.position.y = 1
    gritBoxRight.position.x = - 2.47
    rightSide.push(gritBoxRight);

    var gritBoxRight1 = structure.createPurlin();;
    gritBoxRight1.rotation = new Vector3(0, 0, 3.14159)
    gritBoxRight1.position.y = 1.43
    gritBoxRight1.position.x = - 2.47
    rightSide.push(gritBoxRight1);

    var gritBoxRight2 = structure.createPurlin();;
    gritBoxRight2.rotation = new Vector3(0, 0, 3.14159)
    gritBoxRight2.position.y = 0.5
    gritBoxRight2.position.x = - 2.47
    rightSide.push(gritBoxRight2);

    var gritBoxRight3 = structure.createPurlin();;
    gritBoxRight3.rotation = new Vector3(0, 0, 3.14159)
    gritBoxRight3.position.y = 1.88
    gritBoxRight3.position.x = - 2.47
    rightSide.push(gritBoxRight3);

    //front side
    var frontgrit = structure.createPurlin();;
    frontgrit.rotation = new Vector3(0, 11, 9.4)
    frontgrit.position.y = 1.88
    frontgrit.position.x = 0
    frontgrit.position.z = 2.62
    frontgrit.scaling.z = 0.98
    frontSide.push(frontgrit);

    var frontgrit1 = structure.createPurlin();;
    frontgrit1.rotation = new Vector3(0, 11, 9.4)
    frontgrit1.position.y = 1.43
    frontgrit1.position.x = 0
    frontgrit1.position.z = 2.62
    frontgrit1.scaling.z = 0.98
    frontSide.push(frontgrit1);

    var frontgrit2 = structure.createPurlin();;
    frontgrit2.rotation = new Vector3(0, 11, 9.4)
    frontgrit2.position.y = 1.00
    frontgrit2.position.x = 0
    frontgrit2.position.z = 2.62;
    frontgrit2.scaling.z = 0.98
    frontSide.push(frontgrit2);

    var frontgrit3 = structure.createPurlin();;
    frontgrit3.rotation = new Vector3(0, 11, 9.4)
    frontgrit3.position.y = 0.5
    frontgrit3.position.x = 0
    frontgrit3.position.z = 2.62
    frontgrit3.scaling.z = 0.98
    frontSide.push(frontgrit3);
    //front cover
    // Define the vertices of the triangle
    if (degree != null) {
        var pitchInfo = pitch[degree];
        topCenter = pitchInfo.topCenter;
    }
    var positions = [
        2.5, 0.1, 0,   // Vertex 1: Bottom left corner
        -2.5, 0.1, 0,   // Vertex 2: Bottom right corner
        0, topCenter, 0  // Vertex 3: Top center corner
    ];

    // Define the indices that make up the triangle
    var indices = [
        0, 1, 2  // Indices to form a triangle with the defined vertices
    ];

    // Create a VertexData object
    var vertexData = new VertexData();

    // Assign the positions and indices to the VertexData object
    vertexData.positions = positions;
    vertexData.indices = indices;

    // Apply the VertexData to a mesh
    var triangle = new Mesh("triangle", scene);
    vertexData.applyToMesh(triangle);

    // Create a standard material for the triangle
    var material = new StandardMaterial("triangleMaterial", scene);
    // material.diffuseColor = new Color3(1, 0, 0); // Red color for the triangle
    material.backFaceCulling = false; // Make the material double-sided
    triangle.material = material;
    triangle.position.y = 2.35;
    triangle.position.z = 2.675;
    triangle.scaling.z = 10;

    var flatFront = MeshBuilder.CreateBox("box", { width: 5, height: 2.9, depth: 0.01 }, scene);
    flatFront.position.y = 1;
    flatFront.position.z = 2.67;
    var frontTop = [];
    frontTop.push(triangle);
    frontSide.push(flatFront);

    var backgrit = structure.createPurlin();;
    backgrit.rotation = new Vector3(0, 1.5708, 3.14159)
    backgrit.position.y = 1.88
    backgrit.position.x = 0
    backgrit.position.z = -2.62
    backgrit.scaling.z = 0.98
    backSide.push(backgrit);

    var backgrit1 = structure.createPurlin();;
    backgrit1.rotation = new Vector3(0, 1.5708, 3.14159)
    backgrit1.position.y = 1.43
    backgrit1.position.x = 0
    backgrit1.position.z = -2.62
    backgrit1.scaling.z = 0.98
    backSide.push(backgrit1);

    var backgrit2 = structure.createPurlin();;
    backgrit2.rotation = new Vector3(0, 1.5708, 3.14159)
    backgrit2.position.y = 1.00
    backgrit2.position.x = 0
    backgrit2.position.z = -2.62;
    backgrit2.scaling.z = 0.98
    backSide.push(backgrit2);

    var backgrit3 = structure.createPurlin();;
    backgrit3.rotation = new Vector3(0, 1.5708, 3.14159)
    backgrit3.position.y = 0.5
    backgrit3.position.x = 0
    backgrit3.position.z = -2.62
    backgrit3.scaling.z = 0.98
    backSide.push(backgrit3);

    //back cover
    if (degree != null) {
        var pitchInfo = pitch[degree];
        topCenter = pitchInfo.topCenter;
    }
    // Define the vertices of the triangle
    var positions = [
        2.5, 0.1, 0,   // Vertex 1: Bottom left corner
        -2.5, 0.1, 0,   // Vertex 2: Bottom right corner
        0, topCenter, 0  // Vertex 3: Top center corner
    ];

    // Define the indices that make up the triangle
    var indices = [
        0, 1, 2  // Indices to form a triangle with the defined vertices
    ];

    // Create a VertexData object
    var vertexData = new VertexData();

    // Assign the positions and indices to the VertexData object
    vertexData.positions = positions;
    vertexData.indices = indices;

    // Apply the VertexData to a mesh
    var triangle = new Mesh("triangle", scene);
    vertexData.applyToMesh(triangle);

    // Create a standard material for the triangle
    var material = new StandardMaterial("triangleMaterial", scene);
    material.backFaceCulling = false; // Make the material double-sided
    triangle.material = material;
    triangle.position.y = 2.35;
    triangle.position.z = -2.675;

    var box = MeshBuilder.CreateBox("box", { width: 5, height: 2.9, depth: 0.01 }, scene);
    box.position.y = 1;
    box.position.z = -2.67;
    backTop.push(triangle);
    backSide.push(box);


    //roof purlins left
    var roofPurlinsLeft5 = structure.createPurlin();;
    roofPurlinsLeft5.position.y = 2.4;
    roofPurlinsLeft5.position.x = 2.36;
    roofPurlinsLeft5.rotation = new Vector3(0, 0, 4.53786);
    leftRoof.push(roofPurlinsLeft5);

    var roofPurlinsLeft = structure.createPurlin();;
    roofPurlinsLeft.position.y = 2.45;
    roofPurlinsLeft.position.x = 2;
    roofPurlinsLeft.rotation = new Vector3(0, 0, 4.53786);
    leftRoof.push(roofPurlinsLeft);

    var roofPurlinsLeft1 = structure.createPurlin();;
    roofPurlinsLeft1.rotation = new Vector3(0, 0, 4.53786);
    roofPurlinsLeft1.position.y = 2.48;
    roofPurlinsLeft1.position.x = 1.5;
    leftRoof.push(roofPurlinsLeft1);

    var roofPurlinsLeft2 = structure.createPurlin();;
    roofPurlinsLeft2.rotation = new Vector3(0, 0, 4.53786);
    roofPurlinsLeft2.position.y = 2.52;
    roofPurlinsLeft2.position.x = 1;
    leftRoof.push(roofPurlinsLeft2);

    var roofPurlinsLeft3 = structure.createPurlin();;
    roofPurlinsLeft3.rotation = new Vector3(0, 0, 4.53786);
    roofPurlinsLeft3.position.y = 2.57;
    roofPurlinsLeft3.position.x = 0.5;
    leftRoof.push(roofPurlinsLeft3);

    var roofPurlinsLeft4 = structure.createPurlin();;
    roofPurlinsLeft4.rotation = new Vector3(0, 0, 4.53786);
    roofPurlinsLeft4.position.y = 2.6;
    roofPurlinsLeft4.position.x = 0.08;
    leftRoof.push(roofPurlinsLeft4);

    //roof Purlins right
    var roofPurlinsRight5 = structure.createPurlin();;
    roofPurlinsRight5.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight5.position.y = 2.4
    roofPurlinsRight5.position.x = - 2.38
    rightRoof.push(roofPurlinsRight5);

    var roofPurlinsRight = structure.createPurlin();;
    roofPurlinsRight.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight.position.y = 2.43
    roofPurlinsRight.position.x = - 2
    rightRoof.push(roofPurlinsRight);


    var roofPurlinsRight1 = structure.createPurlin();;
    roofPurlinsRight1.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight1.position.y = 2.48
    roofPurlinsRight1.position.x = -1.5
    rightRoof.push(roofPurlinsRight1);

    var roofPurlinsRight2 = structure.createPurlin();;
    roofPurlinsRight2.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight2.position.y = 2.52
    roofPurlinsRight2.position.x = -1
    rightRoof.push(roofPurlinsRight2);

    var roofPurlinsRight3 = structure.createPurlin();;
    roofPurlinsRight3.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight3.position.y = 2.57
    roofPurlinsRight3.position.x = -0.5
    rightRoof.push(roofPurlinsRight3);

    var roofPurlinsRight4 = structure.createPurlin();;
    roofPurlinsRight4.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight4.position.y = 2.6
    roofPurlinsRight4.position.x = -0.08
    rightRoof.push(roofPurlinsRight4);


    //roof cover
    var roofLeft = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 5.1 }, scene);
    roofLeft.position.y = 2.55;
    roofLeft.position.x = 1.25;
    roofLeft.rotation = new Vector3(0, 0, -0.0872665);
    leftRoof.push(roofLeft);

    var roofRight = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 5.1 }, scene);
    roofRight.position.y = 2.55;
    roofRight.position.x = -1.25
    roofRight.rotation = new Vector3(0, 0, 0.0872665);
    rightRoof.push(roofRight);

    //walls
    var wallLeft = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.45, depth: 5.1 }, scene);
    wallLeft.position.y = 1.2;
    wallLeft.position.x = 2.51
    wallLeft.rotation = new Vector3(0, 0, 29.85)
    leftSide.push(wallLeft);

    var wallRight = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.45, depth: 5.1 }, scene);
    wallRight.position.y = 1.2;
    wallRight.position.x = - 2.51
    wallRight.rotation = new Vector3(0, 0, 29.85)
    rightSide.push(wallRight);

    var leftAwning = [];
    var rightAwning = [];

    //awning/cantilever

    //    var awningLeft =  MeshBuilder.CreateBox("box", {size: 0.02, width: 2.5, depth: 5.1}, scene);
    //    awningLeft.position.y=2.33;
    //    awningLeft.position.x=3.75;
    //    awningLeft.rotation = new Vector3(0,0,-0.0872665);
    //    leftAwning.push(awningLeft);

    //    var awningLeftPurlin = structure.createPurlin();;
    //    awningLeftPurlin.position.y=2.38;
    //    awningLeftPurlin.position.x= 2.56;
    //    awningLeftPurlin.rotation = new Vector3(0,0,4.53786);
    //    leftAwning.push(awningLeftPurlin);

    //    var awningLeftPurlin1 = structure.createPurlin();;
    //    awningLeftPurlin1.position.y=2.33;
    //    awningLeftPurlin1.position.x= 3.06;
    //    awningLeftPurlin1.rotation = new Vector3(0,0,4.53786);
    //    leftAwning.push(awningLeftPurlin1);

    //    var awningLeftPurlin2 = structure.createPurlin();;
    //    awningLeftPurlin2.position.y=2.28;
    //    awningLeftPurlin2.position.x= 3.56;
    //    awningLeftPurlin2.rotation = new Vector3(0,0,4.53786);
    //    leftAwning.push(awningLeftPurlin2);

    //    var awningLeftPurlin3 = structure.createPurlin();;
    //    awningLeftPurlin3.position.y=2.25;
    //    awningLeftPurlin3.position.x= 4.06;
    //    awningLeftPurlin3.rotation = new Vector3(0,0,4.53786);
    //    leftAwning.push(awningLeftPurlin3);

    //    var awningLeftPurlin4 = structure.createPurlin();;
    //    awningLeftPurlin4.position.y=2.20;
    //    awningLeftPurlin4.position.x= 4.56;
    //    awningLeftPurlin4.rotation = new Vector3(0,0,4.53786);
    //    leftAwning.push(awningLeftPurlin4);

    //    var awningLeftPurlin5 = structure.createPurlin();;
    //    awningLeftPurlin5.position.y=2.16;
    //    awningLeftPurlin5.position.x= 4.83;
    //    awningLeftPurlin5.rotation = new Vector3(0,0,4.53786);
    //    leftAwning.push(awningLeftPurlin5);

    //    var awningLeftRafter = structure.rafter();
    //    awningLeftRafter.position.y = 2.15;
    //    awningLeftRafter.position.z = 2.5
    //    awningLeftRafter.position.x= 3.7
    //    awningLeftRafter.rotation = new Vector3(0,0,1.48353);
    //    awningLeftRafter.scaling.y = 1
    //    leftAwning.push(awningLeftRafter)

    //    var awningLeftRafter1 = structure.rafter();
    //    awningLeftRafter1.position.y = 2.15;
    //    awningLeftRafter1.position.z = -2.5
    //    awningLeftRafter1.position.x= 3.7
    //    awningLeftRafter1.rotation = new Vector3(0,0,1.48353);
    //    awningLeftRafter1.scaling.y = 1
    //    leftAwning.push(awningLeftRafter1);

    //    //awning right
    //    var awningRight =  MeshBuilder.CreateBox("box", {size: 0.02, width: 2.5, depth: 5.1}, scene);
    //    awningRight.position.y=2.33;
    //    awningRight.position.x=-3.75;
    //    awningRight.rotation = new Vector3(0,0,0.0872665);
    //    rightAwning.push(awningRight);

    //    var awningRightPurlin = structure.createPurlin();;
    //    awningRightPurlin.position.y=2.38;
    //    awningRightPurlin.position.x= -2.56;
    //    awningRightPurlin.rotation = new Vector3(0,0,4.88692);
    //    rightAwning.push(awningRightPurlin);

    //    var awningRightPurlin1 = structure.createPurlin();;
    //    awningRightPurlin1.position.y=2.33;
    //    awningRightPurlin1.position.x= -3.06;
    //    awningRightPurlin1.rotation = new Vector3(0,0,4.88692);
    //    rightAwning.push(awningRightPurlin1);

    //    var awningRightPurlin2 = structure.createPurlin();;
    //    awningRightPurlin2.position.y=2.28;
    //    awningRightPurlin2.position.x= -3.56;
    //    awningRightPurlin2.rotation = new Vector3(0,0,4.88692);
    //    rightAwning.push(awningRightPurlin2);

    //    var awningRightPurlin3 = structure.createPurlin();;
    //    awningRightPurlin3.position.y=2.25;
    //    awningRightPurlin3.position.x= -4.06;
    //    awningRightPurlin3.rotation = new Vector3(0,0,4.88692);
    //    rightAwning.push(awningRightPurlin3);

    //    var awningRightPurlin4 = structure.createPurlin();;
    //    awningRightPurlin4.position.y=2.20;
    //    awningRightPurlin4.position.x= -4.56;
    //    awningRightPurlin4.rotation = new Vector3(0,0,4.88692);
    //    rightAwning.push(awningRightPurlin4);

    //    var awningRightPurlin5 = structure.createPurlin();;
    //    awningRightPurlin5.position.y=2.16;
    //    awningRightPurlin5.position.x= -4.83;
    //    awningRightPurlin5.rotation = new Vector3(0,0,4.88692);
    //    rightAwning.push(awningRightPurlin5);

    //    var awningRightRafter = structure.rafter();
    //    awningRightRafter.position.y = 2.15;
    //    awningRightRafter.position.z = 2.5
    //    awningRightRafter.position.x= -3.7
    //    awningRightRafter.rotation = new Vector3(0,3.14159,1.48353);
    //    awningRightRafter.scaling.y = 1
    //    rightAwning.push(awningRightRafter);

    //    var awningRightRafter1 = structure.rafter();
    //    awningRightRafter1.position.y = 2.15;
    //    awningRightRafter1.position.z = -2.5
    //    awningRightRafter1.position.x= -3.7
    //    awningRightRafter1.rotation = new Vector3(0,3.14159,1.48353);
    //    awningRightRafter1.scaling.y = 1
    //    rightAwning.push(awningRightRafter1);

    //Lean to left
    var leanToLeftWalls = [];
    var leanToLeftRoofs = [];
    var leanToRightWalls = [];
    var leanToRightRoofs = [];
    var leantoleftcols = [];
    var leantorightcols = [];

    var leanToLeftCol3 = structure.ubColumn();
    leanToLeftCol3.position.y = 0.95;
    leanToLeftCol3.position.x = 4.9;
    leanToLeftCol3.position.z = 2.5;
    leanToLeftCol3.scaling.y = 0.98;
    leantoleftcols.push(leanToLeftCol3);

    //    var leanToLeftCol4 = structure.ubColumn();
    //    leanToLeftCol4.position.y = 1;
    //    leanToLeftCol4.position.x = 4.9;
    //    leanToLeftCol4.position.z = -2.5;
    //    leanToLeftCol4.scaling.y = 0.98;
    //    leantoleftcols.push(leanToLeftCol4);


    if (localStorage.getItem("rafter") === "truss") {
        var leanToLeftRafter = structure.truss();
    } else {
        var leanToLeftRafter = structure.rafter();
    }
    leanToLeftRafter.position.y = 2.15;
    leanToLeftRafter.position.z = 2.5
    leanToLeftRafter.position.x = 3.7
    leanToLeftRafter.rotation = new Vector3(0, 0, 1.48353);
    leanToLeftRafter.scaling.y = 1
    leanToLeftRoofs.push(leanToLeftRafter)

    //    var leanToLeftRafter1 = structure.rafter();
    //    leanToLeftRafter1.position.y = 2.15;
    //    leanToLeftRafter1.position.z = -2.5
    //    leanToLeftRafter1.position.x= 3.7
    //    leanToLeftRafter1.rotation = new Vector3(0,0,1.48353);
    //    leanToLeftRafter1.scaling.y = 1
    //    leanToLeftRoofs.push(leanToLeftRafter1);

    var leanToLeftPurlin = structure.createPurlin();;
    leanToLeftPurlin.position.y = 2.38;
    leanToLeftPurlin.position.x = 2.56;
    leanToLeftPurlin.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin);

    var leanToLeftPurlin1 = structure.createPurlin();;
    leanToLeftPurlin1.position.y = 2.33;
    leanToLeftPurlin1.position.x = 3.06;
    leanToLeftPurlin1.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin1);

    var leanToLeftPurlin2 = structure.createPurlin();;
    leanToLeftPurlin2.position.y = 2.28;
    leanToLeftPurlin2.position.x = 3.56;
    leanToLeftPurlin2.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin2);

    var leanToLeftPurlin3 = structure.createPurlin();;
    leanToLeftPurlin3.position.y = 2.25;
    leanToLeftPurlin3.position.x = 4.06;
    leanToLeftPurlin3.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin3);

    var leanToLeftPurlin4 = structure.createPurlin();;
    leanToLeftPurlin4.position.y = 2.20;
    leanToLeftPurlin4.position.x = 4.56;
    leanToLeftPurlin4.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin4);

    var leanToLeftPurlin5 = structure.createPurlin();;
    leanToLeftPurlin5.position.y = 2.16;
    leanToLeftPurlin5.position.x = 4.90;
    leanToLeftPurlin5.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin5);

    var leanToLeftRoof = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 5.1 }, scene);
    leanToLeftRoof.position.y = 2.33;
    leanToLeftRoof.position.x = 3.75;
    leanToLeftRoof.rotation = new Vector3(0, 0, -0.0872665);
    leanToLeftRoofs.push(leanToLeftRoof);

    var leanToLeftwall = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.2, depth: 5.1 }, scene);
    leanToLeftwall.position.y = 1.1;
    leanToLeftwall.position.x = 5;
    leanToLeftwall.rotation = new Vector3(0, 0, 29.85)
    leanToLeftWalls.push(leanToLeftwall);

    var leanToLeftPartWall = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 2.2 }, scene);
    leanToLeftPartWall.position.y = 1.1;
    leanToLeftPartWall.position.x = 3.75;
    leanToLeftPartWall.position.z = 2.66;
    leanToLeftPartWall.rotation = new Vector3(1.5708, 0, 0)

    var leanToLeftPartWallPurlins = [];
    var leanToLeftPartWallPurlin = structure.createPurlin();
    leanToLeftPartWallPurlin.rotation = new Vector3(0, 11, 9.4)
    leanToLeftPartWallPurlin.position.y = 1.88;
    leanToLeftPartWallPurlin.scaling.z = 0.49;
    leanToLeftPartWallPurlin.position.z = 2.6;
    leanToLeftPartWallPurlin.position.x = 3.75;
    leanToLeftPartWallPurlins.push(leanToLeftPartWallPurlin);
    var leanToLeftPartWallPurlin1 = structure.createPurlin();
    leanToLeftPartWallPurlin1.rotation = new Vector3(0, 11, 9.4)
    leanToLeftPartWallPurlin1.position.y = 1.43;
    leanToLeftPartWallPurlin1.scaling.z = 0.49;
    leanToLeftPartWallPurlin1.position.z = 2.6;
    leanToLeftPartWallPurlin1.position.x = 3.75;
    leanToLeftPartWallPurlins.push(leanToLeftPartWallPurlin1);
    var leanToLeftPartWallPurlin2 = structure.createPurlin();
    leanToLeftPartWallPurlin2.position.y = 1.00;
    leanToLeftPartWallPurlin2.scaling.z = 0.49;
    leanToLeftPartWallPurlin2.position.z = 2.6;
    leanToLeftPartWallPurlin2.position.x = 3.75;
    leanToLeftPartWallPurlin2.rotation = new Vector3(0, 11, 9.4)
    leanToLeftPartWallPurlins.push(leanToLeftPartWallPurlin2);
    var leanToLeftPartWallPurlin3 = structure.createPurlin();
    leanToLeftPartWallPurlin3.position.y = 0.5;
    leanToLeftPartWallPurlin3.scaling.z = 0.49;
    leanToLeftPartWallPurlin3.position.z = 2.6;
    leanToLeftPartWallPurlin3.position.x = 3.75;
    leanToLeftPartWallPurlin3.rotation = new Vector3(0, 11, 9.4)
    leanToLeftPartWallPurlins.push(leanToLeftPartWallPurlin3);

    if (awningDegree != null) {
        var pitchInfo = awningPitch[localStorage.getItem("leftAwningPitch")];
        topCenterAwningsLeft = pitchInfo.topCenterLeft;
    }
    // Define the vertices of the triangle for awnings wall
    var positions = [
        -1, 0, 0,   // Vertex 1: Bottom left corner
        1.5, 0, 0,    // Vertex 2: Bottom right corner
        -1, topCenterAwningsLeft, 0    // Vertex 3: Top left corner
    ];

    // Define the indices that make up the triangle
    var indices = [
        0, 1, 2  // Indices to form a triangle with the defined vertices
    ];

    // Create a VertexData object
    var vertexData = new VertexData();

    // Assign the positions and indices to the VertexData object
    vertexData.positions = positions;
    vertexData.indices = indices;

    // Apply the VertexData to a mesh
    var leftAwningTriangle = new Mesh("triangle", scene);
    vertexData.applyToMesh(leftAwningTriangle);

    // Create a standard material for the triangle
    var material = new StandardMaterial("triangleMaterial", scene);
    material.backFaceCulling = false; // Make the material double-sided
    leftAwningTriangle.material = material;
    leftAwningTriangle.position.z = 2.56;
    leftAwningTriangle.position.x = 3.4;
    leftAwningTriangle.position.y = 2.2;



    //Lean To right

    var leanToRightCol3 = structure.ubColumn();
    leanToRightCol3.position.y = 1;
    leanToRightCol3.position.x = -4.9;
    leanToRightCol3.position.z = 2.5;
    leanToRightCol3.scaling.y = 0.98;
    leantorightcols.push(leanToRightCol3);

    // var leanToRightCol4 = structure.ubColumn();
    // leanToRightCol4.position.y = 1;
    // leanToRightCol4.position.x = -4.9;
    // leanToRightCol4.position.z = -2.5;
    // leanToRightCol4.scaling.y = 0.98;
    // leantorightcols.push(leanToRightCol4);

    var leanToRightPurlin = structure.createPurlin();;
    leanToRightPurlin.position.y = 2.38;
    leanToRightPurlin.position.x = -2.56;
    leanToRightPurlin.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin);

    var leanToRightPurlin1 = structure.createPurlin();;
    leanToRightPurlin1.position.y = 2.33;
    leanToRightPurlin1.position.x = -3.06;
    leanToRightPurlin1.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin1);

    var leanToRightPurlin2 = structure.createPurlin();;
    leanToRightPurlin2.position.y = 2.28;
    leanToRightPurlin2.position.x = -3.56;
    leanToRightPurlin2.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin2);

    var leanToRightPurlin3 = structure.createPurlin();;
    leanToRightPurlin3.position.y = 2.25;
    leanToRightPurlin3.position.x = -4.06;
    leanToRightPurlin3.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin3);

    var leanToRightPurlin4 = structure.createPurlin();;
    leanToRightPurlin4.position.y = 2.20;
    leanToRightPurlin4.position.x = -4.56;
    leanToRightPurlin4.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin4);

    var leanToRightPurlin5 = structure.createPurlin();;
    leanToRightPurlin5.position.y = 2.16;
    leanToRightPurlin5.position.x = -4.90;
    leanToRightPurlin5.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin5);


    if (localStorage.getItem("rafter") === "truss") {
        var leanToRightRafter = structure.truss();
    } else {
        var leanToRightRafter = structure.rafter();
    }
    leanToRightRafter.position.y = 2.15;
    leanToRightRafter.position.z = 2.5
    leanToRightRafter.position.x = - 3.7
    leanToRightRafter.rotation = new Vector3(0, 3.14159, 1.48353);
    leanToRightRafter.scaling.y = 1
    leanToRightRoofs.push(leanToRightRafter)

    // var leanToRightRafter1 = structure.rafter();
    // leanToRightRafter1.position.y = 2.15;
    // leanToRightRafter1.position.z = -2.5
    // leanToRightRafter1.position.x= - 3.7
    // leanToRightRafter1.rotation = new Vector3(0,3.14159,1.48353);
    // leanToRightRafter1.scaling.y = 1
    // leanToRightRoofs.push(leanToRightRafter1);

    var leanToRightRoof = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 5.1 }, scene);
    leanToRightRoof.position.y = 2.33;
    leanToRightRoof.position.x = -3.75;
    leanToRightRoof.rotation = new Vector3(0, 0, 0.0872665);
    leanToRightRoofs.push(leanToRightRoof);

    var leanToRightWall = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.2, depth: 5.1 }, scene);
    leanToRightWall.position.y = 1.1;
    leanToRightWall.position.x = - 5;
    leanToRightWall.rotation = new Vector3(0, 0, 29.85)
    leanToRightWalls.push(leanToRightWall);

    var leanToRightPartWall = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 2.2 }, scene);
    leanToRightPartWall.position.y = 1.1;
    leanToRightPartWall.position.x = -3.75;
    leanToRightPartWall.position.z = 2.67;
    leanToRightPartWall.rotation = new Vector3(1.5708, 0, 0)

    var leanToRightPartWallPurlins = [];
    var leanToRightPartWallPurlin = structure.createPurlin();
    leanToRightPartWallPurlin.rotation = new Vector3(0, 11, 9.4)
    leanToRightPartWallPurlin.position.y = 1.88;
    leanToRightPartWallPurlin.scaling.z = 0.49;
    leanToRightPartWallPurlin.position.z = 2.6;
    leanToRightPartWallPurlin.position.x = -3.75;
    leanToRightPartWallPurlins.push(leanToRightPartWallPurlin);
    var leanToRightPartWallPurlin1 = structure.createPurlin();
    leanToRightPartWallPurlin1.rotation = new Vector3(0, 11, 9.4)
    leanToRightPartWallPurlin1.position.y = 1.43;
    leanToRightPartWallPurlin1.scaling.z = 0.49;
    leanToRightPartWallPurlin1.position.z = 2.6;
    leanToRightPartWallPurlin1.position.x = -3.75;
    leanToRightPartWallPurlins.push(leanToRightPartWallPurlin1);
    var leanToRightPartWallPurlin2 = structure.createPurlin();
    leanToRightPartWallPurlin2.position.y = 1.00;
    leanToRightPartWallPurlin2.scaling.z = 0.49;
    leanToRightPartWallPurlin2.position.z = 2.6;
    leanToRightPartWallPurlin2.position.x = -3.75;
    leanToRightPartWallPurlin2.rotation = new Vector3(0, 11, 9.4)
    leanToRightPartWallPurlins.push(leanToRightPartWallPurlin2);
    var leanToRightPartWallPurlin3 = structure.createPurlin();
    leanToRightPartWallPurlin3.position.y = 0.5;
    leanToRightPartWallPurlin3.scaling.z = 0.49;
    leanToRightPartWallPurlin3.position.z = 2.6;
    leanToRightPartWallPurlin3.position.x = -3.75;
    leanToRightPartWallPurlin3.rotation = new Vector3(0, 11, 9.4)
    leanToRightPartWallPurlins.push(leanToRightPartWallPurlin3);

    if (awningDegree != null) {
        var pitchInfo = awningPitch[localStorage.getItem("rightAwningPitch")];
        topCenterAwningsRight = pitchInfo.topCenterLeft;
    }
    // Define the vertices of the triangle
    var positions = [
        -1, 0, 0,   // Vertex 1: Bottom left corner
        1.5, 0, 0,    // Vertex 2: Bottom right corner
        -1, topCenterAwningsRight, 0    // Vertex 3: Top left corner
    ];

    // Define the indices that make up the triangle
    var indices = [
        0, 1, 2  // Indices to form a triangle with the defined vertices
    ];

    // Create a VertexData object
    var vertexData = new VertexData();

    // Assign the positions and indices to the VertexData object
    vertexData.positions = positions;
    vertexData.indices = indices;

    // Apply the VertexData to a mesh
    var rightAwningTriangle = new Mesh("triangle", scene);
    vertexData.applyToMesh(rightAwningTriangle);

    // Create a standard material for the triangle
    var material = new StandardMaterial("triangleMaterial", scene);
    material.backFaceCulling = false; // Make the material double-sided
    rightAwningTriangle.material = material;
    rightAwningTriangle.position.z = 2.56;
    rightAwningTriangle.position.x = -3.4;
    rightAwningTriangle.position.y = 2.2;
    rightAwningTriangle.rotation = new Vector3(0, 3.14159, 0)


    //create measurement items
    // Create arrow lines representing the width of the mesh
    var width = 2.15; // Width of the arrow lines
    var startPoint = new Vector3(3, 0.1, 0);
    var endPoint1 = new Vector3(3, 0.1, -width); // Endpoint for the first arrow line
    var endPoint2 = new Vector3(3, 0.1, width); // Endpoint for the second arrow line

    // Create the arrow lines
    var arrowLine1 = MeshBuilder.CreateTube("arrowLine1", { path: [startPoint, endPoint1], radius: 0.05 }, scene);
    var arrowLine2 = MeshBuilder.CreateTube("arrowLine2", { path: [startPoint, endPoint2], radius: 0.05 }, scene);


    // Create arrowhead meshes
    var arrowhead1 = MeshBuilder.CreateCylinder("arrowhead1", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);
    var arrowhead2 = MeshBuilder.CreateCylinder("arrowhead2", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);

    // Position arrowhead meshes at the ends of arrow lines
    arrowhead1.position = endPoint1;
    arrowhead2.position = endPoint2;

    // Rotate arrowhead meshes to align with the direction of the arrow lines
    arrowhead1.rotationQuaternion = Quaternion.RotationAxis(Axis.X, -Math.PI / 2); // rotation adjustment - important
    arrowhead2.rotationQuaternion = Quaternion.RotationAxis(Axis.X, Math.PI / 2);

    // Color arrow lines and arrowhead meshes
    arrowLine1.material = new StandardMaterial("arrowLineMat1", scene);
    arrowLine1.material.diffuseColor = new Color3(1, 1, 1); // color assignment
    arrowLine2.material = new StandardMaterial("arrowLineMat2", scene);
    arrowLine2.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead1.material = new StandardMaterial("arrowheadMat1", scene);
    arrowhead1.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead2.material = new StandardMaterial("arrowheadMat2", scene);
    arrowhead2.material.diffuseColor = new Color3(1, 1, 1);

    arrows.push(arrowLine1);
    arrows.push(arrowLine2);
    arrows.push(arrowhead1);
    arrows.push(arrowhead2);
    var leantoleftcolsmesh = Mesh.MergeMeshes(leantoleftcols, true, true, undefined, false, true);
    leantoleftcolsmesh.name = "leantoleftcols";
    var leantorightcolsmesh = Mesh.MergeMeshes(leantorightcols, true, true, undefined, false, true);
    leantorightcolsmesh.name = "leantorightcols";
    // var container_center = BABYLON.Mesh.MergeMeshes(centercontainer_columns.getChildMeshes(), true, true, undefined, false, true);


    var leftRoofMesh = Mesh.MergeMeshes(leftRoof, true, true, undefined, false, true);
    var rightRoofMesh = Mesh.MergeMeshes(rightRoof, true, true, undefined, false, true);
    leftRoofMesh.name = 'lRoof';
    rightRoofMesh.name = 'rRoof';
    var leftWallMesh = Mesh.MergeMeshes(leftSide, true, true, undefined, false, true);
    var rightWallMesh = Mesh.MergeMeshes(rightSide, true, true, undefined, false, true);
    var leanToLeftWallsMesh = Mesh.MergeMeshes(leanToLeftWalls, true, true, undefined, false, true);
    leanToLeftWallsMesh.name = "leanToLeftWalls";
    var leanToLeftRoofMesh = Mesh.MergeMeshes(leanToLeftRoofs, true, true, undefined, false, true);
    leanToLeftRoofMesh.name = "leanToLeftRoofs";
    var leanToRightWallsMesh = Mesh.MergeMeshes(leanToRightWalls, true, true, undefined, false, true);
    leanToRightWallsMesh.name = "leanToRightWalls";
    var leanToLeftPartWallPurlinMesh = Mesh.MergeMeshes(leanToLeftPartWallPurlins, true, true, undefined, false, true);
    leanToLeftPartWallPurlinMesh.name = "leanToLeftPurlins";
    var leanToRightRoofMesh = Mesh.MergeMeshes(leanToRightRoofs, true, true, undefined, false, true);
    var leanToRightPartWallPurlinMesh = Mesh.MergeMeshes(leanToRightPartWallPurlins, true, true, undefined, false, true);
    leanToRightPartWallPurlinMesh.name = "leanToRightPurlins";
    leanToRightRoofMesh.name = "leanToRightRoofs";
    leanToLeftPartWall.name = "leanToLeftPartWall";
    leftAwningTriangle.name = "leanToLeftTriangle";
    leanToRightPartWall.name = "leanToRightPartWall";
    rightAwningTriangle.name = "leanToRightTriangle";
    var arrowMesh = Mesh.MergeMeshes(arrows, true, true, undefined, false, true);
    var frontWallMesh = Mesh.MergeMeshes(frontSide, true, true, undefined, false, true);
    var frontTopMesh = Mesh.MergeMeshes(frontTop, true, true, undefined, false, true);
    var backWallMesh = Mesh.MergeMeshes(backSide, true, true, undefined, false, true);
    var backTopMesh = Mesh.MergeMeshes(backTop, true, true, undefined, false, true);
    var roofCollection = [leftRoofMesh, rightRoofMesh];
    var leanToLeftCollection = [leanToLeftWallsMesh, leanToLeftRoofMesh, leantoleftcolsmesh, leanToLeftPartWall, leftAwningTriangle, leanToLeftPartWallPurlinMesh, ALtruss ];
    var leanToRightCollection = [leanToRightWallsMesh, leanToRightRoofMesh, leantorightcolsmesh, leanToRightPartWall, rightAwningTriangle, leanToRightPartWallPurlinMesh, ARtruss];

    var roof_container = new Mesh("fRoof", scene);
    roofCollection[0].setParent(roof_container);
    roofCollection[1].setParent(roof_container);
    roof_container.position.y = 0.435;
    
    if (degree != null) {
        var pitchInfo = pitch[degree];
        rightRoofMesh.rotation = new Vector3(0, 0, pitchInfo.rightRoofMesh.rotation[2]);
        rightRoofMesh.position = new Vector3(pitchInfo.rightRoofMesh.position.x, 0, 0);
        rightRoofMesh.scaling = new Vector3(pitchInfo.rightRoofMesh.scaling.x, 1, 1);


        leftRoofMesh.rotation = new Vector3(0, 0, pitchInfo.leftRoofMesh.rotation[2]);
        leftRoofMesh.position = new Vector3(pitchInfo.leftRoofMesh.position.x, 0, 0);
        leftRoofMesh.scaling.x = pitchInfo.leftRoofMesh.scaling.x;

        roof_container.position.y = pitchInfo.leftRoofMesh.position.y;
    }
    var leftAwningFlag = localStorage.getItem("leftAwning");
    var leftCantileverFlag = localStorage.getItem("leftCantilever");
    var rightAwningFlag = localStorage.getItem("rightAwning");
    var rightCantileverFlag = localStorage.getItem("rightCantilever");

    if (awningDegree != null) {
        var pitchInfo = awningPitch[localStorage.getItem("leftAwningPitch")];
        leanToLeftRoofMesh.rotation = new Vector3(0, 0, pitchInfo.leanToLeftRoofMesh.rotation[2]);
        leanToLeftRoofMesh.position = new Vector3(-0.45, pitchInfo.leanToLeftRoofMesh.position.y, 0);
        leanToLeftRoofMesh.scaling = new Vector3(pitchInfo.leanToLeftRoofMesh.scaling.x, 1, 1);
        leanToLeftWallsMesh.position = new Vector3(0, pitchInfo.leanToLeftWallsMesh.position.y, 0);
        leantoleftcolsmesh.position.y = pitchInfo.leanToLeftWallsMesh.position.y;
        leanToLeftPartWall.position.y = pitchInfo.leanToLeftPartition.position.y;
        leftAwningTriangle.position.y = pitchInfo.leanToLeftTriangle.position.y;
        ALtruss.position.y = pitchInfo.leanToLeftTriangle.position.y;

    }

    if (awningDegree != null) {
        var pitchInfo = awningPitch[localStorage.getItem("rightAwningPitch")];
        leanToRightRoofMesh.rotation = new Vector3(0, 0, pitchInfo.leanToRightRoofMesh.rotation[2]);
        leanToRightRoofMesh.position = new Vector3(pitchInfo.leanToRightRoofMesh.position.x, pitchInfo.leanToRightRoofMesh.position.y, 0);
        leanToRightRoofMesh.scaling = new Vector3(pitchInfo.leanToRightRoofMesh.scaling.x, 1, 1);
        leanToRightWallsMesh.position = new Vector3(0, pitchInfo.leanToRightWallsMesh.position.y, 0);
        leantorightcolsmesh.position = new Vector3(0, pitchInfo.leanToRightWallsMesh.position.y, 0);
        leanToRightPartWall.position.y = pitchInfo.leanToLeftPartition.position.y;
        rightAwningTriangle.position.y = pitchInfo.leanToLeftTriangle.position.y;
        ARtruss.position.y = pitchInfo.leanToLeftTriangle.position.y;

        //for cantilever frame
        // rightAwningMesh.rotation = new Vector3(0,0,pitchInfo.leanToRightRoofMesh.rotation[2]);
        // rightAwningMesh.position = new Vector3 (pitchInfo.leanToRightRoofMesh.position.x,pitchInfo.leanToRightRoofMesh.position.y,0);
        // rightAwningMesh.scaling = new Vector3 (pitchInfo.leanToRightRoofMesh.scaling.x,1,1);
    }
    var container_left = new BABYLON.Mesh("container_left", scene);
    container_left.position = new BABYLON.Vector3(0, 0, 0); // Set container_left's initial position
    var container_right = new BABYLON.Mesh("container_right", scene);
    container_right.position = new BABYLON.Vector3(0, 0, 0); // Set container_right's initial position
    const leftAwningGroundTile = MeshBuilder.CreateBox("leftAwningGroundTile", {
        height: 1,   // The thickness of the ground tile
        width: 2.6,      // The width of the ground tile
        depth: 5.3     // The depth of the ground tile
    });
    leftAwningGroundTile.position.x = 3.7;
    const rightAwningGroundTile = MeshBuilder.CreateBox("rightAwningGroundTile", {
        height: 1,   // The thickness of the ground tile
        width: 2.6,      // The width of the ground tile
        depth: 5.3     // The depth of the ground tile
    });
    rightAwningGroundTile.position.x = -3.7;
    if(localStorage.getItem('leftAwning') === 'true' && localStorage.getItem('slab') === 'Enable'){
        leftAwningGroundTile.isVisible = true;
    }else{
        leftAwningGroundTile.isVisible = false;
    }
    if(localStorage.getItem('rightAwning') === 'true' && localStorage.getItem('slab') === 'Enable'){
        rightAwningGroundTile.isVisible = true;
    }else{
        rightAwningGroundTile.isVisible = false;
    }
    const groundTile = MeshBuilder.CreateBox("groundTile", {
        height: 1,   // The thickness of the ground tile
        width: 5,      // The width of the ground tile
        depth: 5.3     // The depth of the ground tile
    });
    groundTile.position.y = -0.2;
    if (localStorage.getItem('slab') === 'Disable') {
        groundTile.isVisible = false;
        leftAwningGroundTile.isVisible = false;
        rightAwningGroundTile.isVisible = false;
        // leantoleftcolsmesh.position.y = 0;
        // leantorightcolsmesh.position.y = 0;
        container_left.position.y = 0;
        container_right.position.y = 0;
        centercontainer_columns.position.y = 0
        roofCollection[0].position.y = 0;
        roofCollection[1].position.y = 0;
        leftWallMesh.position.y = 0
        rightWallMesh.position.y = 0
        frontWallMesh.position.y = 0
        backWallMesh.position.y = 0
        Ltruss.position.y += 0;
        Rtruss.position.y += 0;
        ALtruss.position.y += 0;
        ARtruss.position.y += 0;
        frontTopMesh.position.y = 0
        backTopMesh.position.y = 0
    }

    // if (localStorage.getItem('slab') === 'Enable') {
    //     //reAdjusting positions to include slab
    //     // leantoleftcolsmesh
    //     // leantorightcolsmesh
    //     container_left.position.y = 0.3;
    //     container_right.position.y = 0.3;
    //     leantoleftcolsmesh.position.y = 0.3;
    //     leantorightcolsmesh.position.y = 0.3;
    //     centercontainer_columns.position.y = 0.3
    //     roofCollection[0].position.y = 0.3;
    //     roofCollection[1].position.y = 0.3;
    //     leftWallMesh.position.y = 0.3
    //     rightWallMesh.position.y = 0.3
    //     frontWallMesh.position.y = 0.3
    //     backWallMesh.position.y = 0.3
    //     // leanToLeftWallsMesh
    //     // leanToLeftRoofMesh 
    //     // leanToLeftPartWallPurlinsMesh
    //     // leanToRightWallsMesh
    //     // leanToRightRoofMesh
    //     // leanToRightPartWallPurlinsMesh
    //     frontTopMesh.position.y = 0.3
    //     backTopMesh.position.y = 0.3
    // }

    if (parseInt(localStorage.getItem("slabSize")) > 150 && localStorage.getItem('slab') === 'Enable') {
        //reAdjusting positions to include slab
        // leantoleftcolsmesh
        // leantorightcolsmesh
        groundTile.position.y = 0;
        leftAwningGroundTile.position.y = 0;
        rightAwningGroundTile.position.y = 0;
        container_left.position.y = 0.4;
        container_right.position.y = 0.4;
        leantoleftcolsmesh.position.y += 0.4;
        leantorightcolsmesh.position.y += 0.4;
        centercontainer_columns.position.y = 0.4
        roofCollection[0].position.y = 0.4;
        roofCollection[1].position.y = 0.4;
        leftWallMesh.position.y = 0.4
        rightWallMesh.position.y = 0.4
        frontWallMesh.position.y = 0.4
        backWallMesh.position.y = 0.4
        Ltruss.position.y += 0.4;
        Rtruss.position.y += 0.4;
        ALtruss.position.y += 0.4;
        ARtruss.position.y += 0.4;
        frontTopMesh.position.y = 0.4
        backTopMesh.position.y = 0.4
    } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100 && localStorage.getItem('slab') === 'Enable') {
        //reAdjusting positions to include slab
        // leantoleftcolsmesh
        // leantorightcolsmesh
        groundTile.position.y = -0.3;
        leftAwningGroundTile.position.y = -0.3;
        rightAwningGroundTile.position.y = -0.3;
        container_left.position.y = 0.2;
        container_right.position.y = 0.2;
        leantoleftcolsmesh.position.y += 0.2;
        leantorightcolsmesh.position.y += 0.2;
        centercontainer_columns.position.y = 0.2
        roofCollection[0].position.y = 0.2;
        roofCollection[1].position.y = 0.2;
        leftWallMesh.position.y = 0.2
        rightWallMesh.position.y = 0.2
        frontWallMesh.position.y = 0.2
        backWallMesh.position.y = 0.2
        Ltruss.position.y += 0.2;
        Rtruss.position.y += 0.2;
        ALtruss.position.y += 0.2;
        ARtruss.position.y += 0.2;
        frontTopMesh.position.y = 0.2
        backTopMesh.position.y = 0.2
    } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50 && localStorage.getItem('slab') === 'Enable') {
        //reAdjusting positions to include slab
        // leantoleftcolsmesh
        // leantorightcolsmesh
        groundTile.position.y = -0.2;
        leftAwningGroundTile.position.y = -0.2;
        rightAwningGroundTile.position.y = -0.2;
        container_left.position.y = 0.1;
        container_right.position.y = 0.1;
        leantoleftcolsmesh.position.y += 0.1;
        leantorightcolsmesh.position.y += 0.1;
        centercontainer_columns.position.y = 0.1
        roofCollection[0].position.y = 0.1;
        roofCollection[1].position.y = 0.1;
        leftWallMesh.position.y = 0.1
        rightWallMesh.position.y = 0.1
        frontWallMesh.position.y = 0.1
        backWallMesh.position.y = 0.1
        Ltruss.position.y += 0.1;
        Rtruss.position.y += 0.1;
        ALtruss.position.y += 0.1;
        ARtruss.position.y += 0.1;
        frontTopMesh.position.y = 0.1
        backTopMesh.position.y = 0.1
    } else if (parseInt(localStorage.getItem("slabSize")) < 50 && localStorage.getItem('slab') === 'Enable') {
        //reAdjusting positions to include slab
        groundTile.position.y = -0.3;
        leftAwningGroundTile.position.y = -0.3;
        rightAwningGroundTile.position.y = -0.3;
        container_left.position.y = 0;
        container_right.position.y = 0;
        leantoleftcolsmesh.position.y += 0;
        leantorightcolsmesh.position.y += 0;
        centercontainer_columns.position.y = 0
        roofCollection[0].position.y = 0;
        roofCollection[1].position.y = 0;
        leftWallMesh.position.y = 0
        rightWallMesh.position.y = 0
        frontWallMesh.position.y = 0
        backWallMesh.position.y = 0
        Ltruss.position.y += 0;
        Rtruss.position.y += 0;
        ALtruss.position.y += 0;
        ARtruss.position.y += 0;
        frontTopMesh.position.y = 0
        backTopMesh.position.y = 0
    }

    // Add child meshes to the container_left
    leanToLeftWallsMesh.parent = container_left;
    leanToLeftPartWall.parent = container_left;
    leftAwningTriangle.parent = container_left;
    leanToLeftRoofMesh.parent = container_left;
    // leantoleftcolsmesh.parent = container_left;
    leanToLeftPartWallPurlinMesh.parent = container_left;

    // Add child meshes to the container_right
    leanToRightWallsMesh.parent = container_right;
    leanToRightPartWall.parent = container_right;
    rightAwningTriangle.parent = container_right;
    leanToRightRoofMesh.parent = container_right;
    // leantorightcolsmesh.parent = container_right;
    leanToRightPartWallPurlinMesh.parent = container_right;

    // var leanToLeftMesh = Mesh.MergeMeshes(leanToLeftCollection, true, true, undefined, false, true);
    // var leanToRightMesh = Mesh.MergeMeshes(leanToRightCollection, true, true, undefined, false, true);


    // Calculate the offset based on the total depth of the front bay
    var tempDimensions = 5.1;
    var centerBayOffsetZ = tempDimensions * distance;

    //adding offset to mesh positioning
    leftAwningGroundTile.position.z -= centerBayOffsetZ;
    rightAwningGroundTile.position.z -= centerBayOffsetZ;
    groundTile.position.z -= centerBayOffsetZ;
    backWallMesh.position.z -= centerBayOffsetZ;
    backTopMesh.position.z -= centerBayOffsetZ;
    frontWallMesh.position.z -= centerBayOffsetZ;
    frontTopMesh.position.z -= centerBayOffsetZ;
    centercontainer_columns.position.z -= centerBayOffsetZ;
    roofCollection[0].position.z -= centerBayOffsetZ;
    roofCollection[1].position.z -= centerBayOffsetZ;
    leftWallMesh.position.z -= centerBayOffsetZ;
    rightWallMesh.position.z -= centerBayOffsetZ;
    Rtruss.position.z -= centerBayOffsetZ;
    Ltruss.position.z -= centerBayOffsetZ;
    // leftAwningMesh.position.z -= centerBayOffsetZ;
    // rightAwningMesh.position.z -= centerBayOffsetZ;
    // leanToLeftMesh.position.z -= centerBayOffsetZ;
    leanToLeftCollection.forEach((mesh) => {
        mesh.position.z -= centerBayOffsetZ;
    });
    leanToRightCollection.forEach((mesh) => {
        mesh.position.z -= centerBayOffsetZ;
    });
    // leanToRightMesh.position.z -= centerBayOffsetZ;
    arrowMesh.position.z -= centerBayOffsetZ;
    if (sessionStorage.getItem("leftArrowPosition_") != 0 && sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0 && sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
        console.log("hitting all 3")
        arrowMesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"));
    } else if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0 && sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
        console.log("hitting the problematic 2")
        arrowMesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_"));
    } else if (sessionStorage.getItem("leftArrowPosition_") != 0 && sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0) {
        arrowMesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"));
    } else if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0) {
        arrowMesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"));
    } else if (sessionStorage.getItem("leftArrowPosition_") != 0) {
        arrowMesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_"));
    } else if (sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
        arrowMesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_"));
    }

    //Assigning visibility to hidden by default meshes
    if (leftAwningFlag === 'false') {
        leanToLeftCollection.forEach((mesh) => {
            mesh.isVisible = false;

        });
    } else {
        leanToLeftCollection.forEach(mesh => {
            if (mesh.name === 'leanToLeftTriangle' || mesh.name === "leanToLeftPartWall" || mesh.name === "leanToLeftPurlins") {
                mesh.isVisible = false;
            }
        })
    }
    // if(leftCantileverFlag === 'false'){
    //     leftAwningMesh.isVisible = false;
    // }
    // if(rightCantileverFlag === 'false'){
    //     rightAwningMesh.isVisible = false;
    // }
    if (rightAwningFlag === 'false') {
        leanToRightCollection.forEach((mesh) => {
            mesh.isVisible = false;
        });
    } else {
        leanToRightCollection.forEach(mesh => {
            if (mesh.name === 'leanToRightTriangle' || mesh.name === "leanToRightPartWall" || mesh.name === "leanToRightPurlins") {
                mesh.isVisible = false;
            }
        })
    }
    // leanToRightMesh.isVisible = false;
    rightWallMesh.isVisible = true;
    leftWallMesh.isVisible = true;
    frontWallMesh.isVisible = false;
    frontTopMesh.isVisible = false;
    backWallMesh.isVisible = false;
    backTopMesh.isVisible = false;

    //naming convention for referencing meshes
    arrowMesh.name = 'Larrow';
    leftWallMesh.name = 'Lwall';

    rightWallMesh.name = 'Rwall';
    frontWallMesh.name = 'FWall';
    backWallMesh.name = 'BWall';
    frontTopMesh.name = 'FTop';
    backTopMesh.name = 'BTop'
    // leanToLeftCollection.name = 'leanToLeft';
    // leanToRightMesh.name = 'leanToRight';
    // leftAwningMesh.name = 'cantileverLeft';
    // rightAwningMesh.name = 'cantileverRight';
    var leftAwningMesh = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 2.2 }, scene);
    leftAwningMesh.isVisible = false;
    var rightAwningMesh = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 2.2 }, scene);
    rightAwningMesh.isVisible = false;

    if (localStorage.getItem("LeftWallsVisible") == "false") {
        leftWallMesh.isVisible = false
    }
    if (localStorage.getItem("RightWallsVisible") == "false") {
        rightWallMesh.isVisible = false
    }
    if (localStorage.getItem("LeftAwningWallsVisible") == "false") {
        leanToLeftWallsMesh.isVisible = false
    }
    if (localStorage.getItem("RightAwningWallsVisible") == "false") {
        leanToRightWallsMesh.isVisible = false
    }
    var rightMezzanine = mezzanine.rightMezzanine(scene);
    var leftMezzanine = mezzanine.leftMezzanine(scene);
    rightMezzanine.position.z -= centerBayOffsetZ;
    leftMezzanine.position.z -= centerBayOffsetZ;

    // var left_bracing = bracing.left_bracing(scene);
    // var right_bracing = bracing.right_bracing(scene);
    // left_bracing.position.z -= centerBayOffsetZ;
    // right_bracing.position.z -= centerBayOffsetZ;
    return [centercontainer_columns, roof_container, leftWallMesh, rightWallMesh, leftAwningMesh, rightAwningMesh, leanToLeftCollection[0], leanToLeftCollection[1], leanToLeftCollection[2], leanToRightCollection[0], leanToRightCollection[1], leanToRightCollection[2], frontWallMesh, frontTopMesh, backWallMesh, backTopMesh, arrowMesh, leanToLeftCollection[3], leanToLeftCollection[4], leanToRightCollection[3], leanToRightCollection[4], container_left, container_right, leanToLeftCollection[5], leanToRightCollection[5], rightMezzanine, leftMezzanine, colCenter1, colCenter2, Rtruss, ARtruss, Ltruss, ALtruss,  groundTile, leftAwningGroundTile, rightAwningGroundTile];
};


//<=================== BackBay Creation Logic =====================>//
///changes....
export const createBackBay = function (
    centerBayDimensions,
    centerBayPosition,
    distance,
    scene,
    degree,
    awningDegree
) {
    var leftRoof = [];
    var rightRoof = [];
    var leftSide = [];
    var rightSide = [];
    var backSide = [];
    var leftArrows = [];
    var backArrows = [];
    var backTop = [];
    var frontSide = [];
    var frontTop = [];

    const container_columns = new BABYLON.Mesh("container_columns", scene);

    var col1 = structure.ubColumn(scene, material);
    col1.position.y = 1.2;
    col1.position.x = -2.35;
    col1.position.z = 2.5;
    col1.parent = container_columns;
    col1.name = 'col1';
    col1.id = "col1"; // Naming convention for col1
    // console.log("c0l1 name ", col1.name);  // Output: "col1"
    // console.log("c0l1 id", col1.id);    // Output: "box_merged"
    // console.log("c0l1", col1.isVisible);

    var col2 = structure.ubColumn(scene, material);
    col2.position.y = 1.2;
    col2.position.x = 2.35;
    col2.position.z = 2.5;
    col2.parent = container_columns;
    col2.id = "col2";
    col2.name = 'col2'; // Naming convention for col2
    // console.log("col2:", col2);



    if (localStorage.getItem("rafter") === "truss") {
        var rafterFront = structure.truss();
        rafterFront.position.y = 2.45;
    } else {
        var rafterFront = structure.rafter();
        rafterFront.position.y = 2.38;
    }
    rafterFront.position.z = 2.5
    rafterFront.position.x = 1.15
    rafterFront.rotation = new Vector3(0, 0, 1.48353);
    leftRoof.push(rafterFront);


    if (localStorage.getItem("rafter") === "truss") {
        var rafterFront1 = structure.truss();
        rafterFront1.position.y = 2.45;
    } else {
        var rafterFront1 = structure.rafter();
        rafterFront1.position.y = 2.38;
    }
    rafterFront1.position.z = 2.5
    rafterFront1.position.x = -1.15
    rafterFront1.rotation = new Vector3(0, 3.14159, 1.48353);
    rightRoof.push(rafterFront1);

    var bRtruss = structure.gurder()
    bRtruss.position = new Vector3(-2.3, 2.4, 0.);
    bRtruss.rotation = new Vector3(0, Math.PI / 2, Math.PI / 2);
    bRtruss.name = 'brtruss'
    bRtruss.id = 'brtruss'
    bRtruss.isVisible = false;


    var AbRtruss = structure.gurder()
    AbRtruss.position = new Vector3(-4.9, 2.12, 0);
    AbRtruss.rotation = new Vector3(0, Math.PI / 2, Math.PI / 2);
    AbRtruss.name = 'abrtruss'
    AbRtruss.id = 'abrtruss'
    AbRtruss.isVisible = false;

     console.log('bottom rtruss', AbRtruss)
    // loaded_meshes_global.push([Rtruss]);

    var Bltruss = structure.gurder();
    Bltruss.position = new Vector3(2.2, 2.4, 0);
    Bltruss.rotation = new Vector3(0, -Math.PI / 2, Math.PI / 2);
    Bltruss.name = 'bltruss';
    Bltruss.id = 'bltruss';
    Bltruss.isVisible = false;
     console.log('Bltruss created:', Bltruss);


    var ABltruss = structure.gurder();
    ABltruss.position = new Vector3(4.9, 2.12, 0);
    ABltruss.rotation = new Vector3(0, -Math.PI / 2, Math.PI / 2);
    ABltruss.name = 'abltruss';
    ABltruss.id = 'abltruss';
    ABltruss.isVisible = false;
     console.log('ABltruss created:', ABltruss);



    //back side
    var col3 = structure.ubColumn(scene, material);
    col3.position.y = 1.2;
    col3.position.x = -2.35;
    col3.position.z = -2.5;

    col3.parent = container_columns;
    col3.name = 'col3';

    col3.id = "col3";
    // console.log("col3:", col3);

    var col4 = structure.ubColumn(scene, material);
    col4.position.y = 1.2;
    col4.position.x = 2.35;
    col4.position.z = -2.5;

    col4.parent = container_columns;
    col4.name = 'col4';
    col4.id = "col4";
    // console.log("col4:", col4);


    container_columns.parent = container_back;
    // console.log("container_columns:", container_columns);
    // console.log('Children of column_container:', container_columns.getChildMeshes());
    // Store backBayMeshes globally
    // window.backBayMeshes = [col1, col2, col3, col4];
    // loaded_meshes_global = window.loaded_meshes_global || [];
    // loaded_meshes_global.push(col1, col2, col3, col4);
    // console.log("window.loaded_meshes_global:", window.loaded_meshes_global);


    if (localStorage.getItem("rafter") === "truss") {
        var rafterBack = structure.truss();
        rafterBack.position.y = 2.45;
    } else {
        var rafterBack = structure.rafter();
        rafterBack.position.y = 2.38;
    }
    rafterBack.position.z = -2.5
    rafterBack.position.x = 1.15
    rafterBack.rotation = new Vector3(0, 0, 1.48353);
    leftRoof.push(rafterBack);


    if (localStorage.getItem("rafter") === "truss") {
        var rafterBack1 = structure.truss();
        rafterBack1.position.y = 2.45;
    } else {
        var rafterBack1 = structure.rafter();
        rafterBack1.position.y = 2.38;
    }
    rafterBack1.position.z = -2.5
    rafterBack1.position.x = -1.15
    rafterBack1.rotation = new Vector3(0, 3.14159, 1.48353);
    rightRoof.push(rafterBack1);

    //gritLeft
    var gritBox = structure.createPurlin();;
    gritBox.rotation = new Vector3(0, 0, 3.14159)
    gritBox.position.y = 1
    gritBox.position.x = 2.47
    leftSide.push(gritBox);

    var gritBox1 = structure.createPurlin();;
    gritBox1.rotation = new Vector3(0, 0, 3.14159)
    gritBox1.position.y = 1.43
    gritBox1.position.x = 2.47
    leftSide.push(gritBox1);

    var gritBox2 = structure.createPurlin();;
    gritBox2.rotation = new Vector3(0, 0, 3.14159)
    gritBox2.position.y = 0.5
    gritBox2.position.x = 2.47
    leftSide.push(gritBox2);

    var gritBox3 = structure.createPurlin();;
    gritBox3.rotation = new Vector3(0, 0, 3.14159)
    gritBox3.position.y = 1.88
    gritBox3.position.x = 2.47
    leftSide.push(gritBox3);

    //gritRight
    var gritBoxRight = structure.createPurlin();;
    gritBoxRight.rotation = new Vector3(0, 0, 3.14159)
    gritBoxRight.position.y = 1
    gritBoxRight.position.x = - 2.47
    rightSide.push(gritBoxRight);

    var gritBoxRight1 = structure.createPurlin();;
    gritBoxRight1.rotation = new Vector3(0, 0, 3.14159)
    gritBoxRight1.position.y = 1.43
    gritBoxRight1.position.x = - 2.47
    rightSide.push(gritBoxRight1);

    var gritBoxRight2 = structure.createPurlin();;
    gritBoxRight2.rotation = new Vector3(0, 0, 3.14159)
    gritBoxRight2.position.y = 0.5
    gritBoxRight2.position.x = - 2.47
    rightSide.push(gritBoxRight2);

    var gritBoxRight3 = structure.createPurlin();;
    gritBoxRight3.rotation = new Vector3(0, 0, 3.14159)
    gritBoxRight3.position.y = 1.88
    gritBoxRight3.position.x = - 2.47
    rightSide.push(gritBoxRight3);

    //roof purlins left
    var roofPurlinsLeft5 = structure.createPurlin();;
    roofPurlinsLeft5.position.y = 2.4;
    roofPurlinsLeft5.position.x = 2.36;
    roofPurlinsLeft5.rotation = new Vector3(0, 0, 4.53786);
    leftRoof.push(roofPurlinsLeft5);

    var roofPurlinsLeft = structure.createPurlin();;
    roofPurlinsLeft.position.y = 2.43;
    roofPurlinsLeft.position.x = 2;
    roofPurlinsLeft.rotation = new Vector3(0, 0, 4.53786);
    leftRoof.push(roofPurlinsLeft);

    var roofPurlinsLeft1 = structure.createPurlin();;
    roofPurlinsLeft1.rotation = new Vector3(0, 0, 4.53786);
    roofPurlinsLeft1.position.y = 2.48;
    roofPurlinsLeft1.position.x = 1.5;
    leftRoof.push(roofPurlinsLeft1);

    var roofPurlinsLeft2 = structure.createPurlin();;
    roofPurlinsLeft2.rotation = new Vector3(0, 0, 4.53786);
    roofPurlinsLeft2.position.y = 2.52;
    roofPurlinsLeft2.position.x = 1;
    leftRoof.push(roofPurlinsLeft2);

    var roofPurlinsLeft3 = structure.createPurlin();;
    roofPurlinsLeft3.rotation = new Vector3(0, 0, 4.53786);
    roofPurlinsLeft3.position.y = 2.57;
    roofPurlinsLeft3.position.x = 0.5;
    leftRoof.push(roofPurlinsLeft3);

    var roofPurlinsLeft4 = structure.createPurlin();;
    roofPurlinsLeft4.rotation = new Vector3(0, 0, 4.53786);
    roofPurlinsLeft4.position.y = 2.6;
    roofPurlinsLeft4.position.x = 0.08;
    leftRoof.push(roofPurlinsLeft4);

    //roof Purlins right
    var roofPurlinsRight5 = structure.createPurlin();;
    roofPurlinsRight5.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight5.position.y = 2.4
    roofPurlinsRight5.position.x = - 2.38
    rightRoof.push(roofPurlinsRight5);

    var roofPurlinsRight = structure.createPurlin();;
    roofPurlinsRight.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight.position.y = 2.43
    roofPurlinsRight.position.x = - 2
    rightRoof.push(roofPurlinsRight);

    var roofPurlinsRight1 = structure.createPurlin();;
    roofPurlinsRight1.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight1.position.y = 2.48
    roofPurlinsRight1.position.x = -1.5
    rightRoof.push(roofPurlinsRight1);

    var roofPurlinsRight2 = structure.createPurlin();;
    roofPurlinsRight2.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight2.position.y = 2.52
    roofPurlinsRight2.position.x = -1
    rightRoof.push(roofPurlinsRight2);

    var roofPurlinsRight3 = structure.createPurlin();;
    roofPurlinsRight3.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight3.position.y = 2.57
    roofPurlinsRight3.position.x = -0.5
    rightRoof.push(roofPurlinsRight3);

    var roofPurlinsRight4 = structure.createPurlin();;
    roofPurlinsRight4.rotation = new Vector3(0, 0,  1.5708);
    roofPurlinsRight4.position.y = 2.6
    roofPurlinsRight4.position.x = -0.08
    rightRoof.push(roofPurlinsRight4);

    //front side
    var frontgrit = structure.createPurlin();;
    frontgrit.rotation = new Vector3(0, 11, 9.4)
    frontgrit.position.y = 1.88
    frontgrit.position.x = 0
    frontgrit.position.z = 2.62
    frontgrit.scaling.z = 0.98
    frontSide.push(frontgrit);

    var frontgrit1 = structure.createPurlin();;
    frontgrit1.rotation = new Vector3(0, 11, 9.4)
    frontgrit1.position.y = 1.43
    frontgrit1.position.x = 0
    frontgrit1.position.z = 2.62
    frontgrit1.scaling.z = 0.98
    frontSide.push(frontgrit1);

    var frontgrit2 = structure.createPurlin();;
    frontgrit2.rotation = new Vector3(0, 11, 9.4)
    frontgrit2.position.y = 1.00
    frontgrit2.position.x = 0
    frontgrit2.position.z = 2.62;
    frontgrit2.scaling.z = 0.98
    frontSide.push(frontgrit2);

    var frontgrit3 = structure.createPurlin();;
    frontgrit3.rotation = new Vector3(0, 11, 9.4)
    frontgrit3.position.y = 0.5
    frontgrit3.position.x = 0
    frontgrit3.position.z = 2.62
    frontgrit3.scaling.z = 0.98
    frontSide.push(frontgrit3);
    //front cover
    // Define the vertices of the triangle
    if (degree != null) {
        var pitchInfo = pitch[degree];
        topCenter = pitchInfo.topCenter;
    }
    var positions = [
        2.5, 0.1, 0,   // Vertex 1: Bottom left corner
        -2.5, 0.1, 0,   // Vertex 2: Bottom right corner
        0, topCenter, 0  // Vertex 3: Top center corner
    ];

    // Define the indices that make up the triangle
    var indices = [
        0, 1, 2  // Indices to form a triangle with the defined vertices
    ];

    // Create a VertexData object
    var vertexData = new VertexData();

    // Assign the positions and indices to the VertexData object
    vertexData.positions = positions;
    vertexData.indices = indices;

    // Apply the VertexData to a mesh
    var triangle = new Mesh("triangle", scene);
    vertexData.applyToMesh(triangle);

    // Create a standard material for the triangle
    var material = new StandardMaterial("triangleMaterial", scene);
    // material.diffuseColor = new Color3(1, 0, 0); // Red color for the triangle
    material.backFaceCulling = false; // Make the material double-sided
    triangle.material = material;
    triangle.position.y = 2.35;
    triangle.position.z = 2.675;
    triangle.scaling.z = 10;

    var flatFront = MeshBuilder.CreateBox("box", { width: 5, height: 2.9, depth: 0.01 }, scene);
    flatFront.position.y = 1;
    flatFront.position.z = 2.67;
    var frontTop = [];
    frontTop.push(triangle);
    frontSide.push(flatFront);

    var backgrit = structure.createPurlin();;
    backgrit.rotation = new Vector3(0, 1.5708, 3.14159)
    backgrit.position.y = 1.88
    backgrit.position.x = 0
    backgrit.position.z = -2.62
    backgrit.scaling.z = 0.98
    backSide.push(backgrit);

    var backgrit1 = structure.createPurlin();;
    backgrit1.rotation = new Vector3(0, 1.5708, 3.14159)
    backgrit1.position.y = 1.43
    backgrit1.position.x = 0
    backgrit1.position.z = -2.62
    backgrit1.scaling.z = 0.98
    backSide.push(backgrit1);

    var backgrit2 = structure.createPurlin();;
    backgrit2.rotation = new Vector3(0, 1.5708, 3.14159)
    backgrit2.position.y = 1.00
    backgrit2.position.x = 0
    backgrit2.position.z = -2.62;
    backgrit2.scaling.z = 0.98
    backSide.push(backgrit2);

    var backgrit3 = structure.createPurlin();;
    backgrit3.rotation = new Vector3(0, 1.5708, 3.14159)
    backgrit3.position.y = 0.5
    backgrit3.position.x = 0
    backgrit3.position.z = -2.62
    backgrit3.scaling.z = 0.98
    backSide.push(backgrit3);

    //back cover
    if (degree != null) {
        var pitchInfo = pitch[degree];
        topCenter = pitchInfo.topCenter;
    }
    // Define the vertices of the triangle
    var positions = [
        2.5, 0.1, 0,   // Vertex 1: Bottom left corner
        -2.5, 0.1, 0,   // Vertex 2: Bottom right corner
        0, topCenter, 0  // Vertex 3: Top center corner
    ];

    // Define the indices that make up the triangle
    var indices = [
        0, 1, 2  // Indices to form a triangle with the defined vertices
    ];

    // Create a VertexData object
    var vertexData = new VertexData();

    // Assign the positions and indices to the VertexData object
    vertexData.positions = positions;
    vertexData.indices = indices;

    // Apply the VertexData to a mesh
    var triangle = new Mesh("triangle", scene);
    vertexData.applyToMesh(triangle);

    // Create a standard material for the triangle
    var material = new StandardMaterial("triangleMaterial", scene);
    material.backFaceCulling = false; // Make the material double-sided
    triangle.material = material;
    triangle.position.y = 2.35;
    triangle.position.z = -2.675;
    // triangle.scaling.z = 10;

    var box = MeshBuilder.CreateBox("box", { width: 5, height: 2.9, depth: 0.01 }, scene);
    box.position.y = 1;
    box.position.z = -2.67;
    backTop.push(triangle);
    backSide.push(box);
    //roof cover
    var roofLeft = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 5.22 }, scene);
    roofLeft.position.y = 2.55;
    roofLeft.position.x = 1.25;
    roofLeft.position.z = -0.06;
    roofLeft.rotation = new Vector3(0, 0, -0.0872665);
    leftRoof.push(roofLeft);

    var roofRight = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 5.22 }, scene);
    roofRight.position.y = 2.55;
    roofRight.position.x = -1.25;
    roofRight.position.z = -0.06;
    roofRight.rotation = new Vector3(0, 0, 0.0872665);
    rightRoof.push(roofRight);

    //walls
    var wallLeft = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.45, depth: 5.22 }, scene);
    wallLeft.position.y = 1.2;
    wallLeft.position.x = 2.51;
    wallLeft.position.z = -0.06;
    wallLeft.rotation = new Vector3(0, 0, 29.85)
    leftSide.push(wallLeft);

    var wallRight = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.45, depth: 5.22 }, scene);
    wallRight.position.y = 1.2;
    wallRight.position.x = - 2.51;
    wallRight.position.z = -0.06;
    wallRight.rotation = new Vector3(0, 0, 29.85)
    rightSide.push(wallRight);

    var leftAwning = [];
    var rightAwning = [];



    //Lean to left
    var leanToLeftWalls = [];
    var leanToLeftRoofs = [];
    var leanToRight = [];
    var leanToRightWalls = [];
    var leanToRightRoofs = [];
    var leantoleftcolfront = [];
    var leantoleftcolback = [];
    var leantorightcols = [];
    var leantorightcolfront = [];
    var leantorightcolback = [];

    var leanToLeftCol3 = structure.ubColumn();
    leanToLeftCol3.position.y = 1;
    leanToLeftCol3.position.x = 4.9;
    leanToLeftCol3.position.z = 2.5;
    leanToLeftCol3.scaling.y = 0.98;
    leanToLeftCol3.name = 'leantoleftcol3'
    leantoleftcolfront.push(leanToLeftCol3);

    var leanToLeftCol4 = structure.ubColumn();
    leanToLeftCol4.position.y = 1;
    leanToLeftCol4.position.x = 4.9;
    leanToLeftCol4.position.z = -2.5;
    leanToLeftCol4.scaling.y = 0.98;
    leanToLeftCol4.name = 'leantoleftcol4'
    leantoleftcolback.push(leanToLeftCol4);


    if (localStorage.getItem("rafter") === "truss") {
        var leanToLeftRafter = structure.truss();
    } else {
        var leanToLeftRafter = structure.rafter();
    }
    leanToLeftRafter.position.y = 2.15;
    leanToLeftRafter.position.z = 2.5
    leanToLeftRafter.position.x = 3.7
    leanToLeftRafter.rotation = new Vector3(0, 0, 1.48353);
    leanToLeftRafter.scaling.y = 1
    leanToLeftRoofs.push(leanToLeftRafter)


    if (localStorage.getItem("rafter") === "truss") {
        var leanToLeftRafter1 = structure.truss();
    } else {
        var leanToLeftRafter1 = structure.rafter();
    }
    leanToLeftRafter1.position.y = 2.15;
    leanToLeftRafter1.position.z = -2.5
    leanToLeftRafter1.position.x = 3.7
    leanToLeftRafter1.rotation = new Vector3(0, 0, 1.48353);
    leanToLeftRafter1.scaling.y = 1
    leanToLeftRoofs.push(leanToLeftRafter1);

    var leanToLeftPurlin = structure.createPurlin();;
    leanToLeftPurlin.position.y = 2.38;
    leanToLeftPurlin.position.x = 2.56;
    leanToLeftPurlin.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin);

    var leanToLeftPurlin1 = structure.createPurlin();;
    leanToLeftPurlin1.position.y = 2.33;
    leanToLeftPurlin1.position.x = 3.06;
    leanToLeftPurlin1.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin1);

    var leanToLeftPurlin2 = structure.createPurlin();;
    leanToLeftPurlin2.position.y = 2.28;
    leanToLeftPurlin2.position.x = 3.56;
    leanToLeftPurlin2.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin2);

    var leanToLeftPurlin3 = structure.createPurlin();;
    leanToLeftPurlin3.position.y = 2.25;
    leanToLeftPurlin3.position.x = 4.06;
    leanToLeftPurlin3.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin3);

    var leanToLeftPurlin4 = structure.createPurlin();;
    leanToLeftPurlin4.position.y = 2.20;
    leanToLeftPurlin4.position.x = 4.56;
    leanToLeftPurlin4.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin4);

    var leanToLeftPurlin5 = structure.createPurlin();;
    leanToLeftPurlin5.position.y = 2.16;
    leanToLeftPurlin5.position.x = 4.90;
    leanToLeftPurlin5.rotation = new Vector3(0, 0, 4.53786);
    leanToLeftRoofs.push(leanToLeftPurlin5);

    var leanToLeftRoof = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 5.35 }, scene);
    leanToLeftRoof.position.y = 2.33;
    leanToLeftRoof.position.x = 3.75;
    leanToLeftRoof.rotation = new Vector3(0, 0, -0.0872665);
    leanToLeftRoofs.push(leanToLeftRoof);

    var leanToLeftwall = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.2, depth: 5.35 }, scene);
    leanToLeftwall.position.y = 1.1;
    leanToLeftwall.position.x = 5;
    leanToLeftwall.rotation = new Vector3(0, 0, 29.85)
    leanToLeftWalls.push(leanToLeftwall);

    var leanToLeftPartWall = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 2.2 }, scene);
    leanToLeftPartWall.position.y = 1.1;
    leanToLeftPartWall.position.x = 3.75;
    leanToLeftPartWall.position.z = 2.44;
    leanToLeftPartWall.rotation = new Vector3(1.5708, 0, 0)



    if (awningDegree != null) {
        var pitchInfo = awningPitch[localStorage.getItem("leftAwningPitch")];
        topCenterAwningsLeft = pitchInfo.topCenterLeft;
    }
    // Define the vertices of the triangle for awnings wall
    var positions = [
        -1, 0, 0,   // Vertex 1: Bottom left corner
        1.5, 0, 0,    // Vertex 2: Bottom right corner
        -1, topCenterAwningsLeft, 0    // Vertex 3: Top left corner
    ];

    // Define the indices that make up the triangle
    var indices = [
        0, 1, 2  // Indices to form a triangle with the defined vertices
    ];

    // Create a VertexData object
    var vertexData = new VertexData();

    // Assign the positions and indices to the VertexData object
    vertexData.positions = positions;
    vertexData.indices = indices;

    // Apply the VertexData to a mesh
    var leftAwningTriangle = new Mesh("triangle", scene);
    vertexData.applyToMesh(leftAwningTriangle);

    // Create a standard material for the triangle
    var materialLeft = new StandardMaterial("triangleMaterial1", scene);
    materialLeft.backFaceCulling = false; // Make the material double-sided
    leftAwningTriangle.material = materialLeft;
    leftAwningTriangle.position.z = 2.45;
    leftAwningTriangle.position.x = 3.4;
    leftAwningTriangle.position.y = 2.2;

    //Lean To right

    var leanToRightCol3 = structure.ubColumn();
    leanToRightCol3.position.y = 1;
    leanToRightCol3.position.x = -4.9;
    leanToRightCol3.position.z = 2.5;
    leanToRightCol3.scaling.y = 0.98;
    leantorightcolfront.push(leanToRightCol3);

    var leanToRightCol4 = structure.ubColumn();
    leanToRightCol4.position.y = 1;
    leanToRightCol4.position.x = -4.9;
    leanToRightCol4.position.z = -2.5;
    leanToRightCol4.scaling.y = 0.98;
    leantorightcolback.push(leanToRightCol4);

    var leanToRightPurlin = structure.createPurlin();;
    leanToRightPurlin.position.y = 2.38;
    leanToRightPurlin.position.x = -2.56;
    leanToRightPurlin.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin);

    var leanToRightPurlin1 = structure.createPurlin();;
    leanToRightPurlin1.position.y = 2.33;
    leanToRightPurlin1.position.x = -3.06;
    leanToRightPurlin1.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin1);

    var leanToRightPurlin2 = structure.createPurlin();;
    leanToRightPurlin2.position.y = 2.28;
    leanToRightPurlin2.position.x = -3.56;
    leanToRightPurlin2.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin2);

    var leanToRightPurlin3 = structure.createPurlin();;
    leanToRightPurlin3.position.y = 2.25;
    leanToRightPurlin3.position.x = -4.06;
    leanToRightPurlin3.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin3);

    var leanToRightPurlin4 = structure.createPurlin();;
    leanToRightPurlin4.position.y = 2.20;
    leanToRightPurlin4.position.x = -4.56;
    leanToRightPurlin4.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin4);

    var leanToRightPurlin5 = structure.createPurlin();;
    leanToRightPurlin5.position.y = 2.16;
    leanToRightPurlin5.position.x = -4.90;
    leanToRightPurlin5.rotation = new Vector3(0, 0, 4.88692);
    leanToRightRoofs.push(leanToRightPurlin5);


    if (localStorage.getItem("rafter") === "truss") {
        var leanToRightRafter = structure.truss();
    } else {
        var leanToRightRafter = structure.rafter();
    }
    leanToRightRafter.position.y = 2.15;
    leanToRightRafter.position.z = 2.5
    leanToRightRafter.position.x = - 3.7
    leanToRightRafter.rotation = new Vector3(0, 3.14159, 1.48353);
    leanToRightRafter.scaling.y = 1
    leanToRightRoofs.push(leanToRightRafter)


    if (localStorage.getItem("rafter") === "truss") {
        var leanToRightRafter1 = structure.truss();
    } else {
        var leanToRightRafter1 = structure.rafter();
    }
    leanToRightRafter1.position.y = 2.15;
    leanToRightRafter1.position.z = -2.5
    leanToRightRafter1.position.x = - 3.7
    leanToRightRafter1.rotation = new Vector3(0, 3.14159, 1.48353);
    leanToRightRafter1.scaling.y = 1
    leanToRightRoofs.push(leanToRightRafter1);

    var leanToRightRoof = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 5.35 }, scene);
    leanToRightRoof.position.y = 2.33;
    leanToRightRoof.position.x = -3.75;
    leanToRightRoof.rotation = new Vector3(0, 0, 0.0872665);
    leanToRightRoofs.push(leanToRightRoof);

    var leanToRightWall = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.2, depth: 5.35 }, scene);
    leanToRightWall.position.y = 1.1;
    leanToRightWall.position.x = - 5;
    leanToRightWall.rotation = new Vector3(0, 0, 29.85)
    leanToRightWalls.push(leanToRightWall);

    var leanToRightPartWall = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 2.2 }, scene);
    leanToRightPartWall.position.y = 1.1;
    leanToRightPartWall.position.x = -3.75;
    leanToRightPartWall.position.z = 2.44;
    leanToRightPartWall.rotation = new Vector3(1.5708, 0, 0)


    if (awningDegree != null) {
        var pitchInfo = awningPitch[localStorage.getItem("rightAwningPitch")];
        topCenterAwningsRight = pitchInfo.topCenterLeft;
    }
    // Define the vertices of the triangle
    var positions = [
        -1, 0, 0,   // Vertex 1: Bottom left corner
        1.5, 0, 0,    // Vertex 2: Bottom right corner
        -1, topCenterAwningsRight, 0    // Vertex 3: Top left corner
    ];

    // Define the indices that make up the triangle
    var indices = [
        0, 1, 2  // Indices to form a triangle with the defined vertices
    ];

    // Create a VertexData object
    var vertexData = new VertexData();

    // Assign the positions and indices to the VertexData object
    vertexData.positions = positions;
    vertexData.indices = indices;

    // Apply the VertexData to a mesh
    var rightAwningTriangle = new Mesh("triangle", scene);
    vertexData.applyToMesh(rightAwningTriangle);

    // Create a standard material for the triangle
    var material = new StandardMaterial("triangleMaterial", scene);
    material.backFaceCulling = false; // Make the material double-sided
    rightAwningTriangle.material = material;
    rightAwningTriangle.position.z = 2.45;
    rightAwningTriangle.position.x = -3.4;
    rightAwningTriangle.position.y = 2.2;
    rightAwningTriangle.rotation = new Vector3(0, 3.14159, 0)



    //<====================================create arrows along length =====================================>//

    // Create arrow lines representing the width of the mesh
    var width = 2.15; // Width of the arrow lines
    var startPoint = new Vector3(3, 0.1, 0);
    var endPoint1 = new Vector3(3, 0.1, -width); // Endpoint for the first arrow line
    var endPoint2 = new Vector3(3, 0.1, width); // Endpoint for the second arrow line

    // Create the arrow lines
    var arrowLine1 = MeshBuilder.CreateTube("arrowLine1", { path: [startPoint, endPoint1], radius: 0.05 }, scene);
    var arrowLine2 = MeshBuilder.CreateTube("arrowLine2", { path: [startPoint, endPoint2], radius: 0.05 }, scene);

    // Create arrowhead meshes
    var arrowhead1 = MeshBuilder.CreateCylinder("arrowhead1", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);
    var arrowhead2 = MeshBuilder.CreateCylinder("arrowhead2", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);

    // Position arrowhead meshes at the ends of arrow lines
    arrowhead1.position = endPoint1;
    arrowhead2.position = endPoint2;

    // Rotate arrowhead meshes to align with the direction of the arrow lines
    arrowhead1.rotationQuaternion = Quaternion.RotationAxis(Axis.X, -Math.PI / 2); // rotation adjustment - important
    arrowhead2.rotationQuaternion = Quaternion.RotationAxis(Axis.X, Math.PI / 2);

    // Color arrow lines and arrowhead meshes
    arrowLine1.material = new StandardMaterial("arrowLineMat1", scene);
    arrowLine1.material.diffuseColor = new Color3(1, 1, 1); // color assignment
    arrowLine2.material = new StandardMaterial("arrowLineMat2", scene);
    arrowLine2.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead1.material = new StandardMaterial("arrowheadMat1", scene);
    arrowhead1.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead2.material = new StandardMaterial("arrowheadMat2", scene);
    arrowhead2.material.diffuseColor = new Color3(1, 1, 1);

    leftArrows.push(arrowLine1);
    leftArrows.push(arrowLine2);
    leftArrows.push(arrowhead1);
    leftArrows.push(arrowhead2);
    // leftArrows.push(textRect);
    //<===================================== arrows along width =========================================>//
    // Create arrow lines representing the width of the mesh
    var width = 2.1; // Width of the arrow lines
    var startPoint = new Vector3(0, 0, 0);
    var endPoint1 = new Vector3(0, 0, -width); // Endpoint for the first arrow line
    var endPoint2 = new Vector3(0, 0, width); // Endpoint for the second arrow line

    // Create the arrow lines
    var arrowLine1 = MeshBuilder.CreateTube("arrowLine1", { path: [startPoint, endPoint1], radius: 0.05 }, scene);
    var arrowLine2 = MeshBuilder.CreateTube("arrowLine2", { path: [startPoint, endPoint2], radius: 0.05 }, scene);


    arrowLine1.rotation = new Vector3(0, 1.5708, 0)
    arrowLine2.rotation = new Vector3(0, 1.5708, 0)
    // Create arrowhead meshes
    var arrowhead1 = MeshBuilder.CreateCylinder("arrowhead1", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);
    var arrowhead2 = MeshBuilder.CreateCylinder("arrowhead2", { diameterTop: 0, diameterBottom: 0.2, height: 0.4, tessellation: 24 }, scene);

    // Position arrowhead meshes at the ends of arrow lines
    arrowhead1.position = endPoint1.add(new Vector3(-2.3, 0, width)); // Adjust position as needed
    arrowhead2.position = endPoint2.add(new Vector3(2.3, 0, -width)); // Adjust position as needed

    // Rotate arrowhead meshes to align with the direction of the arrow lines
    arrowhead1.rotationQuaternion = Quaternion.RotationAxis(Axis.Z, Math.PI / 2); // Adjust rotation as needed
    arrowhead2.rotationQuaternion = Quaternion.RotationAxis(Axis.Z, -Math.PI / 2); // Adjust rotation as needed

    // Color arrow lines and arrowhead meshes
    arrowLine1.material = new StandardMaterial("arrowLineMat1", scene);
    arrowLine1.material.diffuseColor = new Color3(1, 1, 1); // color assignment
    arrowLine2.material = new StandardMaterial("arrowLineMat2", scene);
    arrowLine2.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead1.material = new StandardMaterial("arrowheadMat1", scene);
    arrowhead1.material.diffuseColor = new Color3(1, 1, 1);
    arrowhead2.material = new StandardMaterial("arrowheadMat2", scene);
    arrowhead2.material.diffuseColor = new Color3(1, 1, 1);

    //textRect.material = materialRect;
    backArrows.push(arrowLine1);
    backArrows.push(arrowLine2);
    backArrows.push(arrowhead1);
    backArrows.push(arrowhead2);

    //<==================================== for drawing labels onto scene ==============================>// 

    var ground = MeshBuilder.CreateGround("ground", { width: 6, height: 2 }, scene);
    ground.position.z = -16;
    ground.position.y = 0.05;

    // Create a material with the background texture
    var materialGround = new StandardMaterial("Mat", scene);
    var backgroundTexture = new Texture("/textures/ground/ground.jpg", scene);
    materialGround.diffuseTexture = backgroundTexture;

    // Create a dynamic texture for drawing text
    var textureGround = new DynamicTexture("dynamic texture", { width: 512, height: 256 }, scene);
    var textureContext = textureGround.getContext();
    var font = "bold 60px monospace";
    textureGround.drawText("Back", 200, 170, font, "white");

    // Assign the dynamic texture as an emissive texture to blend with the background
    materialGround.emissiveTexture = textureGround;
    materialGround.useEmissiveAsIllumination = true;

    ground.material = materialGround;

    //<============================for drawing logos====================================>
    // Create a plane mesh
    const backLogo = MeshBuilder.CreatePlane('plane', { size: 2 }, scene);

    // Create a material
    const materiallogo = new StandardMaterial('material', scene);

    // Load logo texture
    const texture = new Texture(logo, scene);
    materiallogo.diffuseTexture = texture;

    // Apply material to the plane mesh
    backLogo.material = materiallogo;

    // Position and scale the plane mesh
    backLogo.rotation = new Vector3(1.5708, 0, 0);
    backLogo.position = new Vector3(0, 0.05, 0); // Adjust scale as needed
    backLogo.scaling = new Vector3(1.2, 1.2, 1.2)
    var leantoleftcolfrontmesh = Mesh.MergeMeshes(leantoleftcolfront, true, true, undefined, false, true);
    var leantoleftcolbackmesh = Mesh.MergeMeshes(leantoleftcolback, true, true, undefined, false, true);
    leantoleftcolfrontmesh.name = "leantoleftcolfront";
    leantoleftcolfrontmesh.id = "leantoleftcolfront";
    leantoleftcolbackmesh.name = "leantoleftcolback";
    var leantorightcolfrontmesh = Mesh.MergeMeshes(leantorightcolfront, true, true, undefined, false, true);
    var leantorightcolbackmesh = Mesh.MergeMeshes(leantorightcolback, true, true, undefined, false, true);
    leantorightcolfrontmesh.name = "leantorightcolfront";
    leantorightcolfrontmesh.id = "leantorightcolfront";
    leantorightcolbackmesh.name = "leantorightcolback";
    // var backMesh = Mesh.MergeMeshes(backBayMeshes, true, true, undefined, false, true);
    var leftRoofMesh = Mesh.MergeMeshes(leftRoof, true, true, undefined, false, true);
    var rightRoofMesh = Mesh.MergeMeshes(rightRoof, true, true, undefined, false, true);
    leftRoofMesh.name = 'lRoof';
    rightRoofMesh.name = 'rRoof';
    var leftWallMesh = Mesh.MergeMeshes(leftSide, true, true, undefined, false, true);
    var rightWallMesh = Mesh.MergeMeshes(rightSide, true, true, undefined, false, true);
    var backWallMesh = Mesh.MergeMeshes(backSide, true, true, undefined, false, true);

    var leanToLeftWallsMesh = Mesh.MergeMeshes(leanToLeftWalls, true, true, undefined, false, true);
    leanToLeftWallsMesh.name = "leanToLeftWalls";
    var leanToLeftRoofMesh = Mesh.MergeMeshes(leanToLeftRoofs, true, true, undefined, false, true);
    // var leanToLeftPartWallPurlinMesh = Mesh.MergeMeshes(leanToLeftPartWallPurlins, true, true, undefined, false, true);
    leanToLeftRoofMesh.name = "leanToLeftRoofs";
    leanToLeftPartWall.name = "leanToLeftPartWall";
    leftAwningTriangle.name = "leanToLeftTriangle";
    // leanToLeftPartWallPurlinMesh.name = "leanToLeftPurlins"
    var leanToleftPartWallBack = leanToLeftPartWall.clone();
    var leftAwningTriangleBack = leftAwningTriangle.clone();
    leanToleftPartWallBack.name = "leanToLeftPartWallBack";
    leftAwningTriangleBack.name = "leanToLeftTriangleBack";
    leanToleftPartWallBack.position.z -= 5.1;
    leftAwningTriangleBack.position.z -= 5.15;
    var leanToRightWallsMesh = Mesh.MergeMeshes(leanToRightWalls, true, true, undefined, false, true);
    leanToRightWallsMesh.name = "leanToRightWalls";
    var leanToRightRoofMesh = Mesh.MergeMeshes(leanToRightRoofs, true, true, undefined, false, true);
    // var leanToRightPartWallPurlinMesh = Mesh.MergeMeshes(leanToRightPartWallPurlins, true, true, undefined, false, true);
    leanToRightRoofMesh.name = "leanToRightRoofs";
    leanToRightPartWall.name = "leanToRightPartWall";
    rightAwningTriangle.name = "leanToRightTriangle";
    // leanToRightPartWallPurlinMesh.name = "leanToRightPurlins";
    var leanTorightPartWallBack = leanToRightPartWall.clone();
    var rightAwningTriangleBack = rightAwningTriangle.clone();
    leanTorightPartWallBack.name = "leanToRightPartWallBack";
    rightAwningTriangleBack.name = "leanToRightTriangleBack";
    leftAwningTriangleBack.material = material;
    leanTorightPartWallBack.position.z -= 5.1;
    rightAwningTriangleBack.position.z -= 5.15;
    //var leanToBackMesh = Mesh.MergeMeshes(leanToBack, true, true, undefined, false, true);
    var leftArrowsMesh = Mesh.MergeMeshes(leftArrows, true, true, undefined, false, true);
    var backArrowsMesh = Mesh.MergeMeshes(backArrows, true, true, undefined, false, true);
    var backTopMesh = Mesh.MergeMeshes(backTop, true, true, undefined, false, true);
    var frontWallMesh = Mesh.MergeMeshes(frontSide, true, true, undefined, false, true);
    var frontTopMesh = Mesh.MergeMeshes(frontTop, true, true, undefined, false, true);
    var leanToLeftCollection = [leanToLeftWallsMesh, leanToLeftRoofMesh, leantoleftcolfrontmesh,leantoleftcolbackmesh, leanToLeftPartWall, leftAwningTriangle, leanToleftPartWallBack, leftAwningTriangleBack,];
    var leanToRightCollection = [leanToRightWallsMesh, leanToRightRoofMesh, leantorightcolfrontmesh,leantorightcolbackmesh, leanToRightPartWall, rightAwningTriangle, leanTorightPartWallBack, rightAwningTriangleBack,];
    var roofCollection = [leftRoofMesh, rightRoofMesh];

    var roof_container = new Mesh("fRoof", scene);
    roofCollection[0].setParent(roof_container);
    roofCollection[1].setParent(roof_container);
    roof_container.position.y = 0.435;
    
    if (degree != null) {
        var pitchInfo = pitch[degree];
        rightRoofMesh.rotation = new Vector3(0, 0, pitchInfo.rightRoofMesh.rotation[2]);
        rightRoofMesh.position = new Vector3(pitchInfo.rightRoofMesh.position.x, 0, 0);
        rightRoofMesh.scaling = new Vector3(pitchInfo.rightRoofMesh.scaling.x, 1, 1);


        leftRoofMesh.rotation = new Vector3(0, 0, pitchInfo.leftRoofMesh.rotation[2]);
        leftRoofMesh.position = new Vector3(pitchInfo.leftRoofMesh.position.x, 0, 0);
        leftRoofMesh.scaling.x = pitchInfo.leftRoofMesh.scaling.x;

        roof_container.position.y = pitchInfo.leftRoofMesh.position.y;
    }

    var leftAwningFlag = localStorage.getItem("leftAwning");
    var leftCantileverFlag = localStorage.getItem("leftCantilever");
    var rightAwningFlag = localStorage.getItem("rightAwning");
    var rightCantileverFlag = localStorage.getItem("rightCantilever");

    if (awningDegree != null) {
        var pitchInfo = awningPitch[parseFloat(localStorage.getItem("leftAwningPitch"))];
        //for lean to frame
        leanToLeftRoofMesh.rotation = new Vector3(0, 0, pitchInfo.leanToLeftRoofMesh.rotation[2]);
        leanToLeftRoofMesh.position = new Vector3(-0.45, pitchInfo.leanToLeftRoofMesh.position.y, 0);
        leanToLeftRoofMesh.scaling = new Vector3(pitchInfo.leanToLeftRoofMesh.scaling.x, 1, 1);
        leanToLeftWallsMesh.position = new Vector3(0, pitchInfo.leanToLeftWallsMesh.position.y, 0);
        leantoleftcolbackmesh.position.y = pitchInfo.leanToLeftWallsMesh.position.y;
        leantoleftcolfrontmesh.position.y = pitchInfo.leanToLeftWallsMesh.position.y;
        leanToLeftPartWall.position.y = pitchInfo.leanToLeftPartition.position.y;
        leftAwningTriangle.position.y = pitchInfo.leanToLeftTriangle.position.y;
        leanToleftPartWallBack.position.y = pitchInfo.leanToLeftPartition.position.y;
        leftAwningTriangleBack.position.y = pitchInfo.leanToLeftTriangle.position.y;
        ABltruss.position.y = pitchInfo.leanToLeftTriangle.position.y;

    }

    if (awningDegree != null) {
        var pitchInfo = awningPitch[parseFloat(localStorage.getItem("rightAwningPitch"))];
        leanToRightRoofMesh.rotation = new Vector3(0, 0, pitchInfo.leanToRightRoofMesh.rotation[2]);
        leanToRightRoofMesh.position = new Vector3(pitchInfo.leanToRightRoofMesh.position.x, pitchInfo.leanToRightRoofMesh.position.y, 0);
        leanToRightRoofMesh.scaling = new Vector3(pitchInfo.leanToRightRoofMesh.scaling.x, 1, 1);
        leanToRightWallsMesh.position = new Vector3(0, pitchInfo.leanToRightWallsMesh.position.y, 0);
        leantorightcolbackmesh.position.y = pitchInfo.leanToRightWallsMesh.position.y;
        leantorightcolfrontmesh.position.y = pitchInfo.leanToRightWallsMesh.position.y;
        leanToRightPartWall.position.y = pitchInfo.leanToLeftPartition.position.y;
        rightAwningTriangle.position.y = pitchInfo.leanToLeftTriangle.position.y;
        leanTorightPartWallBack.position.y = pitchInfo.leanToLeftPartition.position.y;
        rightAwningTriangleBack.position.y = pitchInfo.leanToLeftTriangle.position.y;
        AbRtruss.position.y = pitchInfo.leanToLeftTriangle.position.y;


    }

    var container_left = new BABYLON.Mesh("container_left", scene);
    container_left.position = new BABYLON.Vector3(0, 0, 0); // Set container_left's initial position
    var container_right = new BABYLON.Mesh("container_right", scene);
    container_right.position = new BABYLON.Vector3(0, 0, 0); // Set container_right's initial position

    var container_back = new BABYLON.Mesh("container_back", scene);
    container_back.position = new BABYLON.Vector3(0, 0, 0);

    // Add child meshes to the container_left
    leanToLeftWallsMesh.parent = container_left;
    leanToLeftPartWall.parent = container_left;
    leftAwningTriangle.parent = container_left;
    leanToleftPartWallBack.parent = container_left;
    leftAwningTriangleBack.parent = container_left;
    leanToLeftRoofMesh.parent = container_left;
    // leantoleftcolsmesh.parent = container_left;
    // leanToLeftPartWallPurlinMesh.parent = container_left;

    // Add child meshes to the container_right
    leanToRightWallsMesh.parent = container_right;
    leanToRightPartWall.parent = container_right;
    rightAwningTriangle.parent = container_right;
    leanTorightPartWallBack.parent = container_right;
    rightAwningTriangleBack.parent = container_right;
    leanToRightRoofMesh.parent = container_right;
    // leantorightcolsmesh.parent = container_right;
    // leanToRightPartWallPurlinMesh.parent = container_right;
    // var leanToLeftMesh = Mesh.MergeMeshes(leanToLeftCollection, true, true, undefined, false, true);
    // var leanToRightMesh = Mesh.MergeMeshes(leanToRightCollection, true, true, undefined, false, true);
    var leantobackleftclone = roofCollection[0].clone();
    var leantobackrightclone = roofCollection[1].clone();
    var leantobackroofmesh = [leantobackleftclone, leantobackrightclone]
    var leanToBackRoof = Mesh.MergeMeshes(leantobackroofmesh, true, true, undefined, false, true);
    leanToBackRoof.scaling.z = 0.725;
    leanToBackRoof.position.z -= 0.7;
    //for creating back awning
    var backAwningMesh = leanToBackRoof.clone();

    //for creating back Lean to mesh

    // var leanToBackCols = backMesh.clone();
    leanToBackRoof.name = 'leanToBackRoof';
    var leanToBackCols = [];
    //creating columns for front bay
    var colFront = structure.ubColumn();
    colFront.scaling.y = 1.5;
    colFront.position.y = 0.6;
    colFront.position.x = -2.35;
    colFront.position.z = -2.5;
    leanToBackCols.push(colFront);

    var colFront1 = structure.ubColumn();
    colFront1.scaling.y = 1.5;
    colFront1.position.y = 0.6;
    colFront1.position.x = 2.35;
    colFront1.position.z = -2.5;
    leanToBackCols.push(colFront1);
    //Merginf new front column array
    var leanToBackColsMesh = Mesh.MergeMeshes(leanToBackCols, true, true, undefined, false, true);
    leanToBackColsMesh.name = 'leanToBackCols'
    leanToBackRoof.parent = container_back;
    leanToBackColsMesh.parent = container_back;
    var leanToBackMesh = [leanToBackRoof, leanToBackColsMesh];

    const leftAwningGroundTile = MeshBuilder.CreateBox("leftAwningGroundTile", {
        height: 1,   // The thickness of the ground tile
        width: 2.6,      // The width of the ground tile
        depth: 5.3     // The depth of the ground tile
    });
    leftAwningGroundTile.position.x = 3.7;
    const rightAwningGroundTile = MeshBuilder.CreateBox("rightAwningGroundTile", {
        height: 1,   // The thickness of the ground tile
        width: 2.6,      // The width of the ground tile
        depth: 5.3     // The depth of the ground tile
    });
    rightAwningGroundTile.position.x = -3.7;
    if(localStorage.getItem('leftAwning') === 'true' && localStorage.getItem('slab') === 'Enable'){
        leftAwningGroundTile.isVisible = true;
    }else{
        leftAwningGroundTile.isVisible = false;
    }
    if(localStorage.getItem('rightAwning') === 'true' && localStorage.getItem('slab') === 'Enable'){
        rightAwningGroundTile.isVisible = true;
    }else{
        rightAwningGroundTile.isVisible = false;
    }
    const groundTile = MeshBuilder.CreateBox("groundTile", {
        height: 1,   // The thickness of the ground tile
        width: 5,      // The width of the ground tile
        depth: 5.3     // The depth of the ground tile
    });
    groundTile.position.y = -0.2;
    if (localStorage.getItem('slab') === 'Disable') {
        groundTile.isVisible = false;
        leftAwningGroundTile.isVisible = false;
        rightAwningGroundTile.isVisible = false;
        container_left.position.y = 0;
        container_right.position.y = 0;
        container_back.position.y = 0;
        leantoleftcolfrontmesh.position.y += 0;
        leantoleftcolbackmesh.position.y += 0;
        leantorightcolfrontmesh.position.y += 0;
        leantorightcolbackmesh.position.y += 0;
        container_columns.position.y = 0
        roofCollection[0].position.y = 0;
        roofCollection[1].position.y = 0;
        leftWallMesh.position.y = 0
        rightWallMesh.position.y = 0
        frontWallMesh.position.y = 0
        backWallMesh.position.y = 0
        Bltruss.position.y += 0;
        bRtruss.position.y += 0;
        ABltruss.position.y += 0;
        AbRtruss.position.y += 0;
        frontTopMesh.position.y = 0
        backTopMesh.position.y = 0
    }

    // if (localStorage.getItem('slab') === 'Enable') {
    //     //reAdjusting positions to include slab
    //     // leantoleftcolsmesh
    //     // leantorightcolsmesh
    //     container_left.position.y = 0.3;
    //     container_right.position.y = 0.3;
    //     leantoleftcolfrontmesh.position.y = 0.3;
    //     leantoleftcolbackmesh.position.y = 0.3;
    //     leantorightcolfrontmesh.position.y = 0.3;
    //     leantorightcolbackmesh.position.y = 0.3;
    //     container_columns.position.y = 0.3
    //     roofCollection[0].position.y = 0.3;
    //     roofCollection[1].position.y = 0.3;
    //     leftWallMesh.position.y = 0.3
    //     rightWallMesh.position.y = 0.3
    //     frontWallMesh.position.y = 0.3
    //     backWallMesh.position.y = 0.3
    //     // leanToLeftWallsMesh
    //     // leanToLeftRoofMesh 
    //     // leanToLeftPartWallPurlinsMesh
    //     // leanToRightWallsMesh
    //     // leanToRightRoofMesh
    //     // leanToRightPartWallPurlinsMesh
    //     frontTopMesh.position.y = 0.3
    //     backTopMesh.position.y = 0.3
    // }

    if (parseInt(localStorage.getItem("slabSize")) > 150 && localStorage.getItem('slab') === 'Enable') {
        //reAdjusting positions to include slab
        // leantoleftcolsmesh
        // leantorightcolsmesh
        groundTile.position.y = 0;
        leftAwningGroundTile.position.y = 0;
        rightAwningGroundTile.position.y = 0;
        container_left.position.y = 0.4;
        container_right.position.y = 0.4;
        container_back.position.y = 0.4;
        leantoleftcolfrontmesh.position.y += 0.4;
        leantoleftcolbackmesh.position.y += 0.4;
        leantorightcolfrontmesh.position.y += 0.4;
        leantorightcolbackmesh.position.y += 0.4;
        container_columns.position.y = 0.4
        roofCollection[0].position.y = 0.4;
        roofCollection[1].position.y = 0.4;
        leftWallMesh.position.y = 0.4
        rightWallMesh.position.y = 0.4
        frontWallMesh.position.y = 0.4
        backWallMesh.position.y = 0.4
        Bltruss.position.y += 0.4;
        bRtruss.position.y += 0.4;
        ABltruss.position.y += 0.4;
        AbRtruss.position.y += 0.4;
        frontTopMesh.position.y = 0.4
        backTopMesh.position.y = 0.4
    } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100 && localStorage.getItem('slab') === 'Enable') {
        //reAdjusting positions to include slab
        // leantoleftcolsmesh
        // leantorightcolsmesh
        groundTile.position.y = -0.3;
        leftAwningGroundTile.position.y = -0.3;
        rightAwningGroundTile.position.y = -0.3;
        container_left.position.y = 0.2;
        container_right.position.y = 0.2;
        container_back.position.y = 0.2;
        leantoleftcolfrontmesh.position.y += 0.2;
        leantoleftcolbackmesh.position.y += 0.2;
        leantorightcolfrontmesh.position.y += 0.2;
        leantorightcolbackmesh.position.y += 0.2;
        container_columns.position.y = 0.2
        roofCollection[0].position.y = 0.2;
        roofCollection[1].position.y = 0.2;
        leftWallMesh.position.y = 0.2
        rightWallMesh.position.y = 0.2
        frontWallMesh.position.y = 0.2
        backWallMesh.position.y = 0.2
        Bltruss.position.y += 0.2;
        bRtruss.position.y += 0.2;
        ABltruss.position.y += 0.2;
        AbRtruss.position.y += 0.2;
        frontTopMesh.position.y = 0.2
        backTopMesh.position.y = 0.2
    } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50 && localStorage.getItem('slab') === 'Enable') {
        //reAdjusting positions to include slab
        // leantoleftcolsmesh
        // leantorightcolsmesh
        groundTile.position.y = -0.2;
        leftAwningGroundTile.position.y = -0.2;
        rightAwningGroundTile.position.y = -0.2;
        container_left.position.y = 0.1;
        container_right.position.y = 0.1;
        container_back.position.y = 0.1;
        leantoleftcolfrontmesh.position.y += 0.1;
        leantoleftcolbackmesh.position.y += 0.1;
        leantorightcolfrontmesh.position.y += 0.1;
        leantorightcolbackmesh.position.y += 0.1;
        container_columns.position.y = 0.1
        roofCollection[0].position.y = 0.1;
        roofCollection[1].position.y = 0.1;
        leftWallMesh.position.y = 0.1
        rightWallMesh.position.y = 0.1
        frontWallMesh.position.y = 0.1
        backWallMesh.position.y = 0.1
        Bltruss.position.y += 0.1;
        bRtruss.position.y += 0.1;
        ABltruss.position.y += 0.1;
        AbRtruss.position.y += 0.1;
        frontTopMesh.position.y = 0.1
        backTopMesh.position.y = 0.1
    } else if (parseInt(localStorage.getItem("slabSize")) < 50 && localStorage.getItem('slab') === 'Enable') {
        //reAdjusting positions to include slab
        // leantoleftcolsmesh
        // leantorightcolsmesh
        groundTile.position.y = -0.3;
        leftAwningGroundTile.position.y = -0.3;
        rightAwningGroundTile.position.y = -0.3;
        container_left.position.y = 0;
        container_right.position.y = 0;
        container_back.position.y = 0;
        leantoleftcolfrontmesh.position.y += 0;
        leantoleftcolbackmesh.position.y += 0;
        leantorightcolfrontmesh.position.y += 0;
        leantorightcolbackmesh.position.y += 0;
        container_columns.position.y = 0
        roofCollection[0].position.y = 0;
        roofCollection[1].position.y = 0;
        leftWallMesh.position.y = 0
        rightWallMesh.position.y = 0
        frontWallMesh.position.y = 0
        backWallMesh.position.y = 0
        Bltruss.position.y += 0;
        bRtruss.position.y += 0;
        ABltruss.position.y += 0;
        AbRtruss.position.y += 0;
        frontTopMesh.position.y = 0
        backTopMesh.position.y = 0
    }

    // Calculate the offset based on the total depth of the front bay
    var tempDimensions = 5.02;
    var backBayOffsetZ = tempDimensions * distance;

    //Applying offset to meshes
    groundTile.position.z -= backBayOffsetZ;
    backLogo.position.z -= backBayOffsetZ + 11;
    backTopMesh.position.z -= backBayOffsetZ;
    frontWallMesh.position.z -= backBayOffsetZ;
    leftArrowsMesh.position.z -= backBayOffsetZ;
    backArrowsMesh.position.z -= backBayOffsetZ + 3;
    container_columns.position.z -= backBayOffsetZ;
    //make changes here 
    bRtruss.position.z -= backBayOffsetZ;
    AbRtruss.position.z -= backBayOffsetZ;
    Bltruss.position.z -= backBayOffsetZ;
    ABltruss.position.z -= backBayOffsetZ;

    roofCollection[0].position.z -= backBayOffsetZ;
    roofCollection[1].position.z -= backBayOffsetZ;
    leftWallMesh.position.z -= backBayOffsetZ;
    if (sessionStorage.getItem("leftArrowPosition_") != 0 && sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0 && sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
        console.log("hitting all 3")
        leftArrowsMesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"));
    } else if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0 && sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
        console.log("hitting the problematic 2")
        leftArrowsMesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_"));
    } else if (sessionStorage.getItem("leftArrowPosition_") != 0 && sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0) {
        leftArrowsMesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"));
    } else if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") != 0) {
        leftArrowsMesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"));
    } else if (sessionStorage.getItem("leftArrowPosition_") != 0) {
        leftArrowsMesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_"));
    } else if (sessionStorage.getItem("leftArrowPositionAfterEnabling_") != 0) {
        leftArrowsMesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_"));
    }
    leftAwningGroundTile.position.z -= backBayOffsetZ;
    rightAwningGroundTile.position.z -= backBayOffsetZ;
    rightWallMesh.position.z -= backBayOffsetZ;
    backWallMesh.position.z -= backBayOffsetZ;
    // leftAwningMesh.position.z -= backBayOffsetZ;
    // rightAwningMesh.position.z -= backBayOffsetZ;
    backAwningMesh.position.z -= backBayOffsetZ + 3.95;
    backAwningMesh.scaling.z -= 0.5;
    // leanToLeftMesh.position.z -= backBayOffsetZ;
    leanToLeftCollection.forEach(mesh => {
        // if(mesh.name === 'leantoleftcol3'){
        //     mesh.position.y = 0.8;
        //     mesh.position.x = 4.9;
        //     mesh.position.z = 2.5;
        //     mesh.scaling.y = 0.98;
        // }
        // if(mesh.name === 'leantoleftcol4'){
        //     mesh.position.y = 0.8;
        //     mesh.position.x = 4.9;
        //     mesh.position.z = -2.5;
        //     mesh.scaling.y = 0.98;
        // }
        mesh.position.z -= backBayOffsetZ;
    });
    leanToRightCollection.forEach(mesh => {
        mesh.position.z -= backBayOffsetZ;
    });
    // leanToRightMesh.position.z -= backBayOffsetZ;
    leanToBackMesh.forEach((mesh) => {
        // mesh.position.z -= backBayOffsetZ + 3.95 - 0.5;
        mesh.isVisible = false;
    })
    container_back.position.z -= backBayOffsetZ + 3.95 - 0.5;
    //leanToBackMesh.rotation = new Vector3(0,1.5708,0);
    frontTopMesh.position.z -= backBayOffsetZ;

    //Assigning visibility to hidden by default meshes
    if (leftAwningFlag === 'false') {
        leanToLeftCollection.forEach(mesh => {
            mesh.isVisible = false;
        });
    } else {
        leanToLeftCollection.forEach(mesh => {
            if (mesh.name === 'leantoLeftTriangle' || mesh.name === "leanToLeftPartWall" || mesh.name === "leanToleftPartWallBack" || mesh.name === 'leanToLeftTriangleBack' || mesh.name === 'leanToLeftPurlins') {
                mesh.isVisible = false;
            }
        })
    }
    // if(leftCantileverFlag === 'false'){
    //     leftAwningMesh.isVisible = false;
    // }
    // if(rightCantileverFlag === 'false'){
    //     rightAwningMesh.isVisible = false;
    // }
    if (rightAwningFlag === 'false') {
        leanToRightCollection.forEach(mesh => {
            mesh.isVisible = false;
        });
    } else {
        leanToRightCollection.forEach(mesh => {
            if (mesh.name === 'leantoRightTriangle' || mesh.name === "leanToRightPartWall" || mesh.name === "leanToRightPartWallBack" || mesh.name === 'leanToRightTriangleBack' || mesh.name === 'leanToRightPurlins') {
                mesh.isVisible = false;
            }
        })
    }
    // leanToRightMesh.isVisible = false;
    // rightAwningMesh.isVisible = false;
    frontTopMesh.isVisible = false;
    frontWallMesh.isVisible = false;
    leanToBackMesh.isVisible = false;
    backAwningMesh.isVisible = false;

    //naming convention for referencing meshes
    backArrowsMesh.name = 'Barrow';
    leftArrowsMesh.name = 'Larrow';
    // leanToLeftCollection.name = 'leanToLeft';
    // leanToRightMesh.name = 'leanToRight';
    //leanToBackMesh.name = 'leanToBack'
    // leftAwningMesh.name = 'cantileverLeft';
    // rightAwningMesh.name = 'cantileverRight';
    backAwningMesh.name = 'cantileverBack'
    leftWallMesh.name = "Lwall";

    rightWallMesh.name = "Rwall";
    backWallMesh.name = "BWall";
    backTopMesh.name = "BTop";
    frontWallMesh.name = 'FWall';
    frontTopMesh.name = 'FTop';
    ground.name = 'bGround';
    backLogo.name = 'bLogo';

    var leftAwningMesh = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 2.2 }, scene);
    leftAwningMesh.isVisible = false;
    var rightAwningMesh = MeshBuilder.CreateBox("box", { size: 0.02, width: 2.5, depth: 2.2 }, scene);
    rightAwningMesh.isVisible = false;

    if (localStorage.getItem("LeftWallsVisible") == "false") {
        leftWallMesh.isVisible = false
    }
    if (localStorage.getItem("RightWallsVisible") == "false") {
        rightWallMesh.isVisible = false
    }
    if (localStorage.getItem("LeftAwningWallsVisible") == "false") {
        leanToLeftWallsMesh.isVisible = false
    }
    if (localStorage.getItem("RightAwningWallsVisible") == "false") {
        leanToRightWallsMesh.isVisible = false
    }
    var leftMezzanine = mezzanine.leftMezzanineBack(scene);
    var rightMezzanine = mezzanine.rightMezzanineBack(scene);
    leftMezzanine.position.z -= backBayOffsetZ;
    rightMezzanine.position.z -= backBayOffsetZ;

    var left_bracing = bracing.left_bracing(scene);
    var right_bracing = bracing.right_bracing(scene);
    left_bracing.position.z -= backBayOffsetZ;
    right_bracing.position.z -= backBayOffsetZ;

    return [
        container_columns,
        roof_container,
        leftWallMesh,
        rightWallMesh,
        leftAwningMesh,
        rightAwningMesh,
        backAwningMesh,
        leanToLeftCollection[0],
        leanToLeftCollection[1],
        leanToLeftCollection[2],
        leanToRightCollection[0],
        leanToRightCollection[1],
        leanToRightCollection[2],
        leanToBackMesh[0],
        leanToBackMesh[1],
        backWallMesh,
        backTopMesh,
        frontWallMesh,
        frontTopMesh,
        ground,
        backArrowsMesh,
        leftArrowsMesh,
        leanToLeftCollection[3],
        leanToLeftCollection[4],
        leanToLeftCollection[5],
        leanToLeftCollection[6],
        leanToRightCollection[3],
        leanToRightCollection[4],
        leanToRightCollection[5],
        leanToRightCollection[6],
        container_left,
        container_right,
        container_back,
        col1,
        col2,
        col3,
        col4,
        leftMezzanine, rightMezzanine, left_bracing, right_bracing, backLogo, bRtruss,  AbRtruss, Bltruss,  ABltruss, leanToLeftCollection[7],leanToRightCollection[7], groundTile, leftAwningGroundTile, rightAwningGroundTile
    ];
};