import { GitCompare } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';

export default function CompareButton({ slug, className = '', size = 'md' }) {
  const { isInCompareList, toggleCompare } = useWedding();
  const inCompare = isInCompareList(slug);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCompare(slug);
      }}
      className={`${sizes[size]} rounded-full flex items-center justify-center transition-all ${
        inCompare 
          ? 'bg-blue-500 text-white scale-110' 
          : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-blue-50 hover:text-blue-500'
      } shadow-lg hover:shadow-xl ${className}`}
      title={inCompare ? 'Remove from compare' : 'Add to compare'}
    >
      <GitCompare className={iconSizes[size]} />
    </button>
  );
}
