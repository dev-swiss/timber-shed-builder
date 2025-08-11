import React, { useState, useEffect } from 'react';
import './TypeMenu.css';
import FloorPlan from './FloorPlan';
import Plan from './Plan';
import { HandConstraintBehavior } from '@babylonjs/core';

const TypeMenu = ({ type, handle_close_display }) => {
  const [activeType, setActiveType] = useState('');

  useEffect(() => {
     if (type === '3D') {
      if (activeType === '') {
        alert('Already on 3D plan!');
      } else {
        handle_close_display(); // Close the Floor or Plan file
        setActiveType('3D');
      }
    } else if (type === 'Floor' || type === 'Plan') {
      setActiveType(type);
    }
  }, [type]);

  return (
    <div className='outer-container'>
      {activeType === 'Floor' && <FloorPlan />}
      {activeType === 'Plan' && <Plan />}
     
    </div>
  );
};

export default TypeMenu;