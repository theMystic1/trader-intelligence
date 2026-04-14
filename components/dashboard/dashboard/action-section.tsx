"use client";

import { actionCards, cardIconColors } from "@/lib/constants";
import { Icon } from "./Dashboard";

const ActionsSections = () => {
  return (
    <section className="grid grid-grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-3 mb-5">
      {actionCards.map((card) => {
        const c = cardIconColors[card.color];
        return (
          <div
            key={card.title}
            style={{
              background: "#1a1f2e",
              border: "1px solid #2a3040",
              borderRadius: 10,
              padding: "18px 16px",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: c.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Icon name={card.icon} size={20} color={c.stroke} />
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#e2e8f0",
                marginBottom: 8,
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#9ca3af",
                lineHeight: 1.5,
                marginBottom: 14,
              }}
            >
              {card.desc}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#3b82f6",
                display: "flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              Get started →
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ActionsSections;
