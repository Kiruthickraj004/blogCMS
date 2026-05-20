<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StatsAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function __construct(private StatsAiService $stats) {}

    public function admin(): JsonResponse
    {
        return response()->json($this->stats->adminStats());
    }

    public function author(Request $request): JsonResponse
    {
        return response()->json($this->stats->authorStats($request->user()));
    }

    public function suggestions(Request $request): JsonResponse
    {
        return response()->json([
            'suggestions' => $this->stats->suggestionsForViewer($request->user()),
        ]);
    }
}
