import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import { Parking } from '../components/parking/index';

// ----------------------------------------------------------------------

export default function ParkingSpacesPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Rooms</title>
      </Helmet>

      <Container>
        <Parking />
      </Container>
    </>
  );
}
