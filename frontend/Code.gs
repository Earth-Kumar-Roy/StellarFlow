function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    // 1. SAVE TRANSACTION LOGS & SEND PERSONALIZED EMAILS
    if (action === "log_transaction") {
      var sheet = ss.getSheetByName("Transactions");
      if (!sheet) sheet = ss.insertSheet("Transactions");

      var timestamp = new Date().toISOString();
      var clientName = data.clientName || "Client";
      var freelancerName = data.freelancerName || "Freelancer";
      
      sheet.appendRow([
        timestamp,
        data.eventType || "UNKNOWN", // ESCROW_CREATED, WORK_SUBMITTED, MILESTONE_RELEASED, REFUNDED
        clientName,
        data.clientAddress || "",
        data.clientEmail || "",
        freelancerName,
        data.freelancerAddress || "",
        data.freelancerEmail || "",
        data.totalAmount || "",
        data.milestoneId !== undefined ? data.milestoneId : "",
        data.milestoneDescription || "",
        data.milestoneAmount || "",
        data.txHash || ""
      ]);

      // Handle Personalized Email Dispatches
      sendEscrowEmails(data, clientName, freelancerName);

      return responseJSON({ status: "success", message: "Transaction logged successfully" });
    }

    // 2. SAVE USER FEEDBACK (Accepts both 'submit_feedback' and 'log_feedback')
    if (action === "submit_feedback" || action === "log_feedback") {
      var feedbackSheet = ss.getSheetByName("Feedbacks");
      if (!feedbackSheet) feedbackSheet = ss.insertSheet("Feedbacks");

      // Set headers if the sheet was newly created
      if (feedbackSheet.getLastRow() === 0) {
        feedbackSheet.appendRow([
          "Timestamp",
          "User Name",
          "User Address",
          "Rating",
          "Category",
          "Comment",
          "Recipient Address"
        ]);
      }

      feedbackSheet.appendRow([
        new Date().toISOString(),
        data.userName || "Anonymous User",
        data.userAddress || "",
        data.rating || 5,
        data.category || "General Escrow",
        data.comment || "",
        data.recipientAddress || data.targetAddress || "" // Freelancer or Client wallet address
      ]);

      return responseJSON({ status: "success", message: "Feedback recorded" });
    }

  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = e && e.parameter ? e.parameter.action : "";
  var address = e && e.parameter && e.parameter.address ? e.parameter.address.trim() : "";

  // FETCH TRANSACTIONS FILTERED BY CONNECTED ADDRESS
  if (action === "get_transactions") {
    var sheet = ss.getSheetByName("Transactions");
    if (!sheet) return responseJSON([]);
    
    var rows = sheet.getDataRange().getValues();
    var result = [];

    // Skip header row
    for (var i = 1; i < rows.length; i++) {
      var clientAddr = String(rows[i][3]).trim();
      var freelancerAddr = String(rows[i][6]).trim();

      // Return row if address matches either Client or Freelancer address (or if no address filter supplied)
      if (!address || clientAddr === address || freelancerAddr === address) {
        result.push({
          timestamp: rows[i][0],
          eventType: rows[i][1],
          clientName: rows[i][2],
          clientAddress: clientAddr,
          clientEmail: rows[i][4],
          freelancerName: rows[i][5],
          freelancerAddress: freelancerAddr,
          freelancerEmail: rows[i][7],
          totalAmount: rows[i][8],
          milestoneId: rows[i][9],
          milestoneDescription: rows[i][10],
          milestoneAmount: rows[i][11],
          txHash: rows[i][12]
        });
      }
    }
    return responseJSON(result);
  }

  // FETCH FEEDBACK RECEIVED BY OR SUBMITTED BY ADDRESS
  if (action === "get_feedback") {
    var fbSheet = ss.getSheetByName("Feedbacks");
    if (!fbSheet) return responseJSON({ feedback: [] });

    var fbRows = fbSheet.getDataRange().getValues();
    var fbResult = [];

    for (var j = 1; j < fbRows.length; j++) {
      var submitterAddr = String(fbRows[j][2]).trim();
      var recipientAddr = String(fbRows[j][6]).trim();

      if (!address || recipientAddr === address || submitterAddr === address) {
        fbResult.unshift({
          timestamp: fbRows[j][0],
          userName: fbRows[j][1],
          userAddress: submitterAddr,
          rating: fbRows[j][3],
          category: fbRows[j][4],
          comment: fbRows[j][5],
          recipientAddress: recipientAddr,
          targetAddress: recipientAddr
        });
      }
    }
    return responseJSON({ feedback: fbResult });
  }

  return responseJSON({ status: "online", service: "StellarFlow Backend API" });
}

// HELPER: PERSONALIZED EMAIL DISPATCH
function sendEscrowEmails(data, clientName, freelancerName) {
  var senderDisplayName = "StellarFlow Escrow";
  var eventType = data.eventType;
  var amount = data.milestoneAmount || data.totalAmount || "";
  var txLink = data.txHash ? "https://stellar.expert/explorer/testnet/tx/" + data.txHash : "#";

  // Email to Client (if provided)
  if (data.clientEmail) {
    try {
      var clientSubject = "StellarFlow Alert: " + getSubjectForEvent(eventType, true);
      var clientBody = buildHtmlEmail(clientName, eventType, data, freelancerName, amount, txLink, true);
      
      MailApp.sendEmail({
        to: data.clientEmail,
        subject: clientSubject,
        htmlBody: clientBody,
        name: senderDisplayName
      });
    } catch (err) {
      Logger.log("Client Email Error: " + err.toString());
    }
  }

  // Email to Freelancer (if provided)
  if (data.freelancerEmail) {
    try {
      var freelancerSubject = "StellarFlow Alert: " + getSubjectForEvent(eventType, false);
      var freelancerBody = buildHtmlEmail(freelancerName, eventType, data, clientName, amount, txLink, false);

      MailApp.sendEmail({
        to: data.freelancerEmail,
        subject: freelancerSubject,
        htmlBody: freelancerBody,
        name: senderDisplayName
      });
    } catch (err) {
      Logger.log("Freelancer Email Error: " + err.toString());
    }
  }
}

function getSubjectForEvent(eventType, isClient) {
  switch (eventType) {
    case "ESCROW_CREATED":
      return isClient ? "New Escrow Initialized Successfully" : "You Were Named Freelancer on a New Escrow";
    case "WORK_SUBMITTED":
      return isClient ? "Milestone Work Submitted for Your Review" : "Your Work Submission Has Been Logged";
    case "MILESTONE_RELEASED":
      return isClient ? "Milestone Payment Released" : "Payment Released to Your Wallet!";
    case "REFUNDED":
      return "Expired Escrow Funds Refunded";
    default:
      return "Contract Status Update";
  }
}

function buildHtmlEmail(recipientName, eventType, data, otherPartyName, amount, txLink, isClient) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; max-width: 600px;">
      <h2 style="color: #6366f1; margin-bottom: 8px;">StellarFlow</h2>
      <p style="font-size: 16px;">Hello <strong>${recipientName}</strong>,</p>
      <p style="font-size: 14px; color: #cbd5e1;">${getEventMessage(eventType, otherPartyName, amount, isClient)}</p>
      
      <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin: 16px 0; font-family: monospace;">
        <p style="margin: 4px 0;"><strong>Event:</strong> ${eventType}</p>
        <p style="margin: 4px 0;"><strong>Counterparty:</strong> ${otherPartyName}</p>
        ${amount ? `<p style="margin: 4px 0;"><strong>Amount:</strong> ${amount} XLM</p>` : ''}
        ${data.milestoneDescription ? `<p style="margin: 4px 0;"><strong>Milestone:</strong> ${data.milestoneDescription}</p>` : ''}
      </div>

      ${data.txHash ? `<p><a href="${txLink}" style="background-color: #6366f1; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Transaction on Stellar Expert</a></p>` : ''}
      
      <hr style="border-color: #334155; margin-top: 24px;" />
      <p style="font-size: 11px; color: #64748b;">This is an automated notification from StellarFlow Smart Contract Platform.</p>
    </div>
  `;
}

function getEventMessage(eventType, counterparty, amount, isClient) {
  if (eventType === "ESCROW_CREATED") {
    return isClient 
      ? `Your escrow agreement with <strong>${counterparty}</strong> has been created and funds are locked securely.`
      : `<strong>${counterparty}</strong> created a milestone escrow agreement naming you as freelancer.`;
  }
  if (eventType === "WORK_SUBMITTED") {
    return isClient 
      ? `<strong>${counterparty}</strong> submitted milestone work for review. Please check the dashboard to approve payout.`
      : `Your milestone submission was recorded and <strong>${counterparty}</strong> has been notified to review.`;
  }
  if (eventType === "MILESTONE_RELEASED") {
    return isClient 
      ? `You approved and released <strong>${amount} XLM</strong> to <strong>${counterparty}</strong>.`
      : `<strong>${counterparty}</strong> approved your milestone work! <strong>${amount} XLM</strong> have been transferred to your wallet.`;
  }
  return `A contract event occurred involving <strong>${counterparty}</strong>.`;
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
