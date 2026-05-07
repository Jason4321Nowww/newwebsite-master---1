const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4200';

const logoBlock = `
  <div style="text-align:center;padding:24px 0 16px;">
    <div style="display:inline-block;background:#009d63;border-radius:12px;padding:10px 28px;">
      <span style="font-size:2rem;font-weight:900;color:#fff;letter-spacing:0.1em;font-family:Arial,sans-serif;">BKP</span>
    </div>
  </div>`;

const footer = `
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e0e0e0;text-align:center;color:#aaa;font-size:0.78rem;font-family:sans-serif;">
    Bundesverband Kulturelle Partnerschaft · <a href="${CLIENT_URL}" style="color:#009d63;text-decoration:none;">bkp.ch</a><br/>
    Bitte nicht auf diese E-Mail antworten.
  </div>`;

const wrap = (content) => `
  <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:0;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
    ${logoBlock}
    <div style="padding:0 2rem 2rem;">
      ${content}
      ${footer}
    </div>
  </div>`;

// ── OTP verification email ──────────────────────────────────────────────────
const otpEmail = (otp, expiryMinutes) => ({
  subject: 'Verify your BKP account — One-Time Code',
  html: wrap(`
    <h2 style="color:#009d63;margin:0 0 0.5rem;">Verify your email</h2>
    <p style="color:#444;">Use the code below to verify your BKP account. It expires in <strong>${expiryMinutes} minutes</strong>.</p>
    <div style="font-size:2.2rem;font-weight:700;letter-spacing:0.3em;color:#1565c0;background:#e3f2fd;padding:16px 28px;border-radius:8px;display:inline-block;margin:12px 0;">
      ${otp}
    </div>
    <p style="color:#888;font-size:0.82rem;margin-top:20px;">
      If you did not create a BKP account, you can safely ignore this email.
    </p>`),
});

// ── Welcome email (sent after OTP verified) ─────────────────────────────────
const welcomeEmail = (username) => ({
  subject: 'Welcome to BKP — Account confirmed',
  html: wrap(`
    <h2 style="color:#009d63;margin:0 0 0.5rem;">Welcome to BKP, ${username}!</h2>
    <p style="color:#444;">
      Your email has been successfully verified. Your account is now pending admin approval.
    </p>
    <p style="color:#444;">
      You will receive another email as soon as an administrator activates your account.
      Once active, you can sign in at the link below.
    </p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${CLIENT_URL}/signin"
         style="display:inline-block;padding:12px 32px;background:#009d63;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:1rem;">
        Go to Sign In
      </a>
    </div>
    <p style="color:#888;font-size:0.82rem;">
      If you did not register, please ignore this email.
    </p>`),
});

// ── Admin invite email ───────────────────────────────────────────────────────
const adminInviteEmail = (roleName, inviteUrl, expiryHours) => ({
  subject: 'Invitation to join the BKP Admin Panel',
  html: wrap(`
    <h2 style="color:#009d63;margin:0 0 0.5rem;">Admin Invitation</h2>
    <p style="color:#444;">
      You have been invited to join the <strong>BKP Admin Panel</strong> as <strong>${roleName}</strong>.
    </p>
    <p style="color:#444;">Click the button below to accept. The link expires in <strong>${expiryHours} hours</strong>.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${inviteUrl}"
         style="display:inline-block;padding:12px 28px;background:#009d63;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
        Accept Invitation
      </a>
    </div>
    <p style="color:#888;font-size:0.82rem;margin-top:20px;">
      If you did not expect this, you can safely ignore this email.
    </p>`),
});

// ── User invite email ────────────────────────────────────────────────────────
const userInviteEmail = (roleName, otp, inviteUrl, expiryHours) => ({
  subject: 'Invitation to join BKP',
  html: wrap(`
    <h2 style="color:#009d63;margin:0 0 0.5rem;">BKP Membership Invitation</h2>
    <p style="color:#444;">
      You have been invited to join <strong>BKP</strong> as <strong>${roleName}</strong>.
    </p>
    <p style="color:#444;">Use this one-time code when you register:</p>
    <div style="font-size:2rem;font-weight:700;letter-spacing:0.25em;color:#1565c0;background:#e3f2fd;padding:14px 28px;border-radius:8px;display:inline-block;margin:10px 0;">
      ${otp}
    </div>
    <p style="color:#444;">Click the button below to complete your registration.<br/>
       The link expires in <strong>${expiryHours} hours</strong>.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${inviteUrl}"
         style="display:inline-block;padding:12px 28px;background:#009d63;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
        Complete Registration
      </a>
    </div>
    <p style="color:#888;font-size:0.82rem;margin-top:20px;">
      If you did not expect this invitation, you can safely ignore this email.
    </p>`),
});

// ── Account activated email ──────────────────────────────────────────────────
const accountActivatedEmail = (name, signinUrl) => ({
  subject: 'Your BKP account has been activated',
  html: wrap(`
    <h2 style="color:#009d63;margin:0 0 0.5rem;">Account Activated!</h2>
    <p style="color:#444;">Hi <strong>${name}</strong>,</p>
    <p style="color:#444;">
      Great news — your BKP account has been reviewed and <strong>activated</strong> by an administrator.
      You can now sign in and access all features available to your role.
    </p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${signinUrl}"
         style="display:inline-block;padding:12px 32px;background:#009d63;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:1rem;">
        Sign In Now
      </a>
    </div>
    <p style="color:#888;font-size:0.82rem;">
      If you have any questions, please contact your administrator.
    </p>`),
});

// ── Order email translations ─────────────────────────────────────────────────
const orderI18n = {
  de: {
    confirmed_subject: (inv) => `BKP Bestellbestätigung — Bestellnummer #${inv}`,
    confirmed_title: 'Bestellung bestätigt!',
    greeting: (name) => `Hallo <strong>${name}</strong>,`,
    confirmed_intro: 'Vielen Dank für Ihre Bestellung. Wir haben Ihre Anfrage erhalten und werden sie bearbeiten, sobald Ihre Banküberweisung eingegangen ist.',
    invoice_label: 'Bestellnummer',
    payment_label: 'Kaufnummer (Zahlungsreferenz)',
    items_header: 'Bestellte Artikel',
    col_product: 'Produkt', col_qty: 'Menge', col_price: 'Preis', col_total: 'Gesamt',
    bank_header: 'Bankverbindung',
    bank_holder: 'Kontoinhaber', bank_iban: 'IBAN', bank_bank: 'Bank',
    bank_address: 'Adresse', bank_currency: 'Währung', bank_amount: 'Betrag',
    confirmed_note: 'Bitte verwenden Sie die Kaufnummer als Verwendungszweck bei Ihrer Banküberweisung, damit wir Ihre Zahlung zuordnen können. Sie erhalten eine weitere Benachrichtigung, sobald Ihre Zahlung bestätigt ist.',
    shipped_subject: (inv) => `BKP — Ihre Bestellung #${inv} wurde versandt`,
    shipped_title: 'Ihre Bestellung ist unterwegs!',
    shipped_body: (name, inv) => `Hallo <strong>${name}</strong>,<br/><br/>Ihre Bestellung <strong>#${inv}</strong> wurde soeben versandt. Sie sollten Ihre Artikel in Kürze erhalten.`,
    shipped_thanks: 'Vielen Dank für Ihr Vertrauen in BKP!',
    cancelled_subject: (inv) => `BKP — Bestellung #${inv} storniert`,
    cancelled_title: 'Bestellung storniert',
    cancelled_body: (name, inv) => `Hallo <strong>${name}</strong>,<br/><br/>Ihre Bestellung <strong>#${inv}</strong> wurde storniert. Falls Sie Fragen haben, kontaktieren Sie uns bitte.`,
  },
  fr: {
    confirmed_subject: (inv) => `BKP Confirmation de commande — N° #${inv}`,
    confirmed_title: 'Commande confirmée !',
    greeting: (name) => `Bonjour <strong>${name}</strong>,`,
    confirmed_intro: 'Merci pour votre commande. Nous avons bien reçu votre demande et la traiterons dès confirmation de votre virement bancaire.',
    invoice_label: 'Numéro de commande',
    payment_label: 'Numéro d\'achat (référence de paiement)',
    items_header: 'Articles commandés',
    col_product: 'Produit', col_qty: 'Qté', col_price: 'Prix', col_total: 'Total',
    bank_header: 'Coordonnées bancaires',
    bank_holder: 'Titulaire', bank_iban: 'IBAN', bank_bank: 'Banque',
    bank_address: 'Adresse', bank_currency: 'Devise', bank_amount: 'Montant',
    confirmed_note: 'Veuillez indiquer le numéro d\'achat comme référence lors de votre virement bancaire. Vous recevrez une notification dès confirmation du paiement.',
    shipped_subject: (inv) => `BKP — Votre commande #${inv} a été expédiée`,
    shipped_title: 'Votre commande est en route !',
    shipped_body: (name, inv) => `Bonjour <strong>${name}</strong>,<br/><br/>Votre commande <strong>#${inv}</strong> vient d'être expédiée. Vous devriez la recevoir prochainement.`,
    shipped_thanks: 'Merci pour votre confiance en BKP !',
    cancelled_subject: (inv) => `BKP — Commande #${inv} annulée`,
    cancelled_title: 'Commande annulée',
    cancelled_body: (name, inv) => `Bonjour <strong>${name}</strong>,<br/><br/>Votre commande <strong>#${inv}</strong> a été annulée. Si vous avez des questions, n'hésitez pas à nous contacter.`,
  },
  it: {
    confirmed_subject: (inv) => `BKP Conferma ordine — N. #${inv}`,
    confirmed_title: 'Ordine confermato!',
    greeting: (name) => `Ciao <strong>${name}</strong>,`,
    confirmed_intro: 'Grazie per il tuo ordine. Abbiamo ricevuto la tua richiesta e la elaboreremo non appena il bonifico bancario sarà confermato.',
    invoice_label: 'Numero ordine',
    payment_label: 'Numero acquisto (riferimento pagamento)',
    items_header: 'Articoli ordinati',
    col_product: 'Prodotto', col_qty: 'Qtà', col_price: 'Prezzo', col_total: 'Totale',
    bank_header: 'Dati bancari',
    bank_holder: 'Intestatario', bank_iban: 'IBAN', bank_bank: 'Banca',
    bank_address: 'Indirizzo', bank_currency: 'Valuta', bank_amount: 'Importo',
    confirmed_note: 'Utilizzare il numero acquisto come causale del bonifico bancario. Riceverà un\'ulteriore notifica alla conferma del pagamento.',
    shipped_subject: (inv) => `BKP — Il tuo ordine #${inv} è stato spedito`,
    shipped_title: 'Il tuo ordine è in viaggio!',
    shipped_body: (name, inv) => `Ciao <strong>${name}</strong>,<br/><br/>Il tuo ordine <strong>#${inv}</strong> è stato appena spedito. Lo riceverai a breve.`,
    shipped_thanks: 'Grazie per la tua fiducia in BKP!',
    cancelled_subject: (inv) => `BKP — Ordine #${inv} annullato`,
    cancelled_title: 'Ordine annullato',
    cancelled_body: (name, inv) => `Ciao <strong>${name}</strong>,<br/><br/>Il tuo ordine <strong>#${inv}</strong> è stato annullato. Per qualsiasi domanda, contattateci.`,
  },
  en: {
    confirmed_subject: (inv) => `BKP Order Confirmation — Invoice #${inv}`,
    confirmed_title: 'Order Confirmed!',
    greeting: (name) => `Hi <strong>${name}</strong>,`,
    confirmed_intro: 'Thank you for your order. We have received your request and will process it once your bank transfer is confirmed.',
    invoice_label: 'Invoice Number',
    payment_label: 'Payment Number / Kaufnummer',
    items_header: 'Items Ordered',
    col_product: 'Product', col_qty: 'Qty', col_price: 'Price', col_total: 'Total',
    bank_header: 'Bank Transfer Details',
    bank_holder: 'Account Holder', bank_iban: 'IBAN', bank_bank: 'Bank',
    bank_address: 'Address', bank_currency: 'Currency', bank_amount: 'Amount',
    confirmed_note: 'Please use the payment number as the reference when making your bank transfer so we can match your payment. You will receive a further notification once your payment is confirmed.',
    shipped_subject: (inv) => `BKP — Your order #${inv} has been shipped`,
    shipped_title: 'Your order is on its way!',
    shipped_body: (name, inv) => `Hi <strong>${name}</strong>,<br/><br/>Your order <strong>#${inv}</strong> has just been shipped. You should receive your items shortly.`,
    shipped_thanks: 'Thank you for your trust in BKP!',
    cancelled_subject: (inv) => `BKP — Order #${inv} cancelled`,
    cancelled_title: 'Order Cancelled',
    cancelled_body: (name, inv) => `Hi <strong>${name}</strong>,<br/><br/>Your order <strong>#${inv}</strong> has been cancelled. If you have any questions, please contact us.`,
  },
};

const getT = (lang) => orderI18n[lang] || orderI18n.de;

// ── Order confirmation email ─────────────────────────────────────────────────
const orderConfirmationEmail = (customerName, invoiceNumber, paymentNumber, items, total, address, lang = 'de') => {
  const t = getT(lang);

  const itemRows = items.map(i =>
    `<tr>
       <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;">${i.name}</td>
       <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:center;">${i.quantity}</td>
       <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:right;">CHF ${(i.price * i.quantity).toFixed(2)}</td>
     </tr>`
  ).join('');

  const bankIban    = process.env.BANK_IBAN    || 'CH60 0900 0000 1581 0867 8';
  const bankHolder  = process.env.BANK_HOLDER  || 'Büezer und KMU Partei (BKP)';
  const bankName    = process.env.BANK_NAME    || 'PostFinance AG';
  const bankAddress = process.env.BANK_ADDRESS || 'Zürichstrasse 23, 8607 Aathal-Seegräben';

  return {
    subject: t.confirmed_subject(invoiceNumber),
    html: wrap(`
      <h2 style="color:#009d63;margin:0 0 0.5rem;">${t.confirmed_title}</h2>
      <p style="color:#444;">${t.greeting(customerName)}</p>
      <p style="color:#444;">${t.confirmed_intro}</p>

      <div style="background:#f8f9fa;border-radius:8px;padding:14px 18px;margin:18px 0;">
        <p style="margin:0 0 4px;color:#555;font-size:0.82rem;text-transform:uppercase;letter-spacing:.05em;">${t.invoice_label}</p>
        <p style="margin:0 0 12px;font-size:1.2rem;font-weight:700;color:#333;letter-spacing:.1em;">${invoiceNumber}</p>
        <p style="margin:0 0 4px;color:#555;font-size:0.82rem;text-transform:uppercase;letter-spacing:.05em;">${t.payment_label}</p>
        <p style="margin:0;font-size:1.3rem;font-weight:700;color:#1565c0;letter-spacing:.15em;font-family:monospace;">${paymentNumber}</p>
      </div>

      <h4 style="color:#333;margin:18px 0 8px;">${t.items_header}</h4>
      <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
        <thead>
          <tr style="background:#f0f0f0;">
            <th style="padding:6px 8px;text-align:left;">${t.col_product}</th>
            <th style="padding:6px 8px;text-align:center;">${t.col_qty}</th>
            <th style="padding:6px 8px;text-align:right;">${t.col_price}</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:8px;font-weight:700;text-align:right;">${t.col_total}:</td>
            <td style="padding:8px;font-weight:700;text-align:right;color:#009d63;">CHF ${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <h4 style="color:#333;margin:18px 0 8px;">${t.bank_header}</h4>
      <div style="background:#f0faf5;border-left:4px solid #009d63;padding:12px 16px;border-radius:0 6px 6px 0;font-size:0.9rem;">
        <p style="margin:2px 0;"><strong>${t.bank_holder}:</strong> ${bankHolder}</p>
        <p style="margin:2px 0;"><strong>${t.bank_iban}:</strong> <span style="font-family:monospace;">${bankIban}</span></p>
        <p style="margin:2px 0;"><strong>${t.bank_bank}:</strong> ${bankName}</p>
        <p style="margin:2px 0;"><strong>${t.bank_address}:</strong> ${bankAddress}</p>
        <p style="margin:2px 0;"><strong>${t.bank_currency}:</strong> CHF</p>
        <p style="margin:2px 0;"><strong>${t.bank_amount}:</strong> <strong>CHF ${total.toFixed(2)}</strong></p>
      </div>

      <p style="color:#888;font-size:0.82rem;margin-top:20px;">${t.confirmed_note}</p>`),
  };
};

// ── Order shipped email ──────────────────────────────────────────────────────
const orderShippedEmail = (customerName, invoiceNumber, lang = 'de') => {
  const t = getT(lang);
  return {
    subject: t.shipped_subject(invoiceNumber),
    html: wrap(`
      <h2 style="color:#009d63;margin:0 0 0.5rem;">${t.shipped_title}</h2>
      <p style="color:#444;">${t.shipped_body(customerName, invoiceNumber)}</p>
      <p style="color:#444;">${t.shipped_thanks}</p>`),
  };
};

// ── Order cancelled email ────────────────────────────────────────────────────
const orderCancelledEmail = (customerName, invoiceNumber, lang = 'de') => {
  const t = getT(lang);
  return {
    subject: t.cancelled_subject(invoiceNumber),
    html: wrap(`
      <h2 style="color:#c0392b;margin:0 0 0.5rem;">${t.cancelled_title}</h2>
      <p style="color:#444;">${t.cancelled_body(customerName, invoiceNumber)}</p>`),
  };
};

module.exports = {
  otpEmail, welcomeEmail, adminInviteEmail, userInviteEmail,
  accountActivatedEmail, orderConfirmationEmail, orderShippedEmail, orderCancelledEmail,
};
