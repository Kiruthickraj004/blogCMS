<?php

namespace App\Services;

use App\Enums\BlogStatus;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Like;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatsAiService
{
    public function adminStats(): array
    {
        return Cache::remember('stats.admin', 300, function () {
            return [
                'users' => [
                    'total' => User::count(),
                    'admins' => User::where('role', 'admin')->count(),
                    'authors' => User::where('role', 'author')->count(),
                    'viewers' => User::where('role', 'viewer')->count(),
                ],
                'blogs' => [
                    'total' => Blog::count(),
                    'published' => Blog::where('status', BlogStatus::Published)->count(),
                    'pending' => Blog::where('status', BlogStatus::Pending)->count(),
                    'draft' => Blog::where('status', BlogStatus::Draft)->count(),
                    'rejected' => Blog::where('status', BlogStatus::Rejected)->count(),
                ],
                'engagement' => [
                    'total_likes' => Like::count(),
                    'total_views' => (int) Blog::sum('views_count'),
                ],
                'top_categories' => Category::withCount(['blogs' => fn ($q) => $q->published()])
                    ->orderByDesc('blogs_count')
                    ->limit(5)
                    ->get(['id', 'name', 'slug', 'color', 'blogs_count']),
            ];
        });
    }

    public function authorStats(User $author): array
    {
        $key = 'stats.author.'.$author->id;

        return Cache::remember($key, 300, function () use ($author) {
            $blogs = Blog::where('user_id', $author->id);

            return [
                'blogs' => [
                    'total' => (clone $blogs)->count(),
                    'published' => (clone $blogs)->where('status', BlogStatus::Published)->count(),
                    'pending' => (clone $blogs)->where('status', BlogStatus::Pending)->count(),
                    'draft' => (clone $blogs)->where('status', BlogStatus::Draft)->count(),
                ],
                'engagement' => [
                    'total_views' => (int) (clone $blogs)->sum('views_count'),
                    'total_likes' => Like::whereIn('blog_id', $author->blogs()->pluck('id'))->count(),
                    'subscribers' => $author->subscribers()->count(),
                ],
                'recent_performance' => Blog::where('user_id', $author->id)
                    ->published()
                    ->orderByDesc('views_count')
                    ->limit(5)
                    ->get(['id', 'title', 'slug', 'views_count', 'published_at']),
            ];
        });
    }

    public function suggestionsForViewer(User $viewer, int $limit = 8): Collection
    {
        $cacheKey = 'suggestions.viewer.'.$viewer->id;

        return Cache::remember($cacheKey, 600, function () use ($viewer, $limit) {
            $likedCategoryIds = DB::table('likes')
                ->join('blogs', 'likes.blog_id', '=', 'blogs.id')
                ->where('likes.user_id', $viewer->id)
                ->whereNotNull('blogs.category_id')
                ->pluck('blogs.category_id')
                ->unique();

            $subscribedAuthorIds = $viewer->subscriptions()->pluck('author_id');

            $query = Blog::published()
                ->with(['author:id,name,avatar', 'category:id,name,slug,color'])
                ->withCount('likes');

            if ($likedCategoryIds->isNotEmpty() || $subscribedAuthorIds->isNotEmpty()) {
                $query->where(function ($q) use ($likedCategoryIds, $subscribedAuthorIds) {
                    if ($likedCategoryIds->isNotEmpty()) {
                        $q->orWhereIn('category_id', $likedCategoryIds);
                    }
                    if ($subscribedAuthorIds->isNotEmpty()) {
                        $q->orWhereIn('user_id', $subscribedAuthorIds);
                    }
                });
            }

            $personalized = $query->orderByDesc('published_at')->limit($limit)->get();

            if ($personalized->count() >= $limit) {
                return $personalized;
            }

            return Blog::published()
                ->with(['author:id,name,avatar', 'category:id,name,slug,color'])
                ->withCount('likes')
                ->orderByDesc('views_count')
                ->limit($limit)
                ->get();
        });
    }

    public function clearCaches(?int $userId = null): void
    {
        Cache::forget('stats.admin');
        if ($userId) {
            Cache::forget('stats.author.'.$userId);
            Cache::forget('suggestions.viewer.'.$userId);
        }
    }
}
