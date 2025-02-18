let failedAttempts = 0;
let smsCode = null;

const checkPassword = (password) => {
  const correctPassword = "123456";

  if (password === correctPassword) {
    failedAttempts = 0;
    return { success: true, message: "Kirish muvaffaqiyatli!" };
  }

  failedAttempts++;

  if (failedAttempts >= 5) {
    smsCode = Math.floor(1000 + Math.random() * 9000);
    console.log(`SMS kodi: ${smsCode}`);
    return { success: false, message: "5 martadan xato kiritildi. SMS kod yuborildi." };
  }

  return { success: false, message: "Parol noto‘g‘ri!" };
};

const verifySMS = (code) => {
  if (parseInt(code) === smsCode) {
    failedAttempts = 0;
    smsCode = null;
    return { success: true, message: "SMS kod to‘g‘ri! Sayt ochildi." };
  }

  return { success: false, message: "SMS kod noto‘g‘ri!" };
};

module.exports = { checkPassword, verifySMS };
