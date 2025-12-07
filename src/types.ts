export interface Caption {
  id: string;
  caption_text: string;
  category: string;
  categories: string[];
  tone?: string;
  tags: string[];
  used_count: number;
  created_at: string;
  updated_at: string;
}

export const CATEGORIES = [
  'Travel',
  'Gym/Fitness',
  'Love/Romantic',
  'Wedding',
  'Friends',
  'Food',
  'Fashion',
  'Nature',
  'Daily Life',
  'Aesthetic/Minimal',
  'Funny/Sarcastic',
  'Motivational/Quotes',
  'Bollywood',
  'Hollywood',
  'Color',
  'Cringe'
] as const;

export type CategoryType = typeof CATEGORIES[number];
