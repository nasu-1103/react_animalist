<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Anime;
use App\Models\AnimeGroup;
use App\Models\User;
use App\Models\WatchList;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'admin_flg' => 1,
        ]);

        User::factory()->create([
            'name' => 'なす',
            'email' => 'test@test.com',
        ]);

        $this->call([
            // AnimeSeeder::class,
            // AnimeGroupSeeder::class,
            // WatchListSeeder::class,
        ]);
    }
}
