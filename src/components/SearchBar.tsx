import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search captions...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-14 pr-12 py-4 bg-white rounded-2xl border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-md font-medium placeholder:text-gray-400"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
