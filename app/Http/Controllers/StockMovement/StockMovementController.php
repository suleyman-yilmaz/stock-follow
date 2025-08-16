<?php

namespace App\Http\Controllers\StockMovement;

use App\Http\Controllers\Controller;
use App\Models\StockCard\StockCard;
use App\Models\StockMovement\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stock_cards = StockCard::select('id', 'productName')->get();
        $products = StockMovement::with('card')->get();
        return Inertia::render('products/index', [
            'stock_cards' => $stock_cards,
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'stock_card_id' => 'required|exists:stock_card,id',
            'movement_type' => 'required|in:in,out',
            'movement_amount' => 'required|numeric',
            'movement_price' => 'required|numeric',
            'total_price' => 'required|numeric',
            'movement_date' => 'required|date',
            'company' => 'nullable|string',
        ]);
        try {
            $validated['user_id'] = Auth::user()->id;
            $product = StockMovement::create($validated);
            return back();
        } catch (\Exception $e) {
            Log::info('error', ['message' => $e->getMessage()]);
            return back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'stock_card_id' => 'required|exists:stock_card,id',
            'movement_type' => 'required|in:in,out',
            'movement_amount' => 'required|numeric',
            'movement_price' => 'required|numeric',
            'total_price' => 'required|numeric',
            'movement_date' => 'required|date',
            'company' => 'nullable|string',
        ]);
        try {
            $validated['user_id'] = Auth::user()->id;
            $product = StockMovement::findOrFail($id);
            $product->update($validated);
            return back();
        } catch (\Exception $e) {
            Log::info('error', ['message' => $e->getMessage()]);
            return back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = StockMovement::findOrFail($id);
        $product->delete();
        return back();
    }
}
