export const requestInfohtml = (
  name: string,
  requestDisplayId: number,
  title: string,
  pricePerUnit: number,
  quantity: number,
  totalCost: number,
  description: string,
  logisticCost: number,
  attachment: string,
  commentMessage: string,
  //   receiverInfo?: string,
  //   accountInfo?: string,
) => {
  // Create a new Date object for GMT+5
  const now = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });

  const proLoginURL =
    process.env.PRO_LOGIN_URL || 'https://pas-stage.concaveagri.com/';

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>More information requested</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        background-color: #f4f6f9;
        margin: 0;
        padding: 0;
      }
  
      .container {
        max-width: 600px;
        margin: 40px auto;
        padding: 30px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
        border: 1px solid #dcdcdc;
      }
  
      h1 {
        color: #2c3e50;
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 20px;
        text-align: center;
      }
  
      p {
        color: #34495e;
        font-size: 16px;
        line-height: 1.8;
        margin: 15px 0;
      }
  
      .highlight {
        font-weight: bold;
        color: #27ae60;
      }
  
      .details-table {
        width: 100%;
        margin: 20px 0;
        border-collapse: collapse;
      }
  
      .details-table th, .details-table td {
        padding: 12px;
        border: 1px solid #ddd;
        text-align: left;
        font-size: 15px;
      }
  
      .details-table th {
        background-color: #f2f2f2;
        color: #333;
      }
  
      .footer {
        margin-top: 40px;
        font-size: 14px;
        color: #7f8c8d;
        text-align: center;
        border-top: 1px solid #e0e0e0;
        padding-top: 20px;
      }
  
      .footer p {
        margin: 5px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>More information requested</h1>
      <p>Dear Sir/Mam<strong></strong>,</p>
      <p> purchase request with ID <span class="highlight">${requestDisplayId}</span> titled "<strong>${title}</strong>" requests information.</p>

    <!--  <p> Below is the comment message:</p> -->
      <p>${commentMessage !== null && commentMessage !== undefined ? 'Below is the comment message:' : ''} </p> 

      <p>${commentMessage !== null && commentMessage !== undefined ? `<strong>"${commentMessage}"</strong>` : ''} </p> 

     <p> Below are the details of the request:</p>

     <!-- <p>Receiver Details<strong></strong>,</p> -->
  
       
      
      <table class="details-table">
        <tr>
          <th>Title</th>
          <td>${title}</td>
        </tr>
        <tr>
          <th>Quantity</th>
        <!--  <td>${quantity}</td> -->
          <td>${quantity !== null && quantity !== undefined ? quantity : 0}</td>
        </tr>
        <tr>
          <th>Price per Unit</th>
         <!-- <td>${pricePerUnit}</td> -->
          <td>${pricePerUnit !== null && pricePerUnit !== undefined ? pricePerUnit : 0}</td> 
        </tr>
         <tr>
          <th>Logistic Cost</th>
        <!--  <td>${logisticCost}</td> -->
          <td>${logisticCost !== null && logisticCost !== undefined ? logisticCost : 0}</td>
        </tr>
        <tr>
          <th>Total Cost</th>
         <!-- <td>${totalCost}</td> -->
          <td>${totalCost !== null && totalCost !== undefined ? totalCost : 0}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>${description}</td>
        </tr>
        <tr>
          <th>Attachment</th>
         <!-- <td>${attachment}</td> -->
         <!-- <td>${attachment ? `<a href="${attachment}" download>Download Attachment</a>` : 'No Attachment'}</td> -->
          <td>${attachment ? `<a href="${attachment}">Download Attachment</a>` : 'No Attachment'}</td>
        </tr>
  
        
  
        
        
      </table>
  
      <!-- Add a button link to the project login page -->
      <div style="text-align: center; font-size: 16px;">
        <a href="${proLoginURL}" class="button">Click here to access to your account</a>
      </div>
  
      
  
        <div class="footer">
        <p>${now} (GMT+5)</p>
      </div>
  
        
  
     
  
      </div>
    </div>
  </body>
  </html>
  `;
};
