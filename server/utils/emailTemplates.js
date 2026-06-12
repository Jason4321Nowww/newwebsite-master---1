const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4200';

const logoBlock = `
  <div style="text-align:center;padding:24px 0 16px;">
    <div style="display:inline-block;background:#009d63;border-radius:12px;padding:10px 28px;">
      <span style="font-size:2rem;font-weight:900;color:#fff;letter-spacing:0.1em;font-family:Arial,sans-serif;">BKP</span>
    </div>
  </div>`;

const footerI18n = {
  de: 'Bitte nicht auf diese E-Mail antworten.',
  fr: 'Merci de ne pas répondre à cet e-mail.',
  it: 'Si prega di non rispondere a questa e-mail.',
  en: 'Please do not reply to this email.',
};

const footerOrgI18n = {
  de: 'Büezer und KMU Partei (BKP)',
  fr: 'Parti des Travailleurs et des PME (BKP)',
  it: 'Partito dei Lavoratori e delle PMI (BKP)',
  en: 'Workers and SME Party (BKP)',
};

const wrap = (content, lang = 'de') => {
  const noReply = footerI18n[lang] || footerI18n.de;
  return `
  <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:0;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
    ${logoBlock}
    <div style="padding:0 2rem 2rem;">
      ${content}
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e0e0e0;text-align:center;color:#aaa;font-size:0.78rem;font-family:sans-serif;">
        ${footerOrgI18n[lang] || footerOrgI18n.de} · <a href="${CLIENT_URL}" style="color:#009d63;text-decoration:none;">bkp.ch</a><br/>
        ${noReply}
      </div>
    </div>
  </div>`;
};

// ── Auth email translations ──────────────────────────────────────────────────
const authI18n = {
  de: {
    otp_subject:       'BKP-Konto bestätigen — Einmalcode',
    otp_title:         'E-Mail-Adresse bestätigen',
    otp_body:          (min) => `Verwenden Sie den folgenden Code, um Ihr BKP-Konto zu bestätigen. Er läuft in <strong>${min} Minuten</strong> ab.`,
    otp_ignore:        'Falls Sie kein BKP-Konto erstellt haben, können Sie diese E-Mail ignorieren.',
    welcome_subject:   'Willkommen bei BKP — Konto bestätigt',
    welcome_title:     (name) => `Willkommen bei BKP, ${name}!`,
    welcome_body:      'Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Ihr Konto wartet nun auf die Freigabe durch einen Administrator.',
    welcome_pending:   'Sie erhalten eine weitere E-Mail, sobald Ihr Konto aktiviert wird. Danach können Sie sich hier anmelden.',
    welcome_btn:       'Zur Anmeldung',
    welcome_ignore:    'Falls Sie sich nicht registriert haben, ignorieren Sie bitte diese E-Mail.',
    activated_subject: 'Ihr BKP-Konto wurde aktiviert',
    activated_title:   'Konto aktiviert!',
    activated_hi:      (name) => `Hallo <strong>${name}</strong>,`,
    activated_text:    'Ihr BKP-Konto wurde von einem Administrator überprüft und <strong>aktiviert</strong>. Sie können sich jetzt anmelden.',
    activated_btn:     'Jetzt anmelden',
    activated_footer:  'Bei Fragen wenden Sie sich bitte an Ihren Administrator.',
  },
  fr: {
    otp_subject:       'Confirmez votre compte BKP — Code unique',
    otp_title:         'Vérifiez votre adresse e-mail',
    otp_body:          (min) => `Utilisez le code ci-dessous pour vérifier votre compte BKP. Il expire dans <strong>${min} minutes</strong>.`,
    otp_ignore:        'Si vous n\'avez pas créé de compte BKP, vous pouvez ignorer cet e-mail.',
    welcome_subject:   'Bienvenue sur BKP — Compte confirmé',
    welcome_title:     (name) => `Bienvenue sur BKP, ${name} !`,
    welcome_body:      'Votre adresse e-mail a été vérifiée avec succès. Votre compte est en attente d\'approbation par un administrateur.',
    welcome_pending:   'Vous recevrez un autre e-mail dès que votre compte sera activé. Vous pourrez alors vous connecter via le lien ci-dessous.',
    welcome_btn:       'Se connecter',
    welcome_ignore:    'Si vous ne vous êtes pas inscrit, veuillez ignorer cet e-mail.',
    activated_subject: 'Votre compte BKP a été activé',
    activated_title:   'Compte activé !',
    activated_hi:      (name) => `Bonjour <strong>${name}</strong>,`,
    activated_text:    'Votre compte BKP a été examiné et <strong>activé</strong> par un administrateur. Vous pouvez maintenant vous connecter.',
    activated_btn:     'Se connecter maintenant',
    activated_footer:  'Pour toute question, veuillez contacter votre administrateur.',
  },
  it: {
    otp_subject:       'Conferma il tuo account BKP — Codice unico',
    otp_title:         'Verifica il tuo indirizzo e-mail',
    otp_body:          (min) => `Usa il codice sottostante per verificare il tuo account BKP. Scade tra <strong>${min} minuti</strong>.`,
    otp_ignore:        'Se non hai creato un account BKP, puoi ignorare questa e-mail.',
    welcome_subject:   'Benvenuto su BKP — Account confermato',
    welcome_title:     (name) => `Benvenuto su BKP, ${name}!`,
    welcome_body:      'Il tuo indirizzo e-mail è stato verificato con successo. Il tuo account è in attesa di approvazione da parte di un amministratore.',
    welcome_pending:   'Riceverai un\'altra e-mail non appena il tuo account verrà attivato. Potrai quindi accedere tramite il link sottostante.',
    welcome_btn:       'Accedi',
    welcome_ignore:    'Se non ti sei registrato, ignora questa e-mail.',
    activated_subject: 'Il tuo account BKP è stato attivato',
    activated_title:   'Account attivato!',
    activated_hi:      (name) => `Ciao <strong>${name}</strong>,`,
    activated_text:    'Il tuo account BKP è stato esaminato e <strong>attivato</strong> da un amministratore. Ora puoi accedere.',
    activated_btn:     'Accedi ora',
    activated_footer:  'Per qualsiasi domanda, contatta il tuo amministratore.',
  },
  en: {
    otp_subject:       'Verify your BKP account — One-Time Code',
    otp_title:         'Verify your email',
    otp_body:          (min) => `Use the code below to verify your BKP account. It expires in <strong>${min} minutes</strong>.`,
    otp_ignore:        'If you did not create a BKP account, you can safely ignore this email.',
    welcome_subject:   'Welcome to BKP — Account confirmed',
    welcome_title:     (name) => `Welcome to BKP, ${name}!`,
    welcome_body:      'Your email has been successfully verified. Your account is now pending admin approval.',
    welcome_pending:   'You will receive another email as soon as an administrator activates your account. Once active, you can sign in at the link below.',
    welcome_btn:       'Go to Sign In',
    welcome_ignore:    'If you did not register, please ignore this email.',
    activated_subject: 'Your BKP account has been activated',
    activated_title:   'Account Activated!',
    activated_hi:      (name) => `Hi <strong>${name}</strong>,`,
    activated_text:    'Your BKP account has been reviewed and <strong>activated</strong> by an administrator. You can now sign in and access all features available to your role.',
    activated_btn:     'Sign In Now',
    activated_footer:  'If you have any questions, please contact your administrator.',
  },
};

const getA = (lang) => authI18n[lang] || authI18n.de;

// ── OTP verification email ──────────────────────────────────────────────────
const otpEmail = (otp, expiryMinutes, lang = 'de') => {
  const t = getA(lang);
  return {
    subject: t.otp_subject,
    html: wrap(`
      <h2 style="color:#009d63;margin:0 0 0.5rem;">${t.otp_title}</h2>
      <p style="color:#444;">${t.otp_body(expiryMinutes)}</p>
      <div style="font-size:2.2rem;font-weight:700;letter-spacing:0.3em;color:#1565c0;background:#e3f2fd;padding:16px 28px;border-radius:8px;display:inline-block;margin:12px 0;">
        ${otp}
      </div>
      <p style="color:#888;font-size:0.82rem;margin-top:20px;">${t.otp_ignore}</p>`, lang),
  };
};

// ── Welcome email (sent after OTP verified) ─────────────────────────────────
const welcomeEmail = (username, lang = 'de') => {
  const t = getA(lang);
  return {
    subject: t.welcome_subject,
    html: wrap(`
      <h2 style="color:#009d63;margin:0 0 0.5rem;">${t.welcome_title(username)}</h2>
      <p style="color:#444;">${t.welcome_body}</p>
      <p style="color:#444;">${t.welcome_pending}</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${CLIENT_URL}/signin"
           style="display:inline-block;padding:12px 32px;background:#009d63;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:1rem;">
          ${t.welcome_btn}
        </a>
      </div>
      <p style="color:#888;font-size:0.82rem;">${t.welcome_ignore}</p>`, lang),
  };
};

// ── Invite email translations ────────────────────────────────────────────────
const inviteI18n = {
  de: {
    admin_subject:    'Einladung zur BKP-Administrationskonsole',
    admin_title:      'Admin-Einladung',
    admin_body:       (role) => `Sie wurden eingeladen, der <strong>BKP-Administrationskonsole</strong> als <strong>${role}</strong> beizutreten.`,
    admin_expire:     (h) => `Klicken Sie auf die Schaltfläche unten, um die Einladung anzunehmen. Der Link läuft in <strong>${h} Stunden</strong> ab.`,
    admin_btn:        'Einladung annehmen',
    admin_ignore:     'Falls Sie diese Einladung nicht erwartet haben, können Sie diese E-Mail ignorieren.',
    user_subject:     'Einladung zur BKP-Mitgliedschaft',
    user_title:       'BKP-Mitgliedschaftseinladung',
    user_body:        (role) => `Sie wurden eingeladen, <strong>BKP</strong> als <strong>${role}</strong> beizutreten.`,
    user_otp_label:   'Ihr Einmalcode (OTP) für die Registrierung:',
    user_key_label:   'Ihr Registrierungsschlüssel:',
    user_expire:      (h) => `Klicken Sie auf die Schaltfläche unten, um Ihre Registrierung abzuschließen.<br/>Der Link läuft in <strong>${h} Stunden</strong> ab.`,
    user_btn:         'Registrierung abschließen',
    user_ignore:      'Falls Sie diese Einladung nicht erwartet haben, können Sie diese E-Mail ignorieren.',
    key_label:        'Registrierungsschlüssel',
    key_note:         'Bewahren Sie diesen Schlüssel sicher auf. Er wird während der Registrierung benötigt.',
  },
  fr: {
    admin_subject:    'Invitation à rejoindre l\'administration BKP',
    admin_title:      'Invitation administrateur',
    admin_body:       (role) => `Vous avez été invité à rejoindre le <strong>panneau d\'administration BKP</strong> en tant que <strong>${role}</strong>.`,
    admin_expire:     (h) => `Cliquez sur le bouton ci-dessous pour accepter. Le lien expire dans <strong>${h} heures</strong>.`,
    admin_btn:        'Accepter l\'invitation',
    admin_ignore:     'Si vous n\'attendiez pas cette invitation, vous pouvez ignorer cet e-mail.',
    user_subject:     'Invitation à rejoindre BKP',
    user_title:       'Invitation à l\'adhésion BKP',
    user_body:        (role) => `Vous avez été invité à rejoindre <strong>BKP</strong> en tant que <strong>${role}</strong>.`,
    user_otp_label:   'Votre code unique (OTP) pour l\'inscription :',
    user_key_label:   'Votre clé d\'inscription :',
    user_expire:      (h) => `Cliquez sur le bouton ci-dessous pour finaliser votre inscription.<br/>Le lien expire dans <strong>${h} heures</strong>.`,
    user_btn:         'Finaliser l\'inscription',
    user_ignore:      'Si vous n\'attendiez pas cette invitation, vous pouvez ignorer cet e-mail.',
    key_label:        'Clé d\'inscription',
    key_note:         'Conservez cette clé en lieu sûr. Elle sera nécessaire lors de l\'inscription.',
  },
  it: {
    admin_subject:    'Invito al pannello di amministrazione BKP',
    admin_title:      'Invito amministratore',
    admin_body:       (role) => `Sei stato invitato a unirti al <strong>pannello di amministrazione BKP</strong> come <strong>${role}</strong>.`,
    admin_expire:     (h) => `Clicca il pulsante qui sotto per accettare. Il link scade tra <strong>${h} ore</strong>.`,
    admin_btn:        'Accetta l\'invito',
    admin_ignore:     'Se non ti aspettavi questo invito, puoi ignorare questa e-mail.',
    user_subject:     'Invito all\'adesione BKP',
    user_title:       'Invito all\'adesione BKP',
    user_body:        (role) => `Sei stato invitato a unirti a <strong>BKP</strong> come <strong>${role}</strong>.`,
    user_otp_label:   'Il tuo codice unico (OTP) per la registrazione:',
    user_key_label:   'La tua chiave di registrazione:',
    user_expire:      (h) => `Clicca il pulsante qui sotto per completare la registrazione.<br/>Il link scade tra <strong>${h} ore</strong>.`,
    user_btn:         'Completa la registrazione',
    user_ignore:      'Se non ti aspettavi questo invito, puoi ignorare questa e-mail.',
    key_label:        'Chiave di registrazione',
    key_note:         'Conserva questa chiave al sicuro. Sarà necessaria durante la registrazione.',
  },
  en: {
    admin_subject:    'Invitation to join the BKP Admin Panel',
    admin_title:      'Admin Invitation',
    admin_body:       (role) => `You have been invited to join the <strong>BKP Admin Panel</strong> as <strong>${role}</strong>.`,
    admin_expire:     (h) => `Click the button below to accept. The link expires in <strong>${h} hours</strong>.`,
    admin_btn:        'Accept Invitation',
    admin_ignore:     'If you did not expect this invitation, you can safely ignore this email.',
    user_subject:     'Invitation to join BKP',
    user_title:       'BKP Membership Invitation',
    user_body:        (role) => `You have been invited to join <strong>BKP</strong> as <strong>${role}</strong>.`,
    user_otp_label:   'Your one-time code (OTP) for registration:',
    user_key_label:   'Your registration key:',
    user_expire:      (h) => `Click the button below to complete your registration.<br/>The link expires in <strong>${h} hours</strong>.`,
    user_btn:         'Complete Registration',
    user_ignore:      'If you did not expect this invitation, you can safely ignore this email.',
    key_label:        'Registration Key',
    key_note:         'Keep this key safe. You will need it during registration.',
  },
};

const getI = (lang) => inviteI18n[lang] || inviteI18n.de;

const regKeyBlock = (key, label, note) => `
  <div style="background:#f0faf5;border-left:4px solid #009d63;padding:16px 20px;border-radius:0 8px 8px 0;margin:16px 0;">
    <p style="margin:0 0 6px;color:#555;font-size:0.78rem;text-transform:uppercase;letter-spacing:.06em;">${label}</p>
    <p style="margin:0 0 8px;font-size:1.4rem;font-weight:700;font-family:monospace;color:#009d63;letter-spacing:.12em;">${key}</p>
    <p style="margin:0;color:#888;font-size:0.8rem;">${note}</p>
  </div>`;

// ── Admin invite email ───────────────────────────────────────────────────────
const adminInviteEmail = (roleName, inviteUrl, expiryHours, lang = 'de', registrationKey = null) => {
  const t = getI(lang);
  return {
    subject: t.admin_subject,
    html: wrap(`
      <h2 style="color:#009d63;margin:0 0 0.5rem;">${t.admin_title}</h2>
      <p style="color:#444;">${t.admin_body(roleName)}</p>
      <p style="color:#444;">${t.admin_expire(expiryHours)}</p>
      ${registrationKey ? regKeyBlock(registrationKey, t.key_label, t.key_note) : ''}
      <div style="text-align:center;margin:24px 0;">
        <a href="${inviteUrl}"
           style="display:inline-block;padding:12px 28px;background:#009d63;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
          ${t.admin_btn}
        </a>
      </div>
      <p style="color:#888;font-size:0.82rem;margin-top:20px;">${t.admin_ignore}</p>`, lang),
  };
};

// ── User invite email ────────────────────────────────────────────────────────
const userInviteEmail = (roleName, otp, inviteUrl, expiryHours, lang = 'de', registrationKey = null) => {
  const t = getI(lang);
  return {
    subject: t.user_subject,
    html: wrap(`
      <h2 style="color:#009d63;margin:0 0 0.5rem;">${t.user_title}</h2>
      <p style="color:#444;">${t.user_body(roleName)}</p>
      <p style="color:#444;">${t.user_otp_label}</p>
      <div style="font-size:2rem;font-weight:700;letter-spacing:0.25em;color:#1565c0;background:#e3f2fd;padding:14px 28px;border-radius:8px;display:inline-block;margin:10px 0;">
        ${otp}
      </div>
      ${registrationKey ? regKeyBlock(registrationKey, t.key_label, t.key_note) : ''}
      <p style="color:#444;">${t.user_expire(expiryHours)}</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${inviteUrl}"
           style="display:inline-block;padding:12px 28px;background:#009d63;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
          ${t.user_btn}
        </a>
      </div>
      <p style="color:#888;font-size:0.82rem;margin-top:20px;">${t.user_ignore}</p>`, lang),
  };
};

// ── Registration key email ───────────────────────────────────────────────────
const regKeyI18n = {
  de: {
    subject:  'BKP — Ihr Registrierungsschlüssel',
    title:    'BKP Registrierungsschlüssel',
    body:     'Sie wurden eingeladen, sich auf der BKP-Website zu registrieren. Verwenden Sie den folgenden Schlüssel beim Erstellen Ihres Kontos.',
    label:    'Registrierungsschlüssel',
    btn:      'Jetzt registrieren',
    footer:   'Bewahren Sie diesen Schlüssel sicher auf und teilen Sie ihn nicht mit anderen.',
  },
  fr: {
    subject:  'BKP — Votre clé d\'inscription',
    title:    'Clé d\'inscription BKP',
    body:     'Vous avez été invité à vous inscrire sur le site BKP. Utilisez la clé ci-dessous lors de la création de votre compte.',
    label:    'Clé d\'inscription',
    btn:      'S\'inscrire maintenant',
    footer:   'Conservez cette clé en lieu sûr et ne la partagez pas avec d\'autres personnes.',
  },
  it: {
    subject:  'BKP — La tua chiave di registrazione',
    title:    'Chiave di registrazione BKP',
    body:     'Sei stato invitato a registrarti sul sito BKP. Usa la chiave seguente durante la creazione del tuo account.',
    label:    'Chiave di registrazione',
    btn:      'Registrati ora',
    footer:   'Conserva questa chiave in un luogo sicuro e non condividerla con altri.',
  },
  en: {
    subject:  'BKP — Your Registration Key',
    title:    'BKP Registration Key',
    body:     'You have been invited to register on the BKP website. Use the key below when creating your account.',
    label:    'Registration Key',
    btn:      'Register Now',
    footer:   'Keep this key safe and do not share it with others.',
  },
};

const registrationKeyEmail = (key, lang = 'de') => {
  const t = regKeyI18n[lang] || regKeyI18n.de;
  return {
    subject: t.subject,
    html: wrap(`
      <h2 style="color:#009d63;margin:0 0 0.5rem;">${t.title}</h2>
      <p style="color:#444;">${t.body}</p>
      <div style="background:#f0faf5;border-left:4px solid #009d63;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
        <p style="margin:0 0 6px;color:#555;font-size:0.78rem;text-transform:uppercase;letter-spacing:.06em;">${t.label}</p>
        <p style="margin:0;font-size:1.4rem;font-weight:700;font-family:monospace;color:#009d63;letter-spacing:.12em;">${key}</p>
      </div>
      <div style="text-align:center;margin:24px 0;">
        <a href="${CLIENT_URL}/signup?lang=${lang}"
           style="display:inline-block;padding:12px 32px;background:#009d63;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:1rem;">
          ${t.btn}
        </a>
      </div>
      <p style="color:#888;font-size:0.82rem;">${t.footer}</p>`, lang),
  };
};

// ── Account activated email ──────────────────────────────────────────────────
const accountActivatedEmail = (name, signinUrl, lang = 'de') => {
  const t = getA(lang);
  return {
    subject: t.activated_subject,
    html: wrap(`
      <h2 style="color:#009d63;margin:0 0 0.5rem;">${t.activated_title}</h2>
      <p style="color:#444;">${t.activated_hi(name)}</p>
      <p style="color:#444;">${t.activated_text}</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${signinUrl}"
           style="display:inline-block;padding:12px 32px;background:#009d63;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:1rem;">
          ${t.activated_btn}
        </a>
      </div>
      <p style="color:#888;font-size:0.82rem;">${t.activated_footer}</p>`, lang),
  };
};

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

      <p style="color:#888;font-size:0.82rem;margin-top:20px;">${t.confirmed_note}</p>`, lang),
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
      <p style="color:#444;">${t.shipped_thanks}</p>`, lang),
  };
};

// ── Order cancelled email ────────────────────────────────────────────────────
const orderCancelledEmail = (customerName, invoiceNumber, lang = 'de') => {
  const t = getT(lang);
  return {
    subject: t.cancelled_subject(invoiceNumber),
    html: wrap(`
      <h2 style="color:#c0392b;margin:0 0 0.5rem;">${t.cancelled_title}</h2>
      <p style="color:#444;">${t.cancelled_body(customerName, invoiceNumber)}</p>`, lang),
  };
};

module.exports = {
  otpEmail, welcomeEmail, adminInviteEmail, userInviteEmail,
  accountActivatedEmail, registrationKeyEmail,
  orderConfirmationEmail, orderShippedEmail, orderCancelledEmail,
};
