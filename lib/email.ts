import "server-only";
import { Resend } from "resend";

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<{ sent: boolean }> {
  const resend = getResendClient();
  if (!resend) {
    // No provider configured (e.g. local dev without RESEND_API_KEY set).
    return { sent: false };
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "Betelino <onboarding@resend.com>";

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Resetează-ți parola Betelino",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #2f3e2e;">Resetează-ți parola</h2>
        <p>Am primit o cerere de resetare a parolei pentru contul tău Betelino.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #4a5d3a; color: #fff; text-decoration: none; border-radius: 8px;">
            Resetează parola
          </a>
        </p>
        <p>Linkul este valabil timp de o oră. Dacă nu ai cerut resetarea parolei, poți ignora acest email.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Trimiterea emailului de resetare a eșuat: ${error.message}`);
  }

  return { sent: true };
}
