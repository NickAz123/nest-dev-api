/** A row of the `gear` table. */
export interface Gear {
    id: number;
    user_id: number;
    name: string;
    brand: string | null;
    model: string | null;
    purchase_date: Date | null;
    notes: string | null;
    created_at: Date;
    retired_at: Date | null;
    last_updated: Date | null;
    is_deleted: boolean;
    status_id: number;
    useKm: number | null;
    useDays: number | null;
    threshKm: number | null;
    threshDays: number | null;
}

/** The projection returned by `PUT /gear/:id`. */
export type CreatedGear = Pick<
    Gear,
    | "id"
    | "user_id"
    | "name"
    | "brand"
    | "model"
    | "purchase_date"
    | "notes"
    | "last_updated"
    | "useKm"
    | "useDays"
    | "threshKm"
    | "threshDays"
>;
