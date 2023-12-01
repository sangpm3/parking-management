import { useState } from 'react';

import { Helmet } from 'react-helmet-async';

// @mui
import { Grid, Container, Typography } from '@mui/material';

import { ref, set, onValue } from 'firebase/database';
import { database } from '../firebase';

// components

// sections
import { AppWidgetSummary } from '../sections/@dashboard/app';
import { calculateParkingCost } from '../utils/utils';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const parkingArrayRef = ref(database, '/parkingArray');

  const [totalRoom, setTotalRoom] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // convert data queuing when esp8266 upload new data
  onValue(parkingArrayRef, async (snapshot) => {
    const dataParkingArrayRef = snapshot.val();
    if (!dataParkingArrayRef) {
      set(ref(database, `queuing`), {});
      console.log('Data not found');
    } else {
      if (dataParkingArrayRef.length !== totalRoom) {
        setTotalRoom(dataParkingArrayRef.length);
      }

      const cost = dataParkingArrayRef.reduce((total, item) => {
        const currentValue = calculateParkingCost(item?.date, item?.time, true);
        return total + currentValue;
      }, 0);
      if (cost !== totalCost) {
        setTotalCost(cost);
      }
    }
  });

  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Xin chào,
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary title="Số phòng đang dùng" color="warning" total={totalRoom} icon={'cil:room'} />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Tổng tiền hiện tại"
              total={totalCost}
              color="info"
              icon={'healthicons:money-bag'}
              money="true"
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
