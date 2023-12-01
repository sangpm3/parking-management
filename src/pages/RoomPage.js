/* eslint-disable */
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Typography, Box, Modal, Button } from '@mui/material';
import { ref, set, onValue } from 'firebase/database';
import _ from 'lodash';

import { calculateParkingCost, calculateTimeElapsed } from '../utils/utils';
import { database } from '../firebase';
// components
import { Parking } from '../components/parking/index';

// ----------------------------------------------------------------------
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

export default function RoomPage() {
  const [open, setOpen] = useState(false);
  const [previousData, setPreviousData] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    set(ref(database, `roomOut`), {});
  };
  const [roomInfo, setRoomInfo] = useState({});

  const roomOutRef = ref(database, '/roomOut');

  // convert data queuing when esp8266 upload new data
  onValue(roomOutRef, async (snapshot) => {
    const dataRoomOut = snapshot.val();
    if (!dataRoomOut) {
      // set(ref(database, `queuing`), {});
      console.log('Data roomOut not found');
    } else {
      // const room = dataRoomOut;
      if (!_.isEqual(previousData, dataRoomOut)) {
        setRoomInfo(dataRoomOut);
        handleOpen();
        setPreviousData(dataRoomOut);
      }
    }
  });

  return (
    <>
      <Helmet>
        <title>Rooms</title>
      </Helmet>

      <Container>
        <Parking />
      </Container>
      <Modal
        open={open}
        // open="true"
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Phòng {roomInfo?.slot} rời phòng
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <b>Ngày nhận phòng:</b> {roomInfo?.date}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <b>Thời gian nhận phòng:</b> {roomInfo?.time}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <b>Thời gian sử dụng:</b> {calculateTimeElapsed(roomInfo?.date, roomInfo?.time)}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <b>Thành tiền:</b> {calculateParkingCost(roomInfo?.date, roomInfo?.time)} đồng
          </Typography>
          <Button variant="contained" onClick={handleClose}>
            Đóng
          </Button>
        </Box>
      </Modal>
    </>
  );
}
