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
            ])
            ->doesntHave('hiddenLists')
            ->paginate(15);

        return Inertia::render('watch_lists/Index');
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

    public function store(Request $request)
    {
        // バリデーションのエラーメッセージを設定
        $request->validate([
            'anime_check_lists' => 'required',
        ], [
            'anime_check_lists.required' => 'アニメチェックリストを選択してください。'
        ]);

        // チェックされたアニメをウォッチリストに登録
        foreach ($request->anime_check_lists as $anime_check_list) {
            // 既にウォッチリストに登録されている場合はエラーをスロー
            if (WatchList::whereAnime_id($anime_check_list)->whereUserId(Auth::user()->id)->get()->count() >= 1) {
                throw ValidationException::withMessages([
                    'anime_check_lists' => 'すでに登録されています。',
                ]);
            };

            $watch_list = new WatchList();
            $watch_list->anime_id = $anime_check_list;
            $watch_list->user_id = Auth::user()->id;
            $watch_list->save();
        }

        return redirect()->route('watch_list.index')->with('flash_message', '登録が完了しました。');
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

        return redirect()->route('watch_list.index')->with('flash_message', '登録を削除しました。');
    }
}
