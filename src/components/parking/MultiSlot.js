import React from 'react';
import './style.css';

import _ from 'lodash';
import { Slot } from './Slot';
import { SlotByArea } from './SlotByArea';

const posts = [
  {
    id: 0,
    content: {
      title: '0',
      image: '',
      content: '',
    },
    likeIsClicked: true,
    likes: 5,
    isParking: true,
  },
  {
    id: 1,
    content: {
      title: '1',
      image: '',
      content: '',
    },
    likeIsClicked: true,
    likes: 15,
    // isParking: true,
  },
  {
    id: 2,
    content: {
      title: '2',
      image: '',
      content: '',
    },
    likeIsClicked: true,
    likes: 8,
  },
  {
    id: 3,
    content: {
      title: '3',
      image: '',
      content: '',
    },
    likeIsClicked: true,
    likes: 8,
  },
  {
    id: 4,
    content: {
      title: '4',
      image: '',
      content: '',
    },
    likeIsClicked: true,
    likes: 8,
  },
  {
    id: 5,
    content: {
      title: '5',
      image: '',
      content: '',
    },
    likeIsClicked: true,
    likes: 8,
    isParking: true,
  },
];

export const MultiSlot = ({ area, data }) => {
  const render = () => {
    const slotArray = [];
    let dataFilterByArea = [];

    if (_.isArray(data)) {
      // const dataFilterByArea = data.filter((item) => {
      //   const numberDivide = area * 6;
      //   let checkSlotByArea = Number(item.slot) % numberDivide;
      //   if (checkSlotByArea === 0) {
      //     checkSlotByArea = numberDivide;
      //   }

      //   return (
      //     checkSlotByArea === Number(item.slot) && checkSlotByArea <= numberDivide && checkSlotByArea > (area - 1) * 6
      //   );
      // });
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

      // const slotArray = [];
      for (let i = 1; i < 7; i += 1) {
        slotArray.push(<SlotByArea area={area} position={i} data={dataFilterByArea} />);
      }

      // return slotArray;
    } else {
      for (let i = 1; i < 7; i += 1) {
        slotArray.push(<SlotByArea area={area} position={i} data={dataFilterByArea} />);
      }
    }
    // return [];
    // console.log('log slotArray: ', slotArray);
    return slotArray;
  };

  return (
    <div className="card-grid-view">
      {/* {data.map((e, index) => {
        return <Slot key={e.id} area={area} carInfor={e} index={index} />;
      })} */}
      {render()}
    </div>
  );
};
