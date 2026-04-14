"use client";

const GraphPieSection = () => {
  return (
    <section className="bg-[#1a1f2e] border border-[#2a3040] py-8 px-5 text-center mb-4">
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          background: "linear-gradient(90deg,#3b82f6,#8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 8,
        }}
      >
        Ready to start journaling?
      </div>
      <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>
        Your dashboard will come alive with charts, stats, and AI insights once
        <br />
        you log your first trade. Pick a path below to get started.
      </div>
    </section>
  );
};

export default GraphPieSection;
