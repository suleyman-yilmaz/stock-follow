<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_movement', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_card_id')->constrained('stock_card')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('movement_type', ['in', 'out']);
            $table->decimal('movement_amount', 8, 2);
            $table->decimal('movement_price', 8, 2);
            $table->decimal('total_price', 8, 2);
            $table->dateTime('movement_date');
            $table->string('company')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movement');
    }
};
