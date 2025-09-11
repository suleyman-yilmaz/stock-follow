<?php

namespace App\Http\Controllers\RealTimeStock;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RealTimeStockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $realTime = DB::table('vw_rt_stock')->where('user_id', Auth::id())->where('status', true)->get();
        return Inertia::render('real-time/index', [
            'realTime' => $realTime
        ]);
    }
}
