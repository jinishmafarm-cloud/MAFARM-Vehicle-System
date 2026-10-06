/**
 * MAFARM Vehicle Statutory Alert Backend
 *
 * 1. Create a Google Sheet named "MAFARM Vehicle Statutory Register".
 * 2. Import/copy the vehicle register into the sheet named "Vehicles".
 * 3. Extensions -> Apps Script -> paste this code.
 * 4. Deploy -> New deployment -> Web app.
 *    Execute as: Me
 *    Who has access: Anyone with the link
 * 5. Put the Web App URL into the HTML system Settings.
 *
 * Columns in Vehicles:
 * A Vehicle No
 * B Model
 * C Vehicle Type
 * D Unit
 * E Registration Date
 * F Fitness Expiry
 * G Insurance Expiry
 * H Tax Expiry
 * I Pollution Due
 */

const CONFIG = {
  SHEET_NAME: 'Vehicles',
  ALERT_EMAIL: 'operationhead@mafarm.in',
  ALERT_DAYS: 30
};

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    if (body.action === 'sendAlert') {
      sendAlert_(body.to || CONFIG.ALERT_EMAIL, body.subject, body.html);
      return json_({ok:true, message:'Alert email sent successfully.'});
    }
    if (body.action === 'sendVehicleEmail') {
      sendAlert_(body.to, body.subject, body.htmlBody || body.html);
      return json_({ok:true, message:'Vehicle details email sent successfully to '+body.to+'.'});
    }
    return json_({ok:false, message:'Unknown action.'});
  } catch (err) {
    return json_({ok:false, message:String(err)});
  }
}

function doGet() {
  return json_({ok:true, message:'MAFARM Vehicle Statutory API is running.'});
}

function dailyVehicleExpiryCheck() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) throw new Error('Sheet "Vehicles" not found.');

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return;

  const headers = values[0];
  const map = {};
  headers.forEach((h,i)=>map[String(h).trim()] = i);

  const required = ['Vehicle No','Model','Unit','Fitness Expiry','Insurance Expiry','Tax Expiry','Pollution Due'];
  required.forEach(h=>{ if(map[h] === undefined) throw new Error('Missing column: '+h); });

  const today = new Date();
  today.setHours(0,0,0,0);
  const end = new Date(today);
  end.setDate(end.getDate()+CONFIG.ALERT_DAYS);

  const alerts = [];

  for (let r=1;r<values.length;r++) {
    const row=values[r];
    const vehicle=row[map['Vehicle No']];
    if (!vehicle) continue;

    [
      ['Fitness','Fitness Expiry'],
      ['Insurance','Insurance Expiry'],
      ['Tax','Tax Expiry'],
      ['Pollution','Pollution Due']
    ].forEach(([doc,col])=>{
      const value=row[map[col]];
      if (!(value instanceof Date)) return;
      const d=new Date(value); d.setHours(0,0,0,0);
      const diff=Math.ceil((d-today)/86400000);
      if(diff <= CONFIG.ALERT_DAYS) {
        alerts.push({
          vehicle:String(vehicle),
          model:String(row[map['Model']]||''),
          unit:String(row[map['Unit']]||''),
          document:doc,
          expiry:Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd-MMM-yyyy'),
          days:diff
        });
      }
    });
  }

  if (!alerts.length) return;

  const rows=alerts.map(a=>`
    <tr>
      <td>${escape_(a.vehicle)}</td>
      <td>${escape_(a.model)}</td>
      <td>${escape_(a.unit)}</td>
      <td>${escape_(a.document)}</td>
      <td>${escape_(a.expiry)}</td>
      <td style="font-weight:bold;color:${a.days<0?'#c53939':'#c88718'}">${a.days<0?Math.abs(a.days)+' days overdue':a.days===0?'Expires today':a.days+' days'}</td>
    </tr>`).join('');

  const html=`
  <div style="font-family:Arial,sans-serif;color:#263238">
    <div style="background:#2f6b1f;color:#fff;padding:18px">
      <h2 style="margin:0">MANAPPURAM AGRO FARMS LIMITED</h2>
      <div>Vehicle Statutory Alert</div>
    </div>
    <div style="padding:20px">
      <p>The following vehicle statutory documents are expired or due within ${CONFIG.ALERT_DAYS} days.</p>
      <table style="border-collapse:collapse;width:100%" border="1" cellpadding="8">
        <tr style="background:#eaf4e4">
          <th>Vehicle</th><th>Model</th><th>Unit</th><th>Document</th><th>Expiry</th><th>Status</th>
        </tr>${rows}
      </table>
      <p>Please update the statutory register after renewal.</p>
    </div>
  </div>`;

  MailApp.sendEmail({
    to: CONFIG.ALERT_EMAIL,
    subject: 'MAFARM Vehicle Statutory Alert – '+alerts.length+' item(s)',
    htmlBody: html,
    body: 'MAFARM Vehicle Statutory Alert: '+alerts.length+' item(s) require attention.'
  });
}

function sendAlert_(to, subject, html) {
  MailApp.sendEmail({
    to: to || CONFIG.ALERT_EMAIL,
    subject: subject || 'MAFARM Vehicle Statutory Alert',
    htmlBody: html || '<p>Vehicle statutory alert.</p>',
    body: 'Vehicle statutory alert.'
  });
}

function createDailyTrigger() {
  const triggers=ScriptApp.getProjectTriggers();
  triggers.forEach(t=>{
    if(t.getHandlerFunction()==='dailyVehicleExpiryCheck') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('dailyVehicleExpiryCheck')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function escape_(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
