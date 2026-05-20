<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Like;
use App\Models\Subscription;
use App\Services\StatsAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ViewerController extends Controller
{
    public function __construct(private StatsAiService $stats) {}

    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'stats' => [
                'liked_blogs' => Like::where('user_id', $user->id)->count(),
                'subscriptions' => Subscription::where('subscriber_id', $user->id)->count(),
            ],
            'suggestions' => $this->stats->suggestionsForViewer($user, 6),
            'recent_from_subscriptions' => Blog::published()
                ->whereIn('user_id', $user->subscriptions()->pluck('author_id'))
                ->with(['author:id,name,avatar', 'category'])
                ->withCount('likes')
                ->latest('published_at')
                ->limit(5)
                ->get(),
        ]);
    }
}
