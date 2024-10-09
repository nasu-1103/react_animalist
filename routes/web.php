<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WatchlistController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    Auth::logout();
    return redirect(route('login'));
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

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
    Route::get('/watchlists/index', [WatchlistController::class, 'index'])->name('watch_list.index');
    Route::post('/watchlists/store/{anime_id}/{status}/{note?}', [WatchlistController::class, 'store'])->name('watch_list.store');
    Route::delete('watchlists/{watch_list}', [WatchlistController::class, 'destroy'])->name('watch_list.destroy');
    Route::post('/watchlists/addHiddenList/{anime_group_id}', [WatchlistController::class, 'addHiddenList'])->name('watch_list.addHiddenList');
    Route::post('/watchlists/deleteHiddenList/{anime_group_id}', [WatchlistController::class, 'deleteHiddenList'])->name('watch_list.deleteHiddenList');
    Route::post('/watchlists/setNote/{note}', [WatchlistController::class, 'setNote'])->name('watch_list.setNote');
});