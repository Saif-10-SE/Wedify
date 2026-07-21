import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InvitationCard from '@/components/InvitationCard';
import {
  invitationTemplates,
  getInvitationTemplate,
  loadSavedDesigns,
  persistSavedDesigns
} from '@/data/invitationTemplates';
import { Mail, Plus, Trash2, Pencil, Sparkles } from 'lucide-react';

export default function InvitationsPage() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    setSaved(loadSavedDesigns());
  }, []);

  const handleDelete = (id) => {
    const next = saved.filter((d) => d.id !== id);
    setSaved(next);
    persistSavedDesigns(next);
  };

  return (
    <>
      <Head>
        <title>Digital Invitations | Wedify</title>
        <meta
          name="description"
          content="Design beautiful digital wedding invitation cards with Wedify templates."
        />
      </Head>

      <Navbar />

      <main className="pt-28 pb-20 min-h-screen bg-gradient-to-b from-[#faf6f1] to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="text-gold-600 text-sm font-medium tracking-wide uppercase mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Digital Invitations
              </p>
              <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-3">
                Choose a card template
              </h1>
              <p className="text-gray-600 max-w-2xl">
                Pick a design, add your wedding details and guest list, then save or download
                personalized digital invitations.
              </p>
            </div>
            <Link
              href="/invitations/create?template=classic-gold"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-burgundy-900/10"
            >
              <Plus className="w-5 h-5" />
              Start Designing
            </Link>
          </div>

          {/* Templates */}
          <section className="mb-16">
            <h2 className="text-2xl font-serif text-gray-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-600" />
              Templates
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {invitationTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5 bg-gray-50 flex justify-center min-h-[320px] items-center">
                    <div className="scale-[0.72] origin-center pointer-events-none">
                      <InvitationCard
                        templateId={template.id}
                        brideName="Ayesha"
                        groomName="Hamza"
                        eventType="Barat"
                        date="2026-12-20"
                        time="7:00 PM"
                        venue="Royal Palm, Lahore"
                        message="Your presence will make our day complete."
                        rsvpNote="Kindly RSVP"
                        guestName="Dear Guest"
                        members={2}
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">{template.description}</p>
                    <Link
                      href={`/invitations/create?template=${template.id}`}
                      className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white font-medium transition-colors"
                    >
                      Use this template
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Saved designs */}
          <section>
            <h2 className="text-2xl font-serif text-gray-800 mb-6">Saved Designs</h2>
            {saved.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-10 text-center">
                <p className="text-gray-600 mb-4">No saved invitations yet.</p>
                <Link
                  href="/invitations/create?template=classic-gold"
                  className="text-burgundy-700 font-medium hover:underline"
                >
                  Create your first card →
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {saved.map((design) => {
                  const template = getInvitationTemplate(design.templateId);
                  const firstGuest = design.guests?.[0] || { name: 'Guest', members: 1 };
                  return (
                    <div
                      key={design.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50 flex justify-center min-h-[260px] items-center">
                        <div className="scale-[0.62] origin-center pointer-events-none">
                          <InvitationCard
                            templateId={design.templateId}
                            brideName={design.brideName}
                            groomName={design.groomName}
                            eventType={design.eventType}
                            date={design.date}
                            time={design.time}
                            venue={design.venue}
                            message={design.message}
                            rsvpNote={design.rsvpNote}
                            guestName={firstGuest.name}
                            members={firstGuest.members}
                          />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">
                          {design.brideName || 'Bride'} & {design.groomName || 'Groom'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {template.name} · {design.guests?.length || 0} guest
                          {(design.guests?.length || 0) === 1 ? '' : 's'}
                        </p>
                        <div className="flex gap-2 mt-4">
                          <Link
                            href={`/invitations/create?edit=${design.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(design.id)}
                            className="px-3 py-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50"
                            aria-label="Delete design"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
