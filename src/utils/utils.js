export function calculateTimeElapsed(targetDate, targetTime) {
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

  // Parse the target date and time
  const targetDateTime = new Date(targetDateTimeString);

  // Get the current date and time
  const currentDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = currentDate - targetDateTime;

  // Convert the time difference to seconds, minutes, hours, and days
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Calculate the remaining hours, minutes, and seconds
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  return `${days} ngày : ${remainingHours} giờ : ${remainingMinutes} phút: ${remainingSeconds} giây`;
}

export function calculateParkingCost(targetDate, targetTime, number = false) {
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

  // // Calculate the number of days parked (rounded up to the nearest day)
  // const daysParked = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Calculate the parking cost
  const parkingCost = Math.ceil(timeDifference / 1000) * 10;
  // const parkingCost = daysParked * 5000;\
  if (number) {
    return parkingCost;
  }

  return parkingCost.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
}
