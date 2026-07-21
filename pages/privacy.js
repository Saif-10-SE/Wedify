import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Wedify</title>
      </Head>
      <Navbar />
      <main className="pt-28 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: July 20, 2026</p>
          <div className="space-y-6 text-gray-700 leading-relaxed bg-white rounded-2xl p-8 shadow-sm">
            <p>
              Wedify collects only the information you submit through inquiry forms, newsletter signup,
              and planning tools (favorites, wedding date, compare list). This data is used to respond
              to your requests and improve the Lahore wedding planning experience.
            </p>
            <p>
              Inquiry and newsletter submissions are stored securely on our application server.
              Favorites and checklist progress remain in your browser unless you clear site data.
            </p>
            <p>
              We do not sell personal information. Venue contact details shown on Wedify are published
              for booking convenience and belong to the respective venues.
            </p>
            <p>
              Questions? Email{' '}
              <a href="mailto:hello@wedify.pk" className="text-burgundy-700 underline">
                hello@wedify.pk
              </a>
              .
            </p>
            <Link href="/" className="inline-block text-gold-600 font-medium hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
