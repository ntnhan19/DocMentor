// User dashboard components
interface WelcomeBannerProps {
  user: { name: string; avatar: string; level: string };
  streak: number;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user, streak }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Xin chào, {user.name}! 👋</h2>
        </div>
        <img
          src={user.avatar}
          alt={user.name}
          className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
        />
      </div>
    </div>
  );
};

export default WelcomeBanner;
