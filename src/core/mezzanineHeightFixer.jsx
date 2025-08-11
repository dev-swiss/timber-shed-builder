export const mezzanineHeightFixer = (mesh) => {
    if(localStorage.getItem("mezzanine_height") && localStorage.getItem("mezzanine_height") !== 'null'){
        mesh.position.y = parseFloat(localStorage.getItem("mezzanine_height"))
      }
}