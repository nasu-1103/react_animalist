<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserHiddenList extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'anime_group_id'];
}
