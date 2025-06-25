
const mailTamplet = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>OTP Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 0;
          margin: 0;
        }
        .container {
          max-width: 600px;
          margin: 50px auto;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background-color: #4a90e2;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 30px 20px;
          color: #333;
        }
        .otp-box {
          font-size: 32px;
          font-weight: bold;
          color: #4a90e2;
          margin: 30px auto;
          background: #e6f0fa;
          padding: 20px 0;
          text-align: center;
          border-radius: 8px;
          width: 200px;
          letter-spacing: 4px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #777;
          background-color: #f9f9f9;
        }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          background-color: #4a90e2;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Live Chating Made Easy</h1>
        </div>
        <div class="content">
          <h2>Email Verification</h2>
          <p>Hello,</p>
          <p>Use the OTP below to complete your email verification:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Live Chating Made Easy. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

export default mailTamplet;