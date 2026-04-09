export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
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
          <div className="mt-3 text-sm leading-7 text-slate-700 space-y-1">
            <p><strong>Treilix</strong></p>
            <p>Szilard Nagy</p>
            <p>Putzbrunner Straße 20</p>
            <p>81737 München</p>
            <p>Germany</p>
            <p>Email: info@treilix.com</p>
          </div>
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
              <li>Technical information such as browser type and request data</li>
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
              <li>Enable company inquiries</li>
              <li>Allow claiming and managing company profiles</li>
              <li>Review submissions and claims</li>
              <li>Operate and improve the platform</li>
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            4. Legal basis
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
            <ul className="list-disc space-y-2 pl-5">
              <li>Your consent</li>
              <li>Performance of a contract</li>
              <li>Legitimate interest</li>
              <li>Legal obligations</li>
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            5. Third-party services
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
            <ul className="list-disc space-y-2 pl-5">
              <li>Supabase (database & authentication)</li>
              <li>Resend (email sending)</li>
              <li>Hosting providers</li>
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            6. Cookies
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            We use cookies and similar technologies to ensure proper functionality
            and improve user experience. You can manage cookies in your browser settings.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            7. Data retention
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Data is stored only as long as necessary to provide the service and
            fulfill legal obligations.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            8. Your rights
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
            <li>Access your data</li>
            <li>Correct your data</li>
            <li>Delete your data</li>
            <li>Object to processing</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            9. Security
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            We use appropriate technical measures to protect your data.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            10. Contact
          </h2>
          <div className="mt-3 text-sm leading-7 text-slate-700 space-y-1">
            <p><strong>Treilix</strong></p>
            <p>Szilard Nagy</p>
            <p>Putzbrunner Straße 20</p>
            <p>81737 München</p>
            <p>Germany</p>
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