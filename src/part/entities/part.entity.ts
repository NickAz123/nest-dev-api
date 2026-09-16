/** A row of the `gear` table. */
export interface Part {
    id: number;
    gear_id: number;
    name: string;
    brand: string | null;
    model: string | null;
    notes: string | null;
    price: number | null;
    usageKm: number | null;
    usageDays: number | null;
    purchase_date: Date | null;
    created_at: Date;
    retired_at: Date | null;
    is_deleted: boolean;
    status_id: number;
    useKm: number | null;
    useDays: number | null;
    threshKm: number | null;
    threshDays: number | null;
}

/** The projection returned by `PUT /gear/:id`. */
export type CreatedPart = Pick<
    Part,
    | "id"
    | "gear_id"
    | "name"
    | "brand"
    | "model"
    | "notes"
    | "price"
    | "usageKm"
    | "usageDays"
    | "purchase_date"
    | "created_at"
    | "retired_at"
    | "is_deleted"
    | "useKm"
    | "useDays"
    | "threshKm"
    | "threshDays"
>;
