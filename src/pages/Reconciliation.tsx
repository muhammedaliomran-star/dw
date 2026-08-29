import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { BezelCard } from "@/components/BezelCard";
import { useDB, fmt } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, CheckCircle2, ClipboardCheck, FileText, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Finding = { title: string; detail: string };

export default function Reconciliation() {
  const data = useDB();
  const [movements, setMovements] = useState<Array<{ stock_item_id: string; quantity: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: rows, error } = await (supabase.from as any)("stock_movements").select("stock_item_id,quantity");
        if (error) throw error;
        if (!cancelled) setMovements((rows ?? []).map((row: any) => ({ stock_item_id: row.stock_item_id, quantity: Number(row.quantity ?? 0) })));
      } catch (error: any) {
        if (!cancelled) toast.error(error.message ?? "تعذر تحميل حركات المخزون");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const findings = useMemo(() => {
    const output: Finding[] = [];
    const paymentsByInvoice = new Map<string, number>();
    for (const payment of data.payments) paymentsByInvoice.set(payment.invoiceId, (paymentsByInvoice.get(payment.invoiceId) ?? 0) + payment.amount);
    for (const invoice of data.invoices) {
      const expected = Math.min(invoice.total, invoice.downPayment + (paymentsByInvoice.get(invoice.id) ?? 0));
      if (Math.abs(invoice.paid - expected) > 0.01) output.push({ title: `فرق تحصيل في الفاتورة ${invoice.id.slice(0, 8)}`, detail: `المسجل ${fmt(invoice.paid)} ج.م، والصحيح حسب الدفعات ${fmt(expected)} ج.م.` });
      const items = data.invoiceItems.filter((item) => item.invoiceId === invoice.id);
      if (invoice.status !== "cancelled" && (items.length === 0 || items.some((item) => item.cost <= 0))) output.push({ title: `تكلفة ناقصة في الفاتورة ${invoice.id.slice(0, 8)}`, detail: "الفاتورة مستبعدة من حساب الربح حتى تُسجل تكلفة كل صنف." });
    }
    const movementTotals = new Map<string, number>();
    for (const movement of movements) movementTotals.set(movement.stock_item_id, (movementTotals.get(movement.stock_item_id) ?? 0) + movement.quantity);
    for (const item of data.stockItems) {
      const movementTotal = movementTotals.get(item.id);
      if (movementTotal !== undefined && Math.abs(item.quantity - movementTotal) > 0) output.push({ title: `فرق مخزون: ${item.name}`, detail: `الرصيد الحالي ${fmt(item.quantity)}، ومجموع الحركات ${fmt(movementTotal)}.` });
    }
    for (const returned of data.returns) {
      if (data.returnItems.every((item) => item.returnId !== returned.id)) output.push({ title: `مرتجع بلا بنود ${returned.id.slice(0, 8)}`, detail: "أضف بنود المرتجع أو اعكس السجل قبل الاعتماد على إجماليه." });
    }
    return output;
  }, [data.invoices, data.invoiceItems, data.payments, data.returns, data.returnItems, data.stockItems, movements]);

  return (
    <AppShell>
      <div dir="rtl" className="space-y-6 pb-20">
        <PageHeader title="مركز المطابقة" subtitle="مراجعة الفروق بين الفواتير والدفعات والمخزون والمرتجعات." icon={<ClipboardCheck className="h-7 w-7" />} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="المشاكل المكتشفة" value={fmt(findings.length)} icon={<AlertTriangle className="w-5 h-5" />} tone={findings.length > 0 ? "danger" : "success"} sub={findings.length > 0 ? "تحتاج إلى مراجعة وتدقيق" : "لا توجد أي فروقات"} />
          <Metric label="الفواتير المسجلة" value={fmt(data.invoices.length)} icon={<FileText className="w-5 h-5" />} tone="neutral" sub="إجمالي الفواتير في النظام" />
          <Metric label="حركات المخزون" value={loading ? "..." : fmt(movements.length)} icon={<Package className="w-5 h-5" />} tone="neutral" sub="عمليات الصرف والإيداع" />
        </div>
        {loading ? (
          <BezelCard className="grid min-h-40 place-items-center">
            <Loader2 className="h-7 w-7 animate-spin" />
          </BezelCard>
        ) : findings.length === 0 ? (
          <BezelCard className="flex items-center gap-3 p-6 text-success">
            <CheckCircle2 className="h-6 w-6" />
            <div>
              <p className="font-bold">لا توجد فروق مكتشفة</p>
              <p className="text-sm text-muted-foreground">البيانات المتاحة متطابقة حاليًا.</p>
            </div>
          </BezelCard>
        ) : (
          <div className="grid gap-3">
            {findings.map((finding, index) => (
              <BezelCard key={`${finding.title}-${index}`} className="flex items-start gap-3 border-warning/30 p-5">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                <div>
                  <p className="font-bold">{finding.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{finding.detail}</p>
                </div>
              </BezelCard>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Metric({ label, value, icon, tone = "neutral", sub }: { label: string; value: string; icon: React.ReactNode; tone?: "neutral" | "danger" | "success"; sub?: string }) {
  const isDanger = tone === "danger";
  const isSuccess = tone === "success";

  const borderCls = isDanger
    ? "border-danger/30 hover:border-danger/60"
    : isSuccess
    ? "border-success/30 hover:border-success/60"
    : "border-border/30 hover:border-border/40";

  const chipCls = isDanger
    ? "bg-danger/10 border-danger/30 text-danger"
    : isSuccess
    ? "bg-success/10 border-success/30 text-success"
    : "bg-foreground/[0.06] border-border/30 text-muted-foreground ring-1 ring-border";

  const textCls = isDanger ? "text-danger" : isSuccess ? "text-success" : "text-foreground";

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border bg-card/70 plate p-5 transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5", borderCls)}>
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-gradient-to-bl from-transparent to-transparent" />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className={cn("w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0", chipCls)}>
            {icon}
          </div>
          <div className="text-xs text-muted-foreground text-left max-w-[60%] leading-relaxed font-medium">{label}</div>
        </div>
        <div className={cn("text-2xl lg:text-3xl font-extrabold mt-4 tabular-nums text-right", textCls)}>{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-1.5 text-right">{sub}</div>}
      </div>
    </div>
  );
}
