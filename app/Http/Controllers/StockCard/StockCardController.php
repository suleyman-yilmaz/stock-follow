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
        $stockCards = StockCard::where('user_id', Auth::id())->get();
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
            'barcode'     => 'required|string',
            'unit'        => 'required|string',
            'status'      => 'required|boolean|in:0,1',
        ]);
        try {
            $user = Auth::user();
            $exists = StockCard::where('user_id', $user->id)->where('barcode', $request->barcode)->exists();
            if ($exists) return redirect()->route('stock.card.index')->with('error', 'The barcode you are trying to add already exists');
            $validatedData['user_id'] = $user->id;
            StockCard::create($validatedData);
            return back()->withSuccess('Stock card added successfully.');
        } catch (\Exception $e) {
            Log::error('StockCard Store Error', ['message' => $e->getMessage()]);
            return back()->withErrors('An error occurred: ' . $e->getMessage());
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
            $exist = StockCard::where('user_id', Auth::id())->where('barcode', $request->barcode)->where('id', '!=', $id)->exists();
            if ($exist) return redirect()->route('stock.card.index')->with('error', 'The barcode you are trying to add already exists');
            $stock_card = StockCard::findOrFail($id);
            $stock_card->update($validatedData);
            return back()->withSuccess('Stock card updated successfully.');
        } catch (\Exception $e) {
            Log::info('error', ['message' => $e->getMessage()]);
            return back()->withErrors('An error occurred: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $stockCard = StockCard::findOrFail($id);
        $stockCard->delete();
        return back()->withSuccess('Stock card deleted successfully.');
    }
}
