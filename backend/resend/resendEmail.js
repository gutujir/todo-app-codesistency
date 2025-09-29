import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: "TodoPro <onboarding@resend.dev>", // Use a verified sender!
      to,
      subject,
      html,
    });
    console.log("Resend API response:", data);
    return data;
  } catch (error) {
    console.error("Resend API error:", error);
    throw error;
  }
};
