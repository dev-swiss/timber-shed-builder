import React, { useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import { updateFrontAwning, updateBackAwning, updateLeftAwning, updateRightAwning, 
         updateFrontCantilever, updateBackCantilever,updateLeftCantilever, updateRightCantilever } from '../Store'
import './AwningsMenu.css'
import LeftAwningOption from './LeftAwningOption'
import RightAwningOption from './RightAwningOption'
import FrontAwningOption from './FrontAwningOption'
import BackAwningOption from './BackAwningOption'
import FrontCantileverOption from './FrontCantileverOption'
import BackCantileverOption from './BackCantileverOption'
import LeftCantileverOption from './LeftCantileverOption'
import RightCantileverOption from './RightCantileverOption'
import { checkHeightChangeLeft, checkHeightChangeRight, createAwningDepthMeasurementsLeft, createAwningDepthMeasurementsRight } from '../Structure/gable'
import { updateAwningHeight } from '../core/coreFunctions'


var loaded_meshes_global = [];
var sceneRef;
export const loaded_meshes_for_awnings = ( loadedMeshes, scene ) => {
  loaded_meshes_global = loadedMeshes;
  sceneRef = scene;
  // console.log("Loaded Meshes: ", loaded_meshes_global);
  return loaded_meshes_global;
}
var heightArrow;
export const getLeftAwningArrow = () => {
    if(heightArrow != null){
        return heightArrow;
    }else{
        return null
    }
}
var rightHeightArrow;
export const getRightAwningArrow = () => {
    if(rightHeightArrow != null){
        // console.log("sent")
        return rightHeightArrow;
    }else{
        return null
    }
}
var leftDepthArrow;
export const getLeftAwningDepthArrow = () => {
    if(leftDepthArrow != null){
        return leftDepthArrow;
    }else{
        return null
    }
}
var rightDepthArrow;
export const getRightAwningDepthArrow = () => {
    if(rightDepthArrow != null){
        return rightDepthArrow;
    }else{
        return null
    }
}
const AwningsMenu = (props) => {
    const {
        leftAwning,
        rightAwning,
        frontAwning,
        backAwning,
        leftCantilever,
        rightCantilever,
        frontCantilever,
        backCantilever,
        updateLeftAwning,
        updateRightAwning,
        updateFrontAwning,
        updateBackAwning,
        updateLeftCantilever,
        updateRightCantilever,
        updateFrontCantilever,
        updateBackCantilever
    } = props;

    // Initialize state based on props
    const [leftAwningsOption, setLeftAwningsOption] = useState(leftAwning);
    const [rightAwningsOption, setRightAwningsOption] = useState(rightAwning);
    const [frontAwningsOption, setFrontAwningsOption] = useState(frontAwning);
    const [backAwningsOption, setBackAwningsOption] = useState(backAwning);
    const [leftCantileverOption, setLeftCantileverOption] = useState(leftCantilever);
    const [rightCantileverOption, setRightCantileverOption] = useState(rightCantilever);
    const [frontCantileverOption, setFrontCantileverOption] = useState(frontCantilever);
    const [backCantileverOption, setBackCantileverOption] = useState(backCantilever);
    //heightArrow = useRef(null);

    // Update state when props change
    useEffect(() => {
        setLeftAwningsOption(leftAwning);
        setRightAwningsOption(rightAwning);
        setFrontAwningsOption(frontAwning);
        setBackAwningsOption(backAwning);
        setLeftCantileverOption(leftCantilever);
        setRightCantileverOption(rightCantilever);
        setFrontCantileverOption(frontCantilever);
        setBackCantileverOption(backCantilever);
    }, [leftAwning, rightAwning, frontAwning, backAwning, leftCantilever, rightCantilever, frontCantilever, backCantilever]);

    const showLeftAwningOption = () => {
        updateLeftAwning(!leftAwningsOption);
        setLeftAwningsOption(!leftAwningsOption);
        localStorage.setItem('leftAwning', !leftAwningsOption ? 'true' : 'false');
        // loaded_meshes_global[1].forEach((element) => {
        //     if (element.name === 'LHarrow') {
        //         // element.isVisible = localStorage.getItem('leftAwning') === 'true' ? true : false;
        //     }
        // })
        var awningHeight = updateAwningHeight(parseFloat(localStorage.getItem("height")),parseFloat(localStorage.getItem("leftAwningPitch")), parseFloat(localStorage.getItem("leftAwningLength")));
        heightArrow = checkHeightChangeLeft(awningHeight, loaded_meshes_global, sceneRef);
        leftDepthArrow = createAwningDepthMeasurementsLeft(parseInt(localStorage.getItem("leftAwningLength")),sceneRef)
        // if(!leftAwningsOption == false){
        //     heightArrow.forEach((mesh) => {
        //         mesh.isVisible = false;
        //     })
        // }else {
        //     heightArrow.forEach((mesh) => {
        //         mesh.isVisible = true;
        //     })
        // }
       }

    const showRightAwningOption = () => {
        updateRightAwning(!rightAwningsOption);
        setRightAwningsOption(!rightAwningsOption);
        localStorage.setItem('rightAwning', !rightAwningsOption ? 'true' : 'false');
        // loaded_meshes_global[1].forEach((element) => {
        //     if (element.name === 'RHarrow') {
        //         // element.isVisible = localStorage.getItem('rightAwning') === 'true' ? true : false;
        //     }
        // });
        var awningHeight = updateAwningHeight(parseFloat(localStorage.getItem("height")),parseFloat(localStorage.getItem("rightAwningPitch")), parseFloat(localStorage.getItem("rightAwningLength")));
        rightHeightArrow = checkHeightChangeRight(awningHeight, loaded_meshes_global, sceneRef);
        rightDepthArrow = createAwningDepthMeasurementsRight(parseInt(localStorage.getItem("rightAwningLength")),sceneRef);
        }
    const showFrontAwningOption = () => {
        updateFrontAwning(!frontAwningsOption);
        setFrontAwningsOption(!frontAwningsOption);
        localStorage.setItem('frontAwning', !frontAwningsOption ? 'true' : 'false');
        }

    const showBackAwningOption = () => {
        updateBackAwning(!backAwningsOption);
        setBackAwningsOption(!backAwningsOption);
        localStorage.setItem('backAwning', !backAwningsOption ? 'true' : 'false');
    }
    const showLeftCantileverOption = () => {
        updateLeftCantilever(!leftCantileverOption);
        setLeftCantileverOption(!leftCantileverOption);
        localStorage.setItem('leftCantilever', !leftCantileverOption ? 'true' : 'false');
    }

    const showRightCantileverOption = () => {
        updateRightCantilever(!rightCantileverOption);
        setRightCantileverOption(!rightCantileverOption);
        localStorage.setItem('rightCantilever', !rightCantileverOption ? 'true' : 'false');
        }
    const showFrontCantileverOption = () => {
        updateFrontCantilever(!frontCantileverOption);
        setFrontCantileverOption(!frontCantileverOption);
        localStorage.setItem('frontCantilever', !frontCantileverOption ? 'true' : 'false');
        }

    const showBackCantileverOption = () => {
        updateBackCantilever(!backCantileverOption);
        setBackCantileverOption(!backCantileverOption);
        localStorage.setItem('backCantilever', !backCantileverOption ? 'true' : 'false');
        }
  // front overhang option
  const [frontOverHangeOption, setFrontOverhangOption] = useState(false)
  
  const showFrontOverHangeOption = () => {
    if(frontOverHangeOption == true){
        setFrontAwningsOption(false)
    }else{
        setFrontAwningsOption(true)
    }
  }


  // back overhang option
  const [backOverHangeOption, setBackOverhangOption] = useState(false)
  
  const showBackOverHangeOption = () => {
    if(backOverHangeOption == true){
        setBackAwningsOption(false)
    }else{
        setBackAwningsOption(true)
    }
  }

  const custom_cant = () => {
    const styles = {}
    leftAwningsOption ? styles.color = 'gray' : styles.color = 'black';
    return styles;
  }

  return (
    <>
        <div className={`awnings-container ${props.itemClass}`}>
            <div className="field-box">
                <span>Awnings Left</span>
                <hr />
                {<div className='checkbox'>
                    <input type="checkbox" checked={leftAwningsOption} disabled={leftCantileverOption} onChange={showLeftAwningOption}/>  
                    <label id='leftS'>Simply supported</label>
                </div>}
                {
                    leftAwningsOption && <LeftAwningOption />
                }
                <hr />
                {<div className='checkbox'>
                    <input type="checkbox" checked={leftCantileverOption} disabled = {leftAwningsOption} onChange={showLeftCantileverOption}/>  
                    <label id='leftC'>Cantilever</label>
                </div>}
                {
                    leftCantileverOption && <LeftCantileverOption />
                }
            </div>
            <div className="field-box">
                <span>Awnings Right</span>
                <hr />
                {<div className='checkbox'>
                    <input type="checkbox" checked={rightAwningsOption} disabled={rightCantileverOption} onChange={showRightAwningOption}/>
                    <label id='rightS'>Simply supported</label>
                </div>}
                {
                    rightAwningsOption && <RightAwningOption />
                }
                                <hr />
                {<div className='checkbox'>
                    <input type="checkbox" checked={rightCantileverOption} disabled={rightAwningsOption} onChange={showRightCantileverOption}/>  
                    <label id='rightC'>Cantilever</label>
                </div>}
                {
                    rightCantileverOption && <RightCantileverOption />
                }
            </div>
            <div className="field-box">
                <span>Awnings Front</span>
                <hr />
                {<div className='checkbox'>
                    <input type="checkbox" checked={frontAwningsOption} disabled={frontCantileverOption} onChange={showFrontAwningOption}/>
                    <label id='frontS'>Simply supported</label>
                </div>}
                {
                    frontAwningsOption && <FrontAwningOption />
                }
                <hr />
                {<div className='checkbox'>
                    <input type="checkbox" checked={frontCantileverOption} disabled={frontAwningsOption} onChange={showFrontCantileverOption}/>  
                    <label id='frontC'>Cantilever</label>
                </div>}
                {
                    frontCantileverOption && <FrontCantileverOption />
                }
            </div>
            <div className="field-box">
                <span>Awnings Back</span>
                <hr />
                {<div className='checkbox'>
                    <input type="checkbox" checked={backAwningsOption} disabled={backCantileverOption} onChange={showBackAwningOption}/>
                    <label id='backS'>Simply supported</label>
                </div>}
                {
                    backAwningsOption && <BackAwningOption />
                }
                <hr />
                {<div className='checkbox'>
                    <input type="checkbox" checked={backCantileverOption} disabled={backAwningsOption} onChange={showBackCantileverOption}/>  
                    <label id='backC'>Cantilever</label>
                </div>}
                {
                    backCantileverOption && <BackCantileverOption />
                }
            </div>
            {/* <div className="field-box">
                <span>Overhang Front</span>
                <hr />
                <div className='checkbox'>
                    <input type="checkbox" onChange={showFrontOverHangeOption}/>
                    <label>Visible</label>
                </div>
                {
                    frontOverHangeOption && <FrontOverhangeOption />
                }
            </div>
            <div className="field-box">
                <span>Overhang Back</span>
                <hr />
                <div className='checkbox'>
                    <input type="checkbox" onChange={showBackOverHangeOption}/>
                    <label>Visible</label>
                </div>
                {
                    backOverHangeOption && <BackOverhangeOption />
                }
            </div> */}
        </div>
    </>
  )
};

const mapStateToProps = (state) => ({
    leftAwning: state.leftAwning,
    rightAwning: state.rightAwning,
    backAwning: state.backAwning,
    frontAwning: state.frontAwning,
    leftCantilever: state.leftCantilever,
    rightCantilever: state.rightCantilever,
    backCantilever: state.backCantilever,
    frontCantilever: state.frontCantilever,
});

const mapDispatchToProps = (dispatch) => ({
    updateLeftAwning: (visibility) => dispatch(updateLeftAwning(visibility)),
    updateRightAwning: (visibility) => dispatch(updateRightAwning(visibility)),
    updateFrontAwning: (visibility) => dispatch(updateFrontAwning(visibility)),
    updateBackAwning: (visibility) => dispatch(updateBackAwning(visibility)),
    updateLeftCantilever: (visibility) => dispatch(updateLeftCantilever(visibility)),
    updateRightCantilever: (visibility) => dispatch(updateRightCantilever(visibility)),
    updateFrontCantilever: (visibility) => dispatch(updateFrontCantilever(visibility)),
    updateBackCantilever: (visibility) => dispatch(updateBackCantilever(visibility)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AwningsMenu);
