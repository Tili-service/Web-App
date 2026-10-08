export type DayRevenue = {
    date: string;
    revenue: number;
    sales: number;
};

export type TopItem = {
    name: string;
    quantity: number;
    revenue: number;
    category: string;
};

export type PaymentMethod = {
    method: string;
    amount: number;
    count: number;
};

export type RecentSale = {
    history_id: number;
    changed_at: string;
    price: number;
    items_count: number;
    payment_method: string;
    cashier: string;
    profile_id: number;
};

export type ProfileSummary = {
    profile_id: number;
    name: string;
    sales_count: number;
    revenue: number;
    avg_basket: number;
};

export type HourStat = {
    hour: number;
    count: number;
    revenue: number;
};

export type DashboardStats = {
    today: {
        revenue: number;
        sales_count: number;
        avg_basket: number;
        vs_yesterday_pct: number;
    };
    month: {
        revenue: number;
        sales_count: number;
        vs_last_month_pct: number;
    };
    revenue_by_day: DayRevenue[];
    sales_by_hour: HourStat[];
    payment_breakdown: PaymentMethod[];
    top_items: TopItem[];
    recent_sales: RecentSale[];
    profiles: ProfileSummary[];
};

const DAILY_REVENUES = [
    280, 320, 195, 410, 380, 290, 0,
    445, 315, 370, 425, 290, 180, 0,
    510, 330, 420, 285, 395, 445, 0,
    375, 490, 320, 410, 360, 295, 0,
    380, 342,
];

const DAILY_SALES = [
    12, 14, 9, 18, 16, 12, 0,
    19, 14, 16, 18, 12, 8, 0,
    22, 14, 18, 12, 17, 19, 0,
    16, 21, 14, 18, 15, 13, 0,
    16, 14,
];

export function getDashboardMockData(_storeId: number): DashboardStats {
    const now = new Date();

    const revenue_by_day: DayRevenue[] = DAILY_REVENUES.map((revenue, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (29 - i));
        return {
            date: d.toISOString().slice(0, 10),
            revenue,
            sales: DAILY_SALES[i],
        };
    });

    const monthRevenue = revenue_by_day.reduce((s, d) => s + d.revenue, 0);
    const monthSales = revenue_by_day.reduce((s, d) => s + d.sales, 0);

    const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000).toISOString();

    return {
        today: {
            revenue: 342,
            sales_count: 14,
            avg_basket: 24.43,
            vs_yesterday_pct: 12.3,
        },
        month: {
            revenue: monthRevenue,
            sales_count: monthSales,
            vs_last_month_pct: 8.7,
        },
        revenue_by_day,
        sales_by_hour: [
            { hour: 6,  count: 2,  revenue: 8.0   },
            { hour: 7,  count: 8,  revenue: 36.5  },
            { hour: 8,  count: 24, revenue: 116.0 },
            { hour: 9,  count: 30, revenue: 148.5 },
            { hour: 10, count: 16, revenue: 74.0  },
            { hour: 11, count: 19, revenue: 88.5  },
            { hour: 12, count: 38, revenue: 242.0 },
            { hour: 13, count: 33, revenue: 208.5 },
            { hour: 14, count: 12, revenue: 54.0  },
            { hour: 15, count: 21, revenue: 98.5  },
            { hour: 16, count: 26, revenue: 122.0 },
            { hour: 17, count: 18, revenue: 83.5  },
            { hour: 18, count: 10, revenue: 44.0  },
            { hour: 19, count: 5,  revenue: 22.5  },
            { hour: 20, count: 2,  revenue: 9.0   },
        ],
        payment_breakdown: [
            { method: "Espèces",  amount: 1240.5, count: 52 },
            { method: "Carte",    amount: 2180.0, count: 89 },
            { method: "Virement", amount: 340.0,  count: 8  },
        ],
        top_items: [
            { name: "Café allongé",     quantity: 128, revenue: 256.0, category: "Boissons"      },
            { name: "Croissant",         quantity: 95,  revenue: 190.0, category: "Viennoiseries" },
            { name: "Sandwich jambon",   quantity: 67,  revenue: 335.0, category: "Restauration"  },
            { name: "Jus d'orange",      quantity: 54,  revenue: 162.0, category: "Boissons"      },
            { name: "Pain au chocolat",  quantity: 48,  revenue: 120.0, category: "Viennoiseries" },
        ],
        recent_sales: [
            { history_id: 101, changed_at: minutesAgo(5),  price: 8.5,  items_count: 2, payment_method: "Carte",    cashier: "Marie",  profile_id: 1 },
            { history_id: 100, changed_at: minutesAgo(22), price: 15.0, items_count: 3, payment_method: "Espèces",  cashier: "Paul",   profile_id: 2 },
            { history_id: 99,  changed_at: minutesAgo(45), price: 6.5,  items_count: 1, payment_method: "Carte",    cashier: "Marie",  profile_id: 1 },
            { history_id: 98,  changed_at: minutesAgo(68), price: 32.0, items_count: 5, payment_method: "Espèces",  cashier: "Thomas", profile_id: 3 },
            { history_id: 97,  changed_at: minutesAgo(90), price: 12.5, items_count: 2, payment_method: "Virement", cashier: "Paul",   profile_id: 2 },
        ],
        profiles: [
            { profile_id: 1, name: "Marie",  sales_count: 89, revenue: 2340.0, avg_basket: 26.29 },
            { profile_id: 2, name: "Paul",   sales_count: 76, revenue: 1890.0, avg_basket: 24.87 },
            { profile_id: 3, name: "Thomas", sales_count: 48, revenue: 1530.0, avg_basket: 31.88 },
        ],
    };
}
