<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Blog Management API',
        'version' => '1.0',
        'docs' => 'Use /api endpoints from the React SPA',
    ]);
});
