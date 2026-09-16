import { Inject, Injectable } from "@nestjs/common";
import { Pool, PoolClient } from "pg";

import { PG_POOL } from "../database/database.constants";
import {
    buildInsertClause,
    buildSetClause,
    ColumnMap,
} from "../database/sql-builder";
import { CreatePartDto } from "./dto/create-part.dto";
import { CreatedPart, Part } from "./entities/part.entity";
import { UpdatePartDto } from "./dto/update-part.dto";

/** Request keys the API permits on a create, mapped to their columns. */
const INSERTABLE_COLUMNS: ColumnMap = {
    name: "name",
    brand: "brand",
    model: "model",
    usageKm: "usage_km",
    usageDays: "usage_days",
    purchaseDate: "purchase_date",
    notes: "notes",
};

const INSERTABLE_HEALTH_COLUMNS: ColumnMap = {
    useKm: "use_km",
    useDays: "use_days",
    threshKm: "threshold_km",
    threshDays: "threshold_days",
};

const UPDATABLE_COLUMNS: ColumnMap = {
    name: "name",
    brand: "brand",
    model: "model",
    usageKm: "usage_km",
    usageDays: "usage_days",
    purchaseDate: "purchase_date",
    notes: "notes",
};

const UPDATABLE_HEALTH_COLUMNS: ColumnMap = {
    useKm: "use_km",
    useDays: "use_days",
    threshKm: "threshold_km",
    threshDays: "threshold_days",
};

const RETURNED_COLUMNS =
    "id, user_id, name, brand, model, purchase_date, usage_km, usage_days, notes, last_updated";

@Injectable()
export class PartRepository {
    constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

    async findById(id: number, client?: PoolClient): Promise<Part | undefined> {
        const queryClient = client || this.pool;

        const result = await queryClient.query<Part>(
            "SELECT p.*, ph.* FROM part p LEFT JOIN part_health ph on ph.part_id = p.id WHERE p.is_deleted = FALSE AND p.id = $1 LIMIT 1",
            [id],
        );
        return result.rows[0];
    }

    async findByGearId(gearId: number): Promise<Part[]> {
        const result = await this.pool.query<Part>(
            "SELECT p.*, ph.* FROM part p LEFT JOIN part_health ph on ph.part_id = p.id WHERE p.is_deleted = FALSE AND p.gear_id = $1 LIMIT 1",
            [gearId],
        );
        return result.rows;
    }

    async create(
        userId: number,
        fields: CreatePartDto,
    ): Promise<Part | undefined> {
        const { columns, placeholders, values } = buildInsertClause(
            INSERTABLE_COLUMNS,
            fields,
            {
                columns: ["user_id"],
                placeholders: ["$1"],
                values: [userId],
                nextIndex: 2,
            },
        );

        // Always stamp creation/update time.
        columns.push("last_updated");
        placeholders.push("NOW()");

        return this.withTransaction(async (client) => {
            const result = await client.query<CreatedPart>(
                `INSERT INTO gear (${columns.join(", ")})
                 VALUES (${placeholders.join(", ")})
                 RETURNING ${RETURNED_COLUMNS}`,
                values,
            );

            const created = result.rows[0];

            const {
                columns: healthCols,
                placeholders: healthPlaceholders,
                values: healthValues,
            } = buildInsertClause(INSERTABLE_HEALTH_COLUMNS, fields, {
                columns: ["gear_id"],
                placeholders: ["$1"],
                values: [created.id],
                nextIndex: 2,
            });

            // Only insert health if there are health fields in the request
            if (healthCols.length > 1) {
                await client.query(
                    `INSERT INTO gear_health (${healthCols.join(", ")})
                     VALUES (${healthPlaceholders.join(", ")})`,
                    healthValues,
                );
            }
            return await this.findById(created.id, client);
        });
    }

    async update(id: number, fields: UpdatePartDto): Promise<Part | undefined> {
        const { assignments, values, nextIndex } = buildSetClause(
            UPDATABLE_COLUMNS,
            fields,
        );

        if (assignments.length === 0) {
            return undefined;
        }

        assignments.push("last_updated = NOW()");
        values.push(id);

        return this.withTransaction(async (client) => {
            // Update gear
            const result = await client.query<Part>(
                `UPDATE gear
            SET ${assignments.join(", ")}
            WHERE id = $${nextIndex} AND is_deleted = FALSE
            RETURNING id`,
                values,
            );

            const gearUpdated = result.rows[0];

            if (!gearUpdated) {
                return undefined;
            }

            // Update health if fields provided
            const {
                assignments: healthAssignments,
                values: healthVals,
                nextIndex: healthIndex,
            } = buildSetClause(UPDATABLE_HEALTH_COLUMNS, fields);

            if (healthAssignments.length > 0) {
                healthVals.push(id);
                await client.query(
                    `UPDATE gear_health
                 SET ${healthAssignments.join(", ")}
                 WHERE gear_id = $${healthIndex}`,
                    healthVals,
                );
            }

            // Query within transaction
            return this.findById(id, client);
        });
    }

    async softDelete(id: number): Promise<{ id: number } | undefined> {
        const result = await this.pool.query<{ id: number }>(
            "UPDATE gear SET is_deleted = TRUE where id = $1 RETURNING id",
            [id],
        );
        return result.rows[0];
    }

    private async withTransaction<T>(
        work: (client: PoolClient) => Promise<T>,
    ): Promise<T> {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            const result = await work(client);
            await client.query("COMMIT");
            return result;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }
}
