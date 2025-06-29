import { brevoClient, sender } from './brevo.config.js';
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE
} from './emailTemplates.js';

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await brevoClient.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: "Verify your email",
      htmlContent: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    });
  } catch (error) {
    console.log("Error sending verification email:", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await brevoClient.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: "Welcome to our website",
      htmlContent: WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name),
    });
  } catch (error) {
    console.log("Error sending welcome email:", error);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const response = await brevoClient.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: "Reset your password",
      htmlContent: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
  } catch (error) {
    console.log("Error sending password reset email:", error);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const response = await brevoClient.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: "Password reset successful",
      htmlContent: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
  } catch (error) {
    console.log("Error sending reset success email:", error);
  }
};
