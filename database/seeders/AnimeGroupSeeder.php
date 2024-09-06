<?php

namespace Database\Seeders;

use App\Models\AnimeGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnimeGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AnimeGroup::create([
            'name' => '僕のヒーローアカデミア',
        ]);

        AnimeGroup::create([
            'name' => '進撃の巨人',
        ]);

        AnimeGroup::create([
            'name' => '鬼滅の刃 竈門炭治郎 立志編',
        ]);

        AnimeGroup::create([
            'name' => '呪術廻戦',
        ]);

        AnimeGroup::create([
            'name' => '黒執事',
        ]);
    }
}
