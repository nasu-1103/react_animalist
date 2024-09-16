<?php

use App\Models\Anime;
use App\Models\WatchList;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AnimeController;
use App\Http\Controllers\AnimeGroupController;
use App\Http\Controllers\WatchlistController;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect(route('login'));
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/watch_list/index', function () {
    return Inertia::render('watch_lists/Index');
})->middleware(['auth', 'verified'])->name('watch_list.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('anime_groups/setting', [AnimeGroupController::class, 'setting'])->name('anime_groups.setting');
    // Route::post('anime_groups/setting/add', [AnimeGroupController::class, 'settingAdd'])->name('anime_groups.setting.add');
    // Route::delete('anime_groups/setting/add', [AnimeGroupController::class, 'settingDelete'])->name('anime_groups.setting.delete');

    Route::get('/watchlists/index', [WatchlistController::class, 'index'])->name('watch_list.index');
    // Route::get('watchlists/selectAnime', [WatchlistController::class, 'selectAnimeGroup'])->name('watch_list.selectAnimeGroup');
    // Route::get('watchlists/create', [WatchlistController::class, 'create'])->name('watch_list.create');
    Route::post('/watchlists/store/{anime_id}/{status}', [WatchlistController::class, 'store'])->name('watch_list.store');
    // Route::get('watchlists/edit/{watch_list}', [WatchlistController::class, 'edit'])->name('watch_list.edit');
    // Route::patch('watchlists/{watch_list}', [WatchlistController::class, 'update'])->name('watch_list.update');
    Route::delete('watchlists/{watch_list}', [WatchlistController::class, 'destroy'])->name('watch_list.destroy');

    Route::middleware(['can:admin'])->group(function () {
        // Route::get('anime_groups/index', [AnimeGroupController::class, 'index'])->name('anime_groups.index');
        // Route::get('anime_groups/create', [AnimeGroupController::class, 'create'])->name('anime_groups.create');
        // Route::get('anime_groups_/annict_search', [AnimeGroupController::class, 'annict_search'])->name('anime_groups.annict_search');
        // Route::get('anime_groups/annict_list', [AnimeGroupController::class, 'annict_list'])->name('anime_groups.annict_list');
        // Route::post('anime_groups/store', [AnimeGroupController::class, 'store'])->name('anime_groups.store');
        // Route::post('anime_groups/annict_store', [AnimeGroupController::class, 'annict_store'])->name('anime_groups.annict_store');
        // Route::get('anime_groups/edit/{animeGroup}', [AnimeGroupController::class, 'edit'])->name('anime_groups.edit');
        // Route::get('anime_groups/{animeGroup}', [AnimeGroupController::class, 'show'])->name('anime_groups.show');
        // Route::patch('anime_groups/{animeGroup}', [AnimeGroupController::class, 'update'])->name('anime_groups.update');
        // Route::delete('anime_groups/{animeGroup}', [AnimeGroupController::class, 'destroy'])->name('anime_groups.destroy');

        // Route::get('/animes/index', [AnimeController::class, 'index'])->name('animes.index');
        // Route::get('animes/create', [AnimeController::class, 'create'])->name('animes.create');
        // Route::get('animes/annict_search', [AnimeController::class, 'annict_search'])->name('animes.annict_search');
        // Route::get('animes/annict_list', [AnimeController::class, 'annict_list'])->name('animes.annict_list');
        // Route::post('/animes/store', [AnimeController::class, 'store'])->name('animes.store');
        // Route::post('animes/annict_store', [AnimeController::class, 'annict_store'])->name('animes.annict_store');
        // Route::get('/animes/edit/{anime}', [AnimeController::class, 'edit'])->name('animes.edit');
        // Route::get('/animes/{anime}', [AnimeController::class, 'show'])->name('animes.show');
        // Route::patch('/animes/{anime}', [AnimeController::class, 'update'])->name('animes.update');
        Route::delete('/animes/{anime}', [AnimeController::class, 'destroy'])->name('animes.destroy');
    });
});