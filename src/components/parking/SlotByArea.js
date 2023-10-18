import { Slot } from './Slot';

export const SlotByArea = ({ area, position, data }) => {
  const carInfor = data.filter((item) => {
    let positionBySlot = Number(item.slot) % 6;
    if (positionBySlot === 0) {
      positionBySlot = 6;
    }
    return positionBySlot === Number(position);
  })[0];

  return <Slot area={area} position={position} carInfor={carInfor} />;
};
