import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InvitationCard from '@/components/InvitationCard';
import InvitationGuestList from '@/components/InvitationGuestList';
import { useWedding } from '@/context/WeddingContext';
import {
  invitationTemplates,
  eventTypes,
  createEmptyInvitation,
  loadSavedDesigns,
  persistSavedDesigns,
  buildInviteShareText,
  getInvitationTemplate
} from '@/data/invitationTemplates';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Save,
  Share2,
  CheckCircle
} from 'lucide-react';

const STEPS = ['Event Details', 'Guests', 'Preview & Export'];

async function loadHtml2Canvas() {
  if (typeof window === 'undefined') return null;
  if (window.html2canvas) return window.html2canvas;

  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-html2canvas]');
    if (existing) {
      if (window.html2canvas) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('html2canvas failed to load')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    script.async = true;
    script.dataset.html2canvas = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('html2canvas failed to load'));
    document.head.appendChild(script);
  });

  return window.html2canvas;
}

export default function CreateInvitationPage() {
  const router = useRouter();
  const { weddingDate, showNotification } = useWedding();
  const cardRef = useRef(null);

  const [step, setStep] = useState(0);
  const [design, setDesign] = useState(null);
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const { template, edit } = router.query;
    const saved = loadSavedDesigns();

    if (edit) {
      const existing = saved.find((d) => d.id === edit);
      if (existing) {
        setDesign(existing);
        setSelectedGuestId(existing.guests?.[0]?.id || null);
        setReady(true);
        return;
      }
    }

    const next = createEmptyInvitation(
      typeof template === 'string' ? template : 'classic-gold'
    );

    if (weddingDate) {
      try {
        const iso = new Date(weddingDate).toISOString().slice(0, 10);
        next.date = iso;
      } catch {
        /* ignore */
      }
    }

    setDesign(next);
    setSelectedGuestId(next.guests[0].id);
    setReady(true);
  }, [router.isReady, router.query, weddingDate]);

  const selectedGuest = useMemo(() => {
    if (!design?.guests?.length) return null;
    return (
      design.guests.find((g) => g.id === selectedGuestId) || design.guests[0]
    );
  }, [design, selectedGuestId]);

  const updateField = (field, value) => {
    setDesign((prev) => ({ ...prev, [field]: value }));
  };

  const onChangeGuest = (id, patch) => {
    setDesign((prev) => ({
      ...prev,
      guests: prev.guests.map((g) => (g.id === id ? { ...g, ...patch } : g))
    }));
  };

  const onAddGuest = () => {
    const id = `g_${Date.now()}`;
    setDesign((prev) => ({
      ...prev,
      guests: [...prev.guests, { id, name: '', members: 2 }]
    }));
    setSelectedGuestId(id);
  };

  const onRemoveGuest = (id) => {
    setDesign((prev) => {
      const guests = prev.guests.filter((g) => g.id !== id);
      return { ...prev, guests };
    });
    setSelectedGuestId((current) => {
      if (current !== id) return current;
      const remaining = design.guests.filter((g) => g.id !== id);
      return remaining[0]?.id || null;
    });
  };

  const validateForExport = () => {
    if (!design.brideName?.trim() || !design.groomName?.trim()) {
      showNotification('Please enter bride and groom names.', 'error');
      setStep(0);
      return false;
    }
    if (!design.date) {
      showNotification('Please set the marriage date.', 'error');
      setStep(0);
      return false;
    }
    if (!design.guests?.length || !design.guests.some((g) => g.name?.trim())) {
      showNotification('Please add at least one guest with a name.', 'error');
      setStep(1);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForExport()) return;
    setSaving(true);

    const payload = {
      ...design,
      updatedAt: new Date().toISOString()
    };

    const existing = loadSavedDesigns();
    const idx = existing.findIndex((d) => d.id === payload.id);
    const next =
      idx >= 0
        ? existing.map((d, i) => (i === idx ? payload : d))
        : [payload, ...existing];

    persistSavedDesigns(next);
    setDesign(payload);

    try {
      await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      /* local save still succeeded */
    }

    setSaving(false);
    showNotification('Invitation design saved!', 'success');
  };

  const handleDownload = async () => {
    if (!validateForExport()) return;
    if (!cardRef.current) return;

    setDownloading(true);
    try {
      const html2canvas = await loadHtml2Canvas();
      if (!html2canvas) {
        throw new Error('html2canvas unavailable');
      }
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false
      });
      const link = document.createElement('a');
      const guestPart = (selectedGuest?.name || 'guest').replace(/\s+/g, '-').toLowerCase();
      link.download = `wedify-invite-${guestPart}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showNotification('Invitation PNG downloaded.', 'success');
    } catch (err) {
      showNotification('Could not download image. Try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!validateForExport()) return;
    const text = buildInviteShareText({
      brideName: design.brideName,
      groomName: design.groomName,
      eventType: design.eventType,
      date: design.date,
      time: design.time,
      venue: design.venue,
      guestName: selectedGuest?.name,
      members: selectedGuest?.members,
      message: design.message
    });

    try {
      await navigator.clipboard.writeText(text);
      showNotification('Invite text copied — paste into WhatsApp!', 'success');
    } catch {
      showNotification('Could not copy text.', 'error');
    }
  };

  const cycleGuest = (direction) => {
    if (!design?.guests?.length) return;
    const ids = design.guests.map((g) => g.id);
    const current = ids.indexOf(selectedGuestId);
    const next =
      direction === 'next'
        ? ids[(current + 1) % ids.length]
        : ids[(current - 1 + ids.length) % ids.length];
    setSelectedGuestId(next);
  };

  if (!ready || !design) {
    return (
      <>
        <Navbar />
        <div className="pt-32 pb-20 text-center text-gray-500">Loading editor…</div>
      </>
    );
  }

  const template = getInvitationTemplate(design.templateId);

  return (
    <>
      <Head>
        <title>Design Invitation | Wedify</title>
      </Head>

      <Navbar />

      <main className="pt-28 pb-20 min-h-screen bg-gradient-to-b from-[#faf6f1] to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <Link
                href="/invitations"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-burgundy-700 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                All templates
              </Link>
              <h1 className="text-3xl md:text-4xl font-serif text-gray-900">
                Design your invitation
              </h1>
              <p className="text-gray-500 mt-1">
                Template: <span className="text-gold-700 font-medium">{template.name}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {invitationTemplates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateField('templateId', t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    design.templateId === t.id
                      ? 'bg-burgundy-700 text-white border-burgundy-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gold-400'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  step === i
                    ? 'bg-gold-500 text-white'
                    : i < step
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {i < step ? <CheckCircle className="w-4 h-4" /> : <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-xs">{i + 1}</span>}
                {label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Form column */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 order-2 lg:order-1">
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-serif text-gray-800 mb-2">Event details</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bride name *</label>
                      <input
                        type="text"
                        value={design.brideName}
                        onChange={(e) => updateField('brideName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        placeholder="Ayesha"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Groom name *</label>
                      <input
                        type="text"
                        value={design.groomName}
                        onChange={(e) => updateField('groomName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        placeholder="Hamza"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event type</label>
                      <select
                        value={design.eventType}
                        onChange={(e) => updateField('eventType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      >
                        {eventTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marriage date *</label>
                      <input
                        type="date"
                        value={design.date}
                        onChange={(e) => updateField('date', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="text"
                        value={design.time}
                        onChange={(e) => updateField('time', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        placeholder="7:00 PM"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                      <input
                        type="text"
                        value={design.venue}
                        onChange={(e) => updateField('venue', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        placeholder="Royal Palm Golf & Country Club"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Personal message</label>
                    <textarea
                      rows={3}
                      value={design.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RSVP note</label>
                    <input
                      type="text"
                      value={design.rsvpNote}
                      onChange={(e) => updateField('rsvpNote', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <InvitationGuestList
                  guests={design.guests}
                  selectedGuestId={selectedGuestId}
                  onSelectGuest={setSelectedGuestId}
                  onChangeGuest={onChangeGuest}
                  onAddGuest={onAddGuest}
                  onRemoveGuest={onRemoveGuest}
                />
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-serif text-gray-800">Preview & export</h2>
                  <p className="text-gray-600 text-sm">
                    Switch guests to personalize each card, then save your design, download a PNG,
                    or copy WhatsApp-ready invite text.
                  </p>

                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <button
                      type="button"
                      onClick={() => cycleGuest('prev')}
                      className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200"
                      aria-label="Previous guest"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                      <p className="font-medium text-gray-800">
                        {selectedGuest?.name || 'Unnamed guest'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedGuest?.members || 1} member
                        {(selectedGuest?.members || 1) === 1 ? '' : 's'} invited
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => cycleGuest('next')}
                      className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200"
                      aria-label="Next guest"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={downloading}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold disabled:opacity-60"
                    >
                      <Download className="w-4 h-4" />
                      {downloading ? 'Preparing…' : 'Download PNG'}
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-800"
                    >
                      <Share2 className="w-4 h-4" />
                      Copy text
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                >
                  Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                    className="px-5 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white font-medium"
                  >
                    Continue
                  </button>
                ) : (
                  <Link
                    href="/invitations"
                    className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    View saved
                  </Link>
                )}
              </div>
            </div>

            {/* Live preview */}
            <div className="lg:sticky lg:top-28 order-1 lg:order-2">
              <div className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Live preview</h3>
                  <span className="text-xs text-gray-500">
                    {selectedGuest?.name ? `For ${selectedGuest.name}` : 'Add a guest name'}
                  </span>
                </div>
                <InvitationCard
                  ref={cardRef}
                  templateId={design.templateId}
                  brideName={design.brideName}
                  groomName={design.groomName}
                  eventType={design.eventType}
                  date={design.date}
                  time={design.time}
                  venue={design.venue}
                  message={design.message}
                  rsvpNote={design.rsvpNote}
                  guestName={selectedGuest?.name}
                  members={selectedGuest?.members}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
