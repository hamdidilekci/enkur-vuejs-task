import axios from "axios";

export const smsTypes = {
    resetPassword: "Hesabınızın şifresini sıfırlamak için OTP kodu: ",
    register: "Uygulamaya kayıt olmak için OTP kodu: ",
    changePhone: "Hesabınızın telefon numarasını değiştirmek için OTP kodu: ",
    newPhone: "Hesabınızın yeni telefon numarasını doğrulamak için OTP kodu: ",
    newPassword: "Uygulamaya giriş yapmak için kullanabileceğiniz yeni şifre: ",
};

export async function sendSms(phone, code, type) {
    const smsBody = `<?xml version="1.0" encoding="UTF-8"?><smspack 
ka="lorem" pwd="abcdef-ghjkl1-mnoprs" org="ipsum" > 
<mesaj><metin>${type} 
${code}</metin><nums>${phone}</nums></mesaj></smspack>`;
    if (process.env.NODE_ENV === "production") {
        await axios.post("https://www.turkcell.com.tr", smsBody, {
            headers: { "Content-Type": "text/xml; charset=UTF-8" },
        });
    }
}
