<?php

namespace Database\Seeders;

use App\Models\Anime;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $heroAcademiaEpisodes = [
            '緑谷出久：オリジン',
            'ヒーローの条件',
            'うなれ筋肉',
            'スタートライン',
            '今 僕に出来ることを',
            '猛れクソナード',
            'デクvsかっちゃん',
            'スタートライン、爆豪の',
            'いいぞガンバレ飯田くん',
            '未知との遭遇',
            'ゲームオーバー',
            'オールマイト',
            '各々の胸に',
            'オリジナルアニメ「救え！救助訓練！」',
        ];

        $attackOnTitanEpisodes = [
            '二千年後の君へ',
            'その日',
            '絶望の中で鈍く光る',
            '解散式の夜',
            '初陣',
            '少女が見た世界',
            '小さな刃',
            '心臓の鼓動が聞こえる',
            '左腕の行方',
            '応える',
            '偶像',
            '傷',
            '原初的欲求',
        ];

        $demonSlayerEpisodes = [
            '残酷',
            '育手・鱗滝左近次',
            '錆兎と真菰',
            '最終選別',
            '己の鋼',
            '鬼を連れた剣士',
            '鬼舞辻無惨',
            '幻惑の血の香り',
            '手毬鬼と矢印鬼',
            'ずっと一緒にいる',
            '鼓の屋敷',
            '猪は牙を剥き　善逸は眠る',
            '命より大事なもの',
            '藤の花の家紋の家',
        ];

        $jujutsuKaisenEpisodes = [
            '両面宿儺',
            '自分のために',
            '鉄骨娘',
            '呪胎戴天',
            '呪胎戴天-弐-',
            '雨後',
            '急襲',
            '退屈',
            '幼魚と逆罰',
            '無為転変',
            '固陋蠢愚',
            'いつかの君へ',
            'また明日',
        ];

        $blackButlerEpisodes = [
            'その執事、有能',
            'その執事、最強',
            'その執事、万能',
            'その執事、酔狂',
            'その執事、邂逅',
            'その執事、埋葬',
            'その執事、遊興',
            'その執事、調教',
            'その執事、幻像',
            'その執事、氷上',
            'その執事、如何様',
            'その執事、寂寥',
            'その執事、居候',
        ];

        // 僕のヒーローアカデミアのエピソードを追加
        for ($episode = 1; $episode < 14; $episode++) { 
            Anime::create([
                'anime_group_id' => 1,
                'title' => '僕のヒーローアカデミア',
                'episode' => $episode,
                'sub_title' => $heroAcademiaEpisodes[$episode -1],
            ]);
        }

        // 進撃の巨人のエピソードを追加
        for ($episode =1 ; $episode < 13; $episode++) { 
            Anime::create([
                'anime_group_id' => 2,
                'title' => '進撃の巨人',
                'episode' => $episode,
                'sub_title' => $attackOnTitanEpisodes[$episode -1],
            ]);
        }

        // 鬼滅の刃 竈門炭治郎 立志編のエピソードを追加
        for ($episode = 1; $episode < 14; $episode ++) { 
            Anime::create([
                'anime_group_id' => 3,
                'title' => '鬼滅の刃 竈門炭治郎 立志編',
                'episode' => $episode,
                'sub_title' => $demonSlayerEpisodes[$episode -1],
            ]);
        }

        // 呪術廻戦のエピソードを追加
        for ($episode = 1; $episode < 13; $episode++) { 
            Anime::create([
                'anime_group_id' => 4,
                'title' => '呪術廻戦',
                'episode' => $episode,
                'sub_title' => $jujutsuKaisenEpisodes[$episode -1],
            ]);
        }

        // 黒執事のエピソードを追加
        for ($episode = 1; $episode < 13; $episode ++) { 
            Anime::create([
                'anime_group_id' => 5,
                'title' => '黒執事',
                'episode' => $episode,
                'sub_title' => $blackButlerEpisodes[$episode -1],
            ]);
        }
    }
}
