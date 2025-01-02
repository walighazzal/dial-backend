export const html = (name: string, url: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Purchase Approval!</title>
  <style>
    /* Add your CSS styles here */
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333333;
      text-align: center;
    }

    p {
      color: #666666;
      line-height: 1.5;
    }

    .user-info {
      margin-top: 20px;
    }

    .user-info h2 {
      color: #333333;
      margin-bottom: 10px;
    }

    .user-info p {
      color: #666666;
      margin-bottom: 5px;
    }

    .user-info strong {
      color: #333333;
    }

    .cta-button {
      display: inline-block;
      background-color: #4CAF50;
      color: #ffffff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Purchase Approval!</h1>
    <p>Dear ${name},</p>
    <p>You have successfully created an account on our platform! </p>
    
    <p>You can now start exploring our platform.</p>
    <p>If you have any questions or need assistance, feel free to reach out to our support team at support-pas@concaveagri.com </p>
    <p>Best regards,</p>
    <p>Purchase Approval Team</p>
    <p><a href=${url} class="cta-button">Login to Your Account</a></p>
  </div>
</body>
</html>
`;
