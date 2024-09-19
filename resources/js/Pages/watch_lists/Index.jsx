import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function WatchList({ auth, animeGroups, flash_message = null, error_message = null }) {
    // 検索キーワードを入力するための初期データを設定
    const { data, setData, post, delete: destroy } = useForm({
        'keyword': ''
    });

    // ウォッチリストのデータを保存する
    const [animeGropus, setAnimeGroups] = useState([]);

    // フラッシュメッセージとエラーメッセージを設定
    const [flashMessage, setFlashMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('')

    // キーワードと一致するアニメグループを検索
    const animeGroupsLocal = animeGroups.filter(
        animeGroup => animeGroup.name.includes(data.keyword) ||
            animeGroup.animes.map(anime => anime.sub_title).includes(data.keyword)
    );

    // 一致したアニメグループのリストを作成
    const animeGroupsLists = animeGroupsLocal.map(animeGroup =>
        <>
            <div class="flex">
                <p className='text-2xl'>{animeGroup.name}</p>
                {/* 全てのアニメが視聴済みなら、👑を表示 */}
                {animeGroup.animes_count == animeGroup.watchList_count &&
                    <p className="text-2xl ml-2">👑</p>
                }
            </div>

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
                                    <td className="border border-slate-300 px-6 py-4">{anime.watchlists?.created_at}</td>
                                    <td className="border border-slate-300 px-6 py-4">
                                        <select onChange={changeStatus} data-id={anime.id}>
                                            <option value="-1" selected>未視聴</option>
                                            <option value="2" selected={anime.watchlists?.status == 2}>視聴中</option>
                                            <option value="1" selected={anime.watchlists?.status == 1}>視聴済み</option>
                                        </select>
                                    </td>
                                    <td className="flex border border-slate-300 px-6 py-6 justify-center gap-4">
                                        <button className="btn btn-outline btn-secondary" onClick={deleteWatchList} data-id={anime.watchlists?.id}>削除</button>
                                    </td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </p>
        </>
    )

    // ウォッチリストの削除処理
    function deleteWatchList(event) {
        destroy(route('watch_list.destroy', { "watch_list": event.target.dataset.id }));
        setFlashMessage('登録を削除しました。');
    }

    // ステータス変更の処理
    function changeStatus(event) {
        const anime_id = event.target.dataset.id;
        const status = event.target.value;
        post(route('watch_list.store', { "anime_id": anime_id, "status": status }));
        setFlashMessage('登録を編集しました。');
    }

    // const [keyword, setKeyword] = useState(''); // TODO:ほどほどに動いたら後で消す

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
                    </div>
                </form>
            }
        >
            <Head title="Watch List" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <div className="mr-1 mt-3 mb-4">

                            {/* フラッシュメッセージを表示 */}
                            {flashMessage && <div className="mb-4 text-gray-700">{flashMessage}</div>}

                            {/* エラーメッセージを表示 */}
                            {errorMessage && <div className="mb-4 text-gray-700">{errorMessage}</div>}
                        </div>

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
                                                                                <button className="btn btn-outline btn-secondary" onClick={() => confirm('本当に削除しますか？')}>
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        fill="none"
                                                                                        viewBox="0 0 24 24"
                                                                                        stroke-width="1.5"
                                                                                        stroke="currentColor"
                                                                                        class="size-6"
                                                                                    >
                                                                                        <path
                                                                                            stroke-linecap="round"
                                                                                            stroke-linejoin="round"
                                                                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                                        />
                                                                                    </svg>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    // ウォッチリストにデータがなくても罫線を引く
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
        </AuthenticatedLayout >
    );
}