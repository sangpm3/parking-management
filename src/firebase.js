// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'; // Hàm để khởi tạo ứng dụng Firebase.
import { getFirestore } from '@firebase/firestore'; // Hàm để lấy tham chiếu tới ứng dụng Firebase.

import { child, ref, set, get, onValue, getDatabase } from 'firebase/database'; // Các hàm như child, ref, set, get, onValue, và getDatabase để thao tác với Realtime Database.
import _ from 'lodash'; // thư viện giúp xử lý logic dễ dàng hơn

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Cung cấp thông tin cấu hình Firebase (API key, authDomain, projectId, ...).
const firebaseConfig = {
  apiKey: 'AIzaSyCJTvovwVoa2tEXGNaXZxr21KtARITFLoc',
  authDomain: 'packing-manager.firebaseapp.com',
  projectId: 'packing-manager',
  storageBucket: 'packing-manager.appspot.com',
  messagingSenderId: '19041306689',
  appId: '1:19041306689:web:4f881c75181d2d7a4a5ec0',
};

// const firebaseConfig = {
//   apiKey: 'AIzaSyCbeF46ZMeCJFVKa4kgXuZWBtKCJNnvkzI',
//   authDomain: 'parking-manager-c6eef.firebaseapp.com',
//   databaseURL: 'https://parking-manager-c6eef-default-rtdb.firebaseio.com',
//   projectId: 'parking-manager-c6eef',
//   storageBucket: 'parking-manager-c6eef.appspot.com',
//   messagingSenderId: '385892307229',
//   appId: '1:385892307229:web:00690d9e642013a2c4d1f4',
//   measurementId: 'G-4Q3SYW3TVW',
// };

// Initialize Firebase
// Khởi tạo Firebase sử dụng thông tin cấu hình.
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const database = getDatabase(app);

// Hàm để chuyển đổi dữ liệu từ dạng chuỗi thành mảng đối tượng
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

// Chuyển đổi ngược lại từ mảng đối tượng sang chuỗi.
const unConvertRawData = (data) => {
  // eslint-disable-next-line
  const result = data.map((item) => {
    return `${item.slot}-${item.date}-${item.time}-${item.id}`;
  });
  return { ...result };
};

// Kiểm tra xem slot đã được sử dụng hay chưa.
function checkSlotIsUsed(data, slot) {
  const inforBySlot = data.filter((item) => Number(item.slot) === Number(slot));
  if (inforBySlot.length > 1) {
    return true;
  }
  return false;
}

// Kiểm tra xem ID đã tồn tại hay chưa.
function checkIdIsExist(data, id) {
  const inforById = data.filter((item) => item.id === id);
  if (inforById.length > 1) {
    return true;
  }
  return false;
}

// Sắp xếp mảng theo thứ tự ngày và thời gian.
const sortByDateAndTime = (data) => {
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

const queuingRef = ref(database, '/queuing'); // Tham chiếu đến node 'queuing' trên database.

// convert data queuing when esp8266 upload new data
// Sự kiện onValue lắng nghe sự thay đổi trên node 'queuing' và thực hiện các xử lý khi có sự thay đổi.
onValue(queuingRef, async (snapshot) => {
  const dataQueuing = snapshot.val();

  // Nếu dataQueuing có giá trị (khác null hoặc undefined), thì tiếp tục xử lý. Ngược lại, hiển thị thông báo "Data not found".
  if (dataQueuing) {
    // Sử dụng hàm convertRawData để chuyển đổi dữ liệu từ dạng string sang arrray
    const convertDataQueuing = convertRawData(dataQueuing);

    // lấy giá trị mới được esp8266 cập nhật vào data
    // lastElement là phần tử cuối cùng của convertDataQueuing -> giá trị mới được cập nhật.
    const lastElement = convertDataQueuing[convertDataQueuing.length - 1];

    let dataParking = null; // khai báo mảng dữ liệu sẽ đi kiểm tra
    // lấy dữ liệu phòng đã dùng trên database
    // Sử dụng get để lấy dữ liệu từ đường dẫn '/parkingArray' trong database.
    await get(child(ref(database), '/parkingArray'))
      .then((snapshot) => {
        // Nếu dữ liệu tồn tại, gán vào dataParking, ngược lại, đặt dataParking là một mảng trống và log thông báo 'No data available'.
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

    // tìm phòng theo id, roomById là một mảng chứa các phần tử trong dataParking có thuộc tính id giống với lastElement.id.
    const roomById = dataParking.filter((item) => item.id === lastElement.id);
    // Nếu roomById không rỗng và slot của phần tử đầu tiên trong roomById khác '0', thì đặt giá trị của roomOut trong database là phần tử đó
    if (roomById[0].slot !== '0' && roomById.length > 0) {
      set(ref(database, `roomOut`), roomById[0]);
    }

    // Tạo một mảng removeById bằng cách loại bỏ phần tử có id giống với lastElement.id từ dataParking.
    const removeById = dataParking.filter((item) => item.id !== lastElement.id);

    // Cập nhật giá trị của '/parkingArray' và '/parking' trong database với removeById sau khi loại bỏ phần tử có id giống lastElement.id.
    set(ref(database, `parkingArray`), removeById);
    set(ref(database, `parking`), unConvertRawData(removeById));
    // const clear
  } else {
    console.log('Data not found');
  }
});

// Sự kiện onValue lắng nghe sự thay đổi trên node 'parking' và thực hiện các xử lý khi có sự thay đổi.
const parkingRef = ref(database, '/parking');
// convert data parking when esp8266 upload new data
onValue(parkingRef, async (snapshot) => {
  const dataParking = snapshot.val();

  // Nếu dataParking có giá trị (khác null hoặc undefined), thực hiện xử lý. Ngược lại, hiển thị thông báo "Data not found" và đặt giá trị của '/parkingArray' trong database là một đối tượng rỗng.
  if (dataParking) {
    // Sử dụng hàm convertRawData để chuyển đổi dữ liệu từ dạng string sang array
    const convertDataParking = convertRawData(dataParking);

    // lấy giá trị xe mới đỗ vào slot được esp8266 cập nhật vào data
    // lastElement là phần tử cuối cùng của convertDataParking.
    const lastElement = convertDataParking[convertDataParking.length - 1];

    // kiểm tra xem slot đã được sử dụng hay chưa
    // Sử dụng hàm checkSlotIsUsed để kiểm tra xem slot đã được sử dụng hay chưa.
    if (!checkSlotIsUsed(convertDataParking, lastElement.slot)) {
      // sử lý khi phòng không sử dụng

      // kiểm tra xem id đã được sử dụng ở slot nào hay chưa
      // Xử lý khi slot không được sử dụng:
      // Nếu checkIdIsExist trả về true, nghĩa là id đã được sử dụng ở một slot khác, thì xóa thông tin cũ và cập nhật với thông tin mới.
      // Ngược lại, nếu id chưa được sử dụng, tiếp tục xử lý để hiển thị thông tin lên web.
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
      }
    } else {
      // Hiển thị thông báo cảnh báo thông tin về việc slot đã được sử dụng.
      // Cập nhật giá trị của '/parking' trong database với dữ liệu đã xóa đi phần tử cuối cùng.
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

// tham chiếu để truy cập và tương tác với dữ liệu parkingArray trên database
const parkingArrayRef = ref(database, '/parkingArray');
// convert data queuing when esp8266 upload new data
onValue(parkingArrayRef, async (snapshot) => {
  const dataParkingArrayRef = snapshot.val();
  // kiểm tra dữ liệu trong parkingArray. nếu rỗng thì xóa toàn bộ data trong queuing
  // Nếu dataParkingArrayRef không có giá trị (tức là null hoặc undefined, có thể kiểm tra bằng cách sử dụng !dataParkingArrayRef), thì thực hiện các bước sau:
  // Sử dụng set để đặt giá trị của đường dẫn '/queuing' trong database thành một đối tượng rỗng (được thể hiện bằng {}).
  // Log một thông báo cảnh báo với nội dung 'Data not found'.
  if (!dataParkingArrayRef) {
    set(ref(database, `queuing`), {});
    console.log('Data not found');
  }
  // Điều này có thể được hiểu như sau:
  // Nếu không có dữ liệu nào trong đường dẫn '/parkingArray', tức là không có ai đang ở trong phòng, thì toàn bộ dữ liệu trong đường dẫn '/queuing' sẽ bị xóa (đặt thành đối tượng rỗng), và một thông báo cảnh báo được hiển thị trên console.
  // Mục đích là để đảm bảo rằng nếu phòng trống, thì không có dữ liệu nào còn đang tồn tại ở hàng đợi (queuing). Điều này liên quan đến quy trình quản lý và làm sạch dữ liệu trong trường hợp không có ai đang sử dụng phòng.
});
