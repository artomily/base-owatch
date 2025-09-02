"use client";

import { useState, useEffect } from "react";
import { useAccount } from 'wagmi';
import { Play, Pause, RotateCcw, Trophy, Clock, DollarSign } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  duration: string;
  reward: number;
  thumbnail: string;
  category: string;
  watched: boolean;
  progress: number;
  description: string;
}

// Dummy videos - nanti bisa diganti dengan data real dari API/Base
const dummyVideos: Video[] = [
  {
    id: 1,
    title: "Introduction to Web3 & Blockchain",
    duration: "5:30",
    reward: 10,
    thumbnail: "/api/placeholder/400/225",
    category: "Education",
    watched: false,
    progress: 0,
    description: "Learn the basics of Web3 technology and how blockchain works"
  },
  {
    id: 2,
    title: "Base Blockchain Deep Dive",
    duration: "8:15",
    reward: 15,
    thumbnail: "/api/placeholder/400/225",
    category: "Technology",
    watched: false,
    progress: 0,
    description: "Explore Base's high-performance blockchain architecture"
  },
  {
    id: 3,
    title: "DeFi Fundamentals",
    duration: "6:45",
    reward: 12,
    thumbnail: "/api/placeholder/400/225",
    category: "Finance",
    watched: false,
    progress: 0,
    description: "Understanding Decentralized Finance and its applications"
  },
  {
    id: 4,
    title: "NFT Marketplace Guide",
    duration: "7:20",
    reward: 14,
    thumbnail: "/api/placeholder/400/225",
    category: "NFT",
    watched: false,
    progress: 0,
    description: "Complete guide to buying, selling, and creating NFTs"
  },
  {
    id: 5,
    title: "Crypto Trading Strategies",
    duration: "9:10",
    reward: 18,
    thumbnail: "/api/placeholder/400/225",
    category: "Trading",
    watched: false,
    progress: 0,
    description: "Advanced trading strategies for cryptocurrency markets"
  },
  {
    id: 6,
    title: "Smart Contracts Explained",
    duration: "11:25",
    reward: 20,
    thumbnail: "/api/placeholder/400/225",
    category: "Development",
    watched: false,
    progress: 0,
    description: "How smart contracts work and their real-world applications"
  }
];

export function VideoContent(): JSX.Element {
  const { address, isConnected } = useAccount();
  const [videos, setVideos] = useState<Video[]>(dummyVideos);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [watchTime, setWatchTime] = useState<number>(0);
  const [showClaimModal, setShowClaimModal] = useState<boolean>(false);
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Load balance from localStorage on mount
  useEffect(() => {
    if (isConnected && address) {
      // Load balance from localStorage using wallet address as key
      const walletAddress = address;
      const savedBalance = parseInt(localStorage.getItem(`owatch_balance_${walletAddress}`) || '0');
      setBalance(savedBalance);
    }
  }, [isConnected, address]);

  // Timer untuk tracking watch time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedVideo) {
      interval = setInterval(() => {
        setWatchTime((prev) => {
          const newTime = prev + 1;
          const totalSeconds = getSecondsFromDuration(selectedVideo.duration);

          // Update progress
          const progress = (newTime / totalSeconds) * 100;
          updateVideoProgress(selectedVideo.id, Math.min(progress, 100));

          // Jika sudah selesai 80% atau lebih, bisa claim reward
          if (progress >= 80 && !claimedRewards.includes(selectedVideo.id)) {
            setShowClaimModal(true);
          }

          return newTime >= totalSeconds ? 0 : newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedVideo, claimedRewards]);

  const getSecondsFromDuration = (duration: string): number => {
    const [minutes, seconds] = duration.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const updateVideoProgress = (videoId: number, progress: number) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId ? { ...video, progress } : video
      )
    );
  };

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
    setWatchTime(0);
  };

  const handlePauseVideo = () => {
    setIsPlaying(false);
  };

  const handleResetVideo = () => {
    setWatchTime(0);
    setIsPlaying(false);
    if (selectedVideo) {
      updateVideoProgress(selectedVideo.id, 0);
    }
  };

  const handleClaimReward = (videoId: number, reward: number) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first!');
      return;
    }

    // Simulasi claim reward
    setClaimedRewards((prev) => [...prev, videoId]);
    setShowClaimModal(false);

    // Update balance using wallet address as key
    const walletAddress = address;
    const newBalance = balance + reward;
    setBalance(newBalance);
    localStorage.setItem(`owatch_balance_${walletAddress}`, newBalance.toString());

    // Update video status
    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId ? { ...video, watched: true } : video
      )
    );

    // Show success message
    alert(`🎉 Successfully claimed ${reward} OWATCH tokens!`);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFilteredVideos = () => {
    return videos.filter((video) => {
      const matchesFilter = filter === "all" || video.category.toLowerCase() === filter.toLowerCase();
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  };

  const categories = ["all", ...Array.from(new Set(videos.map(v => v.category.toLowerCase())))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Watch & Earn</h1>
          <p className="text-gray-600">
            {isConnected ? 'Watch videos and earn OWATCH tokens' : 'Connect your MetaMask wallet to start earning'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {isConnected && (
            <div className="flex items-center space-x-2 bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-semibold">{balance} OWATCH</span>
            </div>
          )}
          {!isConnected && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-sm">
              ⚠️ Wallet not connected
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video List */}
        <div className="lg:col-span-2 space-y-4">
          {getFilteredVideos().map((video) => (
            <div
              key={video.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-purple-200"
              onClick={() => handlePlayVideo(video)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-32 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center relative border border-purple-200">
                  <span className="text-purple-600 text-xs font-medium">Video</span>
                  {video.watched && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 font-semibold mb-1 text-lg">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{video.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">{video.reward} OWATCH</span>
                    </span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">{video.category}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${video.progress}%` }}
                    ></div>
                  </div>
                  {video.progress > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{video.progress.toFixed(0)}% watched</p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {video.watched ? (
                    <span className="text-green-600 text-sm flex items-center space-x-1 font-medium">
                      <Trophy className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <button
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVideo(video);
                      }}
                    >
                      Watch
                    </button>
                  )}
                  {video.progress >= 80 && !claimedRewards.includes(video.id) && (
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClaimReward(video.id, video.reward);
                      }}
                    >
                      Claim {video.reward} OWATCH
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
            <h3 className="text-gray-900 font-semibold mb-4 text-lg">Now Playing</h3>
            {selectedVideo ? (
              <div>
                <div className="w-full h-48 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl mb-4 flex flex-col items-center justify-center relative border border-purple-200">
                  <div className="text-center">
                    {isPlaying ? (
                      <Play className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                    ) : (
                      <Pause className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    )}
                    <span className="text-gray-900 text-sm font-medium">{selectedVideo.title}</span>
                  </div>
                  {selectedVideo.watched && (
                    <div className="absolute top-3 right-3">
                      <Trophy className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-3 mb-6">
                  <button
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg transition-all duration-200 border border-gray-300"
                    onClick={handleResetVideo}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Watch Time:</span>
                    <span className="text-gray-900 font-medium">{formatTime(watchTime)} / {selectedVideo.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Progress:</span>
                    <span className="text-gray-900 font-medium">{selectedVideo.progress.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reward:</span>
                    <span className="text-green-600 font-semibold">{selectedVideo.reward} OWATCH</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedVideo.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <span className="text-sm">Select a video to start watching</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-gray-900 text-2xl font-bold">🎉 Reward Available!</h3>
              </div>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                You've watched <strong className="text-purple-600">{selectedVideo.progress.toFixed(0)}%</strong> of "{selectedVideo.title}".
                Claim your <strong className="text-green-600">{selectedVideo.reward} OWATCH</strong> tokens!
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-gray-300"
                  onClick={() => setShowClaimModal(false)}
                >
                  Watch More
                </button>
                <button
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={() => handleClaimReward(selectedVideo.id, selectedVideo.reward)}
                >
                  Claim {selectedVideo.reward} OWATCH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}