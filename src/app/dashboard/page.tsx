import DashboardContent from '@/components/dashboard/DashboardContent';
import AnimatedBackground from '@/components/dashboard/AnimatedBackground';

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Layer */}
      <AnimatedBackground />

      {/* Content Layer */}
      <div className="relative z-10">
        <DashboardContent />
      </div>
    </div>
  );
}
