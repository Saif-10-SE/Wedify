import { Plus, Trash2, Users } from 'lucide-react';

export default function InvitationGuestList({
  guests,
  selectedGuestId,
  onSelectGuest,
  onChangeGuest,
  onAddGuest,
  onRemoveGuest
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-gold-600" />
            Guest List
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Add each guest with how many members are invited on their card.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddGuest}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-burgundy-700 text-white hover:bg-burgundy-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Guest
        </button>
      </div>

      <div className="space-y-3">
        {guests.map((guest, index) => {
          const selected = guest.id === selectedGuestId;
          return (
            <div
              key={guest.id}
              className={`rounded-xl border p-4 transition-all cursor-pointer ${
                selected
                  ? 'border-gold-500 bg-gold-50/60 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gold-300'
              }`}
              onClick={() => onSelectGuest(guest.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Guest name *
                    </label>
                    <input
                      type="text"
                      value={guest.name}
                      onChange={(e) => onChangeGuest(guest.id, { name: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      placeholder={`Guest ${index + 1}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Members invited *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={guest.members}
                      onChange={(e) =>
                        onChangeGuest(guest.id, {
                          members: Math.max(1, Number(e.target.value) || 1)
                        })
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                {guests.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveGuest(guest.id);
                    }}
                    className="mt-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove guest"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {selected && (
                <p className="text-xs text-gold-700 mt-2 font-medium">
                  Previewing this guest’s card
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
