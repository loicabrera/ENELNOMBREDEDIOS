import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD // Use App Password from Gmail
  }
});

export const sendCredentialsEmail = async (email, username, password) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Tus credenciales de acceso',
      html: `
        <h2>Bienvenido a nuestro sistema</h2>
        <p>Aquí están tus credenciales de acceso:</p>
        <p><strong>Usuario:</strong> ${username}</p>
        <p><strong>Contraseña:</strong> ${password}</p>
        <p>Por favor, guarda esta información en un lugar seguro.</p>
        <p>Te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
}; 