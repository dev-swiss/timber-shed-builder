import { useEffect } from "react";
import { connect } from "react-redux";
import { decryptKey } from "./utils"; // Import the decryption function from your utility file
let loaded_meshes = [];
export const apimeshloader = (loadedMeshes) => {
  loaded_meshes = loadedMeshes;
  return loaded_meshes;
};

const ApiConnection = (props) => {
  const { dispatch } = props;

  useEffect(() => {
    const sessionStorageData = {
      ArrowPosition_: sessionStorage.getItem('ArrowPosition_'),
      LarrowPrevPosition: sessionStorage.getItem('LarrowPrevPosition'),
      RightColCenter: JSON.parse(sessionStorage.getItem('RightColCenter') || '{}'),
      bayStates: JSON.parse(sessionStorage.getItem('bayStates') || '{}'),
      col1: JSON.parse(sessionStorage.getItem('col1') || 'false'),
      col2: JSON.parse(sessionStorage.getItem('col2') || 'false'),
      depthLeftArrowPos_: sessionStorage.getItem('depthLeftArrowPos_'),
      depthRightArrowPos_: sessionStorage.getItem('depthRightArrowPos_'),
      floorHeight: sessionStorage.getItem('floorHeight'),
      frontArrowPosition_: sessionStorage.getItem('frontArrowPosition_'),
      frontAwning_scalingFactor: sessionStorage.getItem('frontAwning_scalingFactor'),
      frontGroundPosition_: sessionStorage.getItem('frontGroundPosition_'),
      frontLogoPosition_: sessionStorage.getItem('frontLogoPosition_'),
      leftArrowPositionAfterEnabling_: sessionStorage.getItem('leftArrowPositionAfterEnabling_'),
      leftArrowPositionAfterWidth_: sessionStorage.getItem('leftArrowPositionAfterWidth_'),
      leftArrowPosition_: sessionStorage.getItem('leftArrowPosition_'),
      leftAwningWallPosition_: sessionStorage.getItem('leftAwningWallPosition_'),
      leftColCenter: JSON.parse(sessionStorage.getItem('leftColCenter') || '{}'),
      leftDepthArrowAfterWidth_: sessionStorage.getItem('leftDepthArrowAfterWidth_'),
      leftHeightArrowPositionAfterWidth_: sessionStorage.getItem('leftHeightArrowPositionAfterWidth_'),
      leftHeightArrowPosition_: sessionStorage.getItem('leftHeightArrowPosition_'),
      rightAwningWallPosition_: sessionStorage.getItem('rightAwningWallPosition_'),
      rightDepthArrowAfterWidth_: sessionStorage.getItem('rightDepthArrowAfterWidth_'),
      rightHeightArrowPositionAfterWidth_: sessionStorage.getItem('rightHeightArrowPositionAfterWidth_'),
      rightHeightArrowPosition_: sessionStorage.getItem('rightHeightArrowPosition_'),
      // Add other session storage items as needed
    };

    // Parse the URL to check for the presence of the key
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedKey = urlParams.get("id");
    if (encryptedKey) {
      try {
        // Decrypt the key directly (no need to parse JSON since it's already an object)
        const decryptedKey = decryptKey(encryptedKey);
        console.log("Decrypted Key:", decryptedKey); // Inspect the decrypted object

        // Directly use the decrypted object
        if (decryptedKey && typeof decryptedKey === 'object') {
          const {
            apexHeight,
            backAwning,
            backAwningWidth,
            backCantilever,
            baySize,
            bayStates,
            buildAddress,
            city,
            comment,
            country,
            customValue,
            email,
            firstName,
            frontAwning,
            frontAwningWidth,
            frontCantilever,
            height,
            lastName,
            leftAwning,
            leftAwningWidth,
            leftAwningPitchRef,
            leftCantilever,
            length,
            mezzanine_height,
            numberOfBays,
            phoneNumber,
            postalCode,
            rightAwning,
            rightAwningWidth,
            rightAwningPitchRef,
            rightCantilever,
            slab,
            specialInstructions,
            state,
            suburb,
            width,
            type,
            // other properties you might need
          } = decryptedKey;

          // Update local storage with decrypted values
          localStorage.setItem('apexHeight', apexHeight);
          localStorage.setItem('backAwning', backAwning);
          localStorage.setItem('backAwningLength', backAwningWidth);
          localStorage.setItem('backCantilever', backCantilever);
          localStorage.setItem('baySize', baySize);
          // localStorage.setItem('bayStates', JSON.stringify(bayStates));
          localStorage.setItem('buildAddress', buildAddress);
          localStorage.setItem('city', city);
          localStorage.setItem('comment', comment);
          localStorage.setItem('country', country);
          localStorage.setItem('customValue', customValue);
          localStorage.setItem('email', email);
          localStorage.setItem('firstName', firstName);
          localStorage.setItem('frontAwning', frontAwning);
          localStorage.setItem('frontAwningLength', frontAwningWidth);
          localStorage.setItem('frontCantilever', frontCantilever);
          localStorage.setItem('height', height);
          localStorage.setItem('lastName', lastName);
          localStorage.setItem('leftAwning', leftAwning);
          localStorage.setItem('leftAwningLength', leftAwningWidth);
          localStorage.setItem('leftAwningPitch', leftAwningPitchRef);
          localStorage.setItem('leftCantilever', leftCantilever);
          localStorage.setItem('length', length);
          localStorage.setItem('mezzanine_height', mezzanine_height);
          localStorage.setItem('numberOfBays', numberOfBays);
          localStorage.setItem('phoneNumber', phoneNumber);
          localStorage.setItem('postalCode', postalCode);
          localStorage.setItem('rightAwning', rightAwning);
          localStorage.setItem('rightAwningLength', rightAwningWidth);
          localStorage.setItem('rightAwningPitch', rightAwningPitchRef);
          localStorage.setItem('rightCantilever', rightCantilever);
          localStorage.setItem('slab', slab);
          localStorage.setItem('specialInstructions', specialInstructions);
          localStorage.setItem('state', state);
          localStorage.setItem('suburb', suburb);
          localStorage.setItem('width', width);

          // Update loaded_meshes with values from decryptedKey
          // Update session storage with decrypted values
          sessionStorage.setItem('ArrowPosition_', sessionStorageData.ArrowPosition_);
          sessionStorage.setItem('LarrowPrevPosition', sessionStorageData.LarrowPrevPosition);
          sessionStorage.setItem('RightColCenter', JSON.stringify(sessionStorageData.RightColCenter));
          sessionStorage.setItem('bayStates', JSON.stringify(bayStates));
          sessionStorage.setItem('col1', JSON.stringify(sessionStorageData.col1));
          sessionStorage.setItem('col2', JSON.stringify(sessionStorageData.col2));
          sessionStorage.setItem('depthLeftArrowPos_', sessionStorageData.depthLeftArrowPos_);
          sessionStorage.setItem('depthRightArrowPos_', sessionStorageData.depthRightArrowPos_);
          sessionStorage.setItem('floorHeight', sessionStorageData.floorHeight);
          sessionStorage.setItem('frontArrowPosition_', sessionStorageData.frontArrowPosition_);
          sessionStorage.setItem('frontAwning_scalingFactor', sessionStorageData.frontAwning_scalingFactor);
          sessionStorage.setItem('frontGroundPosition_', sessionStorageData.frontGroundPosition_);
          sessionStorage.setItem('frontLogoPosition_', sessionStorageData.frontLogoPosition_);
          sessionStorage.setItem('leftArrowPositionAfterEnabling_', sessionStorageData.leftArrowPositionAfterEnabling_);
          sessionStorage.setItem('leftArrowPositionAfterWidth_', sessionStorageData.leftArrowPositionAfterWidth_);
          sessionStorage.setItem('leftArrowPosition_', sessionStorageData.leftArrowPosition_);
          sessionStorage.setItem('leftAwningWallPosition_', sessionStorageData.leftAwningWallPosition_);
          sessionStorage.setItem('leftColCenter', JSON.stringify(sessionStorageData.leftColCenter));
          sessionStorage.setItem('leftDepthArrowAfterWidth_', sessionStorageData.leftDepthArrowAfterWidth_);
          sessionStorage.setItem('leftHeightArrowPositionAfterWidth_', sessionStorageData.leftHeightArrowPositionAfterWidth_);
          sessionStorage.setItem('leftHeightArrowPosition_', sessionStorageData.leftHeightArrowPosition_);
          sessionStorage.setItem('rightAwningWallPosition_', sessionStorageData.rightAwningWallPosition_);
          sessionStorage.setItem('rightDepthArrowAfterWidth_', sessionStorageData.rightDepthArrowAfterWidth_);
          sessionStorage.setItem('rightHeightArrowPositionAfterWidth_', sessionStorageData.rightHeightArrowPositionAfterWidth_);
          sessionStorage.setItem('rightHeightArrowPosition_', sessionStorageData.rightHeightArrowPosition_);

          const updatedMeshes = loaded_meshes.map(mesh => ({
            ...mesh,
            apexHeight,
            backAwning,
            backAwningWidth,
            backCantilever,
            baySize,
            bayStates,
            buildAddress,
            city,
            comment,
            country,
            customValue,
            email,
            firstName,
            frontAwning,
            frontAwningWidth,
            frontCantilever,
            height,
            lastName,
            leftAwning,
            leftAwningWidth,
            leftAwningPitchRef,
            leftCantilever,
            length,
            mezzanine_height,
            numberOfBays,
            phoneNumber,
            postalCode,
            rightAwning,
            rightAwningWidth,
            rightAwningPitchRef,
            rightCantilever,
            slab,
            specialInstructions,
            state,
            suburb,
            width,
          }));

          // Load the updated meshes
          apimeshloader(updatedMeshes);
          console.log("Updated meshes loaded:", updatedMeshes);

          // Dispatch updates to Redux
          dispatch({ type: 'UPDATE_USER_DATA', payload: { buildAddress, city, email, firstName, lastName, phoneNumber, postalCode, state, suburb, country, comment, specialInstructions ,type} });
          dispatch({ type: 'UPDATE_BUILDING_DATA', payload: { apexHeight, baySize, numberOfBays, length, width, height, slab } });

        } else {
          console.error("Decrypted key is not a valid object:", decryptedKey);
        }
      } catch (error) {
        console.error("Error processing encrypted key:", error);
      }
    } else {
      console.log("No key found in the URL.");
    }
  }, [dispatch]);

  return null; // Return null as this component is purely for side effects
};

const mapStateToProps = (state) => ({
  length: state.length,
  width: state.width,
  height: state.height,
  apexHeight: state.apexHeight,
  numberOfBays: state.numberOfBays,
  baySize: state.baySize,
  customValue: state.customValue,
});

export default connect(mapStateToProps)(ApiConnection);
