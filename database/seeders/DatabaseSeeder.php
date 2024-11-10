<?php

namespace Database\Seeders;

use App\Models\User;
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
