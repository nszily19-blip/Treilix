export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-6 shadow-sm md:p-10">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Terms & Conditions
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          These Terms & Conditions govern your use of the Treilix platform.
          By accessing or using the platform, you agree to these terms.
        </p>

        {/* 1 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            1. Platform purpose
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Treilix is an online platform that allows users to discover transport
            and logistics companies, submit company listings, claim ownership of
            company profiles, and send inquiries to companies.
          </p>
        </section>

        {/* 2 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            2. User accounts
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            To access certain features, users may need to create an account.
            You are responsible for maintaining the confidentiality of your
            login credentials and for all activities under your account.
          </p>
        </section>

        {/* 3 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            3. User responsibilities
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
            <p>You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide false or misleading information</li>
              <li>Submit unauthorized or fraudulent company claims</li>
              <li>Use the platform for spam or abusive inquiries</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </div>
        </section>

        {/* 4 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            4. Company listings
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Company information may be submitted by users or company owners.
            Treilix does not guarantee the accuracy, completeness, or reliability
            of any listing.
          </p>
        </section>

        {/* 5 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            5. Claims and ownership
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Claim requests may be reviewed manually. Treilix reserves the right
            to approve or reject claims at its discretion.
          </p>
        </section>

        {/* 6 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            6. Inquiries and communication
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Treilix enables communication between users and companies.
            We do not guarantee responses, business agreements, or outcomes
            resulting from inquiries.
          </p>
        </section>

        {/* 7 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            7. Limitation of liability
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            The platform is provided "as is". Treilix is not liable for any
            direct or indirect damages arising from the use of the platform,
            except where required by law.
          </p>
        </section>

        {/* 8 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            8. Changes to the terms
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            We may update these Terms & Conditions at any time. Continued use of
            the platform after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        {/* 9 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            9. Contact
          </h2>
          <div className="mt-3 text-sm leading-7 text-slate-700">
            <p>
              For questions regarding these Terms & Conditions, contact:
            </p>
            <p className="mt-2">
              <strong>Treilix</strong>
            </p>
            <p>Email: info@treilix.com</p>
          </div>
        </section>

        <div className="mt-10 border-t pt-6 text-xs text-slate-500">
          Last updated: April 2026
        </div>
      </div>
    </main>
  );
}