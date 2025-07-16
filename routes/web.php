<?php

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

    Route::get('/stock/card', function () {
        return Inertia::render('stock/card');
    })->name('stock.card');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
