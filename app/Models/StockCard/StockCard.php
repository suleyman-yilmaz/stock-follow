<?php

namespace App\Models\StockCard;

use App\Models\StockMovement\StockMovement;
use Illuminate\Database\Eloquent\Model;

class StockCard extends Model
{
    protected $table = 'stock_card';

    protected $fillable = [
        'user_id',
        'productName',
        'barcode',
        'unit',
        'status'
    ];

    public function movements()
    {
        return $this->hasMany(StockMovement::class, 'stock_card_id', 'id');
    }
}
