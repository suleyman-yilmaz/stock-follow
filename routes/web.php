<?php

use App\Http\Controllers\RealTimeStock\RealTimeStockController;
use App\Http\Controllers\StockCard\StockCardController;
use App\Http\Controllers\StockMovement\StockMovementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('welcome');
    })->name('home');

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::controller(RealTimeStockController::class)->prefix('real-time')->name('real-time.')->group(function () {
        Route::get('/', 'index')->name('index');
    });

    Route::controller(StockMovementController::class)->prefix('/products')->name('stock.movement.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/store', 'store')->name('store');
        Route::put('/update/{id}', 'update')->name('update');
        Route::delete('/destroy/{id}', 'destroy')->name('destroy');
    });

    Route::controller(StockCardController::class)->prefix('/stock-card')->name('stock.card.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/store', 'store')->name('store');
        Route::put('/update/{id}', 'update')->name('update');
        Route::delete('/destroy/{id}', 'destroy')->name('destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
