import { Mesh, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';

export const createDoorWithKnob = (scene, doorMaterial, knobMaterial, wallType) => {
    var collection = [];

    // Creating the main door 
    var door = BABYLON.MeshBuilder.CreateBox("door", { height: 0.6, width: 0.77, depth: 0.3 }, scene); // New dimensions
    if (wallType === 'Lwall') {
        door.rotation.y = Math.PI / 2; 
        door.position.x = 0.05; 
        door.position.y= -0.4;
     
    } else if (wallType === 'Rwall') {
        door.rotation.y = -Math.PI / 2; 
     //   door.position.z = 0.025; 
   //   door.position.x = 0.3;
          door.position.x = 0.05;
          door.position.y= -0.4;

    } else if (wallType === 'FWall') {
        door.rotation.y = Math.PI; 
        door.position.x = 0.3; 
        door.position.z= 0.1;
        door.position.y= -0.2;

    } else if (wallType === 'BWall') {
        door.rotation.y = 0; 
        door.position.x = -0.025; 
        door.position.y= -0.2;
    }

    door.material = doorMaterial;
    collection.push(door);

    // Creating the door knob
    var knob = BABYLON.MeshBuilder.CreateSphere("knob", { diameter: 0.16 }, scene); // Sphere with diameter 0.16m
    knob.material = knobMaterial;
    collection.push(knob);

   
    if (wallType === 'Lwall') {
        knob.position = new Vector3(0.09, 0, 0.025);
        knob.position.z= -0.25;
        knob.position.x= 0.2;
        knob.position.y= -0.35;
     // knob.position = new BABYLON.Vector3(0.28, 0, 0.025); 

    } else if (wallType === 'Rwall') {
        knob.position = new Vector3(-0.09, 0, 0.025);
       knob.position.x= -0.13;
        knob.position.z= -0.15;
        knob.position.y= -0.35;
    } else if (wallType === 'FWall') {
        knob.position = new Vector3(0.48, 0, door.position.z + 0.025); 
        knob.position.z= 0.2;
        knob.position.y= -0.2;
      //  knob.position.x= 0.3;
    }

    else if ( wallType === 'BWall') {
        knob.position = new Vector3(0.23, 0, door.position.z + 0.025); 
        knob.position.z= -0.1;
        knob.position.y= -0.2;
      //  knob.position.x= 0.3;
    }

    var completeDoor = Mesh.MergeMeshes(collection, true, true, undefined, false, true);

    return completeDoor;
};