import React, { useState } from 'react';
import _ from 'lodash';
// import { database } from 'src/firebase';
import { styled } from '@mui/material/styles';
import { Container, Stack, Typography, Grid, Paper, Divider } from '@mui/material';
import { child, ref, set, get, push, update, onValue, getDatabase } from 'firebase/database';
import { database } from '../../firebase';

import './style.css';

import { UiCard } from './UiCard';
import { MultiSlot } from './MultiSlot';

const posts = [
  {
    id: 0,
    content: {
      title: 'Echinacea flower',
      image: 'https://leoraw.com/images/slidein/echinacea-200px.jpg',
      content: 'Grow some echinacea',
    },
    likeIsClicked: true,
    likes: 5,
  },
  {
    id: 1,
    content: {
      title: 'Lake in New York State',
      image: 'https://www.leoraw.com/images/slidein/lake-400px.jpg',
      content: 'Worth a visit',
    },
    likeIsClicked: true,
    likes: 15,
  },
  {
    id: 2,
    content: {
      title: 'Street in Jerusalem',
      image: 'https://leoraw.com/images/slidein/jerusalem-street-400px.jpg',
      content: 'Street in Valley of Refaim',
    },
    likeIsClicked: true,
    likes: 8,
  },
];

export const Parking = () => {
  const [dataParking, setDataParking] = useState([]);

  let dataParkingArray = [];
  const parkingArrayRef = ref(database, '/parkingArray');
  // convert data parking when esp8266 upload new data
  onValue(parkingArrayRef, async (snapshot) => {
    dataParkingArray = snapshot.val();
    if (!_.isEqual(dataParking, dataParkingArray)) {
      setDataParking(dataParkingArray);
    }
  });

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <Grid container rowSpacing={3} spacing={1}>
      <Grid item xs={6}>
        <MultiSlot area={1} data={dataParkingArray} />
      </Grid>
      <Grid item xs={6}>
        <MultiSlot area={2} data={dataParkingArray} />
      </Grid>
      <Grid item xs={6}>
        <MultiSlot area={3} data={dataParkingArray} />
      </Grid>
      <Grid item xs={6}>
        <MultiSlot area={4} data={dataParkingArray} />
      </Grid>
      <Grid item xs={6}>
        <MultiSlot area={5} data={dataParkingArray} />
      </Grid>
      <Grid item xs={6}>
        <MultiSlot area={6} data={dataParkingArray} />
      </Grid>
    </Grid>
  );
};
