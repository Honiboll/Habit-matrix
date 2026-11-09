import React, { useState, useRef, useEffect } from 'react';
import { Smile, Search, X } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'health',
    name: 'Fitness & Health',
    emojis: ['🏃', '🏋️', '🧘', '🚴', '🏊', '🚶', '💧', '🚿', '🥗', '🥑', '🍎', '💊', '🧗', '🥊', '⚽', '🎾']
  },
  {
    id: 'focus',
    name: 'Productivity & Study',
    emojis: ['🎯', '💻', '📖', '📚', '✍️', '🎓', '⚡', '🧠', '💼', '⏱️', '🚀', '📈', '📝', '💡', '🔬', '📊']
  },
  {
    id: 'mind',
    name: 'Mind & Wellbeing',
    emojis: ['☀️', '🌙', '🌅', '🧘‍♀️', '🛌', '🌿', '🪴', '☕', '🍵', '🕯️', '🕊️', '🎧', '🎨', '🎵', '🛀', '💆']
  },
  {
    id: 'routine',
    name: 'Lifestyle & Routine',
    emojis: ['✨', '🔥', '⭐', '💎', '💰', '🧹', '🍳', '🐶', '🌱', '🦷', '⏰', '🚭', '📵', '🧺', '🚗', '🛍️']
  }
];

export default function EmojiPicker({ selectedEmoji, onSelectEmoji }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [customInput, setCustomInput] = useState('');
  const popoverRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (emoji) => {
    onSelectEmoji(emoji);
    setIsOpen(false);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleSelect(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-[30px] rounded-lg border text-base flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer hover:opacity-90"
        style={{
          backgroundColor: 'var(--input-bg)',
          borderColor: isOpen ? 'var(--accent)' : 'var(--border)',
          color: 'var(--text-main)'
        }}
        title="Select icon/emoji"
      >
        <span className="text-base select-none">{selectedEmoji || '✨'}</span>
        <Smile className="w-3 h-3 text-[#71717a]" />
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div
          className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 rounded-2xl border shadow-2xl p-3 z-50 animate-fade-in backdrop-blur-md"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
            color: 'var(--text-main)'
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between pb-2 mb-2.5 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <span>Choose Icon</span>
              <span className="text-[10px] text-[#71717a] font-normal">(انتخاب ایموجی)</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-[#71717a] hover:text-[#f4f4f6] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Custom Emoji Input */}
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5 mb-2.5">
            <div
              className="flex-1 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs"
              style={{
                backgroundColor: 'var(--cell-empty)',
                borderColor: 'var(--border)'
              }}
            >
              <Search className="w-3 h-3 text-[#71717a]" />
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Or type custom emoji..."
                className="w-full bg-transparent focus:outline-none text-xs"
                maxLength={4}
              />
            </div>
            {customInput && (
              <button
                type="submit"
                className="px-2 py-1 text-xs font-medium rounded-lg bg-[#f5d087] text-[#09090b] hover:opacity-90 transition-opacity"
              >
                Use
              </button>
            )}
          </form>

          {/* Category Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors cursor-pointer shrink-0 border ${
                activeCategory === 'all'
                  ? 'bg-[#f5d087] text-[#09090b] border-transparent font-semibold'
                  : 'text-[#71717a] border-transparent hover:border-[#222227]'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors cursor-pointer shrink-0 border ${
                  activeCategory === cat.id
                    ? 'bg-[#f5d087] text-[#09090b] border-transparent font-semibold'
                    : 'text-[#71717a] border-transparent hover:border-[#222227]'
                }`}
              >
                {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
            {CATEGORIES.filter(
              (cat) => activeCategory === 'all' || activeCategory === cat.id
            ).map((cat) => (
              <div key={cat.id}>
                <div
                  className="text-[10px] font-medium mb-1 tracking-wider uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {cat.name}
                </div>
                <div className="grid grid-cols-7 sm:grid-cols-8 gap-1">
                  {cat.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleSelect(emoji)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:scale-125 transition-transform duration-150 cursor-pointer ${
                        selectedEmoji === emoji ? 'border border-[#f5d087] bg-white/5' : 'hover:bg-white/5'
                      }`}
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

