import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  count: number;
  onClick: () => void;
}

const categoryColors: Record<string, string> = {
  'Travel': 'from-purple-500 to-pink-500',
  'Gym/Fitness': 'from-orange-500 to-yellow-500',
  'Love/Romantic': 'from-pink-500 to-rose-500',
  'Wedding': 'from-purple-400 to-pink-400',
  'Friends': 'from-yellow-400 to-orange-400',
  'Food': 'from-orange-500 to-red-400',
  'Fashion': 'from-pink-500 to-purple-500',
  'Nature': 'from-yellow-500 to-green-500',
  'Daily Life': 'from-purple-500 to-blue-500',
  'Aesthetic/Minimal': 'from-pink-400 to-purple-400',
  'Funny/Sarcastic': 'from-yellow-500 to-orange-500',
  'Motivational/Quotes': 'from-orange-600 to-red-500',
  'Bollywood': 'from-purple-600 to-pink-600',
  'Hollywood': 'from-pink-600 to-red-500',
  'Color': 'from-yellow-400 to-pink-400',
  'Cringe': 'from-orange-400 to-yellow-400'
};

export function CategoryCard({ name, icon: Icon, count, onClick }: CategoryCardProps) {
  const colorClass = categoryColors[name] || 'from-purple-500 to-pink-500';

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center space-y-4 group hover:scale-105 border-2 border-transparent hover:border-purple-200"
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-md`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-gray-800 text-sm">{name}</h3>
        <p className="text-xs text-gray-500 mt-1 font-medium">{count} captions</p>
      </div>
    </button>
  );
}
