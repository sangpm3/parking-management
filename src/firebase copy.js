// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';

// import { getFirestore } from '@firebase/firestore';

// import { child, ref, set, get, update, onValue, getDatabase } from 'firebase/database';
// import _ from 'lodash';

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyCJTvovwVoa2tEXGNaXZxr21KtARITFLoc',
//   authDomain: 'packing-manager.firebaseapp.com',
//   projectId: 'packing-manager',
//   storageBucket: 'packing-manager.appspot.com',
//   messagingSenderId: '19041306689',
//   appId: '1:19041306689:web:4f881c75181d2d7a4a5ec0',
// };

// // const firebaseConfig = {
// //   apiKey: 'AIzaSyCbeF46ZMeCJFVKa4kgXuZWBtKCJNnvkzI',
// //   authDomain: 'parking-manager-c6eef.firebaseapp.com',
// //   databaseURL: 'https://parking-manager-c6eef-default-rtdb.firebaseio.com',
// //   projectId: 'parking-manager-c6eef',
// //   storageBucket: 'parking-manager-c6eef.appspot.com',
// //   messagingSenderId: '385892307229',
// //   appId: '1:385892307229:web:00690d9e642013a2c4d1f4',
// //   measurementId: 'G-4Q3SYW3TVW',
// // };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // export const firestore = getFiresStore(app);
// export const firestore = getFirestore(app);
// export const database = getDatabase(app);

// const updateDataFirebase = async (path, value) => {
//   // lấy data trên firebase theo biến path
//   const dbRef = ref(database);
//   let currentData = null;
//   await get(child(dbRef, path))
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         currentData = snapshot.val();
//       } else {
//         currentData = {};
//         console.log('No data available');
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
//   // update data
//   // Write the new post's data simultaneously in the posts list and the user's post list.
//   const updates = {
//     [path]: {
//       ...currentData,
//       ...value,
//     },
//   };
//   update(dbRef, updates);
// };

// const convertRawData = (data) => {
//   const result = _.values(data).map((item) => {
//     const itemArr = item.split('-');
//     return {
//       slot: itemArr[0],
//       date: itemArr[1],
//       time: itemArr[2],
//       id: itemArr[3],
//     };
//   });

//   return sortByDatAndTime(result);
// };

// const unConvertRawData = (data) => {
//   const result = data.map((item) => {
//     return `${item.slot}-${item.date}-${item.time}-${item.id}`;
//   });
//   return { ...result };
// };

// const clearParkedDataInQueuing = (firstArray, secondArray) => {
//   const filteredArray = secondArray.filter((item) => {
//     // Check if there is a matching id in the first array
//     return !firstArray.some((firstItem) => firstItem.id === item.id);
//   });
//   return filteredArray;
// };

// const checkVehicalInOrOut = (id, parking, queuing) => {
//   // true: in, xe vào
//   // false: out, xe ra

//   let count = 0;

//   queuing.forEach((item) => {
//     if (item.id === id) {
//       count += 1;
//     }
//   });

//   if (count % 2 === 0) {
//     return false;
//   }

//   const result = parking.filter((item) => item.id === id);
//   if (result.length > 0) {
//     return false;
//   }
//   return true;
// };

// function checkSlotIsUsed(data, slot) {
//   const inforBySlot = data.filter((item) => Number(item.slot) === Number(slot));
//   if (inforBySlot.length > 1) {
//     return true;
//   }
//   return false;
// }

// function checkIdIsExist(data, id) {
//   const inforById = data.filter((item) => item.id === id);
//   // console.log('log inforById: ', inforById);
//   if (inforById.length > 1) {
//     return true;
//   }
//   return false;
// }

// function checkIdExistInQueuing(data, id) {
//   const inforBySlot = data.filter((item) => item.id === id);
//   if (inforBySlot.length > 0) {
//     return true;
//   }
//   return false;
// }

// const sortByDatAndTime = (data) => {
//   const result = data.sort((a, b) => {
//     const dateA = new Date(`${a.data} ${a.time}`);
//     const dateB = new Date(`${b.data} ${b.time}`);
//     return dateA - dateB;
//   });
//   return result;
// };

// const queuingRef = ref(database, '/queuing');

// // convert data queuing when esp8266 upload new data
// onValue(queuingRef, async (snapshot) => {
//   const dataQueuing = snapshot.val();
//   if (dataQueuing) {
//     // chuyển data từ dạng string sang arrray
//     const convertDataQueuing = convertRawData(dataQueuing);
//     // lấy giá trị mới được esp8266 cập nhật vào data
//     const lastElement = convertDataQueuing[convertDataQueuing.length - 1];

//     let dataParking = null;
//     let convertDataParking = null;
//     // lấy dữ liệu parking trên database
//     await get(child(ref(database), '/parking'))
//       .then((snapshot) => {
//         if (snapshot.exists()) {
//           dataParking = snapshot.val();
//         } else {
//           dataParking = {};
//           console.log('No data available');
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//     // if (dataParking) {
//     // }
//     convertDataParking = convertRawData(dataParking);

//     if (checkVehicalInOrOut(lastElement.id, convertDataParking, convertDataQueuing)) {
//       // kiểm tra xe vừa mới quẹt thẻ trạng thái vào hoặc ra
//       // true: xe vào
//       // set lại data queuingArray để tiện sử lý trên web
//       // console.log('log xe vao');
//       set(ref(database, `queuingArray`), convertDataQueuing);

//       // updateDataFirebase('queuingArray', convertDataQueuing);
//     } else {
//       // false: xe ra
//       // xóa dữ liệu xe ra trong queuing và parking theo id

//       // tạo array mới mà không có value của id phương tiện ra
//       const removeVehicleQueuingById = convertDataQueuing.filter((item) => item.id !== lastElement.id);
//       // set lại value cho queuingArray
//       set(ref(database, `queuingArray`), removeVehicleQueuingById);
//       // set lại string data cho queuing
//       set(ref(database, `queuing`), unConvertRawData(removeVehicleQueuingById));

//       // xóa dữ liệu xe đã ra trong parking

//       // lấy lại dữ liệu parking trên database
//       await get(child(ref(database), '/parking'))
//         .then((snapshot) => {
//           if (snapshot.exists()) {
//             dataParking = snapshot.val();
//           } else {
//             dataParking = {};
//             console.log('No data available');
//           }
//         })
//         .catch((error) => {
//           console.error(error);
//         });

//       convertDataParking = convertRawData(dataParking);

//       const removeVehicleParkingById = convertDataParking.filter((item) => item.id !== lastElement.id);
//       set(ref(database, `parkingArray`), removeVehicleParkingById);
//       set(ref(database, `parking`), unConvertRawData(removeVehicleParkingById));
//     }

//     // check xe ra hay vao

//     // console.log('log dataQueuing: ', convertData);
//     // set(ref(database, `queuingbackup`), dataQueuing);
//   } else {
//     console.log('Data not found');
//   }
// });

// const parkingRef = ref(database, '/parking');
// // convert data parking when esp8266 upload new data
// onValue(parkingRef, async (snapshot) => {
//   const dataParking = snapshot.val();

//   // let convertData = undefined;
//   if (dataParking) {
//     // chuyển data từ string sang array
//     const convertDataParking = convertRawData(dataParking);
//     // lấy giá trị xe mới đỗ vào slot được esp8266 cập nhật vào data
//     const lastElement = convertDataParking[convertDataParking.length - 1];

//     if (!checkSlotIsUsed(convertDataParking, lastElement.slot)) {
//       // kiểm tra xem phương tiện đã đỗ hay chưa
//       // console.log('log checkIdIsExist: ', checkIdIsExist(convertDataParking, lastElement.id));
//       if (checkIdIsExist(convertDataParking, lastElement.id)) {
//         // const checkIdIsExist = checkIdIsExist(convertDataParking, lastElement.id);

//         // nếu tồn tại thì cho phép đỗ slot khác

//         // xóa toàn bộ thông tin theo id
//         const clearIdExist = convertDataParking.filter((item) => item.id !== lastElement.id);
//         // thêm giá trị mới vào
//         const updateSlotVehicle = sortByDatAndTime([...clearIdExist, lastElement]);

//         set(ref(database, `parkingArray`), updateSlotVehicle);
//         set(ref(database, `parking`), unConvertRawData(updateSlotVehicle));
//       } else {
//         // nếu chưa đỗ tiếp tục xử lý
//         // khi slot không có xe đậu, cho phép đậu xe, cập nhật lại, parkingArray để tiện xử lý trên web
//         set(ref(database, `parkingArray`), convertDataParking);

//         // xóa thông tin phương tiện đã đậu ở trong queuing
//         let dataQueuing = null;
//         await get(child(ref(database), '/queuing'))
//           .then((snapshot) => {
//             if (snapshot.exists()) {
//               dataQueuing = snapshot.val();
//             } else {
//               dataQueuing = {};
//               console.log('No data available');
//             }
//           })
//           .catch((error) => {
//             console.error(error);
//           });

//         const convertDataQueuing = convertRawData(dataQueuing);
//         // convertDataQueuing = convertRawData(dataQueuing);

//         const clearDataParked = clearParkedDataInQueuing(convertDataParking, convertDataQueuing);
//         set(ref(database, `queuingArray`), clearDataParked);

//         // update data in queuing
//         // will change queuingRawTest -> queuing

//         const unConvertDataQueuing = unConvertRawData(clearDataParked);
//         set(ref(database, `queuing`), unConvertDataQueuing);

//         // update data in parking
//         // will change parkingRawTest -> parking
//         // console.log('log convertDataParking: ', convertDataParking);
//         set(ref(database, `parkingArray`), convertDataParking);
//         const unConvertDataParking = unConvertRawData(convertDataParking);
//         set(ref(database, `parking`), unConvertDataParking);
//       }
//     } else {
//       const removeLastVehical = unConvertRawData(convertDataParking.slice(0, -1));
//       set(ref(database, `parking`), removeLastVehical);
//     }

//     // set raw data in parking
//   } else {
//     console.log('Data not found');
//   }
// });
