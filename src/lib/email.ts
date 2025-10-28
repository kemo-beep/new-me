import { Resend } from 'resend';

// Lazy initialization of Resend client
let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set in environment variables. Please add it to your .env file.');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string;
  url: string;
}) {
  try {
    const client = getResendClient();
    const { data, error } = await client.emails.send({
      from: 'Magic Link <onboarding@resend.dev>',
      to: email,
      subject: 'Your Magic Link',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Your Magic Link</h1>
          <p>Click the button below to sign in to your account:</p>
          <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Sign In
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${url}</p>
          <p style="color: #6B7280; font-size: 14px; margin-top: 24px;">
            This link will expire in 5 minutes. If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending magic link email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending magic link email:', error);
    throw error;
  }
} 