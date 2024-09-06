<?php

namespace Database\Seeders;

use App\Models\WatchList;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WatchListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Watchlist::factory(5)->create();
    }
}
