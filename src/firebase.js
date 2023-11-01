// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

import { getFirestore } from '@firebase/firestore';

import { child, ref, set, get, update, onValue, getDatabase } from 'firebase/database';
import _ from 'lodash';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyCJTvovwVoa2tEXGNaXZxr21KtARITFLoc',
//   authDomain: 'packing-manager.firebaseapp.com',
//   projectId: 'packing-manager',
//   storageBucket: 'packing-manager.appspot.com',
//   messagingSenderId: '19041306689',
//   appId: '1:19041306689:web:4f881c75181d2d7a4a5ec0',
// };

const firebaseConfig = {
  apiKey: 'AIzaSyCbeF46ZMeCJFVKa4kgXuZWBtKCJNnvkzI',
  authDomain: 'parking-manager-c6eef.firebaseapp.com',
  databaseURL: 'https://parking-manager-c6eef-default-rtdb.firebaseio.com',
  projectId: 'parking-manager-c6eef',
  storageBucket: 'parking-manager-c6eef.appspot.com',
  messagingSenderId: '385892307229',
  appId: '1:385892307229:web:00690d9e642013a2c4d1f4',
  measurementId: 'G-4Q3SYW3TVW',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const firestore = getFiresStore(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);

const updateDataFirebase = async (path, value) => {
  // lấy data trên firebase theo biến path
  const dbRef = ref(database);
  let currentData = null;
  await get(child(dbRef, path))
    .then((snapshot) => {
      if (snapshot.exists()) {
        currentData = snapshot.val();
      } else {
        currentData = {};
        console.log('No data available');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  // update data
  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {
    [path]: {
      ...currentData,
      ...value,
    },
  };
  update(dbRef, updates);
};

const convertRawData = (data) => {
  const result = _.values(data).map((item) => {
    if (item && typeof item === 'string') {
      const itemArr = item.split('-');
      return {
        slot: itemArr[0],
        date: itemArr[1],
        time: itemArr[2],
        id: itemArr[3],
      };
    }
    return false;
  });

  const clearEmptyItem = result.filter((item) => item);

  return sortByDateAndTime(clearEmptyItem);
};

const unConvertRawData = (data) => {
  const result = data.map((item) => {
    return `${item.slot}-${item.date}-${item.time}-${item.id}`;
  });
  return { ...result };
};

const clearParkedDataInQueuing = (firstArray, secondArray) => {
  const filteredArray = secondArray.filter((item) => {
    // Check if there is a matching id in the first array
    return !firstArray.some((firstItem) => firstItem.id === item.id);
  });
  return filteredArray;
};

const checkVehicalInOrOut = (id, parking, queuing) => {
  // true: in, xe vào
  // false: out, xe ra

  let count = 0;

  queuing.forEach((item) => {
    if (item.id === id) {
      count += 1;
    }
  });

  if (count % 2 === 0) {
    return false;
  }

  const result = parking.filter((item) => item.id === id);
  if (result.length > 0) {
    return false;
  }
  return true;
};

function checkSlotIsUsed(data, slot) {
  const inforBySlot = data.filter((item) => Number(item.slot) === Number(slot));
  if (inforBySlot.length > 1) {
    return true;
  }
  return false;
}

function checkIdIsExist(data, id) {
  const inforById = data.filter((item) => item.id === id);
  // console.log('log inforById: ', inforById);
  if (inforById.length > 1) {
    return true;
  }
  return false;
}

function checkIdExistInQueuing(data, id) {
  const inforBySlot = data.filter((item) => item.id === id);
  if (inforBySlot.length > 0) {
    return true;
  }
  return false;
}

const sortByDateAndTime = (data) => {
  // Sort the array by 'date' and 'time' in ascending order
  // const sortData = data.sort((a, b) => {
  //   const dateComparison = a.date.localeCompare(b.date);
  //   if (dateComparison !== 0) {
  //     return dateComparison;
  //   }
  //   const timeA = a.time.split(':').map(Number);
  //   const timeB = b.time.split(':').map(Number);
  //   for (let i = 0; i < 3; i += 1) {
  //     if (timeA[i] < timeB[i]) return -1;
  //     if (timeA[i] > timeB[i]) return 1;
  //   }
  //   return 0;
  // });
  // const result = sortData.reduce((acc, current) => {
  //   const existing = acc.find((item) => item.id === current.id);
  //   if (!existing) {
  //     acc.push(current);
  //   } else if (current.time > existing.time) {
  //     existing.time = current.time;
  //   }
  //   return acc;
  // }, []);

  const result = data.sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison !== 0) {
      return dateComparison;
    }
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    for (let i = 0; i < 3; i += 1) {
      if (timeA[i] < timeB[i]) return -1;
      if (timeA[i] > timeB[i]) return 1;
    }
    return 0;
  });

  return result;
};

function calculateParkingCost(targetDate, targetTime) {
  if (!targetDate || !targetTime) {
    return 'Thời gian bị lỗi format';
  }
  // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD' format
  const [day, month, year] = targetDate.split('/');

  // Ensure the month has two digits (add leading zero if needed)
  const formattedMonth = month.length === 1 ? `0${month}` : month;
  // Ensure the day has two digits (add leading zero if needed)
  const formattedDay = day.length === 1 ? `0${day}` : day;

  const convertedDate = `${year}-${formattedMonth}-${formattedDay}`;

  // Convert time 'HH:MM:SS' format
  const [hour, minute, second] = targetTime.split(':');
  // Ensure the hour has two digits (add leading zero if needed)
  const formattedHour = hour.length === 1 ? `0${hour}` : hour;

  // Ensure the minute has two digits (add leading zero if needed)
  const formattedMinute = minute.length === 1 ? `0${minute}` : minute;

  // Ensure the second has two digits (add leading zero if needed)
  const formattedSecond = second.length === 1 ? `0${second}` : second;

  const convertedTime = `${formattedHour}:${formattedMinute}:${formattedSecond}`;

  // Regular expression to validate the date format 'DD-MM-YYYY'
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Regular expression to validate the time format 'HH:MM:SS'
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

  // Check if the targetDate and targetTime are in the correct format
  if (!dateRegex.test(convertedDate) || !timeRegex.test(convertedTime)) {
    return 'Thời gian bị lỗi format';
  }
  // Combine the converted target date and time into a single string
  const targetDateTimeString = `${convertedDate}T${convertedTime}`;

  // Convert start time and end time to JavaScript Date objects
  const startDate = new Date(targetDateTimeString);
  const endDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = endDate - startDate;

  // Calculate the number of days parked (rounded up to the nearest day)
  const daysParked = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Calculate the parking cost
  const parkingCost = daysParked * 5000;

  return parkingCost;
}

const queuingRef = ref(database, '/queuing');

// convert data queuing when esp8266 upload new data
onValue(queuingRef, async (snapshot) => {
  const dataQueuing = snapshot.val();
  if (dataQueuing) {
    // alert(`Phòng ${lastElement.slot} đã rời phòng`);

    // chuyển data từ dạng string sang arrray
    const convertDataQueuing = convertRawData(dataQueuing);

    // lấy giá trị mới được esp8266 cập nhật vào data
    const lastElement = convertDataQueuing[convertDataQueuing.length - 1];
    let dataParking = null;
    // let convertDataParking = null;
    // lấy dữ liệu slot đã dùng trên database
    await get(child(ref(database), '/parkingArray'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          dataParking = snapshot.val();
        } else {
          dataParking = [];
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // const uniqueData = convertDataQueuing.reduce((acc, current) => {
    //   const existing = acc.find((item) => item.id === current.id);
    //   if (!existing) {
    //     acc.push(current);
    //   } else if (current.time > existing.time) {
    //     existing.time = current.time;
    //   }
    //   return acc;
    // }, []);

    // // Create a Set of 'id' values from uniqueData for efficient lookup
    // const idsToKeep = new Set(uniqueData.map((item) => item.id));

    // // Filter data1 to keep only elements with 'id' values in idsToKeep
    // const removeById = dataParking.filter((item) => !idsToKeep.has(item.id));
    // console.log('log removeById: ', removeById);
    const roomById = dataParking.filter((item) => item.id === lastElement.id);
    if (roomById[0].slot !== '0' && roomById.length > 0) {
      alert(`Phòng ${roomById[0].slot}: ${calculateParkingCost(roomById[0]?.date, roomById[0]?.time)} đồng`);
    }

    const removeById = dataParking.filter((item) => item.id !== lastElement.id);

    set(ref(database, `parkingArray`), removeById);
    set(ref(database, `parking`), unConvertRawData(removeById));
    // const clear
  } else {
    console.log('Data not found');
  }
});

const parkingRef = ref(database, '/parking');
// convert data parking when esp8266 upload new data
onValue(parkingRef, async (snapshot) => {
  const dataParking = snapshot.val();

  // let convertData = undefined;
  if (dataParking) {
    // chuyển data từ string sang array
    const convertDataParking = convertRawData(dataParking);

    // lấy giá trị xe mới đỗ vào slot được esp8266 cập nhật vào data
    const lastElement = convertDataParking[convertDataParking.length - 1];

    // console.log('log checkIdIsExist: ', checkIdIsExist(convertDataParking, lastElement.id));
    // console.log(
    //   'log checkSlotIsUsed(convertDataParking, lastElement.slot): ',
    //   checkSlotIsUsed(convertDataParking, lastElement.slot)
    // );
    // kiểm tra xem slot đã được sử dụng hay chưa
    if (!checkSlotIsUsed(convertDataParking, lastElement.slot)) {
      // sử lý khi phòng không sử dụng

      // kiểm tra xem id đã được sử dụng ở slot nào hay chưa
      if (checkIdIsExist(convertDataParking, lastElement.id)) {
        // nếu đã được sử sụng, cho phép chuyển sang slot khác
        // xóa toàn bộ thông tin theo id
        const clearIdExist = convertDataParking.filter((item) => item.id !== lastElement.id);
        const updateSlotVehicle = sortByDateAndTime([...clearIdExist, lastElement]);
        set(ref(database, `parkingArray`), updateSlotVehicle);
        set(ref(database, `parking`), unConvertRawData(updateSlotVehicle));
      } else {
        // nếu chưa dùng tiếp tục xử lý để hiển thị lên web
        set(ref(database, `parkingArray`), convertDataParking);

        // // khi slot không có xe đậu, cho phép đậu xe, cập nhật lại, parkingArray để tiện xử lý trên web
        // set(ref(database, `parkingArray`), convertDataParking);
        // // xóa thông tin phương tiện đã đậu ở trong queuing
        // let dataQueuing = null;
        // await get(child(ref(database), '/queuing'))
        //   .then((snapshot) => {
        //     if (snapshot.exists()) {
        //       dataQueuing = snapshot.val();
        //     } else {
        //       dataQueuing = {};
        //       console.log('No data available');
        //     }
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });
        // const convertDataQueuing = convertRawData(dataQueuing);
        // // convertDataQueuing = convertRawData(dataQueuing);
        // const clearDataParked = clearParkedDataInQueuing(convertDataParking, convertDataQueuing);
        // set(ref(database, `queuingArray`), clearDataParked);
        // // update data in queuing
        // // will change queuingRawTest -> queuing
        // const unConvertDataQueuing = unConvertRawData(clearDataParked);
        // set(ref(database, `queuing`), unConvertDataQueuing);
        // // update data in parking
        // // will change parkingRawTest -> parking
        // // console.log('log convertDataParking: ', convertDataParking);
        // set(ref(database, `parkingArray`), convertDataParking);
        // const unConvertDataParking = unConvertRawData(convertDataParking);
        // set(ref(database, `parking`), unConvertDataParking);
      }
    } else {
      alert(`Phòng ${lastElement.slot} đã được sử dụng`);
      const removeLastVehical = unConvertRawData(convertDataParking.slice(0, -1));
      set(ref(database, `parking`), removeLastVehical);
    }

    // set raw data in parking
  } else {
    console.log('Data not found');
    set(ref(database, `parkingArray`), {});
  }
});

const parkingArrayRef = ref(database, '/parkingArray');

// convert data queuing when esp8266 upload new data
onValue(parkingArrayRef, async (snapshot) => {
  const dataParkingArrayRef = snapshot.val();
  if (!dataParkingArrayRef) {
    set(ref(database, `queuing`), {});
    console.log('Data not found');
  }
});
