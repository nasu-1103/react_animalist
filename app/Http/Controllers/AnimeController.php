<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\AnimeGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;


class AnimeController extends Controller
{
    public function destroy(Anime $anime)
    {
        // 管理者以外のアクセスを拒否
        if (Gate::denies('admin')) {
            return redirect()->route('animes.index')->with('error_message', '不正なアクセスです。');
        }

        $anime->delete();

        return redirect()->route('animes.index')->with('flash_message', '登録を削除しました。');
    }
}
