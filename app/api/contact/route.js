import axios from 'axios';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Crear y configurar el transporter de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSKEY,
  },
});

// Función auxiliar para enviar un mensaje por Telegram
async function sendTelegramMessage(token, chat_id, message) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await axios.post(url, {
      text: message,
      chat_id,
    });
    return res.data.ok;
  } catch (error) {
    console.error('Error al enviar el mensaje por Telegram:', error.response?.data || error.message);
    return false;
  }
};

// Plantilla HTML del email
const generateEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">Nuevo mensaje recibido</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Respondé este email para contactar al remitente.</p>
    </div>
  </div>
`;

// Función auxiliar para enviar un email con Nodemailer
async function sendEmail(payload, message) {
  const { name, email, message: userMessage } = payload;

  const mailOptions = {
    from: "Portfolio",
    to: process.env.EMAIL_ADDRESS,
    subject: `Nuevo mensaje de ${name}`,
    text: message,
    html: generateEmailTemplate(name, email, userMessage),
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error al enviar el email:', error.message);
    return false;
  }
};

export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, message: userMessage } = payload;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;

    // Validar variables de entorno
    if (!token || !chat_id) {
      return NextResponse.json({
        success: false,
        message: 'Falta el token de Telegram o el chat ID.',
      }, { status: 400 });
    }

    const message = `Nuevo mensaje de ${name}\n\nEmail: ${email}\n\nMensaje:\n\n${userMessage}\n\n`;

    // Enviar mensaje por Telegram
    const telegramSuccess = await sendTelegramMessage(token, chat_id, message);

    // Enviar email
    const emailSuccess = await sendEmail(payload, message);

    if (telegramSuccess && emailSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Mensaje y email enviados correctamente.',
      }, { status: 200 });
    }

    return NextResponse.json({
      success: false,
      message: 'No se pudo enviar el mensaje o el email.',
    }, { status: 500 });
  } catch (error) {
    console.error('Error de API:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Ocurrió un error en el servidor.',
    }, { status: 500 });
  }
};
