import type { LucideIcon } from "lucide-react";
import React from "react";
import { CountUp } from "@/components/CountUp";
import { Sparkline } from "@/components/Sparkline";
import { cn } from "@/lib/utils";

export type MetricTone = "positive" | "neutral" | "danger" | "warning" | "primary" | "success" | "muted";

export function MetricLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-xs text-muted-foreground text-left max-w-[60%] leading-relaxed font-medium block",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** كارت مؤشر موحد بنفس تصميم ومقاس بطاقات قسم الموردين والمخزون */
export function MetricCard({
  label,
  value,
  sub,
  icon,
  tone = "neutral",
  series,
  isMoney = true,
  masked = false,
  hero = false,
  format,
  className,
}: {
  label: string;
  value: number | string;
  sub?: React.ReactNode;
  icon?: LucideIcon | React.ReactNode;
  tone?: MetricTone;
  series?: number[];
  isMoney?: boolean;
  masked?: boolean;
  hero?: boolean;
  format?: (n: number) => string;
  className?: string;
}) {
  const isDanger = tone === "danger";
  const isPositive = tone === "positive" || tone === "success";
  const isWarning = tone === "warning";
  const isPrimary = tone === "primary";

  const borderCls = isDanger
    ? "border-danger/30 hover:border-danger/60"
    : isPositive
    ? "border-success/30 hover:border-success/60"
    : isWarning
    ? "border-warning/30 hover:border-warning/60"
    : isPrimary
    ? "border-primary/30 hover:border-primary/60"
    : "border-border/30 hover:border-border/40";

  const chipCls = isDanger
    ? "bg-danger/10 border-danger/30 text-danger"
    : isPositive
    ? "bg-success/10 border-success/30 text-success"
    : isWarning
    ? "bg-warning/10 border-warning/30 text-warning"
    : isPrimary
    ? "bg-primary/10 border-primary/30 text-primary"
    : "bg-foreground/[0.06] border-border/30 text-muted-foreground ring-1 ring-border";

  const textCls = isDanger
    ? "text-danger"
    : isPositive
    ? "text-success"
    : isWarning
    ? "text-warning"
    : isPrimary
    ? "text-primary"
    : "text-foreground";

  // Render Icon whether it is a Component or ReactNode
  let renderedIcon: React.ReactNode = null;
  if (icon) {
    if (typeof icon === "function") {
      const IconComponent = icon as LucideIcon;
      renderedIcon = <IconComponent className="w-5 h-5" />;
    } else {
      renderedIcon = icon;
    }
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card/70 plate p-5 transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5",
        borderCls,
        className,
      )}
    >
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-gradient-to-bl from-transparent to-transparent" />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0",
              chipCls,
            )}
          >
            {renderedIcon}
          </div>
          <div className="text-xs text-muted-foreground text-left max-w-[60%] leading-relaxed font-medium">
            {label}
          </div>
        </div>

        <div
          className={cn(
            "text-2xl lg:text-3xl font-extrabold mt-4 tabular-nums text-right",
            textCls,
            masked && "privacy-blur",
          )}
        >
          {typeof value === "number" ? (
            format ? (
              <CountUp value={value} duration={1000} format={format} />
            ) : isMoney ? (
              <>
                <CountUp value={value} duration={1000} /> <span className="text-xs font-bold text-muted-foreground">ج.م</span>
              </>
            ) : (
              <CountUp value={value} duration={1000} />
            )
          ) : (
            value
          )}
        </div>

        {sub && (
          <div className="text-xs text-muted-foreground mt-1.5 text-right">
            {sub}
          </div>
        )}

        {series && series.length > 1 && (
          <div
            className={cn(
              "pointer-events-none -mx-5 -mb-5 mt-2 opacity-80",
              tone === "neutral" ? "text-muted-foreground" : textCls,
            )}
          >
            <Sparkline data={series} height={36} />
          </div>
        )}
      </div>
    </div>
  );
}

