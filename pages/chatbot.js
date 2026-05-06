import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, Trash2, UserRound } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const STORAGE_KEY = 'wedify-chat-history-v1';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content:
    'Assalam o Alaikum. I am your Wedify planner assistant. Share your city, budget, guest count, and events (mehndi/barat/walima), and I will suggest the best options with PKR estimates.'
};

const QUICK_PROMPTS = [
  'My budget is 35 lakh for 600 guests in Lahore. What should I choose?',
  'Recommend 3 venues in DHA for around 450 guests.',
  'How should I split budget across mehndi, barat, and walima?',
  'Suggest affordable alternatives if my budget is tight.'
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [decorPrompt, setDecorPrompt] = useState('');
  const [decorStyle, setDecorStyle] = useState('');
  const [isGeneratingDecor, setIsGeneratingDecor] = useState(false);
  const [decorError, setDecorError] = useState('');
  const [decorImages, setDecorImages] = useState([]);
  const listEndRef = useRef(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        setMessages(parsed);
      }
    } catch (_) {
      setMessages([INITIAL_MESSAGE]);
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submitMessage = async (rawText) => {
    const content = String(rawText || '').trim();
    if (!content || isLoading) return;

    setError('');
    const nextMessages = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: nextMessages.slice(-12)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to fetch chatbot response.');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data?.reply || 'I need a few more details to help you better.' }
      ]);
    } catch (err) {
      const friendly = err?.message || 'Something went wrong while contacting the assistant.';
      setError(friendly);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I could not complete that request right now. Please retry and include your budget, city, guest count, and event list so I can still guide you accurately.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([INITIAL_MESSAGE]);
    setError('');
    window.sessionStorage.removeItem(STORAGE_KEY);
  };

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
          style: decorStyle.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to generate decor image.');
      }

      if (data?.error && !data?.image) {
        throw new Error(data.error);
      }

      if (!data?.image?.base64 || !data?.image?.mimeType) {
        throw new Error('Image data missing in response.');
      }

      const dataUrl = `data:${data.image.mimeType};base64,${data.image.base64}`;
      setDecorImages((prev) => [
        {
          id: `${Date.now()}`,
          prompt,
          style: decorStyle.trim(),
          guidance: data?.guidance || '',
          dataUrl
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

  return (
    <>
      <Head>
        <title>Wedify AI Planner | Wedding Chatbot</title>
        <meta
          name="description"
          content="AI-powered wedding planner for Pakistani weddings with budget-smart venue and vendor recommendations."
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
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Wedding Planning
                </p>
                <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">Wedify Chatbot Assistant</h1>
                <p className="mt-2 max-w-2xl text-sm text-gray-700 md:text-base">
                  Ask naturally about venues, budgets, and vendor trade-offs. I will respond with practical PKR guidance for Pakistani weddings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/calculator"
                  className="rounded-lg border border-gold-300 bg-white px-3 py-2 text-sm font-medium text-gold-800 transition-colors hover:bg-gold-50"
                >
                  Budget Calculator
                </Link>
                <button
                  type="button"
                  onClick={clearConversation}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Chat
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/90 shadow-lg backdrop-blur-sm">
            <div className="max-h-[60vh] overflow-y-auto p-4 md:p-6">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isUser = message.role === 'user';

                  return (
                    <div key={`${message.role}-${index}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] md:max-w-[78%] ${isUser ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed md:text-[15px] ${
                            isUser
                              ? 'bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white'
                              : 'border border-gold-100 bg-gold-50/70 text-gray-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>

                      <div className={`mt-1 px-2 ${isUser ? 'order-1' : 'order-2'}`}>
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            isUser ? 'bg-burgundy-100 text-burgundy-700' : 'bg-gold-100 text-gold-700'
                          }`}
                        >
                          {isUser ? <UserRound className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-gold-100 bg-gold-50/70 px-4 py-3 text-sm text-gray-700">
                      Thinking through your wedding plan...
                    </div>
                  </div>
                )}

                <div ref={listEndRef} />
              </div>
            </div>

            <div className="border-t border-gray-100 p-4 md:p-6">
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => submitMessage(prompt)}
                    disabled={isLoading}
                    className="rounded-full border border-gold-200 bg-gold-50 px-3 py-1.5 text-xs text-gold-800 transition-colors hover:bg-gold-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  submitMessage(input);
                }}
                className="flex items-end gap-3"
              >
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  rows={2}
                  placeholder="Example: My budget is 40 lakh for 700 guests in Gulberg. Suggest best options."
                  className="min-h-[52px] flex-1 resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-gold-500 px-4 font-semibold text-white transition-colors hover:bg-gold-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </form>

              {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg backdrop-blur-sm md:p-6">
            <div className="mb-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-800">
                <Sparkles className="h-3.5 w-3.5" />
                Decor Image Generator
              </p>
              <h2 className="mt-3 text-2xl font-bold text-gray-900">Generate Wedding Decor Concepts</h2>
              <p className="mt-2 text-sm text-gray-700">
                Describe the look you want and receive AI-generated decor inspiration for stage, aisle, tables, and ambience.
              </p>
            </div>

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