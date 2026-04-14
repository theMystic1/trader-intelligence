"use client";

import { ins } from "framer-motion/m";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const inputBase: React.CSSProperties = {
  background: "#0f1117",
  border: "1px solid #1e2a3a",
  borderRadius: 8,
  padding: "10px 12px",
  color: "#e2e8f0",
  fontSize: 13,
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
};

function ChevronDown({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={style}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function RefreshIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function InfoIcon({ color = "#6b7280" }: { color?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ── Consistency tab ── */
function ConsistencyChart() {
  const labels = ["4/5", "4/6", "4/7", "4/8", "4/9", "4/10", "4/11"];
  const W = 700,
    H = 200;
  const pad = { t: 10, r: 10, b: 30, l: 36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  return (
    <div style={{ padding: "0 16px 16px" }}>
      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        {[
          { label: "Win Rate", value: "0.0%", color: "#22c55e" },
          { label: "Profit Factor", value: "0.00", color: "#22c55e" },
          { label: "Consistency", value: "0/100", color: "#3b82f6" },
          { label: "Win Streak", value: "0", color: "#f97316" },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* SVG chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: 200, display: "block" }}
      >
        {[0, 1, 2, 3, 4].map((v) => {
          const y = pad.t + innerH - (v / 4) * innerH;
          return (
            <g key={v}>
              <text
                x={pad.l - 6}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#374151"
              >
                ${v}
              </text>
              <line
                x1={pad.l}
                y1={y}
                x2={W - pad.r}
                y2={y}
                stroke="#1e2a3a"
                strokeDasharray="4 4"
              />
            </g>
          );
        })}
        {labels.map((label, i) => (
          <text
            key={label}
            x={pad.l + (i / (labels.length - 1)) * innerW}
            y={H - 6}
            textAnchor="middle"
            fontSize="11"
            fill="#374151"
          >
            {label}
          </text>
        ))}
        <line
          x1={pad.l}
          y1={pad.t + innerH}
          x2={W - pad.r}
          y2={pad.t + innerH}
          stroke="#22c55e"
          strokeWidth="2"
        />
      </svg>

      {/* Tip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 10,
          fontSize: 12,
          color: "#f59e0b",
          background: "#0f1117",
          border: "1px solid #1e2a3a",
          borderRadius: 8,
          padding: "10px 12px",
        }}
      >
        <InfoIcon color="#f59e0b" />
        Focus on improving your consistency
      </div>
    </div>
  );
}

/* ── Skills tab ── */
function SkillsChart() {
  const cx = 200,
    cy = 185,
    r = 115;
  const skills = [
    "Win Rate",
    "Consistency",
    "Risk Management",
    "Discipline",
    "Experience",
  ];
  const n = skills.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, radius: number) => ({
    x: cx + radius * Math.cos(angle(i)),
    y: cy + radius * Math.sin(angle(i)),
  });
  const rings = [0.2, 0.4, 0.6, 0.8, 1].map((s) =>
    skills.map((_, i) => point(i, r * s)),
  );
  const dataValues = [0.15, 0.18, 0.12, 0.16, 0.1];
  const dataPoints = skills.map((_, i) => point(i, r * dataValues[i]));

  return (
    <div>
      <svg
        viewBox="0 0 400 370"
        style={{
          width: "100%",
          maxWidth: 360,
          margin: "0 auto",
          display: "block",
          height: 260,
        }}
      >
        {rings.map((pts, ri) => (
          <polygon
            key={ri}
            points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#1e2a3a"
            strokeWidth="1"
          />
        ))}
        {skills.map((_, i) => {
          const o = point(i, r);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={o.x}
              y2={o.y}
              stroke="#1e2a3a"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(99,102,241,0.18)"
          stroke="#6366f1"
          strokeWidth="1.5"
        />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#6366f1" />
        ))}
        {skills.map((label, i) => {
          const lp = point(i, r + 22);
          return (
            <text
              key={i}
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
              dominantBaseline="middle"
            >
              {label}
            </text>
          );
        })}
      </svg>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "0 16px 16px",
          flexWrap: "wrap",
        }}
      >
        {[
          { icon: "✅", label: "Win Rate", bg: "#14532d", text: "#22c55e" },
          {
            icon: "ℹ️",
            label: "Risk Management",
            bg: "#1e3a5f",
            text: "#3b82f6",
          },
          { icon: "🔥", label: "Discipline", bg: "#431407", text: "#f97316" },
        ].map((item) => (
          <div
            key={item.label}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            <span style={{ fontSize: 13, color: "#d1d5db" }}>{item.label}</span>
            <span
              style={{
                fontSize: 11,
                background: item.bg,
                color: item.text,
                border: `1px solid ${item.text}50`,
                padding: "2px 8px",
                borderRadius: 6,
              }}
            >
              Expert
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Progress tab ── */
function ProgressTab() {
  const radius = 50,
    stroke = 7;
  const circ = 2 * Math.PI * radius;
  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}
      >
        <div
          style={{
            position: "relative",
            width: 112,
            height: 112,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="112"
            height="112"
            viewBox="0 0 112 112"
            style={{ transform: "rotate(-90deg)", position: "absolute" }}
          >
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="none"
              stroke="#1e2a3a"
              strokeWidth={stroke}
            />
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="none"
              stroke="url(#pg)"
              strokeWidth={stroke}
              strokeDasharray={circ}
              strokeDashoffset={circ * 0.93}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ textAlign: "center", zIndex: 1 }}>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                lineHeight: 1.2,
              }}
            >
              Elite
            </div>
            <div
              style={{
                color: "#6b7280",
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Level
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
            Total P&L
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#22c55e" }}>
            $0.00
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
            Trade Count
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#3b82f6" }}>
            0
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: "#d1d5db",
          marginBottom: 8,
        }}
      >
        <span>🏆</span>
        <span style={{ color: "#6b7280", fontSize: 12 }}>Next Achievement</span>
        <span style={{ fontSize: 12 }}>Consistency Master</span>
      </div>
      <div style={{ height: 6, borderRadius: 4, background: "#0f1117" }}>
        <div
          style={{
            height: 6,
            borderRadius: 4,
            width: "3%",
            background: "linear-gradient(90deg,#22c55e,#3b82f6)",
          }}
        />
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: "#d1d5db", marginBottom: 6 }}>
      {children}
    </div>
  );
}

function SelectField({
  options,
  defaultValue,
  instrument,
  onChange,
  value,
}: {
  options: string[] | { label: string; value: string }[];
  defaultValue?: string;
  instrument?: boolean;
  onChange?: (value: any) => void;
  value?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const updateQueryParams = (classId: string) => {
    const params = new URLSearchParams(sp.toString());

    if (!classId) {
      params.delete("category");
    } else {
      params.set("category", classId);
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(newUrl, { scroll: false });
  };

  return (
    <div style={{ position: "relative" }}>
      <select
        defaultValue={
          defaultValue ||
          (typeof options[0] === "string" ? options[0] : options[0]?.value)
        }
        value={value}
        style={{
          ...inputBase,
          appearance: "none",
          paddingRight: 32,
          cursor: "pointer",
        }}
        onChange={(e) => {
          const value = e.target.value;

          if (instrument) {
            updateQueryParams(value);
          } else {
            onChange?.(value);
          }
        }}
      >
        {options.map((o) => (
          <option
            key={typeof o === "string" ? o : o.value}
            value={typeof o === "string" ? o : o.value}
            style={{ background: "#131620" }}
          >
            {typeof o === "string" ? o : o.label}
          </option>
        ))}
      </select>
      <span
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#6b7280",
          pointerEvents: "none",
          display: "flex",
        }}
      >
        <ChevronDown />
      </span>
    </div>
  );
}

function InputField({
  placeholder,
  prefix,
  onChange,
  value,
  type = "text",
}: {
  placeholder?: string;
  prefix?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  type?: "text" | "number" | "password" | "date";
}) {
  return (
    <div
      style={{
        ...inputBase,
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "0 12px",
      }}
    >
      {prefix && (
        <span style={{ color: "#4b5563", fontSize: 13, flexShrink: 0 }}>
          {prefix}
        </span>
      )}
      <input
        placeholder={placeholder}
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#e2e8f0",
          fontSize: 13,
          flex: 1,
          height: 40,
          width: "100%",
        }}
        type={type}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

function ReadonlyField({ value }: { value: string }) {
  return <div style={{ ...inputBase, color: "#6b7280" }}>{value}</div>;
}

export {
  ChevronDown,
  RefreshIcon,
  XIcon,
  ConsistencyChart,
  SkillsChart,
  ProgressTab,
  InfoIcon,
  FieldLabel,
  SelectField,
  InputField,
  ReadonlyField,
  inputBase,
};
