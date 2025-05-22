import { format } from 'date-fns';

// Generate a unique ID
export const nanoid = () => {
  return Math.random().toString(36).substring(2, 10) + 
         Date.now().toString(36);
};

// Format date to a human-readable string
export const formatDate = (dateString: string, formatStr: string = 'PP') => {
  try {
    return format(new Date(dateString), formatStr);
  } catch (e) {
    return dateString;
  }
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Get welcome message based on time of day
export const getWelcomeMessage = (name: string): string => {
  const hour = new Date().getHours();
  const messages = [
    `🎉 Welcome back, ${name}! Ready to vibe with your memories? 📸🎈`,
    `🦄 Hey ${name}! Your magical gallery awaits 🌟✨`,
    `🌈 Great to see you, ${name}! Let's explore your photo journey! 📱`,
    `🥳 ${name}! Your memories are just a click away! 🖼️`,
  ];
  
  if (hour < 12) {
    return `☀️ Good morning, ${name}! ${messages[Math.floor(Math.random() * messages.length)]}`;
  } else if (hour < 18) {
    return `🌤️ Good afternoon, ${name}! ${messages[Math.floor(Math.random() * messages.length)]}`;
  } else {
    return `🌙 Good evening, ${name}! ${messages[Math.floor(Math.random() * messages.length)]}`;
  }
};

// Generate a random emoji for albums
export const getRandomEmoji = (): string => {
  const emojis = ['📸', '🖼️', '🌅', '🌄', '🎭', '🎬', '🎨', '🎪', '🎡', '🎠', '🎯', '🎮', '🎤', '🎧', '🎵', '🎶', '🎹', '🎺', '🎻', '🎼', '🎸', '🎷', '🎲', '🎰', '🎪', '🎭', '🎨', '🧩', '🧸', '🎁', '🎈', '🎉', '🎊', '🎀', '🎆', '🎇', '🧨', '✨', '🎐', '🎏', '🎎', '🎍', '🎋', '🎄', '🎃', '🎑', '🎢', '🎮'];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

// Emoji picker suggestions
export const emojiCategories = [
  { 
    name: 'Most Used', 
    emojis: ['📸', '🖼️', '🌅', '⛰️', '🌊', '🏝️', '🎭', '🎪', '🎬', '📱', '👨‍👩‍👧‍👦', '🎉', '✨', '💕', '🎂']
  },
  { 
    name: 'Nature', 
    emojis: ['🌳', '🌲', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌍', '🌎', '🌏', '🌑', '🌒']
  },
  { 
    name: 'Travel', 
    emojis: ['🗺️', '🧭', '✈️', '🚀', '🛸', '🚁', '🚢', '⛵', '🚞', '🚂', '🚊', '🚆', '🚖', '🚘', '🚍', '🏖️']
  },
  { 
    name: 'Activities', 
    emojis: ['🎮', '🎯', '🎲', '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '🥋', '⛳']
  },
  { 
    name: 'Food', 
    emojis: ['🍕', '🍔', '🍟', '🌭', '🍿', '🧂', '🥓', '🥚', '🧀', '🥗', '🥙', '🥪', '🌮', '🌯', '🍱', '🍛']
  },
];