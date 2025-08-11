// import { useState, useEffect } from "react";
// import { connect } from "react-redux";
// import axios from "axios";

// const ApiConnection = (props) => {
//   const {
//     length,
//     width,
//     height,
//     apexHeight,
//     numberOfBays,
//     customValue,
//     baySize,
//     dispatch,
//   } = props;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Adjust the URL to the new API endpoint
//         const response = await axios.post("http://localhost:3000/api/send-params-to-frontend", {});
//         if (response.data.success) {
//           const params = response.data.params;
//           const id = response.data.id;
//           if( params.length){
//             const roofPitchRadians = (parseInt(params.customValue) * Math.PI) / 180;
//             var perpendicular = (Math.tan(roofPitchRadians) * parseInt(params.width)/2);
//             var apex = perpendicular + parseInt(params.height);
//             dispatch({ type: 'UPDATE_SIZE', payload: { height: params.height } });
//             dispatch({ type: 'UPDATE_SIZE', payload: { width: params.width } });
//             dispatch({ type: 'UPDATE_SIZE', payload: { length: params.length } });
//             dispatch({ type: 'UPDATE_SIZE', payload: { numberOfBays: params.numberOfBays } });
//             dispatch({ type: 'UPDATE_SIZE', payload: { customValue: params.customValue } });
//             dispatch({ type: 'UPDATE_SIZE', payload: { baySize: params.baySize } });
//             dispatch({ type: 'UPDATE_SIZE', payload: { apexHeight: apex.toFixed(2)} });
  
//             localStorage.setItem('length', parseInt(params.length))
//             localStorage.setItem('pitch',parseInt(params.customValue))
//             localStorage.setItem('bay_no',parseInt(params.numberOfBays));
//             localStorage.setItem('bay_size', parseInt(params.baySize));
//             setTimeout(() => {
//               localStorage.setItem('height', parseInt(params.height));
//             }, 1000);
//             setTimeout(() => {
//               localStorage.setItem('width', parseInt(params.width));
//             }, 2000);
//           }
//         } else {
//           //do nothing
//           //console.error("Failed to fetch params:", response.data.message);
//         }
//       } catch (error) {
//         if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
//           // Handle 400 Bad Request error
//           console.warn("Bad Request: The server rejected the request.");
//         } else {
//           // Handle other errors
//           //console.error("Error fetching params:", error.message);
//         }
//       }
//     };
  
//     fetchData();
//   }, []);
// }

// const mapStateToProps = (state) => ({
//     length: state.length,
//     width: state.width,
//     height: state.height,
//     apexHeight: state.apexHeight,
//     numberOfBays: state.numberOfBays,
//     baySize: state.baySize,
//     customValue: state.customValue,
//   });
  
// export default connect(mapStateToProps)(ApiConnection);