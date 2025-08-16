<?php

namespace App\Models\StockMovement;

use App\Models\StockCard\StockCard;
use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $table = 'stock_movement';

    protected $fillable = [
        'stock_card_id',
        'user_id',
        'movement_type',
        'movement_amount',
        'movement_price',
        'total_price',
        'movement_date',
        'company',
    ];

    public function card()
    {
        return $this->belongsTo(StockCard::class, 'stock_card_id', 'id');
    }
}
