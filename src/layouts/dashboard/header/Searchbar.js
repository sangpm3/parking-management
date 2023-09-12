import { useState } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import { Input, Slide, Button, IconButton, InputAdornment, ClickAwayListener } from '@mui/material';

// import { addDoc, collection } from '@firebase/firestore';
import { child, ref, set, get, push, update } from 'firebase/database';
import { firestore, database } from '../../../firebase';

// utils
import { bgBlur } from '../../../utils/cssStyles';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledSearchbar = styled('div')(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

export default function Searchbar() {
  const [open, setOpen] = useState(false);

  // const ref = collection(firestore, 'messages');

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = async () => {
    console.log('log click btn');

    // Write data
    // const now = new Date();
    // const minutes = now.getMinutes();
    // set(ref(database, `users/${minutes}`), {
    //   username: `sang-${minutes}`,
    //   email: `sang-${minutes}`,
    //   profile_picture: `image-${minutes}`,
    // });

    // read data
    const dbRef = ref(database);
    let currentData = null;
    await get(child(dbRef, `users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          currentData = snapshot.val();
          console.log(snapshot.val());
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });

    // update data
    // Write the new post's data simultaneously in the posts list and the user's post list.
    console.log('log currentData: ', currentData);

    const updates = {
      '/users': {
        ...currentData,
        count: 1000,
      },
    };

    update(ref(database), updates);

    console.log('log end click btn');

    // setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!open && (
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" />
          </IconButton>
        )}

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Search…"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
            />
            <Button variant="contained" onClick={handleClose}>
              Search
            </Button>
          </StyledSearchbar>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
