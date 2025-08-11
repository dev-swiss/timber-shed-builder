import * as BABYLON from 'babylonjs';

export const left_bracing = (scene) => {
    var bracing = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 5.42, diameter: 0.01}, scene);
    bracing.position.y = 1.2;
    bracing.position.x = 2.3;
    bracing.rotation = new BABYLON.Vector3(1.16937,0,0)

    var bracing1 = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 5.42, diameter: 0.01}, scene);
    bracing1.position.y = 1.2;
    bracing1.position.x = 2.3;
    bracing1.rotation = new BABYLON.Vector3(-1.16937,0,0)

    var container_left_bracing = new BABYLON.Mesh("container_left_bracing", scene);
    container_left_bracing.position = new BABYLON.Vector3(2.4, 0, 0); // Set container_left's initial position

    bracing.setParent(container_left_bracing);
    bracing1.setParent(container_left_bracing);

    return container_left_bracing;
}

export const right_bracing = (scene) =>{
    var bracing2 = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 5.42, diameter: 0.01}, scene);
    bracing2.position.y = 1.2;
    bracing2.position.x = -2.3
    bracing2.rotation = new BABYLON.Vector3(1.16937,0,0)

    var bracing3 = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 5.42, diameter: 0.01}, scene);
    bracing3.position.y = 1.2;
    bracing3.position.x = -2.3
    bracing3.rotation = new BABYLON.Vector3(-1.16937,0,0)

    var container_right_bracing = new BABYLON.Mesh("container_right_bracing", scene);
    container_right_bracing.position = new BABYLON.Vector3(-2.4, 0, 0); // Set container_left's initial position

    bracing2.setParent(container_right_bracing);
    bracing3.setParent(container_right_bracing);

    return container_right_bracing;
}
