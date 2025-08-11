// RoofPitchUtility.js

import { Vector3 } from "babylonjs";

export const RoofconfigUtility = (pitch, box) => {
  if (pitch >= 1 && pitch <= 45) {
    let yOffset = 0;
    let zOffset = 0;

    if (pitch === 1) {
      yOffset = 2.25;
      zOffset = 0;
    } else if (pitch === 2) {
      yOffset = 2.20;
      zOffset = 0;
    } else if (pitch === 3) {
      yOffset = 2.15;
      zOffset = 0;
    } else if (pitch === 4) {
      yOffset = 2.10;
      zOffset = 0;
    } else if (pitch === 5) {
      yOffset = 2.05;
      zOffset = 0;
    } else if (pitch === 6) {
      yOffset = 2.00;
      zOffset = 0;
    } else if (pitch === 7) {
      yOffset = 1.95;
      zOffset = 0;
    } else if (pitch === 8) {
      yOffset = 1.90;
      zOffset = 0;
    } else if (pitch === 9) {
      yOffset = 1.85;
      zOffset = 0;
    } else if (pitch === 10) {
      yOffset = 1.65;
      zOffset = 0;
    } else if (pitch === 11) {
      yOffset = 1.60;
      zOffset = 0;
    } else if (pitch === 12) {
      yOffset = 1.55;
      zOffset = 0;
    } else if (pitch === 13) {
      yOffset = 1.50;
      zOffset = 0;
    } else if (pitch === 14) {
      yOffset = 1.45;
      zOffset = 0;
    } else if (pitch === 15) {
      yOffset = 0.1;
      zOffset = 0.1;
    } else if (pitch === 16) {
      yOffset = 1.35;
      zOffset = 0;
    } else if (pitch === 17) {
      yOffset = 1.30;
      zOffset = 0;
    } else if (pitch === 18) {
      yOffset = 1.30;
      zOffset = 0;
    } else if (pitch === 19) {
      yOffset = 1.20;
      zOffset = 0;
    } else if (pitch === 20) {
      yOffset = 1.20;
      zOffset = 0;
    } else if (pitch === 21) {
      yOffset = 1.10;
      zOffset = 0;
    } else if (pitch === 22) {
      yOffset = 1.00;
      zOffset = 0;
    } else if (pitch === 23) {
      yOffset = 0.90;
      zOffset = 0;
    } else if (pitch === 24) {
      yOffset = 0.80;
      zOffset = 0;
    } else if (pitch === 25) {
      yOffset = 0.70;
      zOffset = 0;
    } else if (pitch === 26) {
      yOffset = 0.60;
      zOffset = 0;
    } else if (pitch === 27) {
      yOffset = 0.50;
      zOffset = 0;
    } else if (pitch === 28) {
      yOffset = 0.40;
      zOffset = 0;
    } else if (pitch === 29) {
      yOffset = 0.30;
      zOffset = 0;
    } else if (pitch === 30) {
      yOffset = 0.20;
      zOffset = 0;
    } else if (pitch === 31) {
      yOffset = 0.10;
      zOffset = 0;
    } else if (pitch === 32) {
      yOffset = 0.00;
      zOffset = 0;
    } else if (pitch === 33) {
      yOffset = -0.10;
      zOffset = 0;
    } else if (pitch === 34) {
      yOffset = -0.20;
      zOffset = 0;
    } else if (pitch === 35) {
      yOffset = -0.30;
      zOffset = 0;
    } else if (pitch === 36) {
      yOffset = -0.40;
      zOffset = 0;
    } else if (pitch === 37) {
      yOffset = -0.50;
      zOffset = 0;
    } else if (pitch === 38) {
      yOffset = -0.60;
      zOffset = 0;
    } else if (pitch === 39) {
      yOffset = -0.70;
      zOffset = 0;
    } else if (pitch === 40) {
      yOffset = -0.80;
      zOffset = 0;
    } else if (pitch === 41) {
      yOffset = -0.90;
      zOffset = 0;
    } else if (pitch === 42) {
      yOffset = -1.00;
      zOffset = 0;
    } else if (pitch === 43) {
      yOffset = -1.10;
      zOffset = 0;
    } else if (pitch === 44) {
      yOffset = -1.30;
      zOffset = 0;
    } else if (pitch === 45) {
      yOffset = -1.50;
      zOffset = 0;
    }

    box.position.addInPlace(new Vector3(0, yOffset, zOffset));
    console.log(`Box position adjusted for pitch ${pitch}:`, box.position);
  } else {
    console.error("Pitch out of range. Must be between 1 and 45.");
  }
};