<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserHiddenList;
use App\Models\WatchList;
use App\Models\AnimeGroup;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
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
            ->withCount('animes') // 各アニメグループに含まれるアニメ数をカウント
            ->orderBy('created_at', 'desc') // 作成日時の降順で並び替え
            ->get();

        foreach ($anime_group_lists as $anime_group) {
            // Annict APIからエピソードの総数を取得
            $totalEpisodes = $this->annict_episode_count($anime_group->annict_id);

            // 全エピソード数をセット
            $anime_group->total_episodes = $totalEpisodes;

            // ウォッチリストの初期化
            $anime_group->watchList_count = 0;

            foreach ($anime_group->animes as $anime) {
                // アニメが視聴済みかチェック
                if ($anime->watchlists?->status == 1) {
                    // 視聴済みのアニメがあれば、視聴済みのカウントを増やす
                    $anime_group->watchList_count += 1;
                }
            }

            // 全てのエピソードが視聴済みかチェック
            $anime_group->is_complete = $anime_group->watchList_count === $totalEpisodes;
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
            // 既に同じウォッチリストがある場合、削除する
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
        // 指定されたアニメグループIDに該当するデータを取得
        UserHiddenList::whereAnimeGroupId($anime_group_id)

            // 現在ログイン中のユーザーに該当するデータを取得して非表示リストから削除
            ->whereUserId(Auth::user()->id)
            ->delete();
    }

    public function setNote($note)
    {
        // ログイン中のユーザーを取得
        $user = User::find(Auth::user()->id);

        // ユーザーが存在する場合、ノートを更新し保存
        if ($user) {
            $user->notes = $note;
            $user->save();
        }
    }

    public function annict_episode_count($annictId, $page = 1)
    {
        // Annict APIからエピソードの総数を取得
        $token = env('ANNICT_TOKEN');
        $url = "https://api.annict.com/v1/episodes?filter_work_id=" . $annictId . "&sort_sort_number=asc&page=" . $page;
        $res = Http::withToken($token)->get($url);

        // エピソードの総数を返す
        return $res->json()['total_count'];
    }
}