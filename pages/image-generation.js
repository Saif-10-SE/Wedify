import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ImageGenerationPage() {
  const [decorPrompt, setDecorPrompt] = useState('');
  const [decorStyle, setDecorStyle] = useState('');
  const [isGeneratingDecor, setIsGeneratingDecor] = useState(false);
  const [decorError, setDecorError] = useState('');
  const [decorImages, setDecorImages] = useState([]);
  const [decorReferences, setDecorReferences] = useState([]);

  const generateDecorImage = async () => {
    const prompt = decorPrompt.trim();
    if (!prompt || isGeneratingDecor) return;

    setDecorError('');
    setIsGeneratingDecor(true);

    try {
      const response = await fetch('/api/decor-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: decorStyle.trim(),
          references: [
            ...decorReferences.map((item) => item.dataUrl),
            ...(decorImages[0]?.dataUrl ? [decorImages[0].dataUrl] : [])
          ].slice(0, 5)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        const detail =
          Array.isArray(data?.details) && data.details.length
            ? ` (${data.details[0]})`
            : '';
        throw new Error((data?.error || 'Unable to generate decor image.') + detail);
      }

      if (data?.error && !data?.image) {
        throw new Error(data.error);
      }

      if (!data?.image?.base64 || !data?.image?.mimeType) {
        throw new Error('Image data missing in response.');
      }

      if (data?.metadata?.source === 'local-fallback' || data?.metadata?.source === 'local-catalog') {
        throw new Error(
          'Decor generator returned a stock photo instead of an AI image. Please refresh and try again.'
        );
      }

      const dataUrl = `data:${data.image.mimeType};base64,${data.image.base64}`;
      setDecorImages((prev) => [
        {
          id: `${Date.now()}`,
          prompt,
          style: decorStyle.trim(),
          guidance: data?.guidance || '',
          dataUrl,
          source: data?.metadata?.source || 'ai'
        },
        ...prev
      ]);
      setDecorPrompt('');
    } catch (err) {
      setDecorError(err?.message || 'Failed to generate decor image.');
    } finally {
      setIsGeneratingDecor(false);
    }
  };

  const handleDecorReferences = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const total = decorReferences.length + files.length;
    if (total > 5) {
      setDecorError('You can upload up to 5 reference images.');
      return;
    }

    setDecorError('');
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
              reject(new Error('Only image files are allowed.'));
              return;
            }
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ id: `${Date.now()}-${file.name}`, name: file.name, dataUrl: reader.result });
            reader.onerror = () => reject(new Error(`Unable to read ${file.name}`));
            reader.readAsDataURL(file);
          })
      )
    )
      .then((loaded) => {
        setDecorReferences((prev) => [...prev, ...loaded]);
      })
      .catch((err) => setDecorError(err?.message || 'Failed to load references.'));
  };

  const removeDecorReference = (id) => {
    setDecorReferences((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <Head>
        <title>Image Generation | Wedify</title>
        <meta
          name="description"
          content="Generate AI wedding decor concepts for stage, aisle, tables, and ambience with Wedify."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 pt-28 pb-16">
        <section className="mx-auto max-w-5xl px-4">
          <div className="mb-6 rounded-2xl border border-gold-200/80 bg-white/85 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-800">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Image Generation
                </p>
                <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">Wedding Decor Concepts</h1>
                <p className="mt-2 max-w-2xl text-sm text-gray-700 md:text-base">
                  Describe the look you want and receive AI-generated decor inspiration for stage, aisle, tables, and ambience.
                </p>
              </div>
              <Link
                href="/chatbot"
                className="rounded-lg border border-gold-300 bg-white px-3 py-2 text-sm font-medium text-gold-800 transition-colors hover:bg-gold-50"
              >
                AI Chatbot
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg backdrop-blur-sm md:p-6">
            <div className="grid gap-3 md:grid-cols-2">
              <textarea
                value={decorPrompt}
                onChange={(event) => setDecorPrompt(event.target.value)}
                rows={3}
                placeholder="Example: Royal mehndi setup with marigold flowers, lantern lights, and traditional seating."
                className="min-h-[88px] w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
              />
              <textarea
                value={decorStyle}
                onChange={(event) => setDecorStyle(event.target.value)}
                rows={3}
                placeholder="Optional style notes: pastel theme, floral tunnel entry, elegant modern stage."
                className="min-h-[88px] w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
              />
            </div>
            <div className="mt-3 rounded-xl border border-dashed border-gold-300 bg-gold-50/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-gray-700">
                  Reference images for editing/consistency ({decorReferences.length}/5)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDecorReferences}
                  className="block text-xs text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gold-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-gold-600"
                />
              </div>
              {decorReferences.length ? (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {decorReferences.map((item) => (
                    <div key={item.id} className="relative">
                      <img src={item.dataUrl} alt={item.name} className="h-16 w-full rounded-md object-cover" />
                      <button
                        type="button"
                        onClick={() => removeDecorReference(item.id)}
                        className="absolute right-1 top-1 rounded bg-black/70 px-1.5 text-[10px] text-white"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={generateDecorImage}
                disabled={isGeneratingDecor || !decorPrompt.trim()}
                className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-burgundy-700 px-4 font-semibold text-white transition-colors hover:bg-burgundy-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <Sparkles className="h-4 w-4" />
                {isGeneratingDecor ? 'Generating...' : 'Generate Decor Image'}
              </button>
              {decorImages.length ? (
                <p className="text-xs text-gray-600">Multi-turn edit is active for this decor thread.</p>
              ) : null}
              {decorError ? <p className="text-sm text-red-600">{decorError}</p> : null}
            </div>

            {decorImages.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {decorImages.map((item) => (
                  <article key={item.id} className="overflow-hidden rounded-xl border border-gold-100 bg-gold-50/50">
                    <img src={item.dataUrl} alt={item.prompt} className="h-52 w-full object-cover" />
                    <div className="space-y-2 p-3">
                      <p className="text-sm font-medium text-gray-900">{item.prompt}</p>
                      {item.style ? <p className="text-xs text-gray-700">Style: {item.style}</p> : null}
                      <p className="text-xs text-gray-500">Provider: {item.source}</p>
                      {item.guidance ? <p className="text-xs text-gray-700">{item.guidance}</p> : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
