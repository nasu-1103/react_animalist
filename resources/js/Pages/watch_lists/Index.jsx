import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function WatchList({ animeGroups }) {
    const { data, setData } = useForm({
        'keyword': ''
    });

    const animeGroupsLocal = animeGroups.filter(
        animeGroup => animeGroup.name.includes(data.keyword)
    );

    const animeGroupsLists = animeGroupsLocal.map(animeGroup =>
        <>
            <p className='text-2xl'>{animeGroup.name}</p>
            <hr />
            <p>
                <table className="w-full text-gray-700 text-nowrap">
                    <thead>
                        <tr>
                            <th className="mt-4 w-24">話数</th>
                            <th className="mt-4 w-72">サブタイトル</th>
                            <th className="mt-4 w-48">視聴日</th>
                            <th className="mt-4 w-16">ステータス</th>
                            <th className="mt-4 w-36">エディット</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animeGroup.animes.map(anime =>
                            <>
                                <tr className="text-center">
                                    <td className="border border-slate-300 px-6 py-4">{anime.episode + '話'}</td>
                                    <td className="border border-slate-300 px-6 py-4">{anime.sub_title}</td>
                                    <td className="border border-slate-300 px-6 py-4">{anime.created_at}</td>
                                    <td className="border border-slate-300 px-6 py-4">
                                        <select onChange={changeStatus} data-id={anime.id}>
                                            <option value="false" selected>未視聴</option>
                                            <option value="true">視聴済み</option>
                                        </select>
                                    </td>
                                    <td className="flex border border-slate-300 px-6 py-6 justify-center gap-4">
                                        <button className="btn btn-outline btn-secondary" onClick={deleteWatchList} data-id={anime.id}>削除</button>
                                    </td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </p>
        </>
    )

    function deleteWatchList(event) {
        console.log(event.target.dataset.id);
    }

    function changeStatus(event) {
        console.log(event.target.dataset.id);
    }
    // 一時的に固定値を設定
    const animeGroupList = [
        {
            id: 1,
            name: '僕のヒーローアカデミア',
            animes: [
                {
                    id: 1,
                    episode: 1,
                    sub_title: '緑谷出久 : オリジン',
                    watchlists: [
                        {
                            id: 1,
                            anime_id: 1,
                            user_id: 1,
                            status: 1,
                            created_at: '2024-09-02 08:42:52',
                        },
                    ],
                },
            ],
        },
    ];

    const [keyword, setKeyword] = useState('');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <form action="#" method="GET">
                    <div className="col-auto flex">
                        <label className="font-semibold text-xl my-auto text-gray-800">視聴リスト</label>
                        <input
                            type="text"
                            name="keyword"
                            className="ml-4 mt-1 block w-96 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
                            value={data.keyword}
                            onChange={(e) => setData('keyword', e.target.value)}
                        />
                        {/* <button type="submit" className="btn btn-outline btn-info ml-3 mt-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-6"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button> */}
                    </div>
                </form>
            }
        >
            <Head title="Watch List" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <div className="mr-1 mt-3 mb-4">
                            {/* <Link href="#" className="btn btn-link text-lg">新規登録</Link> */}

                            {/* @session('flash_message')
                            {{ session('flash_message') }}
                            @endsession

                            @session('error_message')
                            {{ session('error_message') }}
                            @endsession */}

                            {animeGroupsLists}

                            {animeGroupList.length > 0 ? (
                                animeGroupList.map((animeGroup) => (
                                    <div key={animeGroup.id} className="text-gray-900">
                                        <div className="card bg-base-100 shadow-xl mt-6 text-lg">
                                            <div className="card-body flex">
                                                <div className="flex">
                                                    <h2 className="card-title">{animeGroup.name}</h2>
                                                    {/* 全アニメがウォッチリストに登録されている場合は👑を表示 */}
                                                    {animeGroup.animes.length === animeGroup.animes.reduce(
                                                        (init, anime) => init + anime.watchlists.length, 0) && (
                                                            <span className="text-2xl ml-2">👑</span>
                                                        )}
                                                    {/* アニメごとにテーブルを作成 */}
                                                    {animeGroup.animes.map((anime) => (
                                                        <div key={anime.id} className="anime_group">
                                                            <table className="w-full text-gray-700 text-nowrap">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="mt-4 w-24">話数</th>
                                                                        <th className="mt-4 w-72">サブタイトル</th>
                                                                        <th className="mt-4 w-48">視聴日</th>
                                                                        <th className="mt-4 w-16">ステータス</th>
                                                                        <th className="mt-4 w-36">エディット</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {anime.watchlists.length > 0 ? (
                                                                        anime.watchlists.map((watchList) => (
                                                                            <tr key={watchList.id} className="text-center">
                                                                                <td className="border border-slate-300 px-6 py-4">{anime.episode}話</td>
                                                                                <td className="border border-slate-300 px-6 py-4">{anime.sub_title}</td>
                                                                                <td className="border border-slate-300 px-6 py-4">{watchList.created_at}</td>
                                                                                <td className="border border-slate-300 px-6 py-4">
                                                                                    {watchList.status === 1 ? '✅' : '👀'}
                                                                                </td>
                                                                                <td className="flex border border-slate-300 px-6 py-4 justify-center gap-4">
                                                                                    <Link href="#" className="btn btn-outline btn-primary">編集</Link>
                                                                                    <button className="btn btn-outline btn-secondary" onClick={() => confirm('本当に削除しますか？')}>削除</button>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        // ウォッチリストにデータがない場合
                                                                        <tr>
                                                                            <td className="border border-slate-300 px-6 py-4"></td>
                                                                            <td className="border border-slate-300 px-6 py-4"></td>
                                                                            <td className="border border-slate-300 px-6 py-4"></td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">投稿はありません。</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}