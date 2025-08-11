var indexForDisabledCol = 0;
var isCenterColEnabled = false;
var isCol1 = false;
var isCol2 = false;

export const getAllChecksForEnablingShedTrusses = (loadedMeshes) =>{
    indexForDisabledCol = 0;
    isCol1 = false;
    isCol2 = false;
    loadedMeshes[loadedMeshes.length - 1].forEach((mesh) =>{
      if(mesh.name === 'colCenter1'){
        if(mesh.isVisible == false){
          isCenterColEnabled = true;
          isCol1 = true;
          indexForDisabledCol = loadedMeshes.length - 1;
        }else{
          isCol1 = false;
        }
      }
      if(mesh.name === 'colCenter2'){
        if(mesh.isVisible == false){
          isCenterColEnabled = true;
          isCol2 = true;
          indexForDisabledCol = loadedMeshes.length - 1;
        }else{
          isCol2 = false;
        }
      }
    })
}
export const enableTrussesForNewBays = (loadedMeshes) =>{
    console.log("index is at: ", indexForDisabledCol)
    if(indexForDisabledCol != 0){
        loadedMeshes[indexForDisabledCol + 1].forEach((mesh) => {
          if(isCol1){
            if(mesh.name === 'rtruss'){
              mesh.isVisible = true;
            }
          }
          if (isCol2){
            if(mesh.name === 'ltruss'){
              mesh.isVisible = true;
            }
          }
        })
      }
}


var indexForDisabledColDeletion = 0;
var isLeftColDeletion = false;
var isRightColDeletion = false;
export const getAllChecksForEnablingBayTrussesDeletion = (loadedMeshes) =>{
    indexForDisabledColDeletion= 0;
    isLeftColDeletion = false;
    isRightColDeletion = false;
    loadedMeshes[loadedMeshes.length - 1].forEach((mesh) =>{
      if(mesh.name === 'colCenter2'){
        if(mesh.isVisible == false){
            isLeftColDeletion = true;
            indexForDisabledColDeletion = loadedMeshes.length - 1;
        }else{
            isLeftColDeletion = false;
        }
      }
      if(mesh.name === 'colCenter1'){
        if(mesh.isVisible == false){
            isRightColDeletion = true;
            indexForDisabledColDeletion = loadedMeshes.length - 1;
        }else{
            isRightColDeletion = false;
        }
      }
    })
}
export const enableTrussesForDeletingBays = (loadedMeshes) =>{
    console.log("function called with index: ", indexForDisabledColDeletion, " and length: ", loadedMeshes.length - 1)
    if(indexForDisabledColDeletion == loadedMeshes.length - 1){
        console.log("passed first check for == len")
        loadedMeshes[1].forEach((mesh) => {
          if(isRightColDeletion){
            if(mesh.name === 'frtruss'){
              mesh.isVisible = true;
            }
          }
          if (isLeftColDeletion){
            if(mesh.name === 'fltruss'){
              mesh.isVisible = true;
            }
          }
        })
      }
}


var indexForDisabledAwningCol= 0;
var isLeftCol = false;
var isRightCol = false;
export const getAllChecksForEnablingAwningTrusses = (loadedMeshes) =>{
    indexForDisabledAwningCol= 0;
    isLeftCol = false;
    isRightCol = false;
    loadedMeshes[loadedMeshes.length - 1].forEach((mesh) =>{
      if(mesh.name === 'leantoleftcols'){
        if(mesh.isVisible == false){
          if(localStorage.getItem("leftAwning") == "true"){
            isLeftCol = true;
            indexForDisabledAwningCol = loadedMeshes.length - 1;
          }
        }else{
            isLeftCol = false;
        }
      }
      if(mesh.name === 'leantorightcols'){
        if(mesh.isVisible == false){
            if(localStorage.getItem("rightAwning") == "true"){
              isRightCol = true;
              indexForDisabledAwningCol = loadedMeshes.length - 1;
            }
        }else{
            isRightCol = false;
        }
      }
    })
}
export const enableTrussesForNewAwningBays = (loadedMeshes) =>{
  console.log("following are teh flag for ratruss: ", isRightCol,"and for ltruss: ", isLeftCol)
    if(indexForDisabledAwningCol != 0){
        loadedMeshes[indexForDisabledAwningCol + 1].forEach((mesh) => {
          if(isRightCol){
            if(mesh.name === 'ratruss'){
              mesh.isVisible = true;
            }
          }
          if (isLeftCol){
            if(mesh.name === 'altruss'){
              mesh.isVisible = true;
            }
          }
        })
      }
}

var indexForDisabledAwningColDeletion = 0;
var isLeftAwningColDeletion = false;
var isRightAwningColDeletion = false;
export const getAllChecksForEnablingAwningTrussesDeletion = (loadedMeshes) =>{
    indexForDisabledAwningColDeletion= 0;
    isLeftAwningColDeletion = false;
    isRightAwningColDeletion = false;
    loadedMeshes[loadedMeshes.length - 1].forEach((mesh) =>{
      if(mesh.name === 'leantoleftcols'){
        if(mesh.isVisible == false){
            if(localStorage.getItem("leftAwning") == "true"){
              isLeftAwningColDeletion = true;
              indexForDisabledAwningColDeletion = loadedMeshes.length - 1;
            }
        }else{
            isLeftAwningColDeletion = false;
        }
      }
      if(mesh.name === 'leantorightcols'){
        if(mesh.isVisible == false){
            if(localStorage.getItem("rightAwning") == "true"){
              isRightAwningColDeletion = true;
              indexForDisabledAwningColDeletion = loadedMeshes.length - 1;
            }
        }else{
            isRightAwningColDeletion = false;
        }
      }
    })
}
export const enableTrussesForDeletingAwningBays = (loadedMeshes) =>{
    if(indexForDisabledAwningColDeletion == loadedMeshes.length - 1){
        loadedMeshes[1].forEach((mesh) => {
          if(isRightAwningColDeletion){
            if(mesh.name === 'afrtruss'){
              mesh.isVisible = true;
            }
          }
          if (isLeftAwningColDeletion){
            if(mesh.name === 'afltruss'){
              mesh.isVisible = true;
            }
          }
        })
      }
}