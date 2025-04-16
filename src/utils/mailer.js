import nodemailer from "nodemailer";

// Create a transporter with Gmail (or your preferred email service)
const transporter = nodemailer.createTransport({
  service: "gmail", // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER, // your email user (e.g., 'your-email@gmail.com')
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

// Function to send OTP email
export const sendOtpEmail = async (to, otp, purpose) => {
  let subject, message;
  
  if (purpose === "register") {
    subject = "Your OTP for Talent 4 Startup Registration";
    message = `
      <h1>Welcome to Talent 4 Startup</h1>
      <p>Dear user,</p>
      <p>Your OTP for registration on <strong>Talent 4 Startup</strong> is:</p>
      <h2 style="color: #4CAF50; font-size: 2em; font-weight: bold;">${otp}</h2>
      <p><b>Important:</b> The OTP expires in 5 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br />
      <p>Best regards,</p>
      <p><strong>Talent 4 Startup Team</strong></p>
    `;
  } else if (purpose === "login") {
    subject = "Your OTP for Talent 4 Startup Login";
    message = `
      <h1>Welcome Back to Talent 4 Startup</h1>
      <p>Dear user,</p>
      <p>Your OTP for logging into <strong>Talent 4 Startup</strong> is:</p>
      <h2 style="color: #4CAF50; font-size: 2em; font-weight: bold;">${otp}</h2>
      <p><b>Important:</b> The OTP expires in 5 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br />
      <p>Best regards,</p>
      <p><strong>Talent 4 Startup Team</strong></p>
    `;
  } else {
    throw new Error("Invalid OTP purpose provided");
  }

  // Mail options
  const mailOptions = {
    from: `"Talent 4 Startup" <${process.env.EMAIL_USER}>`, // Sender's email and project name
    to, // Recipient's email
    subject, // Dynamic subject based on purpose
    html: message, // Dynamic HTML content based on purpose
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent for ${purpose} to ${to}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};
