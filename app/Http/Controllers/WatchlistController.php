<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
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
        // アニメグループと関連するデータを取得
        $anime_group_lists = AnimeGroup::with(
            [
                // アニメグループに含まれるアニメを取得
                'animes',
                'animes.watchlists' => function ($query) {
                    // ログイン中のユーザーのウォッチリストのみ取得
                    return $query->where('user_id', Auth::user()->id);
                },
                'hiddenLists' => function ($query) {
                    // ログイン中のユーザーの非表示リストを取得
                    return $query->where('user_id', Auth::user()->id);
                }
            ]
        )
            // アニメの数をカウントして、アニメグループを降順で表示
            ->withCount('animes')
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

        // ログイン中のユーザーの非表示リストと関連するアニメグループを取得
        $hiddenLists = UserHiddenList::where('user_id', Auth::user()->id)
            ->with('animeGroup')
            ->get();

        return Inertia::render('watch_lists/Index', [
            'animeGroups' => $anime_group_lists,
            'hiddenLists' => $hiddenLists
        ]);
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
        // ログイン中のユーザーでない場合、リダイレクト
        if ($watch_list->user_id !== Auth::id()) {
            return redirect()->route('watch_list.index')->with('error_message', '不正なアクセスです。');
        }

        $watch_list->delete();
    }

    public function addHiddenList($anime_group_id)
    {
        // アニメグループをユーザー非表示リストに追加
        UserHiddenList::create([
            'user_id' => Auth::user()->id,
            'anime_group_id' => $anime_group_id
        ]);
    }

    public function deleteHiddenList($anime_group_id)
    {
        // 指定されたアニメグループIDのレコードを検索
        UserHiddenList::whereAnimeGroupId($anime_group_id)

            // 現在ログイン中のユーザーのレコードを取得
            ->whereUserId(Auth::user()->id)
            ->delete();
    }

    public function setNote($note)
    {
        // ログイン中のユーザーを取得
        $user = User::find(Auth::user()->id);

        // ユーザーが存在する場合、ノートを更新し、保存
        if ($user) {
            $user->notes = $note;
            $user->save();
        }
    }
}
