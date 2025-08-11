import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './QuoteMenu.css';
import axios from 'axios';
import imageCompression from 'browser-image-compression'; // Import the library

const QuoteMenu = (props) => {
  const {
    length,
    width,
    height,
    apexHeight,
    numberOfBays,
    customValue,
    baySize
  } = props;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    buildAddress: '',
    country: '',
    city: '',
    state: '',
    suburb: '',
    postalCode: '',
    comment: '',
    specialInstructions: '',
    type: 'service'
  });

  const [bayStates, setBayStates] = useState(() => {
    const storedBayStates = sessionStorage.getItem('bayStates');
    return storedBayStates ? JSON.parse(storedBayStates) : {};
  });

  // Initialize bay states when numberOfBays changes
  useEffect(() => {
    const initializeBayStates = () => {
      let newBayStates = sessionStorage.getItem('bayStates')
        ? JSON.parse(sessionStorage.getItem('bayStates'))
        : {};

      if (Object.keys(newBayStates).length !== numberOfBays) {
        newBayStates = {};
        for (let i = 0; i < numberOfBays; i++) {
          newBayStates[`bay${i + 1}`] = {
            visibility: true,
            selectedButton: 'left',
          };
        }
        sessionStorage.setItem('bayStates', JSON.stringify(newBayStates));
      }
      setBayStates(newBayStates);
    };

    initializeBayStates();
  }, [numberOfBays]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle checkbox change
  const handleTypeChange = (selectedType) => {
    setFormData((prevData) => ({
      ...prevData,
      type: prevData.type === selectedType ? '' : selectedType,
    }));
  };

  // Capture screenshot
  // const captureScreenshot = async () => {
  //   const canvas = document.querySelector('canvas'); // Assuming Babylon.js renders in a <canvas>
  //   if (!canvas) throw new Error('No canvas element found for screenshot.');
  //   return canvas.toDataURL('image/jpeg'); // Convert to Base64
  // };

  // const uploadImageToS3 = async (imageData) => {
  //   try {
  //     // Step 1: Request a signed URL from the backend
  //     const response = await axios.post('http://localhost:3000/api/generate-signed-url', {
  //       fileName: `screenshot_${Date.now()}.jpg`,
  //       fileType: 'image/jpeg',
  //     });
  
  //     const { signedUrl, fileKey } = response.data;
  
  //     // Step 2: Convert Base64 image data to Blob
  //     const base64Data = imageData.split(',')[1]; // Remove the Base64 prefix
  //     const blob = new Blob([Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))], {
  //       type: 'image/jpeg',
  //     });
  
  //     // Step 3: Upload the Blob to S3 using the signed URL
  //     await axios.put(signedUrl, blob, {
  //       headers: {
  //         'Content-Type': 'image/jpeg', // Match the file type
  //       },
  //     });
  
  //     console.log('Image uploaded successfully:', fileKey);
  
  //     // Return the public URL of the uploaded image
  //     return `https://winstonmarriott.s3.eu-north-1.amazonaws.com/${fileKey}`;
  //   } catch (error) {
  //     console.error('Error uploading image:', error.message);
  //     throw error;
  //   }
  // };
  const captureScreenshot = async () => {
    const canvas = document.querySelector('canvas'); // Assuming Babylon.js renders in a <canvas>
    if (!canvas) throw new Error('No canvas element found for screenshot.');
     await new Promise(requestAnimationFrame);
    return canvas.toDataURL('image/jpeg'); // Convert to Base64
  };

  // Function to send image to backend and get the URL
  const sendImageToBackend = async (imageData) => {
    try {
      // Convert Base64 to Blob
      const base64Data = imageData.split(',')[1]; // Remove the Base64 prefix
      const blob = new Blob([Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))], {
        type: 'image/jpeg',
      });

      // Compress the image
      const options = {
        maxSizeMB: 0.5, // Set the maximum size in MB (reduce further)
        maxWidthOrHeight: 1280, // Set a smaller maximum width or height
        useWebWorker: true,
      };

      const compressedBlob = await imageCompression(blob, options);
      const compressedImageData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(compressedBlob);
      });

      const response = await axios.post('/api/upload-image', {
        imageData: compressedImageData,
        fileName: `screenshot_${Date.now()}.jpg`,
      });
      return response.data.imageUrl; // Return the image URL
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw error;
    }
  };

  // Usage
  const handleScreenshotUpload = async () => {
    try {
      const imageData = await captureScreenshot();
      console.log('Captured Image Data:', imageData);
      await sendImageToBackend(imageData);
    } catch (error) {
      console.error('Error capturing or uploading screenshot:', error.message);
    }
  };

  const validateForm = () => {
    const { email, firstName, lastName, phoneNumber, buildAddress, country, city, state, suburb, postalCode } = formData;
    let errors = false; // Flag to track if there are any errors

    // Check required fields
    if (!firstName) {
      window.alert("First Name is required.");
      errors = true;
    }
    if (!lastName) {
      window.alert("Last Name is required.");
      errors = true;
    }
    if (!email) {
      window.alert("Email is required.");
      errors = true;
    }
    if (!phoneNumber) {
      window.alert("Phone Number is required.");
      errors = true;
    }
    if (!buildAddress) {
      window.alert("Site Address is required.");
      errors = true;
    }
    if (!country) {
      window.alert("Country is required.");
      errors = true;
    }
    if (!city) {
      window.alert("City is required.");
      errors = true;
    }
    if (!state) {
      window.alert("State is required.");
      errors = true;
    }
    if (!suburb) {
      window.alert("Suburb is required.");
      errors = true;
    }
    if (!postalCode) {
      window.alert("Postal Code is required.");
      errors = true;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
      window.alert("Email is not valid.");
      errors = true;
    }

    // Phone number validation (example: must be numeric)
    const phonePattern = /^[0-9+\s]*$/;
    if (phoneNumber && !phonePattern.test(phoneNumber)) {
      window.alert("Phone Number must be numeric.");
      errors = true;
    }

    return errors; // Return true if there are errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasErrors = validateForm();
  
    if (hasErrors) {
      return; // Prevent form submission if there are errors
    }
  await handleScreenshotUpload()
    // Combine data from localStorage and sessionStorage
    const awningAndCantileverValues = {
      leftAwning: JSON.parse(localStorage.getItem('leftAwning') || 'null'),
      rightAwning: JSON.parse(localStorage.getItem('rightAwning') || 'null'),
      backAwning: JSON.parse(localStorage.getItem('backAwning') || 'null'),
      frontAwning: JSON.parse(localStorage.getItem('frontAwning') || 'null'),
      leftCantilever: JSON.parse(localStorage.getItem('leftCantilever') || 'null'),
      rightCantilever: JSON.parse(localStorage.getItem('rightCantilever') || 'null'),
      backCantilever: JSON.parse(localStorage.getItem('backCantilever') || 'null'),
      frontCantilever: JSON.parse(localStorage.getItem('frontCantilever') || 'null'),
      leftAwningPitchRef: JSON.parse(localStorage.getItem('leftAwningPitch') || 'null'),
      rightAwningPitchRef: JSON.parse(localStorage.getItem('rightAwningPitch') || 'null'),
      leftAwningWidth: JSON.parse(localStorage.getItem('leftAwningLength') || 'null'),
      frontAwningWidth: JSON.parse(localStorage.getItem('frontAwningLength') || 'null'),
      backAwningWidth: JSON.parse(localStorage.getItem('backAwningLength') || 'null'),
      rightAwningWidth: JSON.parse(localStorage.getItem('rightAwningLength') || 'null'),
    };
  
    const additionalData = {
      slab: localStorage.getItem('slab'),
      mezzanine_height: JSON.parse(localStorage.getItem('mezzanine_height') || 'null'),
      floorHeight: JSON.parse(sessionStorage.getItem('floorHeight') || 'null'),
      col1State: JSON.parse(sessionStorage.getItem('col1') || 'null'),
      col2State: JSON.parse(sessionStorage.getItem('col2') || 'null'),
      colCenter1EnabledStates: JSON.parse(sessionStorage.getItem('colCenter1EnabledStates') || 'null'),
      colCenter2EnabledStates: JSON.parse(sessionStorage.getItem('colCenter2EnabledStates') || 'null'),
      colCenter1AwningEnabledStates: JSON.parse(sessionStorage.getItem('colCenter1AwningEnabledStates') || 'null'),
      colCenter2AwningEnabledStates: JSON.parse(sessionStorage.getItem('colCenter2AwningEnabledStates') || 'null'),
      roofColor: JSON.parse(sessionStorage.getItem('roofColor') || 'null'),
      wallColor: JSON.parse(sessionStorage.getItem('wallColor') || 'null'),
    };
  
    try {
      // Capture and upload screenshot
      // const screenshot = await captureScreenshot();
      // const imageUrl = await uploadImageToS3(screenshot);
      const imageUrl = ""
      // Consolidate requestData
      const requestData = {
        ...formData,
        length,
        width,
        height,
        apexHeight,
        numberOfBays,
        customValue,
        baySize,
        bayStates,
        screenshotUrl: "", // Placeholder for the screenshot URL
        ...awningAndCantileverValues,
        ...additionalData,
      };
  
      // Export payload as a text file
      const textData = JSON.stringify(requestData, null, 2); // Convert payload to JSON with formatting
      const blob = new Blob([textData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'requirements.txt';
      a.click();
      URL.revokeObjectURL(url);
  
      // Submit form data
      // const response = await axios.post('https://sheds.aqsteelbuilt.com/api/submit-form-data', requestData);
      const response = await axios.post('http://localhost:3000/api/submit-form-data', requestData);
      console.log('API Response:', response.data);

      window.alert('Form submitted successfully!');
      closeQuoteForm();
    } catch (error) {
      console.error('Error submitting form:', error);
  
      // Log additional error details if available
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
  
      // Show error alert
      window.alert('Unable to submit form, please contact support.');
    }
  };
  
  

  const closeQuoteForm = () => {
    const quoteContainer = document.getElementsByClassName('quote__container')[0];
    if (quoteContainer) {
      quoteContainer.style.display = 'none';
    }
  };
  return (
    <>
      <div className='quote_header'>
        <h3>Get a Quote</h3>
        <button onClick={closeQuoteForm}>&#215;</button>
      </div>
          <hr />
        <form>
          <div className='form-group'>
            <label>First Name*</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
          </div>
          <div className='form-group'>
            <label>Last Name*</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
          </div>
          <div className='form-group'>
            <label>Email*</label>
            <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
          <div className='form-group'>
            <label>Phone Number*</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
          </div>
          <div className='form-group'>
            <label>Site Address*</label>
            <input type="text" name="buildAddress" value={formData.buildAddress} onChange={handleInputChange} />
          </div>
          <div className='form-group'>
            <label>Country*</label>
            <input type="text" name="country" value={formData.country} onChange={handleInputChange} />
          </div>
          <div className='form-group'>
            <label>City*</label>
            <input type="text" name="city" value={formData.city} onChange={handleInputChange} />
          </div>
          <div className='form-group'>
            <label>State*</label>
            <input type="text" name="state" value={formData.state} onChange={handleInputChange} />
          </div>
          <div className='form-group'>
            <label>Suburb*</label>
            <input type="text" name="suburb" value={formData.suburb} onChange={handleInputChange} />
          </div>
          <div className='form-group'>
            <label>Postal Code*</label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
          </div>
          <div className='form-group'>
            <label>Comment</label>
            <textarea
              name="comment"
              rows={6}
              cols={30}
              value={formData.comment}
              onChange={handleInputChange}
              ></textarea>
          </div>
          <div className='form-group'>
            <label>Special Instructions</label>
            <textarea
              name="specialInstructions"
              rows={6}
              cols={30}
              value={formData.specialInstructions}
              onChange={handleInputChange}
              ></textarea>
          </div>
          <div className='form-group'>
          <label>Type*</label>
          <div className="type-selection">
            <label  style={{position:'relative' ,right:'112px'}}>
              <input
                type="checkbox"
                name="type"
                checked={formData.type === 'service'}
                onChange={() => handleTypeChange('service')}
              />
              Service
              <span className="tooltip">?
                <span className="tooltiptext">(Steel Sheds e.g. Farm Shed Kit)</span>
              </span>
            </label>
            <label style={{position:'relative' ,right:'112px'}}> 
              <input
                type="checkbox"
                name="type"
                checked={formData.type === 'product'}
                onChange={() => handleTypeChange('product')}
              />
              Product
              <span className="tooltip">?
                <span className="tooltiptext">(Concept Plans, Structural Plans, Fabrication Packages, Certifications)</span>
              </span>
            </label>
            <p class="comment-instruction">
            Please mention the specific Products and Services you require in the comment box.
        </p>
          </div>
        </div>
          <input type="submit" value="Submit" onClick={handleSubmit} />
        </form>
      
    </>
  );
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

export default connect(mapStateToProps)(QuoteMenu);