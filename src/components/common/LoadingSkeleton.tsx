'use client';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'hotel-card' | 'hotel-list' | 'text' | 'image' | 'button';
  count?: number;
}

const SkeletonBase = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function LoadingSkeleton({ 
  className = '', 
  variant = 'text', 
  count = 1 
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'hotel-card':
        return (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <SkeletonBase className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <SkeletonBase key={i} className="w-4 h-4" />
                ))}
              </div>
              <SkeletonBase className="h-6 w-3/4" />
              <SkeletonBase className="h-4 w-1/2" />
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <SkeletonBase className="h-6 w-20" />
                  <SkeletonBase className="h-3 w-16" />
                </div>
                <SkeletonBase className="h-10 w-24" />
              </div>
            </div>
          </div>
        );

      case 'hotel-list':
        return (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <SkeletonBase className="md:w-80 h-64 md:h-auto" />
              <div className="flex-1 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <SkeletonBase className="h-6 w-2/3" />
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <SkeletonBase key={i} className="w-4 h-4" />
                      ))}
                    </div>
                    <SkeletonBase className="h-4 w-1/2" />
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, i) => (
                        <SkeletonBase key={i} className="h-6 w-16" />
                      ))}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <SkeletonBase className="h-8 w-24" />
                    <SkeletonBase className="h-4 w-16" />
                    <SkeletonBase className="h-4 w-20" />
                    <SkeletonBase className="h-10 w-24" />
                  </div>
                </div>
                <SkeletonBase className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        );

      case 'image':
        return <SkeletonBase className={`w-full h-full ${className}`} />;

      case 'button':
        return <SkeletonBase className={`h-10 w-24 ${className}`} />;

      case 'text':
      default:
        return <SkeletonBase className={`h-4 w-full ${className}`} />;
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}