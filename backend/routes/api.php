<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\LikeAndSubscriptionController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\ViewerController;
use App\Http\Middleware\EnsureRole;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{slug}', [BlogController::class, 'show']);
Route::get('/categories', [BlogController::class, 'categories']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/my-blogs', [BlogController::class, 'myBlogs'])
        ->middleware(EnsureRole::class.':admin,author');
    Route::post('/blogs', [BlogController::class, 'store'])
        ->middleware(EnsureRole::class.':admin,author');
    Route::put('/blogs/{blog}', [BlogController::class, 'update'])
        ->middleware(EnsureRole::class.':admin,author');
    Route::delete('/blogs/{blog}', [BlogController::class, 'destroy'])
        ->middleware(EnsureRole::class.':admin,author');
    Route::post('/blogs/{blog}/submit', [BlogController::class, 'submitForReview'])
        ->middleware(EnsureRole::class.':admin,author');

    Route::middleware(EnsureRole::class.':viewer,author,admin')->group(function () {
        Route::post('/blogs/{blog}/like', [LikeAndSubscriptionController::class, 'toggleLike']);
        Route::get('/liked-blogs', [LikeAndSubscriptionController::class, 'likedBlogs']);
        Route::post('/authors/{author}/subscribe', [LikeAndSubscriptionController::class, 'toggleSubscription']);
        Route::get('/subscriptions', [LikeAndSubscriptionController::class, 'subscriptions']);
        Route::get('/suggestions', [StatsController::class, 'suggestions']);
    });

    Route::middleware(EnsureRole::class.':viewer')->group(function () {
        Route::get('/viewer/dashboard', [ViewerController::class, 'dashboard']);
    });

    Route::middleware(EnsureRole::class.':author')->group(function () {
        Route::get('/author/stats', [StatsController::class, 'author']);
    });

    Route::middleware(EnsureRole::class.':admin')->group(function () {
        Route::get('/admin/pending-blogs', [AdminController::class, 'pendingBlogs']);
        Route::post('/admin/blogs/{blog}/approve', [AdminController::class, 'approve']);
        Route::post('/admin/blogs/{blog}/reject', [AdminController::class, 'reject']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::patch('/admin/users/{user}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser']);
        Route::get('/admin/stats', [StatsController::class, 'admin']);
    });
});
