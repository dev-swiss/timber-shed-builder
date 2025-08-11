import { Vector3 } from "babylonjs";

export const RoofPitchUtility = (mesh) => {
  var xtraFactor = 0
  if(localStorage.getItem('slab') !== 'Disable'){
    if(parseInt(localStorage.getItem('slabSize')) < 50 ){
      xtraFactor = 0;
    }else if(parseInt(localStorage.getItem('slabSize')) >= 50 && parseInt(localStorage.getItem('slabSize')) < 100){
      xtraFactor = 0.1;
    }else if(parseInt(localStorage.getItem('slabSize')) >= 100 && parseInt(localStorage.getItem('slabSize')) < 150){
      xtraFactor = 0.2;
    }else if(parseInt(localStorage.getItem('slabSize')) >= 150){
      xtraFactor = 0.4;
    }
  }
    if(parseInt(localStorage.getItem("pitch")) == 1){
        mesh.setPivotPoint(new Vector3(0,2.25 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 2){
        mesh.setPivotPoint(new Vector3(0,2.20 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 3){
        mesh.setPivotPoint(new Vector3(0,2.15 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 4){
        mesh.setPivotPoint(new Vector3(0,2.10 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 5){
        mesh.setPivotPoint(new Vector3(0,2.05 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 6){
        mesh.setPivotPoint(new Vector3(0,2.00 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 7){
        mesh.setPivotPoint(new Vector3(0,1.95 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 8){
        mesh.setPivotPoint(new Vector3(0,1.90 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 9){
        mesh.setPivotPoint(new Vector3(0,1.85 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 10){
        mesh.setPivotPoint(new Vector3(0,1.65 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 11){
        mesh.setPivotPoint(new Vector3(0,1.6 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 12){
        mesh.setPivotPoint(new Vector3(0,1.55 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 13){
        mesh.setPivotPoint(new Vector3(0,1.5 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 14){
        mesh.setPivotPoint(new Vector3(0,1.45 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 15){
        mesh.setPivotPoint(new Vector3(0,1.4 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 16){
        mesh.setPivotPoint(new Vector3(0,1.35 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 17){
        mesh.setPivotPoint(new Vector3(0,1.3 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 18){
        mesh.setPivotPoint(new Vector3(0,1.3 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 19){
        mesh.setPivotPoint(new Vector3(0,1.2 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 20){
        mesh.setPivotPoint(new Vector3(0,1.2 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 21){
        mesh.setPivotPoint(new Vector3(0,1.1 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 22){
        mesh.setPivotPoint(new Vector3(0,1 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 23){
        mesh.setPivotPoint(new Vector3(0,0.9 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 24){
        mesh.setPivotPoint(new Vector3(0,0.8 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 25){
        mesh.setPivotPoint(new Vector3(0,0.7 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 26){
        mesh.setPivotPoint(new Vector3(0,0. + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 27){
        mesh.setPivotPoint(new Vector3(0,0.5 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 28){
        mesh.setPivotPoint(new Vector3(0,0.4 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 29){
        mesh.setPivotPoint(new Vector3(0,0.3 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 30){
        mesh.setPivotPoint(new Vector3(0,0.2 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 31){
        mesh.setPivotPoint(new Vector3(0,0.1 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 32){
        mesh.setPivotPoint(new Vector3(0,0 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 33){
        mesh.setPivotPoint(new Vector3(0,-0.1 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 34){
        mesh.setPivotPoint(new Vector3(0,-0.2 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 35){
        mesh.setPivotPoint(new Vector3(0,-0.3 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 36){
        mesh.setPivotPoint(new Vector3(0,-0.4 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 37){
        mesh.setPivotPoint(new Vector3(0,-0.5 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 38){
        mesh.setPivotPoint(new Vector3(0,-0.6 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 39){
        mesh.setPivotPoint(new Vector3(0,-0.7 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 40){
        mesh.setPivotPoint(new Vector3(0,-0.8 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 41){
        mesh.setPivotPoint(new Vector3(0,-0.9 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 42){
        mesh.setPivotPoint(new Vector3(0,-1.0 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 43){
        mesh.setPivotPoint(new Vector3(0,-1.1 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 44){
        mesh.setPivotPoint(new Vector3(0,-1.3 + xtraFactor, 0));
      }else if(parseInt(localStorage.getItem("pitch")) == 45){
        mesh.setPivotPoint(new Vector3(0,-1.5 + xtraFactor, 0));
      }
}

export const AwningRoofUtility = (mesh) => {
  if(parseInt(localStorage.getItem("pitch")) == 1){
      mesh.position.y -= 0.25;
    }else if(parseInt(localStorage.getItem("pitch")) == 2){
      mesh.position.y -= 0.30;
    }else if(parseInt(localStorage.getItem("pitch")) == 3){
      mesh.position.y -= 0.35;
    }else if(parseInt(localStorage.getItem("pitch")) == 4){
      mesh.position.y -= 0.4;
    }else if(parseInt(localStorage.getItem("pitch")) == 5){
      mesh.position.y -= 0.45;
    }else if(parseInt(localStorage.getItem("pitch")) == 6){
      mesh.position.y -= 0.5;
    }else if(parseInt(localStorage.getItem("pitch")) == 7){
      mesh.position.y -= 0.55;
    }else if(parseInt(localStorage.getItem("pitch")) == 8){
      mesh.position.y -= 0.6;
    }else if(parseInt(localStorage.getItem("pitch")) == 9){
      mesh.position.y -= 0.65;
    }else if(parseInt(localStorage.getItem("pitch")) == 10){
      mesh.position.y -= 0.7;
    }else if(parseInt(localStorage.getItem("pitch")) == 11){
      mesh.position.y -= 0.75;
    }else if(parseInt(localStorage.getItem("pitch")) == 12){
      mesh.position.y -= 0.8;
    }else if(parseInt(localStorage.getItem("pitch")) == 13){
      mesh.position.y -= 0.85;
    }else if(parseInt(localStorage.getItem("pitch")) == 14){
      mesh.position.y -= 0.95;
    }else if(parseInt(localStorage.getItem("pitch")) == 15){
      mesh.position.y -= 1;
    }else if(parseInt(localStorage.getItem("pitch")) == 16){
      mesh.position.y -= 1.05;
    }else if(parseInt(localStorage.getItem("pitch")) == 17){
      mesh.position.y -= 1.1;
    }else if(parseInt(localStorage.getItem("pitch")) == 18){
      mesh.position.y -= 1.15;
    }else if(parseInt(localStorage.getItem("pitch")) == 19){
      mesh.position.y -= 1.2;
    }else if(parseInt(localStorage.getItem("pitch")) == 20){
      mesh.position.y -= 1.3;
    }else if(parseInt(localStorage.getItem("pitch")) == 21){
      mesh.position.y -= 1.4;
    }else if(parseInt(localStorage.getItem("pitch")) == 22){
      mesh.position.y -= 1.5;
    }else if(parseInt(localStorage.getItem("pitch")) == 23){
      mesh.position.y -= 1.6;
    }else if(parseInt(localStorage.getItem("pitch")) == 24){
      mesh.position.y -= 1.7;
    }else if(parseInt(localStorage.getItem("pitch")) == 25){
      mesh.position.y -= 1.75;
    }else if(parseInt(localStorage.getItem("pitch")) == 26){
      mesh.position.y -= 1.8;
    }else if(parseInt(localStorage.getItem("pitch")) == 27){
      mesh.position.y -= 1.85;
    }else if(parseInt(localStorage.getItem("pitch")) == 28){
      mesh.position.y -= 1.9;
    }else if(parseInt(localStorage.getItem("pitch")) == 29){
      mesh.position.y -= 2.05;
    }else if(parseInt(localStorage.getItem("pitch")) == 30){
      mesh.position.y -= 2.1;
    }else if(parseInt(localStorage.getItem("pitch")) == 31){
      mesh.position.y -= 2.2;
    }else if(parseInt(localStorage.getItem("pitch")) == 32){
      mesh.position.y -= 2.3;
    }else if(parseInt(localStorage.getItem("pitch")) == 33){
      mesh.position.y -= 2.5;
    }else if(parseInt(localStorage.getItem("pitch")) == 34){
      mesh.position.y -= 2.6;
    }else if(parseInt(localStorage.getItem("pitch")) == 35){
      mesh.position.y -= 2.7;
    }else if(parseInt(localStorage.getItem("pitch")) == 36){
      mesh.position.y -= 2.8;
    }else if(parseInt(localStorage.getItem("pitch")) == 37){
      mesh.position.y -= 2.9;
    }else if(parseInt(localStorage.getItem("pitch")) == 38){
      mesh.position.y -= 3;
    }else if(parseInt(localStorage.getItem("pitch")) == 39){
      mesh.position.y -= 3.15;
    }else if(parseInt(localStorage.getItem("pitch")) == 40){
      mesh.position.y -= 3.3;
    }else if(parseInt(localStorage.getItem("pitch")) == 41){
      mesh.position.y -= 3.4;
    }else if(parseInt(localStorage.getItem("pitch")) == 42){
      mesh.position.y -= 3.5;
    }else if(parseInt(localStorage.getItem("pitch")) == 43){
      mesh.position.y -= 3.6;
    }else if(parseInt(localStorage.getItem("pitch")) == 44){
      mesh.position.y -= 3.7;
    }else if(parseInt(localStorage.getItem("pitch")) == 45){
      mesh.position.y -= 3.9;
    }
}