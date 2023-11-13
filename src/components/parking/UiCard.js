/* eslint-disable */
import { Box, Modal, Typography } from '@mui/material';
import React from 'react';
import './style.css';

import car from '../../images/car.png';
import sleep from '../../images/sleep.png';
import { calculateParkingCost, calculateTimeElapsed } from 'src/utils/utils';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const UiCard = ({ position, isParking, carInfor }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div onClose={handleClose}>
      <div className="card-img">
        <img
          onClick={handleOpen}
          className={`${position % 2 === 0 ? 'car-left' : 'car-right'}`}
          src={sleep}
          alt="123"
          style={{ display: isParking ? 'block' : 'none' }}
        />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Phòng: {carInfor?.slot}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <b>Ngày nhận phòng:</b> {carInfor?.date}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <b>Thời gian nhận phòng:</b> {carInfor?.time}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <b>Thời gian sử dụng:</b> {calculateTimeElapsed(carInfor?.date, carInfor?.time)}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <b>Thành tiền:</b> {calculateParkingCost(carInfor?.date, carInfor?.time)} đồng
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};
