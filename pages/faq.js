import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const faqs = [
  {
    q: 'Are the marquee prices real?',
    a: 'Yes. Per-head and hall rental figures are based on 2026 Lahore market listings for each venue. Final packages can vary by menu, date, and guest count — always confirm with the venue before booking.'
  },
  {
    q: 'How do I inquire about a venue?',
    a: 'Open any venue page and use the inquiry form. Your request is saved in Wedify and the venue team can follow up using the contact details you provide.'
  },
  {
    q: 'Does the budget calculator include everything?',
    a: 'It covers venue catering, decor, photography, entertainment, and common add-ons. Taxes, invitations, bridal wear, and travel are optional extras you can adjust.'
  },
  {
    q: 'Can I compare venues side by side?',
    a: 'Yes. Use Compare on venue cards, then open the Compare page to review capacity, ratings, and pricing together.'
  },
  {
    q: 'Can I design digital wedding invitations?',
    a: 'Yes. Open Invitations from the Planning menu, choose a template, enter couple and event details, add guests with member counts, then save, download a PNG, or copy WhatsApp-ready invite text.'
  },
  {
    q: 'Is the AI planner free to use?',
    a: 'The AI Planner chat is available inside Wedify. If an API key is configured it uses live AI; otherwise it still matches venues from our Lahore database using your preferences.'
  }
];

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>FAQs | Wedify</title>
      </Head>
      <Navbar />
      <main className="pt-28 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-500 mb-10">Everything you need to know before booking with Wedify.</p>
          <div className="space-y-4">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="bg-white rounded-2xl shadow-sm p-6 group open:ring-1 open:ring-gold-300"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  {item.q}
                  <span className="text-gold-500 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 flex gap-4">
            <Link href="/chatbot" className="text-burgundy-700 font-medium hover:underline">
              Ask the AI Planner →
            </Link>
            <Link href="/marquees" className="text-gold-600 font-medium hover:underline">
              Browse venues →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
