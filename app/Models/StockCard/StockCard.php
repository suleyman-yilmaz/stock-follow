<?php

namespace App\Models\StockCard;

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
}
