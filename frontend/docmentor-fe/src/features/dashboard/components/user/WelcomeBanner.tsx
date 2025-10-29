// User dashboard components
// ===== WELCOME BANNER =====
interface WelcomeBannerProps {
  user: { name: string; avatar: string; level: string };
  streak: number;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user, streak }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-secondary rounded-2xl p-8 shadow-2xl animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            Xin chào, {user.name}! 👋
          </h2>
          <p className="text-white/80 text-sm font-medium">
            🔥 Streak:{" "}
            <span className="text-yellow-300 font-bold">{streak} ngày</span>
          </p>
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-white text-xs font-semibold">
              {user.level}
            </span>
          </div>
        </div>
        <div className="animate-float">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full border-4 border-white/30 shadow-2xl backdrop-blur-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
