import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hsdLeaderBoardAPI } from '../config/api';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  TrendingUp,
  Calendar,
  Clock,
  Star,
  RefreshCw,
  Users
} from 'lucide-react';

const HSDLeaderBoard = () => {
  const { user } = useAuth();
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPeriod, setCurrentPeriod] = useState({
    start: '',
    end: '',
    name: ''
  });
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [userRank, setUserRank] = useState(null);

  const fetchLeaderBoard = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await hsdLeaderBoardAPI.getLeaderBoard();
      
      setLeaderBoard(response.data.leaderBoard);
      setCurrentPeriod(response.data.currentPeriod);
      setUserRank(response.data.userRank);

    } catch (error) {
      console.error('Failed to fetch HSD leader board:', error);
      setError('Failed to load leader board. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateCountdown = () => {
    if (!currentPeriod.end) return;

    const endDate = new Date(currentPeriod.end);
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    } else {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  };

  useEffect(() => {
    if (user) {
      fetchLeaderBoard();
    }
  }, [user]);

  useEffect(() => {
    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [currentPeriod.end]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return <Trophy className="w-6 h-6 text-gray-500" />;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getRowHighlight = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border-gray-200 dark:border-gray-600';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
            <img
              src="https://res.cloudinary.com/dqdcmluxj/image/upload/v1734609205/file_g75vh2.png"
              alt="HSD Diamond"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            HSD Leader Board
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Top HSC spenders competing for HSD Diamond rewards
          </p>
        </div>

        {/* Current Period & Countdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Period */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Current Period
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {currentPeriod.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(currentPeriod.start).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} - {new Date(currentPeriod.end).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Time Remaining
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-3">
                  <div className="text-2xl font-bold">{countdown.days}</div>
                  <div className="text-xs">Days</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-3">
                  <div className="text-2xl font-bold">{countdown.hours}</div>
                  <div className="text-xs">Hours</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-3">
                  <div className="text-2xl font-bold">{countdown.minutes}</div>
                  <div className="text-xs">Minutes</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-3">
                  <div className="text-2xl font-bold">{countdown.seconds}</div>
                  <div className="text-xs">Seconds</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User's Current Rank */}
        {userRank && (
          <div className="card p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Current Position
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Keep spending to climb the ranks!
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  #{userRank.rank}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {userRank.totalSpent.toLocaleString()} HSC spent
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Leader Board */}
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Trophy className="w-8 h-8 mr-3" />
              Top HSC Spenders
            </h2>
            <p className="text-purple-100 mt-2">
              Top 3 users will receive +1 HSD Diamond at the end of this period
            </p>
          </div>

          <div className="p-6">
            {leaderBoard.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No data available
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Start spending HSC to appear on the leader board!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderBoard.map((entry, index) => (
                  <div
                    key={entry.userId._id}
                    className={`rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${getRowHighlight(index + 1)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Rank Icon */}
                        <div className="flex-shrink-0">
                          {getRankIcon(index + 1)}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                            {entry.userId.profileImage ? (
                              <img
                                src={entry.userId.profileImage}
                                alt={entry.userId.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-600 font-semibold text-lg">
                                {entry.userId.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {entry.userId.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {entry.userId.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        {/* HSC Spent */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {entry.totalSpent.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            HSC Spent
                          </div>
                        </div>

                        {/* Rank Badge */}
                        <div className={`px-4 py-2 rounded-full font-bold text-lg ${getRankBadge(index + 1)}`}>
                          #{index + 1}
                        </div>

                        {/* Top 3 Star */}
                        {index < 3 && (
                          <Star className="w-6 h-6 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>

                    {/* Additional Info for Top 3 */}
                    {index < 3 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-center">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                            🎉 Will receive +1 HSD Diamond at period end!
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4">
            <button
              onClick={fetchLeaderBoard}
              disabled={loading}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Leader Board
            </button>
          </div>
        </div>

        {/* Rules & Information */}
        <div className="card p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Competition Period</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Each period lasts exactly 2 months</li>
                <li>• January-February, March-April, May-June, etc.</li>
                <li>• Rankings reset at the start of each period</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rewards</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Top 3 users receive +1 HSD Diamond</li>
                <li>• Rewards distributed automatically at period end</li>
                <li>• Winners receive congratulations email & notification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HSDLeaderBoard;
