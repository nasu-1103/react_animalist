<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\UserHiddenList;
use App\Models\WatchList;
use App\Models\Anime;
use App\Models\AnimeGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class WatchlistController extends Controller
{
    public function index(Request $request)
    {
        // アニメのタイトルまたはサブタイトルで検索キーワードを取得
        $keyword = $request->keyword;

        // アニメのタイトルまたはサブタイトルに該当するキーワードを取得
        if ($keyword) {
            $watch_lists = WatchList::whereUserId(Auth::user()->id)
                ->with('anime')
                ->whereHas("anime", function ($query) use ($keyword) {
                    $query->where('sub_title', 'like', "%{$keyword}%");
                    $query->orWhere('title', 'like', "%{$keyword}%");
                })
                ->orderBy('created_at', 'desc')->paginate(15);
            $watch_lists->appends(['keyword' => $keyword]);
        } else {
            // キーワードがない場合は全てのウォッチリストを取得
            $watch_lists = WatchList::whereUserId(Auth::user()->id)
                ->orderBy('created_at', 'desc')->paginate(15);
        }

        // アニメグループの情報を取得
        $anime = [];
        $animeGroup = AnimeGroup::with('animes')->find(1);
        // 指定されたユーザーのウォッチリストに登録されているアニメIDを取得
        $watch_lists = WatchList::whereUserId(3)->pluck('anime_id')->toArray();

        // アニメグループ内の各アニメに対して、ウォッチリストに登録されているかチェック
        foreach ($animeGroup->animes ?? [] as $anime) {
            if (in_array($anime->id, $watch_lists)) {
                $anime->watch_flg = true;
            } else {
                $anime->watch_glg = false;
            }

            // Annict IDが未登録の場合は、true に設定
            if (is_null($anime->annict_id)) {
                $anime->annict_null = true;
            } else {
                // Annict Idが登録されている場合は、false に設定
                $anime->annict_null = false;
            }
        }

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
            // ->paginate(15);
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

    public function selectAnimeGroup()
    {
        // 全てのアニメグループを取得
        $animeGroups = AnimeGroup::all();
        // ログインしているユーザーの隠しリストを取得
        $localUserHiddenLists = UserHiddenList::whereUserId(Auth::user()->id)->select('anime_group_id')->get();
        $userHiddenLists = [];
        foreach ($localUserHiddenLists as $localUserHiddenList) {
            $userHiddenLists[] = $localUserHiddenList->anime_group_id;
        }

        return view('watch_lists.select_anime', compact('animeGroups', 'userHiddenLists'));
    }

    public function create(Request $request)
    {
        // ログインしているユーザーのIDを取得し、アニメIDとメモを取得
        $watch_lists_notes = WatchList::whereUserId(Auth::user()->id)->pluck('notes', 'anime_id');
        $animes = Anime::whereAnimeGroupId($request->animeGroupId)->get();
        $watch_lists = WatchList::whereUserId(Auth::user()->id)->pluck('anime_id')->toArray();
        // ログインしているユーザーの視聴済みのステータスのアニメIDを取得
        $watch_lists_comp = WatchList::whereUserId(Auth::user()->id)->whereStatus(1)->pluck('anime_id')->toArray();
        // ログインしているユーザーの視聴中のステータスのアニメIDを取得
        $watch_lists_in = WatchList::whereUserId(Auth::user()->id)->whereStatus(2)->pluck('anime_id')->toArray();

        return view('watch_lists.create', compact('animes', 'watch_lists', 'watch_lists_comp', 'watch_lists_in', 'watch_lists_notes'));
    }

    public function store($anime_id, $status)
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
                // 'notes' => $request->notes,
            ]);
        }
        session(['flash_message' => '登録が完了しました。。']);
    }

    public function edit(WatchList $watch_list)
    {
        // ウォッチリストが現在ログイン中のユーザーでない場合、リダイレクト
        if ($watch_list->user_id !== Auth::id()) {
            return redirect()->route('watch_list.index')->with('error_message', '不正なアクセスです。');
        }

        $animes = Anime::all();

        return Inertia::render('watch_lists/Edit');
    }

    public function update(Request $request, Watchlist $watch_list)
    {
        // ウォッチリストが現在ログイン中のユーザーでない場合、リダイレクト
        if ($watch_list->user_id !== Auth::id()) {
            return redirect()->route('watch_list.index')->with('error_message', '不正なアクセスです。');
        }

        $request->validate([
            'anime_id' => 'required',
        ]);

        // 既にウォッチリストに登録されているアニメの場合はエラーメッセージを返す
        if (WatchList::whereAnime_id($request->anime_id)->whereUser_id(Auth::user()->id)->get()->count() >= 1) {
            return back()->withInput()->withErrors('すでに登録されています。');
        };

        $watch_list->anime_id = $request->anime_id;
        $watch_list->save();

        return redirect()->route('watch_list.index')->with('flash_message', '登録を編集しました。');
    }

    public function destroy(Watchlist $watch_list)
    {
        // ウォッチリストが現在ログイン中のユーザーでない場合、リダイレクト
        if ($watch_list->user_id !== Auth::id()) {
            return redirect()->route('watch_list.index')->with('error_message', '不正なアクセスです。');
        }

        $watch_list->delete();

        session(['flash_message' => '登録を削除しました。']);
    }
}
