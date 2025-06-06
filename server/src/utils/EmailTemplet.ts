export const Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #4CAF50;
              background: #e8f5e9;
              border: 1px dashed #4CAF50;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your Email</div>
          <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up! Please confirm your email address by entering the code below:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>If you did not create an account, no further action is required. If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

export const Mobile_Verification_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Mobile Number</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f0f2f5;
              margin: 0;
              padding: 0;
          }
          .wrapper {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
              overflow: hidden;
              border: 1px solid #e1e1e1;
          }
          .header {
              background-color: #007BFF;
              color: white;
              padding: 24px;
              text-align: center;
              font-size: 24px;
              font-weight: 600;
              letter-spacing: 1px;
          }
          .content {
              padding: 30px;
              color: #333;
              line-height: 1.6;
          }
          .otp-box {
              background-color: #e3f2fd;
              border: 2px dashed #007BFF;
              color: #007BFF;
              font-size: 22px;
              font-weight: bold;
              letter-spacing: 2px;
              text-align: center;
              padding: 12px 0;
              border-radius: 6px;
              margin: 20px 0;
          }
          .footer {
              background-color: #f8f9fa;
              text-align: center;
              padding: 18px;
              font-size: 13px;
              color: #666;
              border-top: 1px solid #ddd;
          }
          p {
              margin-bottom: 16px;
          }
      </style>
  </head>
  <body>
      <div class="wrapper">
          <div class="header">Mobile Number Verification</div>
          <div class="content">
              <p>Hello,</p>
              <p>We’ve sent you a one-time password (OTP) to verify your mobile number. Please use the following code to complete the verification process:</p>
              <div class="otp-box">{verificationCode}</div>
              <p>If you didn’t request this, you can safely ignore this message.</p>
              <p>For any help, feel free to contact our support team.</p>
          </div>
          <div class="footer">
              &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
          </div>
      </div>
  </body>
  </html>
`;
