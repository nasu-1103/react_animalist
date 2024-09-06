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
}
