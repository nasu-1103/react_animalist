<?php

namespace App\Http\Controllers;

use App\Models\WatchList;
use Illuminate\Http\Request;

class WatchlistAPIController extends Controller
{
    public function setStatus(Request $request)
    {
        // ステータスが1または2の場合
        if ($request->status === "1" || $request->status === "2") {
            // 指定されたユーザーIDとアニメIDが一致するウォッチリストを取得
            $watchLists = WatchList::whereUserId($request->user_id)->whereAnimeId($request->anime_id)->get();

            // 既にウォッチリストが存在する場合は削除
            if ($watchLists->count() >= 1) {
                $watchLists[0]->delete();
            }

            WatchList::create([
                'anime_id' => $request->anime_id,
                'user_id' => $request->user_id,
                'status' => $request->status,
                'notes' => $request->notes,
            ]);
            return ['result' => 'insert'];
        } else {
            // ステータスが1または2でない場合は、指定されたウォッチリストを削除
            WatchList::whereUserId($request->user_id)
            ->whereAnimeId($request->anime_id)
            ->delete();
            return ['result' => 'delete'];
        }
        return ['result' => 'error'];
    }

    public function setNotes(Request $request)
    {
        // 指定されたユーザーIDとアニメIDが一致するウォッチリストを取得
        $watchLists = WatchList::whereUserId($request->user_id)->whereAnimeId($request->anime_id)->get();

        // ウォッチリストが存在する場合、メモを更新
        if ($watchLists) {
            $watchLists->notes = $request->notes;
            $watchLists->save();
            return ['result' => 'update'];
        } else {
            return ['result'=> 'error'];
        }
    }

    public function changeStatus(Request $request)
    {
        // アニメIDを取得
        $animeId = $request->input('anime_id');

        // アニメIDに関連するウォッチリストのエピソードを取得
        $watchlists = WatchList::where('anime_id', $animeId)->get();

        // ウォッチリスト内のエピソードに、未視聴または視聴中があるかチェック
        $hasUnwatchedOrWatching = $watchlists->contains(function ($watchlist) {
            return $watchlist->status != 1;
        });

        // 👑を表示するかの条件を設定
        if ($hasUnwatchedOrWatching) {
            // 未視聴または視聴中のエピソードがある場合、👑は表示しない
            return response()->json(['👑' => false]);
        } else {
            // 全てのエピソードが視聴済みの場合、👑を表示
            return response()->json(['👑' => true]);
        }
    }
}
