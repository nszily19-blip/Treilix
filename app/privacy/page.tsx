export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-6 shadow-sm md:p-10">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Privacy Policy
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          This Privacy Policy explains how Treilix collects, uses, stores, and
          protects personal data when you use the platform.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            1. Who we are
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Treilix is a platform that helps users discover transport and
            logistics companies, send inquiries, and lets company owners claim
            and manage their listings.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            2. What data we collect
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
            <p>We may collect and process the following personal data:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Email address and login-related account information</li>
              <li>Name, email address, and phone number submitted in inquiries</li>
              <li>Company information submitted or edited by users</li>
              <li>Claim request information</li>
              <li>Technical information such as browser type, device, and IP-related request data</li>
              <li>Cookie preferences stored in your browser</li>
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            3. Why we collect your data
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
            <p>We process personal data in order to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Create and manage user accounts</li>
              <li>Allow users to send company inquiries</li>
              <li>Allow company owners to claim and manage company listings</li>
              <li>Review and process submissions and claim requests</li>
              <li>Operate, maintain, and improve the Treilix platform</li>
              <li>Send service-related communication where necessary</li>
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            4. Legal basis
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
            <p>
              We process data based on one or more of the following legal bases,
              depending on the context:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Your consent</li>
              <li>The performance of a contract or pre-contractual steps</li>
              <li>Our legitimate interests in operating and improving the platform</li>
              <li>Compliance with legal obligations</li>
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            5. Third-party services
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
            <p>Treilix may use third-party services to operate the platform, including:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Supabase for authentication, database, and backend services</li>
              <li>Resend for sending transactional emails</li>
              <li>Hosting providers used to publish and run the website</li>
            </ul>
            <p>
              These services may process data on our behalf to the extent
              necessary for the platform to function.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            6. Cookies and local storage
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
            <p>
              Treilix may use cookies and browser storage technologies to keep
              the website functioning properly, remember preferences, and improve
              the user experience.
            </p>
            <p>
              You can manage your cookie choices through the cookie banner where
              available, and through your browser settings.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            7. Data retention
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            We keep personal data only for as long as necessary to provide the
            service, fulfill legitimate business purposes, resolve disputes,
            enforce agreements, and meet legal obligations.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            8. Your rights
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
            <p>Depending on applicable law, you may have the right to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Restrict or object to certain processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            9. Data security
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            We take reasonable technical and organizational measures to protect
            personal data against unauthorized access, disclosure, alteration,
            and destruction. However, no internet-based service can be guaranteed
            to be completely secure.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            10. Changes to this Privacy Policy
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            We may update this Privacy Policy from time to time. The latest
            version will always be available on this page.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            11. Contact
          </h2>
          <div className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
            <p>
              If you have questions about this Privacy Policy or about your
              personal data, you can contact:
            </p>
            <p>
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