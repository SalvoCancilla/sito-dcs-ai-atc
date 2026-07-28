import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ORGANIZATION } from "@/lib/content";

export const metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "DCS AI ATC privacy policy: data collected, legal basis, retention, your rights (GDPR).",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy policy", path: "/legal/privacy" },
        ])}
      />
      <h1>Privacy policy</h1>
      <p>
        Last updated: June 2026. This notice is drafted in compliance with
        Regulation (EU) 2016/679 (GDPR) and describes how{" "}
        {ORGANIZATION.name} collects and processes your personal data.
      </p>

      <h2>1. Data controller</h2>
      <p>
        The data controller is {ORGANIZATION.name}. For any request regarding
        your data, you can write to{" "}
        <a href={`mailto:${ORGANIZATION.email}`}>{ORGANIZATION.email}</a>.
      </p>

      <h2>2. Data collected</h2>
      <ul>
        <li>
          <strong>Account:</strong> email address and cryptographic hash of the
          password, collected at registration to enable access to the account
          area and license management.
        </li>
        <li>
          <strong>License and devices:</strong> hardware fingerprint of the
          associated device (SHA-256 hash of the machine ID), custom label, and
          timestamp of the last access. The fingerprint does not contain
          identifying personal data.
        </li>
        <li>
          <strong>Payments:</strong> handled entirely by Stripe. We do not store
          card numbers, financial data, or transactions on our server. Stripe
          only communicates the payment status (succeeded / failed) and the
          amount to us.
        </li>
        <li>
          <strong>Game telemetry:</strong> all DCS telemetry (position, heading,
          radio frequencies, traffic status) is processed locally on your PC.
          No mission data is ever sent to our servers.
        </li>
        <li>
          <strong>Authentication logs:</strong> IP address and access
          timestamps, retained for 90 days for security and abuse prevention
          purposes.
        </li>
      </ul>

      <h2>3. Legal basis and purposes</h2>
      <ul>
        <li>
          <strong>Performance of contract</strong> (art. 6(1)(b)): account and
          license data are processed to provide you with the purchased product,
          manage associated devices, and verify the license.
        </li>
        <li>
          <strong>Legal obligation</strong> (art. 6(1)(c)): retention of
          authentication logs for security and tax obligations.
        </li>
        <li>
          <strong>Legitimate interest</strong> (art. 6(1)(f)): prevention of
          abuse, fraud, and attempts to breach the licensing mechanisms.
        </li>
      </ul>

      <h2>4. Retention</h2>
      <ul>
        <li>
          Account data: retained for the duration of the contractual
          relationship and until legal obligations are fulfilled (10 years for
          tax obligations).
        </li>
        <li>
          Authentication logs: 90 days from the last access.
        </li>
        <li>
          Device fingerprints: deleted upon device revocation or user request.
        </li>
      </ul>

      <h2>5. Data sharing</h2>
      <p>
        Your data is not sold or shared with third parties for commercial
        purposes. Payment data is handled by Stripe (appointed as a data
        processor). The licensing server is hosted on cloud infrastructure (EU
        provider) acting as a data processor under a signed DPA.
      </p>

      <h2>6. Your rights</h2>
      <p>
        In accordance with articles 15 to 22 of the GDPR, you have the right to:
      </p>
      <ul>
        <li>Access to your personal data (art. 15)</li>
        <li>Rectification of inaccurate data (art. 16)</li>
        <li>Erasure ("right to be forgotten", art. 17)</li>
        <li>Restriction of processing (art. 18)</li>
        <li>Data portability (art. 20)</li>
        <li>Objection to processing (art. 21)</li>
        <li>
          Lodge a complaint with the data protection authority of your country
        </li>
      </ul>
      <p>
        To exercise these rights, write to{" "}
        <a href={`mailto:${ORGANIZATION.email}`}>{ORGANIZATION.email}</a>.
        We will respond within 30 days.
      </p>

      <h2>7. Security</h2>
      <p>
        Passwords are stored as bcrypt hashes. Communications between client and
        server take place over HTTPS/TLS. Access to license data is protected by
        expiring JWT tokens. Hardware fingerprints are stored as SHA-256 hashes,
        which are non-reversible.
      </p>

      <h2>8. Changes to this notice</h2>
      <p>
        We reserve the right to update this notice to reflect changes in data
        processing practices or legal requirements. Material changes will be
        communicated via email to the address registered on your account.
      </p>
    </>
  );
}
