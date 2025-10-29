import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#040404] text-white relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#44cc00]/5 via-transparent to-transparent pointer-events-none" />

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/landingpageBg.png"
          alt="Landing page background"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Main content */}
      <main className="relative flex items-center justify-center min-h-screen px-6">
        <div className="flex items-center justify-between w-full max-w-7xl gap-12">
          {/* Left side - Text content */}
          <div className="flex-1 space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#44cc00]/10 border border-[#44cc00]/30 rounded-full text-[#44cc00] text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Self Transformation
            </div>

            <div className="space-y-6">
              <h1 className="text-[7rem] leading-[1] font-light tracking-tight text-white/95">
                Transform
                <br />
                <span className="bg-gradient-to-r from-[#44cc00] to-white bg-clip-text text-transparent">
                  Your Life
                </span>
              </h1>

              <p className="text-xl text-white/70 font-light tracking-wide max-w-xl leading-relaxed">
                An AI-powered personal transformation platform that helps you become your ideal self through personalized habits, goals, and intelligent insights.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#44cc00]/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-[#44cc00]" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">85%</div>
                  <div className="text-xs text-white/60">Success Rate</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Award className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">10K+</div>
                  <div className="text-xs text-white/60">Active Users</div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Link
                href="/onboarding"
                className="group relative px-8 py-4 bg-[#44cc00] text-[#040404] rounded-xl font-medium text-lg hover:bg-[#3eb300] transition-all duration-300 shadow-lg shadow-[#44cc00]/20 hover:shadow-xl hover:shadow-[#44cc00]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
                <ArrowRight className="inline ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/docs"
                className="group px-8 py-4 bg-transparent border-2 border-white/20 rounded-xl text-white text-lg font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
              >
                Explore Docs
              </Link>
            </div>
          </div>

          {/* Right side - Number 9 logo */}
          <div className="flex-shrink-0 ml-16 relative">
            <div className="relative animate-float">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#44cc00]/20 to-transparent blur-3xl" />
              <Image
                src="/images/Number 9.png"
                alt="Orchestra 9 Logo"
                width={400}
                height={400}
                className="object-contain relative z-10"
                priority
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
