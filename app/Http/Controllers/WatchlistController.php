<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\UserHiddenList;
use App\Models\WatchList;
use App\Models\Anime;
use App\Models\AnimeGroup;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WatchlistController extends Controller
{
    public function index()
    {
        // アニメグループとログイン中のユーザーのウォッチリストを取得
        $anime_group_lists = AnimeGroup::with(
            [
                'animes',
                'animes.watchlists' => function ($query) {
                    return $query->where('user_id', Auth::user()->id);
                },
                'hiddenLists',
            ]
        )
            ->withCount('animes')
            ->doesntHave('hiddenLists')
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($anime_group_lists as $anime_group) {
            foreach ($anime_group->animes as $anime) {
                // アニメが視聴済みかどうかをチェック
                if ($anime->watchlists?->status == 1) {
                    // 視聴済みのアニメがあれば、視聴済みのカウントを増やす
                    $anime_group->watchList_count += 1;
                };
            }
        }

        return Inertia::render('watch_lists/Index', ['animeGroups' => $anime_group_lists]);
    }

    public function store($anime_id, $status, $note = null)
    {
        // ステータスが1または2の場合、ユーザーIDとアニメIDが一致するウォッチリストを取得
        if ($status === "1" || $status === "2") {
            $watchLists = WatchList::whereUserId(Auth::user()->id)->whereAnimeId($anime_id)->get();
            // 既に登録されている場合、最初のウォッチリストを削除
            if ($watchLists->count() >= 1) {
                $watchLists[0]->delete();
            }

            // 新しいウォッチリストを作成
            WatchList::create([
                'anime_id' => $anime_id,
                'user_id' => Auth::user()->id,
                'status' => $status,
                'notes' => $note,
            ]);
        }
    }

    public function destroy(Watchlist $watch_list)
    {
        // ウォッチリストが現在ログイン中のユーザーでない場合、リダイレクト
        if ($watch_list->user_id !== Auth::id()) {
            return redirect()->route('watch_list.index')->with('error_message', '不正なアクセスです。');
        }

        $watch_list->delete();
    }
}
