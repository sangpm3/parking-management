import _ from 'lodash';
import React from 'react';
import './style.css';

import { UiCard } from './UiCard';

export const Slot = ({ position, area, carInfor }) => {
  let isParking = false;

  if (carInfor) {
    let positionBySlot = Number(carInfor.slot) % 6;
    if (positionBySlot === 0) {
      positionBySlot = 6;
    }

    if (positionBySlot === Number(position)) {
      isParking = true;
    }
  }

  return (
    <div className="card-body">
      <UiCard position={position} isParking={isParking} carInfor={carInfor} />
    </div>
  );
};
