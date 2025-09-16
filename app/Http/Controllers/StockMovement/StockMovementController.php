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
    public function index(Request $request)
    {
        $user = Auth::id();
        $stock_cards = StockCard::select('id', 'productName')->where('user_id', $user)->where('status', true)->get();
        $query = StockMovement::query()->with('card')->where('user_id', $user)->whereHas('card', fn($q) => $q->where('status', true))
            ->when($request->filled('productName'), function ($q) use ($request) {
                $name = $request->string('productName')->trim();
                $q->whereHas('card', fn($qq) => $qq->where('productName', 'like', "%{$name}%"));
            })->when($request->filled('movementType') && in_array($request->movementType, ['in', 'out']), function ($q) use ($request) {
                    $q->where('movement_type', $request->movementType);
            })->when($request->filled('unit'), function ($q) use ($request) {
                $q->whereHas('card', fn($qq) => $qq->where('unit', $request->unit));
            });
        $products = $query->get();
        return Inertia::render('products/index', [
            'stock_cards' => $stock_cards,
            'products' => $products,
        ]);
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
            return Inertia::location(route('stock.movement.index'));
        } catch (\Exception $e) {
            Log::info('error', ['message' => $e->getMessage()]);
            return redirect()->route('stock.movement.index')->with('error', 'An error occurred: ' . $e->getMessage());
        }
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
            return Inertia::location(route('stock.movement.index'));
        } catch (\Exception $e) {
            Log::info('error', ['message' => $e->getMessage()]);
            return redirect()->route('stock.movement.index')->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = StockMovement::findOrFail($id);
        $product->delete();
        return Inertia::location(route('stock.movement.index'));
    }
}
