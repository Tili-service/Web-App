export type Account = {
    name: string;
    email: string;
};

export type Shop = {
    store_id: number;
    name: string;
    date_creation: string;
    numero_tva: string;
    siret: string;
};

export type License = {
    licence_id: string;
    account_id: string;
    expiration: string;
    stripe: {
        next_payment_at: string;
        price_amount: number;
        price_interval: string;
    };
    store: {
        name: string;
    } | null;
    is_active: boolean;
};

export type Catalog = {
    catalog_id: number;
    name: string;
    description: string;
};

export type Categorie = {
    categorie_id: number;
    type: string;
};

export type Item = {
    item_id: number;
    name: string;
    price: number;
    tax: number;
    tax_amount: number;
    categorie_id: number;
    categorie?: {
        categorie_id: number;
        type: string;
    };
};

export type Profile = {
    profile_id: number;
    store_id: number;
    name: string;
    level_access: number;
    is_active: boolean;
};

export type ProfileWithPin = Profile & {
    pin: string;
};
