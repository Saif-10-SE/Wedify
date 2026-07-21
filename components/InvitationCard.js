import { forwardRef } from 'react';
import { formatInvitationDate, formatMembersLabel, getInvitationTemplate } from '@/data/invitationTemplates';

const InvitationCard = forwardRef(function InvitationCard(
  {
    templateId,
    brideName,
    groomName,
    eventType,
    date,
    time,
    venue,
    message,
    rsvpNote,
    guestName,
    members
  },
  ref
) {
  const template = getInvitationTemplate(templateId);
  const { theme, ornament, layout, name: templateName } = template;

  const coupleLine =
    brideName && groomName
      ? `${brideName}  &  ${groomName}`
      : brideName || groomName || 'Bride  &  Groom';

  const guestLine = guestName?.trim() || 'Guest Name';
  const membersLine = formatMembersLabel(members);
  const dateLine = formatInvitationDate(date) || 'Wedding Date';
  const timeLine = time || 'Evening';
  const venueLine = venue?.trim() || 'Venue Name';

  const isDark = layout === 'royal' || layout === 'midnight';

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[380px] mx-auto aspect-[3/4.4] overflow-hidden shadow-2xl"
      style={{
        background: theme.background,
        border: `3px solid ${theme.border}`,
        color: theme.text,
        fontFamily: layout === 'minimal' ? 'Georgia, serif' : 'Georgia, "Times New Roman", serif'
      }}
    >
      <div
        className="absolute inset-3 pointer-events-none"
        style={{ border: `1px solid ${theme.border}`, opacity: 0.55 }}
      />

      <div className="absolute top-5 left-5 text-lg opacity-70" style={{ color: theme.accent }}>
        {ornament}
      </div>
      <div className="absolute top-5 right-5 text-lg opacity-70" style={{ color: theme.accent }}>
        {ornament}
      </div>
      <div className="absolute bottom-5 left-5 text-lg opacity-70" style={{ color: theme.accent }}>
        {ornament}
      </div>
      <div className="absolute bottom-5 right-5 text-lg opacity-70" style={{ color: theme.accent }}>
        {ornament}
      </div>

      <div className="relative h-full flex flex-col items-center justify-between px-8 py-10 text-center">
        <div className="w-full">
          <p
            className="text-[10px] tracking-[0.35em] uppercase mb-3"
            style={{ color: theme.muted }}
          >
            {templateName}
          </p>
          <p
            className="text-xs tracking-[0.25em] uppercase mb-1"
            style={{ color: theme.accent }}
          >
            You are invited
          </p>
          <div
            className="mx-auto my-3 h-px w-16"
            style={{ background: theme.border }}
          />
          <p className="text-sm italic mb-1" style={{ color: theme.muted }}>
            to celebrate the {eventType || 'Wedding'} of
          </p>
          <h2
            className={`leading-tight mt-2 mb-1 ${
              layout === 'minimal' ? 'text-2xl font-semibold tracking-wide' : 'text-2xl font-serif'
            }`}
            style={{ color: theme.accent }}
          >
            {coupleLine}
          </h2>
        </div>

        <div
          className="w-full rounded-lg px-4 py-4 my-2"
          style={{ background: theme.panel }}
        >
          <p className="text-sm font-medium mb-1">Dear {guestLine},</p>
          <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
            {membersLine}.
          </p>
        </div>

        <div className="w-full space-y-2">
          <p className="text-sm font-medium">{dateLine}</p>
          <p className="text-xs tracking-wide" style={{ color: theme.muted }}>
            {timeLine}
          </p>
          <p className="text-sm mt-2">{venueLine}</p>
          {message ? (
            <p className="text-xs italic mt-3 leading-relaxed px-1" style={{ color: theme.muted }}>
              “{message}”
            </p>
          ) : null}
          {rsvpNote ? (
            <p className="text-[10px] tracking-wide uppercase mt-3" style={{ color: theme.accent }}>
              {rsvpNote}
            </p>
          ) : null}
        </div>

        <div className="w-full pt-2">
          <div
            className="mx-auto mb-2 h-px w-12"
            style={{ background: theme.border }}
          />
          <p
            className="text-[9px] tracking-[0.3em] uppercase"
            style={{ color: isDark ? theme.muted : theme.accent, opacity: 0.85 }}
          >
            Wedify
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvitationCard;
