import { ubColumn, rafter, createPurlin } from "./structure";
import * as BABYLON from 'babylonjs'

export const rightMezzanine = (scene, material) => {
    var leanToLeftRoofs = [];
    var leantoleftcols = [];
 
    var leanToLeftCol3 = ubColumn();
    leanToLeftCol3.position.y = 1;
    leanToLeftCol3.position.x = 0;
    leanToLeftCol3.position.z = 2.5;
    leanToLeftCol3.scaling.y = 0.98;
    leanToLeftRoofs.push(leanToLeftCol3);
    
    var leanToLeftCol4 = ubColumn();
    leanToLeftCol4.position.y = 1;
    leanToLeftCol4.position.x = -2.35;
    leanToLeftCol4.position.z = 2.5;
    leanToLeftCol4.scaling.y = 0.98;
    leanToLeftRoofs.push(leanToLeftCol4);
 

    var leanToLeftRafter = rafter();
 
    leanToLeftRafter.position.y = 2.05;
    leanToLeftRafter.position.z = 2.5
    leanToLeftRafter.position.x= -1.2
    leanToLeftRafter.rotation = new BABYLON.Vector3(0,0,1.5708);
    leanToLeftRafter.scaling.y = 1
    leanToLeftRoofs.push(leanToLeftRafter)
 
    var leanToLeftPurlin = createPurlin();;
    leanToLeftPurlin.position.y=2.16;
    leanToLeftPurlin.position.x= 0;
    leanToLeftPurlin.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin);
 
    var leanToLeftPurlin1 = createPurlin();;
    leanToLeftPurlin1.position.y=2.16;
    leanToLeftPurlin1.position.x= -0.5;
    leanToLeftPurlin1.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin1);
 
    var leanToLeftPurlin2 = createPurlin();;
    leanToLeftPurlin2.position.y=2.16;
    leanToLeftPurlin2.position.x= -1;
    leanToLeftPurlin2.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin2);
 
    var leanToLeftPurlin3 = createPurlin();;
    leanToLeftPurlin3.position.y=2.16;
    leanToLeftPurlin3.position.x= -1.5;
    leanToLeftPurlin3.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin3);
 
    var leanToLeftPurlin4 = createPurlin();;
    leanToLeftPurlin4.position.y=2.16;
    leanToLeftPurlin4.position.x= -2;
    leanToLeftPurlin4.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin4);
 
    var leanToLeftPurlin5 = createPurlin();;
    leanToLeftPurlin5.position.y=2.16;
    leanToLeftPurlin5.position.x= -2.5;
    leanToLeftPurlin5.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin5);
 
    var leanToLeftRoof = BABYLON.MeshBuilder.CreateBox("box", {size: 0.02, width: 2.5, depth: 5.35}, scene);
    leanToLeftRoof.position.y=2.20;
    leanToLeftRoof.position.x=-1.2;
    leanToLeftRoof.rotation = new BABYLON.Vector3(0,0,0);
    leanToLeftRoofs.push(leanToLeftRoof);
    
    var container = new BABYLON.Mesh("container_right_mezzanine", scene);
    container.position = new BABYLON.Vector3(0, 1, 0); // Set container_left's initial position

    leanToLeftRoofs.forEach((mesh) => {
        mesh.parent = container;
    })
    container.position.y = -1;
    // var roofMesh = BABYLON.Mesh.MergeMeshes(leanToLeftRoofs, true, true, undefined, false, true);
    // var colMesh = BABYLON.Mesh.MergeMeshes(leantoleftcols , true, true, undefined, false, true);
    // var fullMesh = [roofMesh, colMesh];
    // var fullMergedMesh = BABYLON.Mesh.MergeMeshes(fullMesh , true, true, undefined, false, true);
    // fullMergedMesh.position.y = 0.5

    container.setEnabled(false);
    return container;
}

export const leftMezzanine = (scene, material) => {
    var leanToLeftRoofs = [];
    var leantoleftcols = [];
 
    var leanToLeftCol3 = ubColumn();
    leanToLeftCol3.position.y = 1;
    leanToLeftCol3.position.x = 0;
    leanToLeftCol3.position.z = 2.5;
    leanToLeftCol3.scaling.y = 0.98;
    leanToLeftRoofs.push(leanToLeftCol3);
 
    var leanToLeftCol4 = ubColumn();
    leanToLeftCol4.position.y = 1;
    leanToLeftCol4.position.x = 2.35;
    leanToLeftCol4.position.z = 2.5;
    leanToLeftCol4.scaling.y = 0.98;
    leanToLeftRoofs.push(leanToLeftCol4);
 
    var leanToLeftRafter = rafter();
 
    leanToLeftRafter.position.y = 2.05;
    leanToLeftRafter.position.z = 2.5
    leanToLeftRafter.position.x= 1.2
    leanToLeftRafter.rotation = new BABYLON.Vector3(0,0,1.5708);
    leanToLeftRafter.scaling.y = 1
    leanToLeftRoofs.push(leanToLeftRafter)
 
    var leanToLeftPurlin = createPurlin();;
    leanToLeftPurlin.position.y=2.16;
    leanToLeftPurlin.position.x= 0;
    leanToLeftPurlin.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin);
 
    var leanToLeftPurlin1 = createPurlin();;
    leanToLeftPurlin1.position.y=2.16;
    leanToLeftPurlin1.position.x= 0.5;
    leanToLeftPurlin1.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin1);
 
    var leanToLeftPurlin2 = createPurlin();;
    leanToLeftPurlin2.position.y=2.16;
    leanToLeftPurlin2.position.x= 1;
    leanToLeftPurlin2.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin2);
 
    var leanToLeftPurlin3 = createPurlin();;
    leanToLeftPurlin3.position.y=2.16;
    leanToLeftPurlin3.position.x= 1.5;
    leanToLeftPurlin3.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin3);
 
    var leanToLeftPurlin4 = createPurlin();;
    leanToLeftPurlin4.position.y=2.16;
    leanToLeftPurlin4.position.x= 2;
    leanToLeftPurlin4.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin4);
 
    var leanToLeftPurlin5 = createPurlin();;
    leanToLeftPurlin5.position.y=2.16;
    leanToLeftPurlin5.position.x= 2.36;
    leanToLeftPurlin5.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin5);
 
    var leanToLeftRoof = BABYLON.MeshBuilder.CreateBox("box", {size: 0.02, width: 2.5, depth: 5.35}, scene);
    leanToLeftRoof.position.y=2.20;
    leanToLeftRoof.position.x=1.2;
    leanToLeftRoof.rotation = new BABYLON.Vector3(0,0,0);
    leanToLeftRoofs.push(leanToLeftRoof);
    
    var container = new BABYLON.Mesh("container_left_mezzanine", scene);
    container.position = new BABYLON.Vector3(0, 1, 0); // Set container_left's initial position

    leanToLeftRoofs.forEach((mesh) => {
        mesh.parent = container;
    })
    container.position.y = -1;
    container.setEnabled(false);
    console.log(container.constructor.name);
    return container;
}

export const rightMezzanineBack = (scene, material) => {
    var leanToLeftRoofs = [];
    var leantoleftcols = [];
 
    var leanToLeftCol3 = ubColumn();
    leanToLeftCol3.position.y = 1;
    leanToLeftCol3.position.x = 0;
    leanToLeftCol3.position.z = 2.5;
    leanToLeftCol3.scaling.y = 0.98;
    leanToLeftRoofs.push(leanToLeftCol3);

    var leanToLeftCol5 = ubColumn();
    leanToLeftCol5.position.y = 1;
    leanToLeftCol5.position.x = -2.35;
    leanToLeftCol5.position.z = 2.5;
    leanToLeftCol5.scaling.y = 0.98;
    leanToLeftRoofs.push(leanToLeftCol5);
 

    var leanToLeftCol4 = ubColumn();
    leanToLeftCol4.position.y = 1;
    leanToLeftCol4.position.x = 0;
    leanToLeftCol4.position.z = -2.5;
    leanToLeftCol4.scaling.y = 0.98;
    leanToLeftRoofs.push(leanToLeftCol4);

    var leanToLeftCol6 = ubColumn();
    leanToLeftCol6.position.y = 1;
    leanToLeftCol6.position.x = -2.35;
    leanToLeftCol6.position.z = 2.5;
    leanToLeftCol6.scaling.y = 0.98;
    leanToLeftRoofs.push(leanToLeftCol6);
 
 
    var leanToLeftRafter = rafter();
    leanToLeftRafter.position.y = 2.05;
    leanToLeftRafter.position.z = 2.5
    leanToLeftRafter.position.x= -1.2
    leanToLeftRafter.rotation = new BABYLON.Vector3(0,0,1.5708);
    leanToLeftRafter.scaling.y = 1
    leanToLeftRoofs.push(leanToLeftRafter)

    var leanToLeftRafter1 = rafter();
    leanToLeftRafter1.position.y = 2.05;
    leanToLeftRafter1.position.z = -2.5
    leanToLeftRafter1.position.x= -1.2
    leanToLeftRafter1.rotation = new BABYLON.Vector3(0,0,1.5708);
    leanToLeftRafter1.scaling.y = 1
    leanToLeftRoofs.push(leanToLeftRafter1);
 
    var leanToLeftPurlin = createPurlin();;
    leanToLeftPurlin.position.y=2.16;
    leanToLeftPurlin.position.x= 0;
    leanToLeftPurlin.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin);
 
    var leanToLeftPurlin1 = createPurlin();;
    leanToLeftPurlin1.position.y=2.16;
    leanToLeftPurlin1.position.x= -0.5;
    leanToLeftPurlin1.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin1);
 
    var leanToLeftPurlin2 = createPurlin();;
    leanToLeftPurlin2.position.y=2.16;
    leanToLeftPurlin2.position.x= -1;
    leanToLeftPurlin2.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin2);
 
    var leanToLeftPurlin3 = createPurlin();;
    leanToLeftPurlin3.position.y=2.16;
    leanToLeftPurlin3.position.x= -1.5;
    leanToLeftPurlin3.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin3);
 
    var leanToLeftPurlin4 = createPurlin();;
    leanToLeftPurlin4.position.y=2.16;
    leanToLeftPurlin4.position.x= -2;
    leanToLeftPurlin4.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin4);
 
    var leanToLeftPurlin5 = createPurlin();;
    leanToLeftPurlin5.position.y=2.16;
    leanToLeftPurlin5.position.x= -2.36;
    leanToLeftPurlin5.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin5);
 
    var leanToLeftRoof = BABYLON.MeshBuilder.CreateBox("box", {size: 0.02, width: 2.5, depth: 5.35}, scene);
    leanToLeftRoof.position.y=2.20;
    leanToLeftRoof.position.x=-1.2;
    leanToLeftRoof.rotation = new BABYLON.Vector3(0,0,0);
    leanToLeftRoofs.push(leanToLeftRoof);
    
    var container = new BABYLON.Mesh("container_right_mezzanine", scene);
    container.position = new BABYLON.Vector3(0, 1, 0); // Set container_left's initial position

    leanToLeftRoofs.forEach((mesh) => {
        mesh.parent = container;
    })
    container.position.y = -1;
    // var roofMesh = BABYLON.Mesh.MergeMeshes(leanToLeftRoofs, true, true, undefined, false, true);
    // var colMesh = BABYLON.Mesh.MergeMeshes(leantoleftcols , true, true, undefined, false, true);
    // var fullMesh = [roofMesh, colMesh];
    // var fullMergedMesh = BABYLON.Mesh.MergeMeshes(fullMesh , true, true, undefined, false, true);
    // fullMergedMesh.position.y = 0.5
    container.setEnabled(false);
    return container;
}

export const leftMezzanineBack = (scene, material) => {
    var leanToLeftRoofs = [];
    var leantoleftcols = [];
 
    var leanToLeftCol3 = ubColumn();
    leanToLeftCol3.position.y = 1;
    leanToLeftCol3.position.x = 0;
    leanToLeftCol3.position.z = 2.5;
    leanToLeftCol3.scaling.y = 0.98;
    leanToLeftRoofs.push(leanToLeftCol3);

    var leanToLeftCol5 = ubColumn();
    leanToLeftCol5.position.y = 1;
    leanToLeftCol5.position.x = 2.35;
    leanToLeftCol5.position.z = 2.5;
    leanToLeftCol5.scaling.y = 0.98;
    leanToLeftRoofs.push(leanToLeftCol5);
 
    
    var leanToLeftCol4 = ubColumn();
    leanToLeftCol4.position.y = 1;
    leanToLeftCol4.position.x = 0;
    leanToLeftCol4.position.z = -2.5;
    leanToLeftCol4.scaling.y = 0.98;
    leanToLeftRoofs.push(leanToLeftCol4);

    var leanToLeftCol6 = ubColumn();
    leanToLeftCol6.position.y = 1;
    leanToLeftCol6.position.x = 2.35;
    leanToLeftCol6.position.z = 2.5;
    leanToLeftCol6.scaling.y = 0.98;
    leanToLeftRoofs.push(leanToLeftCol6);
 
    var leanToLeftRafter = rafter();
    leanToLeftRafter.position.y = 2.05;
    leanToLeftRafter.position.z = 2.5
    leanToLeftRafter.position.x= 1.2
    leanToLeftRafter.rotation = new BABYLON.Vector3(0,0,1.5708);
    leanToLeftRafter.scaling.y = 1
    leanToLeftRoofs.push(leanToLeftRafter)

    var leanToLeftRafter1 = rafter();
    leanToLeftRafter1.position.y = 2.05;
    leanToLeftRafter1.position.z = -2.5
    leanToLeftRafter1.position.x= 1.2
    leanToLeftRafter1.rotation = new BABYLON.Vector3(0,0,1.5708);
    leanToLeftRafter1.scaling.y = 1
    leanToLeftRoofs.push(leanToLeftRafter1);
 
    var leanToLeftPurlin = createPurlin();;
    leanToLeftPurlin.position.y=2.16;
    leanToLeftPurlin.position.x= 0;
    leanToLeftPurlin.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin);
 
    var leanToLeftPurlin1 = createPurlin();;
    leanToLeftPurlin1.position.y=2.16;
    leanToLeftPurlin1.position.x= 0.5;
    leanToLeftPurlin1.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin1);
 
    var leanToLeftPurlin2 = createPurlin();;
    leanToLeftPurlin2.position.y=2.16;
    leanToLeftPurlin2.position.x= 1;
    leanToLeftPurlin2.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin2);
 
    var leanToLeftPurlin3 = createPurlin();;
    leanToLeftPurlin3.position.y=2.16;
    leanToLeftPurlin3.position.x= 1.5;
    leanToLeftPurlin3.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin3);
 
    var leanToLeftPurlin4 = createPurlin();;
    leanToLeftPurlin4.position.y=2.16;
    leanToLeftPurlin4.position.x= 2;
    leanToLeftPurlin4.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin4);
 
    var leanToLeftPurlin5 = createPurlin();;
    leanToLeftPurlin5.position.y=2.16;
    leanToLeftPurlin5.position.x= 2.36;
    leanToLeftPurlin5.rotation = new BABYLON.Vector3(0,0,-1.5708);
    leanToLeftRoofs.push(leanToLeftPurlin5);
 
    var leanToLeftRoof = BABYLON.MeshBuilder.CreateBox("box", {size: 0.02, width: 2.5, depth: 5.35}, scene);
    leanToLeftRoof.position.y=2.20;
    leanToLeftRoof.position.x=1.2;
    leanToLeftRoof.rotation = new BABYLON.Vector3(0,0,0);
    leanToLeftRoofs.push(leanToLeftRoof);
    
    var container = new BABYLON.Mesh("container_left_mezzanine", scene);
    container.position = new BABYLON.Vector3(0, 1, 0); // Set container_left's initial position

    leanToLeftRoofs.forEach((mesh) => {
        mesh.parent = container;
    })
    container.position.y = -1;
    container.setEnabled(false);
    return container;
}