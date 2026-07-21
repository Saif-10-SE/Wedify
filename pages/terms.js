import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service | Wedify</title>
      </Head>
      <Navbar />
      <main className="pt-28 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: July 20, 2026</p>
          <div className="space-y-6 text-gray-700 leading-relaxed bg-white rounded-2xl p-8 shadow-sm">
            <p>
              Wedify is a wedding planning platform that helps users discover Lahore marquees, compare
              packages, estimate budgets, and contact venues. Venue rates shown are market snapshots
              based on publicly listed packages and may change; always confirm final quotes with the venue.
            </p>
            <p>
              Submitting an inquiry through Wedify does not guarantee availability or booking.
              Contracts, deposits, and payments are handled directly between you and the venue or vendor.
            </p>
            <p>
              Budget calculator results and AI planner suggestions are planning aids, not binding quotes.
            </p>
            <p>
              By using Wedify you agree to provide accurate contact details when requesting information
              from venues or vendors.
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
