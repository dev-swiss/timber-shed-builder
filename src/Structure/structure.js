import { MeshBuilder, Mesh, Vector3, StandardMaterial, Color3, Tools } from "@babylonjs/core";
import { CompleteGreasedLineColorTable } from "babylonjs";

export const ubColumn = (scene, material) => {
    var collection = [];
    var box = MeshBuilder.CreateBox("box", { size: 2.3, width: 0.14, depth: 0.01 }, scene);
    box.material = material;
    var boxBeam = MeshBuilder.CreateBox("box", { size: 2.3, width: 0.02, depth: 0.08 }, scene);
    boxBeam.position.x = 0.06;
    boxBeam.material = material;
    var boxBeam2 = MeshBuilder.CreateBox("box", { size: 2.3, width: 0.02, depth: 0.08 }, scene);
    boxBeam2.position.x = -0.06;
    boxBeam2.material = material;
    collection.push(box, boxBeam, boxBeam2);
    var ubCol = Mesh.MergeMeshes(collection, true, true, undefined, false, true);
    return ubCol;
}


export const rafter = (scene, material) => {
    var collection = [];
    var box = MeshBuilder.CreateBox("box", { size: 2.33, width: 0.14, depth: 0.01 }, scene);
    box.material = material;
    var boxBeam = MeshBuilder.CreateBox("box", { size: 2.33, width: 0.02, depth: 0.08 }, scene);
    boxBeam.position.x = 0.06;
    boxBeam.material = material;
    var boxBeam1 = MeshBuilder.CreateBox("box", { size: 2.33, width: 0.02, depth: 0.08 }, scene);
    boxBeam1.position.x = -0.06;
    boxBeam1.material = material;
    collection.push(box, boxBeam, boxBeam1);
    var ubRafter = Mesh.MergeMeshes(collection, true, true, undefined, false, true);
    return ubRafter;
    // console.log(material, 'rafter material');
    // var collection = [];
    // // Change material to timber here
    // var timberMaterial = new StandardMaterial("timberMaterial", scene);
    // timberMaterial.diffuseColor = new Color3(0.55, 0.27, 0.07); // Example: brown color for timber
    // // Optionally, use a wood texture:
    // // timberMaterial.diffuseTexture = new Texture("/textures/wood/wood.jpg", scene);

    // var box = MeshBuilder.CreateBox("box", { size: 2.33, width: 0.14, depth: 0.01 }, scene);
    // box.material = material;
    // var boxBeam = MeshBuilder.CreateBox("box", { size: 2.33, width: 0.02, depth: 0.08 }, scene);
    // boxBeam.position.x = 0.06;
    // boxBeam.material = material;
    // var boxBeam1 = MeshBuilder.CreateBox("box", { size: 2.33, width: 0.02, depth: 0.08 }, scene);
    // boxBeam1.position.x = -0.06;
    // boxBeam1.material = timberMaterial;
    // collection.push(box, boxBeam, boxBeam1);
    // var ubRafter = Mesh.MergeMeshes(collection, true, true, undefined, false, true);
    // return ubRafter;
}


export const truss = (scene, material) => {
    // console.log(material, 'truss material');
    var diagVal = []
    // Define a material for the truss
    var timberMaterial = new StandardMaterial("timberMaterial", scene);
    material.diffuseColor = new Color3(0.8, 0.8, 0.8);
    // timberMaterial.diffuseColor = new Color3(0.55, 0.27, 0.07);

    // Top chord (adjusted to match rafter's dimensions)
    var topChord = MeshBuilder.CreateBox("topChord", { width: 2.33, height: 0.01, depth: 0.01 }, scene);
    //topChord.position.y = 0.14 / 2; // Center the top chord
    topChord.rotation.z = 1.5708
    topChord.material = material;

    // Bottom chord (adjusted to match rafter's dimensions)
    var bottomChord = MeshBuilder.CreateBox("bottomChord", { width: 2.33, height: 0.01, depth: 0.01 }, scene);
    bottomChord.rotation.z = 1.5708
    //bottomChord.position.y = -0.14 / 2; // Center the bottom chord
    bottomChord.position.x = -0.2
    bottomChord.material = material;

    // Diagonal members (adjusted to match rafter's dimensions)
    const diagonals = [
        { name: "diagonal1", posX: -0.90, posY: 0, rotZ: Math.PI / 4 }, //right wala 
        { name: "diagonal2", posX: -1.07, posY: 0, rotZ: -Math.PI / 4 },  //left wala
        { name: "diagonal3", posX: -0.55, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal4", posX: -0.72, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal5", posX: -0.21, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal6", posX: -0.38, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal7", posX: 0.12, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal8", posX: -0.05, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal9", posX: 0.3, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal10", posX: 0.45, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal11", posX: 0.75, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal12", posX: 0.6, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal13", posX: 0.9, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal14", posX: 1.03, posY: 0, rotZ: Math.PI / 4 },
    ];

    var trussParts = [topChord, bottomChord];
    diagonals.forEach(diagonal => {
        var diagonalMesh = MeshBuilder.CreateBox(diagonal.name, { width: 0.22, height: 0.02, depth: 0.02 }, scene);
        diagonalMesh.position.x = diagonal.posX;
        diagonalMesh.position.y = diagonal.posY;
        diagonalMesh.rotation.z = diagonal.rotZ;
        diagonalMesh.material = material;
        diagVal.push(diagonalMesh);
    });
    var diagonalsMesh = Mesh.MergeMeshes(diagVal, true, true, undefined, false, true);
    diagonalsMesh.rotation = new Vector3(0, 0, 1.5708)
    diagonalsMesh.position = new Vector3(-0.1, 0, 0)
    trussParts.push(diagonalsMesh)
    // Merge all parts into a single mesh
    var truss = Mesh.MergeMeshes(trussParts, true, true, undefined, false, true);

    // Apply rotation and translation to the whole truss structure
    //truss.rotation.z = Tools.ToRadians(180); // -45 degrees in radians
    // truss.rotation = new Vector3(0,0,90)
    truss.position.y = 1.5; // Move upwards

    return truss;
};

export const createPurlin = (scene, material) => {
    
    
    var cPurlin = [];
    var flat = MeshBuilder.CreateBox("box", { size: 0.08, depth: 5.1, height: 0.001 }, scene);
    cPurlin.push(flat);
    flat.material = material;

    var sideLeft = MeshBuilder.CreateBox("box", { size: 0.02, depth: 5.1, height: 0.005 }, scene);
    sideLeft.position.y = 0.011;
    sideLeft.position.x = 0.04;
    sideLeft.rotation = new Vector3(0, 0, 1.57);
    cPurlin.push(sideLeft);

    var sideRight = MeshBuilder.CreateBox("box", { size: 0.02, depth: 5.1, height: 0.005 }, scene);
    sideRight.position.y = 0.011;
    sideRight.position.x = -0.04;
    sideRight.rotation = new Vector3(0, 0, 1.57);
    cPurlin.push(sideRight);

    var flatTopLeft = MeshBuilder.CreateBox("box", { size: 0.015, depth: 5.1, height: 0.005 }, scene);
    flatTopLeft.position.y = 0.027;
    flatTopLeft.position.x = 0.0355;
    cPurlin.push(flatTopLeft);

    var flatTopRight = MeshBuilder.CreateBox("box", { size: 0.015, depth: 5.1, height: 0.005 }, scene);
    flatTopRight.position.y = 0.027;
    flatTopRight.position.x = -0.0355
    cPurlin.push(flatTopRight);

    var purlin = Mesh.MergeMeshes(cPurlin, true, true, undefined, false, true);

    return purlin;
}
export const gurder = (scene, material) => {
    var diagVal = [];
    var material = new StandardMaterial("gurderMaterial", scene);
    material.diffuseColor = new Color3(0.55, 0.27, 0.07)

    // Top chord (length adjusted to 5)
    var topChord = MeshBuilder.CreateBox("topChordGurder", { width: 5, height: 0.01, depth: 0.01 }, scene);
    topChord.rotation.z = 1.5708;
    topChord.material = material;

    // Bottom chord (length adjusted to 5)
    var bottomChord = MeshBuilder.CreateBox("bottomChordGurder", { width: 5, height: 0.01, depth: 0.01 }, scene);
    bottomChord.rotation.z = 1.5708;
    bottomChord.position.x = -0.2;
    bottomChord.material = material;

    // Adjust diagonal positions for the new length if needed
    // Here, I've just adjusted the length of each diagonal for simplicity
    const diagonals = [
        { name: "diagonal9", posX: -1.22, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal10", posX: -1.37, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal11", posX: -1.52, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal12", posX: -1.67, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal13", posX: -1.82, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal14", posX: -1.97, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal15", posX: -2.12, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal16", posX: -2.27, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal17", posX: -2.42, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal1", posX: -0.90, posY: 0, rotZ: Math.PI / 4 }, //right wala 
        { name: "diagonal2", posX: -1.07, posY: 0, rotZ: -Math.PI / 4 },  //left wala
        { name: "diagonal3", posX: -0.55, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal4", posX: -0.72, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal5", posX: -0.21, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal6", posX: -0.38, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal7", posX: 0.12, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal8", posX: -0.05, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal9", posX: 0.3, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal10", posX: 0.45, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal11", posX: 0.75, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal12", posX: 0.6, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal13", posX: 0.9, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal14", posX: 1.03, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal15", posX: 1.33, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal16", posX: 1.18, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal17", posX: 1.48, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal18", posX: 1.63, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal19", posX: 1.93, posY: 0, rotZ: Math.PI / 4 },
        { name: "diagonal20", posX: 1.78, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal21", posX: 2.08, posY: 0, rotZ: -Math.PI / 4 },
        { name: "diagonal22", posX: 2.23, posY: 0, rotZ: Math.PI / 4 },

        { name: "diagonal23", posX: 2.38, posY: 0, rotZ: -Math.PI / 4 },
    ]

    var gurderParts = [topChord, bottomChord];
    diagonals.forEach(diagonal => {
        var diagonalMesh = MeshBuilder.CreateBox(diagonal.name, { width: 0.22, height: 0.02, depth: 0.02 }, scene);
        diagonalMesh.position.x = diagonal.posX;
        diagonalMesh.position.y = diagonal.posY;
        diagonalMesh.rotation.z = diagonal.rotZ;
        diagonalMesh.material = material;
        diagVal.push(diagonalMesh);
    });
    var diagonalsMesh = Mesh.MergeMeshes(diagVal, true, true, undefined, false, true);
    diagonalsMesh.rotation = new Vector3(0, 0, 1.5708);
    diagonalsMesh.position = new Vector3(-0.1, 0, 0);
    gurderParts.push(diagonalsMesh);

    // Merge all parts into a single mesh
    var gurder = Mesh.MergeMeshes(gurderParts, true, true, undefined, false, true);
    gurder.position.y = 1.5; // Move upwards
    return gurder;
};