<?php

namespace App\Http\Controllers\StockCard;

use App\Http\Controllers\Controller;
use App\Models\StockCard\StockCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StockCardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stockCards = StockCard::all();
        return Inertia::render('stock/card', [
            'stockCards' => $stockCards,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'productName' => 'required|string',
            'barcode' => 'required|string',
            'unit' => 'required|string',
            'status' => 'required|boolean|in:0,1',
        ]);
        try {

            $validatedData['user_id'] = Auth::user()->id;
            $stock_card = StockCard::create($validatedData);
            return back();
        } catch (\Exception $e) {
            Log::info('error', ['message' => $e->getMessage()]);
            return back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'productName' => 'required|string',
            'barcode' => 'required|string',
            'unit' => 'required|string',
            'status' => 'required|boolean|in:0,1',
        ]);
        try {
            $stock_card = StockCard::findOrFail($id);
            $stock_card->update($validatedData);
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
        $stockCard = StockCard::findOrFail($id);
        $stockCard->delete();
        return back();
    }
}
