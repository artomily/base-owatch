"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui";
import {
  Play,
  Wallet,
  Eye,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  Zap,
} from "lucide-react";

interface LandingPageProps {
  onWalletConnect?: () => void;
}

export function LandingPage({
  onWalletConnect,
}: LandingPageProps): JSX.Element {
  const { isConnected, isConnecting } = useAccount();
  const { connect } = useConnect();
  const router = useRouter();
  const [isConnectingState, setIsConnectingState] = useState<boolean>(false);

  const handleWalletConnect = async (): Promise<void> => {
    if (isConnected) {
      // Already connected, redirect to dashboard
      router.push('/dashboard/videos');
      return;
    }

    setIsConnectingState(true);
    connect({ connector: injected() });
    // Just wait a bit for connection to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsConnectingState(false);
  };

  // Auto redirect when wallet is connected
  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard/videos');
    }
  }, [isConnected, router]);

  const features = [
    {
      icon: <Eye className="h-8 w-8 text-purple-500" />,
      title: "Watch to Earn",
      description:
        "Earn OWATCH tokens by watching engaging video content across various categories.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      title: "Real Rewards",
      description:
        "Convert your viewing time into real cryptocurrency rewards that you can withdraw anytime.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
      title: "Track Progress",
      description:
        "Monitor your earnings, watch time, and progress through detailed analytics and charts.",
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "Community",
      description:
        "Join thousands of users earning rewards while staying updated with the latest content.",
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: "Secure",
      description:
        "Built on blockchain technology with secure wallet integration and transparent rewards.",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Instant Rewards",
      description:
        "Earn tokens in real-time as you watch, with instant updates to your balance.",
    },
  ];

  const stats = [
    {
      label: "Total Users",
      value: "50K+",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Tokens Distributed",
      value: "2.5M",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Hours Watched",
      value: "1M+",
      icon: <Play className="h-5 w-5" />,
    },
    {
      label: "Active Creators",
      value: "500+",
      icon: <Eye className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Play className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">O'Watch.ID</h1>
          </div>
          <Badge
            variant="secondary"
            className="bg-purple-500/20 text-purple-200 border-purple-500/30"
          >
            Beta Platform
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Watch.{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Earn.
            </span>{" "}
            Repeat.
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your viewing time into cryptocurrency rewards. Join the
            future of entertainment where every minute watched earns you OWATCH
            tokens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleWalletConnect}
              disabled={isConnecting || isConnectingState}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isConnecting || isConnectingState) ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </div>
              ) : isConnected ? (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  Wallet Connected - Go to Dashboard
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </>
              )}
            </button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 text-lg bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-center"
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-2 text-purple-400">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">
              Why Choose O'Watch.ID?
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the next generation of content consumption with
              built-in rewards and blockchain technology.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-white text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">How It Works</h3>
            <p className="text-xl text-gray-300">
              Simple steps to start earning with O'Watch.ID
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Connect Wallet
              </h4>
              <p className="text-gray-300">
                Link your crypto wallet to securely receive OWATCH token
                rewards.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Watch Content
              </h4>
              <p className="text-gray-300">
                Browse and watch videos from various categories including
                crypto, tech, and gaming.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Earn Rewards
              </h4>
              <p className="text-gray-300">
                Automatically earn OWATCH tokens as you watch, track progress,
                and withdraw anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Start Earning?
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of users who are already earning cryptocurrency
                by watching their favorite content.
              </p>
              <Button
                onClick={handleWalletConnect}
                disabled={isConnecting}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg"
              >
                {isConnecting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Connecting Wallet...</span>
                  </div>
                ) : (
                  <>
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet & Start Earning
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Play className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">O'Watch.ID</span>
            </div>
            <div className="flex space-x-6 text-gray-300">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Documentation
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} O'Watch.ID. All rights reserved. Built on blockchain
              technology.
            </p>
          </div>
        </div>
      </footer>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}
