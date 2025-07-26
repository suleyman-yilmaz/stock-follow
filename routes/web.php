<?php

use App\Http\Controllers\StockCard\StockCardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/stock/realtime', function () {
        return Inertia::render('stock/realtime');
    })->name('stock.realtime');

    Route::get('/products', function () {
        return Inertia::render('products/index');
    })->name('products');

    Route::controller(StockCardController::class)->prefix('/stock/card')->name('stock.card.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/store', 'store')->name('store');
        Route::put('/update/{id}', 'update')->name('update');
        Route::delete('/destroy/{id}', 'destroy')->name('destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
