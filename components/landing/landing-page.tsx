"use client";

import { tradeFeatures } from "@/lib/constants";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Landing = () => {
  const router = useRouter();
  return (
    <main className="relative overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative">
        {/* Glow Background */}
        <div className="absolute w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-[100px] rounded-full right-0 top-20 animate-pulse" />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text"
        >
          Trade With Precision.
          <br />
          Execute With Discipline.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-gray-400 max-w-xl"
        >
          A behavioral trading OS that helps you build strategies, track
          performance, and eliminate emotional mistakes.
        </motion.p>

        <motion.div
          className="mt-8 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            className="px-6 py-3 bg-indigo-500 rounded-xl hover:scale-105 transition cursor-pointer z-50"
            onClick={() => router.push("/signup")}
          >
            Start Free
          </button>

          {/*<button className="px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition">
            Live Demo
          </button>*/}
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need To Trade Like A Pro
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {tradeFeatures.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="font-semibold text-lg">{feature?.title}</h3>
              <p className="text-gray-400 mt-2 text-sm">
                {feature?.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= DASHBOARD PREVIEW ================= */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">
          See Your Trading Performance Clearly
        </h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto backdrop-blur-xl"
        >
          <div className="h-64 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
            Chart Preview
          </div>
        </motion.div>
      </section>

      {/* ================= SOCIAL PROOF ================= */}
      <section className="py-20 text-center">
        <h3 className="text-xl text-gray-400 mb-6">
          Trusted by traders worldwide
        </h3>

        <div className="flex justify-center gap-10 text-gray-500">
          <span>10K+ Users</span>
          <span>200K+ Trades Logged</span>
          <span>AI Driven Insights</span>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 text-center">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="max-w-3xl mx-auto p-10 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/10"
        >
          <h2 className="text-3xl font-bold">
            Start Trading With Discipline Today
          </h2>

          <button className="mt-6 px-8 py-4 bg-indigo-500 rounded-xl hover:scale-105 transition">
            Get Started Free
          </button>
        </motion.div>
      </section>
    </main>
  );
};

export default Landing;
