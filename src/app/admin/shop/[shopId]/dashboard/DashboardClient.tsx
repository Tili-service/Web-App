"use client";

import { useState, useMemo } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell,
    BarChart, Bar,
} from "recharts";
import {
    Euro, ShoppingBag, TrendingUp, TrendingDown,
    CreditCard, Package, BarChart3, Trophy,
} from "lucide-react";
import { DashboardStats } from "@/lib/dashboardMockData";

const PIE_COLORS = ["hsl(8,66%,47%)", "hsl(182,29%,38%)", "hsl(30,100%,67%)"];
const CHART_STYLE = { borderRadius: "0.75rem", border: "1px solid hsl(181,15%,85%)", fontSize: 12, fontFamily: "DM Sans" };
const TICK = { fontSize: 10, fill: "hsl(355,10%,55%)", fontFamily: "DM Sans" };

type Period = "today" | "week" | "month";

function fmt(n: number) {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}
function fmtRound(n: number) {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}
function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}
function timeAgo(iso: string) {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
    if (mins < 60)
        return `${mins} min`;
    return `${Math.floor(mins / 60)}h`;
}
function initial(name: string) { return name.charAt(0).toUpperCase(); }

function Pills<T extends string | number | null>({
    options, selected, onChange, small,
}: {
    options: { value: T; label: string }[];
    selected: T;
    onChange: (v: T) => void;
    small?: boolean;
}) {
    const base = `font-body transition-all duration-150 whitespace-nowrap shrink-0 ${small ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"}  rounded-lg`;
    const active = "bg-card text-foreground shadow-sm border border-border";
    const idle = "text-muted-foreground hover:text-foreground";
    return (
        <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-1 overflow-x-auto scrollbar-none">
            {options.map((o) => (
                <button
                    key={String(o.value)}
                    onClick={() => onChange(o.value)}
                    className={`${base} ${selected === o.value ? active : idle}`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

function KpiCard({ label, value, sub, positive, icon }: {
    label: string; value: string; sub?: string; positive?: boolean; icon: React.ReactNode;
}) {
    return (
        <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide leading-none pt-0.5">{label}</p>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">{icon}</div>
            </div>
            <p className="font-display text-[1.65rem] font-bold text-foreground leading-none">{value}</p>
            {sub && (
                <div className={`flex items-center gap-1 text-xs font-body font-medium ${positive ? "text-emerald-600" : "text-destructive"}`}>
                    {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {sub}
                </div>
            )}
        </div>
    );
}

function Title({ children, note }: { children: React.ReactNode; note?: string }) {
    return (
        <div className="flex items-baseline gap-2 mb-4">
            <h2 className="font-display text-sm font-semibold text-foreground">{children}</h2>
            {note && <span className="text-xs font-body text-muted-foreground">{note}</span>}
        </div>
    );
}

export default function DashboardClient({ stats }: { stats: DashboardStats }) {
    const { today, month, revenue_by_day, sales_by_hour, payment_breakdown, top_items, recent_sales, profiles } = stats;

    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
    const [period, setPeriod] = useState<Period>("month");

    const selectedProfile = useMemo(
        () => profiles.find((p) => p.profile_id === selectedProfileId) ?? null,
        [profiles, selectedProfileId],
    );

    const filteredSales = useMemo(
        () => selectedProfileId === null ? recent_sales : recent_sales.filter((s) => s.profile_id === selectedProfileId),
        [recent_sales, selectedProfileId],
    );

    const caChartData = useMemo(() => {
        if (period === "today") {
            return sales_by_hour.map((h) => ({ label: `${h.hour}h`, revenue: h.revenue, sales: h.count }));
        }
        const slice = period === "week" ? revenue_by_day.slice(-7) : revenue_by_day;
        return slice.map((d) => ({ label: fmtDate(d.date), revenue: d.revenue, sales: d.sales }));
    }, [period, revenue_by_day, sales_by_hour]);

    const weekData = revenue_by_day.slice(-7);
    const weekRevenue = weekData.reduce((s, d) => s + d.revenue, 0);
    const weekSales   = weekData.reduce((s, d) => s + d.sales, 0);

    const kpis = useMemo(() => {
        if (selectedProfile) {
            return { revenue: selectedProfile.revenue, sales: selectedProfile.sales_count, avg: selectedProfile.avg_basket, delta: null, deltaLabel: null };
        }
        if (period === "today")  return { revenue: today.revenue, sales: today.sales_count, avg: today.avg_basket, delta: today.vs_yesterday_pct, deltaLabel: "vs hier" };
        if (period === "week")   return { revenue: weekRevenue, sales: weekSales, avg: weekSales > 0 ? weekRevenue / weekSales : 0, delta: null, deltaLabel: null };
        return { revenue: month.revenue, sales: month.sales_count, avg: month.revenue / Math.max(month.sales_count, 1), delta: month.vs_last_month_pct, deltaLabel: "vs mois préc." };
    }, [period, selectedProfile, today, weekRevenue, weekSales, month]);

    const maxHourCount = Math.max(...sales_by_hour.map((h) => h.count));

    const periodOptions: { value: Period; label: string }[] = [
        { value: "today", label: "Aujourd'hui" },
        { value: "week",  label: "7 jours"     },
        { value: "month", label: "30 jours"    },
    ];

    const profileOptions = [
        { value: null as number | null, label: "Tous" },
        ...profiles.map((p) => ({ value: p.profile_id as number | null, label: p.name })),
    ];

    return (
        <div className="space-y-4 pb-10">

            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h1 className="font-display text-2xl font-bold text-foreground">Tableau de bord</h1>
                    <Pills options={profileOptions} selected={selectedProfileId} onChange={setSelectedProfileId} />
                </div>
                <div className="w-fit">
                    <Pills options={periodOptions} selected={period} onChange={setPeriod} small />
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <KpiCard
                    label={selectedProfile ? "CA total" : period === "today" ? "CA aujourd'hui" : period === "week" ? "CA 7 jours" : "CA du mois"}
                    value={fmt(kpis.revenue)}
                    sub={kpis.delta !== null ? `${kpis.delta > 0 ? "+" : ""}${kpis.delta}% ${kpis.deltaLabel}` : undefined}
                    positive={(kpis.delta ?? 0) >= 0}
                    icon={<Euro size={15} />}
                />
                <KpiCard
                    label="Nombre de ventes"
                    value={String(kpis.sales)}
                    icon={<ShoppingBag size={15} />}
                />
                <KpiCard
                    label="Panier moyen"
                    value={fmt(kpis.avg)}
                    icon={<TrendingUp size={15} />}
                />
                <KpiCard
                    label="CA du mois"
                    value={fmtRound(month.revenue)}
                    sub={`+${month.vs_last_month_pct}% vs mois préc.`}
                    positive
                    icon={<BarChart3 size={15} />}
                />
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
                <Title note={selectedProfile ? "commerce entier" : undefined}>
                    {period === "today" ? "Chiffre d'affaires · par heure" : `Chiffre d'affaires · ${period === "week" ? "7" : "30"} jours`}
                </Title>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={caChartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="hsl(8,66%,47%)" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="hsl(8,66%,47%)" stopOpacity={0}   />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(181,15%,90%)" vertical={false} />
                        <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false} interval={period === "month" ? 4 : 0} />
                        <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} width={44} />
                        <Tooltip formatter={(v: number) => [fmt(v), "CA"]} contentStyle={CHART_STYLE} />
                        <Area type="monotone" dataKey="revenue" stroke="hsl(8,66%,47%)" strokeWidth={2} fill="url(#grad)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: "hsl(8,66%,47%)" }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                <div className="bg-card rounded-2xl border border-border p-6">
                    <Title note={selectedProfile ? "global" : undefined}>Heures de pointe</Title>
                    <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={sales_by_hour} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="20%">
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(181,15%,90%)" vertical={false} />
                            <XAxis dataKey="hour" tickFormatter={(h: number) => `${h}h`} tick={TICK} axisLine={false} tickLine={false} interval={1} />
                            <YAxis tick={TICK} axisLine={false} tickLine={false} width={20} />
                            <Tooltip
                                labelFormatter={(h: number) => `${h}h00`}
                                formatter={(v: number, name: string) => [name === "count" ? `${v} ventes` : fmt(v), name === "count" ? "Ventes" : "CA"]}
                                contentStyle={CHART_STYLE}
                            />
                            <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={24}>
                                {sales_by_hour.map((h, i) => (
                                    <Cell key={i} fill={h.count === maxHourCount ? "hsl(8,66%,47%)" : "hsl(182,29%,38%)"} fillOpacity={h.count === maxHourCount ? 1 : 0.65} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-muted-foreground font-body mt-2">
                        Pic : {sales_by_hour.find((h) => h.count === maxHourCount)?.hour}h00 · {maxHourCount} ventes
                    </p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                    <Title note={selectedProfile ? "global" : undefined}>Répartition des paiements</Title>
                    <div className="flex gap-4 items-center">
                        <ResponsiveContainer width={130} height={130}>
                            <PieChart>
                                <Pie data={payment_breakdown} dataKey="amount" nameKey="method" cx="50%" cy="50%" innerRadius={38} outerRadius={58} strokeWidth={2} stroke="hsl(0,0%,100%)">
                                    {payment_breakdown.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: number, name: string) => [fmt(v), name]} contentStyle={CHART_STYLE} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-3">
                            {payment_breakdown.map((p, i) => (
                                <div key={p.method}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                            <span className="text-sm font-body text-foreground">{p.method}</span>
                                        </div>
                                        <span className="text-sm font-display font-semibold text-foreground">{fmtRound(p.amount)}</span>
                                    </div>
                                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${(p.amount / payment_breakdown.reduce((s, x) => s + x.amount, 0)) * 100}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
                <Title note={selectedProfile ? "global" : undefined}>Top 5 articles · ce mois</Title>
                <div className="divide-y divide-border">
                    {top_items.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-display shrink-0 ${i === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                                {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-body font-medium text-foreground truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.category} · {item.quantity} vendus</p>
                            </div>
                            <span className="text-sm font-display font-semibold text-foreground shrink-0">{fmtRound(item.revenue)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {!selectedProfile && (
                <div className="bg-card rounded-2xl border border-border p-6">
                    <Title>Performance par caissier · 30 jours</Title>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {profiles.map((p, i) => (
                            <button
                                key={p.profile_id}
                                onClick={() => setSelectedProfileId(p.profile_id)}
                                className="text-left p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all group"
                            >
                                <div className="flex items-center gap-2.5 mb-3">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-display shrink-0 ${i === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                                        {initial(p.name)}
                                    </span>
                                    <div>
                                        <p className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors leading-none">{p.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{p.sales_count} ventes</p>
                                    </div>
                                    {i === 0 && <span className="ml-auto text-[10px] font-body font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">#1</span>}
                                </div>
                                <p className="font-display text-xl font-bold text-foreground">{fmtRound(p.revenue)}</p>
                                <p className="text-xs text-muted-foreground">panier moyen {fmt(p.avg_basket)}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-card rounded-2xl border border-border p-6">
                <Title>{selectedProfile ? `Ventes récentes · ${selectedProfile.name}` : "Ventes récentes"}</Title>
                {filteredSales.length === 0 ? (
                    <p className="text-sm text-muted-foreground font-body text-center py-8">Aucune vente récente.</p>
                ) : (
                    <div className="divide-y divide-border">
                        {filteredSales.map((sale) => (
                            <div key={sale.history_id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold font-display text-secondary shrink-0">
                                    {initial(sale.cashier)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-body font-medium text-foreground">{sale.cashier}</p>
                                    <p className="text-xs text-muted-foreground">il y a {timeAgo(sale.changed_at)}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Package size={11} />
                                    {sale.items_count}
                                </div>
                                <span className="text-xs text-muted-foreground w-16 text-right hidden sm:block">{sale.payment_method}</span>
                                <span className="text-sm font-display font-semibold text-foreground w-16 text-right">{fmt(sale.price)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
