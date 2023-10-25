import React from 'react';
import './style.css';

import _ from 'lodash';
import { SlotByArea } from './SlotByArea';

export const MultiSlot = ({ area, data }) => {
  const render = () => {
    const slotArray = [];
    let dataFilterByArea = [];

    if (_.isArray(data)) {
      dataFilterByArea = data.filter((item) => {
        const numberDivide = area * 6;
        let checkSlotByArea = Number(item.slot) % numberDivide;
        if (checkSlotByArea === 0) {
          checkSlotByArea = numberDivide;
        }

        return (
          checkSlotByArea === Number(item.slot) && checkSlotByArea <= numberDivide && checkSlotByArea > (area - 1) * 6
        );
      });

      for (let i = 1; i < 7; i += 1) {
        slotArray.push(<SlotByArea area={area} position={i} data={dataFilterByArea} />);
      }
    } else {
      for (let i = 1; i < 7; i += 1) {
        slotArray.push(<SlotByArea area={area} position={i} data={dataFilterByArea} />);
      }
    }
    return slotArray;
  };

  return <div className="card-grid-view">{render()}</div>;
};
