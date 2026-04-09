export default function ImprintPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Imprint
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          Information provided in accordance with applicable legal disclosure
          requirements, including Section 5 DDG where applicable.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Service provider
          </h2>
          <div className="mt-3 space-y-1 text-sm leading-7 text-slate-700">
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
            Responsible for content
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Szilard Nagy is responsible for the content of this website in
            accordance with applicable laws.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Contact
          </h2>
          <div className="mt-3 space-y-1 text-sm leading-7 text-slate-700">
            <p>Email: info@treilix.com</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Liability for content
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            We make every effort to keep the information on this website current,
            accurate, and complete. However, we cannot guarantee the completeness,
            accuracy, or timeliness of all content.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Liability for links
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            This website may contain links to external third-party websites. We
            have no influence over the content of those websites and therefore
            cannot accept responsibility for them. The respective provider or
            operator of the linked pages is always responsible for their content.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Copyright
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            The content and works published on this website are subject to
            applicable copyright laws. Any reproduction, editing, distribution,
            or use outside the limits of copyright law requires prior written
            consent from the respective author or creator, unless otherwise
            permitted by law.
          </p>
        </section>

        <div className="mt-10 border-t pt-6 text-xs text-slate-500">
          Last updated: April 2026
        </div>
      </div>
    </main>
  );
}