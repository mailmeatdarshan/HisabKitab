import { HISABKITAB_LOGO } from "./logo-data";

export function exportLenDenStatementPDF(party) {
  if (!party) return;

  const entries = Array.isArray(party.entries) ? [...party.entries] : [];
  // Sort entries chronologically
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalGave = entries
    .filter((e) => e.type === "give")
    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const totalGot = entries
    .filter((e) => e.type === "get")
    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const netBalance = totalGave - totalGot;

  let runningBalance = 0;
  const rowsHtml = entries
    .map((e) => {
      const amt = parseFloat(e.amount) || 0;
      if (e.type === "give") {
        runningBalance += amt;
      } else {
        runningBalance -= amt;
      }

      const formattedDate = new Date(e.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return `
        <tr>
          <td>${formattedDate}</td>
          <td>${e.note || (e.type === "give" ? "You Gave" : "You Got")}</td>
          <td class="amount gave">${e.type === "give" ? `₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "-"}</td>
          <td class="amount got">${e.type === "get" ? `₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "-"}</td>
          <td class="amount balance ${runningBalance > 0 ? "positive" : runningBalance < 0 ? "negative" : ""}">
            ₹${Math.abs(runningBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })} ${runningBalance > 0 ? "Dr (To Receive)" : runningBalance < 0 ? "Cr (To Pay)" : ""}
          </td>
        </tr>
      `;
    })
    .join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export the statement PDF.");
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>HisabKitab - Statement for ${party.name}</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 40px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #00C58D;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo {
          width: 44px;
          height: 44px;
          object-contain: contain;
        }
        .brand-name {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #0f172a;
        }
        .brand-name span {
          color: #00C58D;
        }
        .report-title {
          text-align: right;
        }
        .report-title h1 {
          margin: 0;
          font-size: 20px;
          color: #00C58D;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .report-title p {
          margin: 5px 0 0 0;
          font-size: 12px;
          color: #64748b;
        }
        .party-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .party-name {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
        }
        .party-sub {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 30px;
        }
        .summary-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
        }
        .summary-card.net {
          background: ${netBalance > 0 ? "#ecfdf5" : netBalance < 0 ? "#fff1f2" : "#f1f5f9"};
          border-color: ${netBalance > 0 ? "#a7f3d0" : netBalance < 0 ? "#fecdd3" : "#cbd5e1"};
        }
        .card-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
          margin-bottom: 6px;
        }
        .card-value {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }
        .card-value.gave {
          color: #e11d48;
        }
        .card-value.got {
          color: #059669;
        }
        .card-value.net {
          color: ${netBalance > 0 ? "#059669" : netBalance < 0 ? "#e11d48" : "#475569"};
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 13px;
        }
        th {
          background-color: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          padding: 12px 14px;
          text-align: left;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11px;
          color: #475569;
          letter-spacing: 0.05em;
        }
        td {
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
        }
        tr:nth-child(even) {
          background-color: #fafafa;
        }
        .amount {
          font-variant-numeric: tabular-nums;
          font-weight: 600;
          text-align: right;
        }
        th.amount-col {
          text-align: right;
        }
        .amount.gave {
          color: #e11d48;
        }
        .amount.got {
          color: #059669;
        }
        .amount.balance.positive {
          color: #059669;
          font-weight: 700;
        }
        .amount.balance.negative {
          color: #e11d48;
          font-weight: 700;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 11px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
          padding-top: 15px;
        }
        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">
          <img class="logo" src="${HISABKITAB_LOGO}" alt="HisabKitab Logo" />
          <span class="brand-name">Hisab<span>Kitab</span></span>
        </div>
        <div class="report-title">
          <h1>Account Statement</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      <div class="party-card">
        <div>
          <div class="card-label">Party / Customer</div>
          <div class="party-name">${party.name}</div>
          <div class="party-sub">Total ${entries.length} ${entries.length === 1 ? "transaction" : "transactions"} recorded</div>
        </div>
        <div style="text-align: right;">
          <div class="card-label">Net Settlement Status</div>
          <div class="card-value net">
            ${
              netBalance > 0
                ? `₹${netBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })} To Receive`
                : netBalance < 0
                ? `₹${Math.abs(netBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })} To Pay`
                : "Settled"
            }
          </div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <div class="card-label">Total Given</div>
          <div class="card-value gave">₹${totalGave.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="summary-card">
          <div class="card-label">Total Received</div>
          <div class="card-value got">₹${totalGot.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="summary-card net">
          <div class="card-label">Net Balance</div>
          <div class="card-value net">₹${Math.abs(netBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 18%;">Date</th>
            <th style="width: 37%;">Description / Note</th>
            <th class="amount-col" style="width: 15%;">You Gave (-)</th>
            <th class="amount-col" style="width: 15%;">You Got (+)</th>
            <th class="amount-col" style="width: 15%;">Balance</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 24px;">No transactions recorded for this party.</td></tr>`}
        </tbody>
      </table>

      <div class="footer">
        Generated automatically with <strong>HisabKitab</strong> • Smart & Simple Personal Finance Management
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 350);
}
