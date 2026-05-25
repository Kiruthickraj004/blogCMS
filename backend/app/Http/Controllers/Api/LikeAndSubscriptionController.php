<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Enums\BlogStatus;
use App\Models\Blog;
use App\Models\Like;
use App\Models\Subscription;
use App\Models\User;
use App\Services\StatsAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LikeAndSubscriptionController extends Controller
{
    public function __construct(private StatsAiService $stats) {}

    public function toggleLike(Request $request, Blog $blog): JsonResponse
    {
        if ($blog->status !== BlogStatus::Published) {
            return response()->json(['message' => 'You can only like published blogs.'], 422);
        }

        $like = Like::where('user_id', $request->user()->id)
            ->where('blog_id', $blog->id)
            ->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            Like::create([
                'user_id' => $request->user()->id,
                'blog_id' => $blog->id,
            ]);
            $liked = true;
        }

        $this->stats->clearCaches($request->user()->id);

        return response()->json([
            'liked' => $liked,
            'likes_count' => $blog->likes()->count(),
        ]);
    }

    public function likedBlogs(Request $request): JsonResponse
    {
        $blogs = Blog::published()
            ->whereHas('likes', fn ($q) => $q->where('user_id', $request->user()->id))
            ->with(['author:id,name,avatar', 'category'])
            ->withCount('likes')
            ->latest('blogs.updated_at')
            ->paginate(12);

        return response()->json($blogs);
    }

    public function toggleSubscription(Request $request, User $author): JsonResponse
    {
        if (! $author->isAuthor() && ! $author->isAdmin()) {
            return response()->json(['message' => 'You can only subscribe to authors.'], 422);
        }

        if ($author->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot subscribe to yourself.'], 422);
        }

        $sub = Subscription::where('subscriber_id', $request->user()->id)
            ->where('author_id', $author->id)
            ->first();

        if ($sub) {
            $sub->delete();
            $subscribed = false;
        } else {
            Subscription::create([
                'subscriber_id' => $request->user()->id,
                'author_id' => $author->id,
            ]);
            $subscribed = true;
        }

        $this->stats->clearCaches($request->user()->id);

        return response()->json([
            'subscribed' => $subscribed,
            'subscribers_count' => $author->subscribers()->count(),
        ]);
    }

    public function subscriptions(Request $request): JsonResponse
    {
        $authors = User::whereIn('id', $request->user()->subscriptions()->pluck('author_id'))
            ->withCount(['blogs' => fn ($q) => $q->published(), 'subscribers'])
            ->get();

        return response()->json(['authors' => $authors]);
    }
}
