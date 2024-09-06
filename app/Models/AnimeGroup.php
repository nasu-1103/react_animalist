<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnimeGroup extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'annict_id'];

    public function hiddenLists(): HasMany
    {
        return $this->hasMany(UserHiddenList::class);
    }

    public function animes(): HasMany
    {
        return $this->hasMany(Anime::class);
    }
}
