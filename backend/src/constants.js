import "dotenv/config";

export const {
    //==========================
    PORT,
    FRONTEND_URL,
    JWT_SECRET,
  
    //==========================
    // DB SETTINGS
    //==========================
    DB_HOST,
    DB_NAME,
    DB_USER,
    DB_PASS,
  
    //==========================
    // EMAIL SETTINGS
    //==========================
     EMAIL_HOST,
     EMAIL_PORT,
     EMAIL_USER,
     EMAIL_PASS,
     SMTP_EMAIL,

    //==========================
    // PAYMENT SETTINGS
    //==========================
    STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY,


    //==========================
    // ADMIN SETTINGS
    //==========================
    ADMIN_EMAIL,
    ADMIN_PASSWORD,

  } = process.env;
  
