<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Anime extends Model
{
    use HasFactory;

    protected $fillable = ['anime_group_id', 'title', 'episode', 'sub_title'];

    public function watchlists()
    {
        return $this->hasMany(watchlist::class);
    }
}
