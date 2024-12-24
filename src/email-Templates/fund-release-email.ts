export const fundshtml = (data) => {
  const {
    name,
    requestDisplayId,
    title,
    ReleasedFund,
    receivername,
    BankAccountnumber,
    modofpayment,
    remainingamount,
    advancePayment,
    amountReturned,
  } = data;

  const now = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Request Approved</title>
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
      <h1>Purchase Request Fund Released</h1>
      <p>Dear Sir/Mam<strong></strong>,</p>
      <p>
      <!-- On behalf of your  request  ID <span class="highlight">${requestDisplayId}</span> titled "<strong>${title}</strong>"
       The Sum of Rs ${ReleasedFund} is transfered to ${receivername} with bank Account Number ${BankAccountnumber}
       ${modofpayment ? `via ${modofpayment}` : ''}, Remaining amount is ${remainingamount} -->

       
       
       On behalf of your request ID <span class="highlight">${requestDisplayId}</span> titled "<strong>${title}</strong>",
        the sum of Rs ${ReleasedFund} has been transferred to ${receivername}
        ${
          modofpayment === '0'
            ? ''
            : `with bank account number ${BankAccountnumber}`
        }
        ${modofpayment ? `via ${modofpayment === '0' ? 'Cash' : 'Bank Transfer'}` : ''}.
        
        <!-- The remaining amount is ${remainingamount}. -->
       </p>

        ${
          advancePayment
            ? `<p>The returned amount is Rs ${amountReturned}.</p>`
            : ''
        }
  
    <div class="footer">
        <p> ${now} (GMT+5) </p>
        </div>
  
     
  
      </div>

  </body>
  </html>
  `;
};
