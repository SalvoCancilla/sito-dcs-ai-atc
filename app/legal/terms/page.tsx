import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ORGANIZATION, PRICE } from "@/lib/content";

export const metadata = pageMetadata({
  title: "Terms of service",
  description:
    "DCS AI ATC terms of service: license, updates, refunds, acceptable use, liability.",
  path: "/legal/terms",
});

const MAX_DEVICES = 2;

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Terms of service", path: "/legal/terms" },
        ])}
      />
      <h1>Terms of service</h1>
      <p>
        Last updated: June 2026. By downloading, installing, or using{" "}
        {ORGANIZATION.name} you accept these terms. If you do not accept them, do
        not use the software.
      </p>

      <h2>1. License</h2>
      <p>
        Purchasing {ORGANIZATION.name} ({PRICE.currency}
        {PRICE.amount}, perpetual license) grants a non-exclusive,
        non-transferable, and revocable license to use the software on a maximum
        of{" "}
        {MAX_DEVICES} associated devices simultaneously. The license is
        perpetual for the version current at the time of purchase.
      </p>

      <h2>2. Updates</h2>
      <p>
        The license includes 1 year of updates from the date of purchase.
        Updates released within that period are included and usable perpetually.
        Updates after the first year are optional and available at a reduced
        price. You are not required to purchase them to continue using the
        version you own.
      </p>

      <h2>3. System requirements</h2>
      <ul>
        <li>Operating system: Windows 10/11 (64-bit)</li>
        <li>DCS World (Stable or Open Beta) installed — not included</li>
        <li>
          GPU with at least 6 GB of VRAM recommended for Whisper large-v3-turbo
          models; lighter Piper models available for CPU
        </li>
        <li>Internet connection only for license activation and model download (one-time)</li>
      </ul>
      <p>
        {ORGANIZATION.name} is not affiliated with Eagle Dynamics. DCS World is
        a trademark of its respective owners.
      </p>

      <h2>4. Refunds</h2>
      <p>
        We offer a 14-day money-back guarantee from the date of purchase if the
        product does not work on your system and the issue cannot be resolved by
        technical support. To request a refund, write to{" "}
        <a href={`mailto:${ORGANIZATION.email}`}>{ORGANIZATION.email}</a>{" "}
        describing the issue encountered. The refund is issued to the same
        payment method used for the purchase.
      </p>

      <h2>5. Acceptable use</h2>
      <ul>
        <li>Do not distribute, sell, or market unauthorized copies of the software.</li>
        <li>
          Do not attempt to circumvent, modify, or reverse-engineer the
          licensing, device binding, or Ed25519 signature mechanisms.
        </li>
        <li>Do not use the software for illegal purposes or in violation of applicable laws.</li>
        <li>
          Do not integrate the software into third-party commercial products
          without written authorization.
        </li>
      </ul>

      <h2>6. Liability</h2>
      <p>
        The software is provided "as is" without express or implied warranties,
        including but not limited to warranties of merchantability or fitness
        for a particular purpose. {ORGANIZATION.name} is not liable for direct,
        indirect, incidental, or consequential damages arising from the use or
        inability to use the product. Maximum liability is limited to the amount
        paid for the license.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        The software, the integrated AI models (Whisper, Kokoro, Piper), the
        response templates, the airport and navaid definitions, and all
        associated content are protected by copyright and intellectual property
        laws. Third-party open-source models (Whisper, Kokoro, Piper) are
        distributed under their respective licenses.
      </p>

      <h2>8. Changes to terms</h2>
      <p>
        We reserve the right to update these terms. Material changes will be
        communicated via email to the address registered on your account.
        Continued use of the software after the changes constitutes acceptance
        of the new terms.
      </p>

      <h2>9. Contact</h2>
      <p>
        For any questions regarding these terms:{" "}
        <a href={`mailto:${ORGANIZATION.email}`}>{ORGANIZATION.email}</a>.
      </p>
    </>
  );
}
