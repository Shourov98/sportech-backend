function gen4DigitOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

module.exports = { gen4DigitOtp, addMinutes };
