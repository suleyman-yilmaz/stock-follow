<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
        CREATE VIEW vw_rt_stock AS
        SELECT
            sc.user_id,
            sc.id AS stock_card_id,
            sc.productName,
            sc.barcode,
            sc.unit,
            sc.status,
            SUM(CASE WHEN sm.movement_type='in'  THEN sm.movement_amount ELSE 0 END) AS quantityIn,
            SUM(CASE WHEN sm.movement_type='out' THEN sm.movement_amount ELSE 0 END) AS quantityOut,
            SUM(CASE WHEN sm.movement_type='in'  THEN sm.movement_amount ELSE -sm.movement_amount END) AS currentQuantity
        FROM stock_card sc
            LEFT JOIN stock_movement sm ON sc.id = sm.stock_card_id
        GROUP BY sc.user_id, sc.id, sc.productName, sc.barcode, sc.unit
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS vw_rt_stock');
    }
};
