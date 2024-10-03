import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function WatchList({ auth, animeGroups }) {
    const { data, setData, post, delete: destroy, recentlySuccessful } = useForm({
        // 検索キーワードの初期値を設定
        'keyword': ''
    });

    // ウォッチリストのデータを保存する
    const [animeGropus, setAnimeGroups] = useState([]);

    // フラッシュメッセージの設定
    const [flashMessage, setFlashMessage] = useState('');

    // アニメグループリストの設定
    const animeGroupList = [];

    // キーワードと一致するアニメグループを検索
    const animeGroupsLocal = animeGroups.filter(
        animeGroup => animeGroup.name.includes(data.keyword) ||
            // サブタイトルが部分一致していたら true 、 一致しなかったら fasle
            animeGroup.animes.map(anime => anime.sub_title.indexOf(data.keyword) !== -1 ? true : false).includes(true) ? true : false
    );

    // 一致したアニメグループのリストを作成
    const animeGroupsLists = animeGroupsLocal.map(animeGroup =>
        <>
            {/* アニメグループの情報を表示 */}
            <div className="text-gray-900">
                <div className="card bg-base-100 shadow-md mt-6 text-lg">
                    <div className="card-body flex">
                        <div class="flex">
                            <h2 className='card-title'>{animeGroup.name}</h2>
                            {/* 全てのアニメが視聴済みの場合、👑を表示 */}
                            {animeGroup.animes_count == animeGroup.watchList_count &&
                                <span className="text-3xl ml-2 mb-2">👑</span>
                            }
                        </div>
                        <div className="anime_group">
                            <div class="card-actions relative overflow-x-auto shadow-sm sm:rounded-lg text-gray-300 active:text-gray-200">
                                <table className="w-full text-gray-700 text-center text-nowrap">
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
                                        {/* アニメごとにテーブルを作成 */}
                                        {animeGroup.animes.map(anime => {
                                            // アニメの視聴日を取得
                                            const createdAt = anime.watchlists?.created_at;

                                            // Dateオブジェクトに変換
                                            const dateObj = createdAt ? new Date(createdAt) : null;

                                            // 年月日時分秒をそれぞれ取得
                                            const year = dateObj ? dateObj.getFullYear() : "----";
                                            const month = dateObj ? String(dateObj.getMonth() + 1).padStart(2, '0') : "--";
                                            const day = dateObj ? String(dateObj.getDate()).padStart(2, '0') : "--";
                                            const hours = dateObj ? String(dateObj.getHours()).padStart(2, '0') : "--";
                                            const minutes = dateObj ? String(dateObj.getMinutes()).padStart(2, '0') : "--";
                                            const seconds = dateObj ? String(dateObj.getSeconds()).padStart(2, '0') : "--";

                                            // フォーマットされた日時
                                            const formattedDateTime = dateObj ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` : "";

                                            return (
                                                <tr key={anime.id} className="w-full text-center">
                                                    <td className="border border-slate-300 px-6 py-4">{anime.episode}話</td>
                                                    <td className="border border-slate-300 px-6 py-4">{anime.sub_title}</td>
                                                    <td className="border border-slate-300 px-6 py-4">{formattedDateTime}</td>
                                                    <td className="border border-slate-300 px-6 py-4">
                                                        <select onChange={changeStatus} data-id={anime.id} className='align-top rounded-xl mt-2'>
                                                            <option value="-1" selected={!anime.watchlists || anime.watchlists.status === -1}>未視聴</option>
                                                            <option value="2" selected={anime.watchlists?.status == 2}>視聴中</option>
                                                            <option value="1" selected={anime.watchlists?.status == 1}>視聴済み</option>
                                                        </select>
                                                        <textarea
                                                            name="note"
                                                            id={`note-${anime.id}`}
                                                            rows="1"
                                                            cols="12"
                                                            placeholder="メモ"
                                                            className="ml-6 rounded-xl xl:inline-block mt-2"
                                                            defaultValue={anime.watchlists?.notes ?? ''}>
                                                        </textarea>
                                                    </td>
                                                    <td className="flex border border-slate-300 px-6 py-6 justify-center gap-4">
                                                        <button className="btn btn-outline btn-secondary" onClick={deleteWatchList} data-id={anime.watchlists?.id} data-anime-id={anime.id}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    // ウォッチリストの削除処理
    function deleteWatchList(event) {
        destroy(route('watch_list.destroy', { "watch_list": event.target.dataset.id }));
        setFlashMessage('登録を削除しました。');
        document.getElementById('note-' + event.target.dataset.animeId).value = '';
    }

    // ステータス変更の処理
    function changeStatus(event) {
        const anime_id = event.target.dataset.id;
        const status = event.target.value;
        const note = document.getElementById('note-' + anime_id).value;
        post(route('watch_list.store', { "anime_id": anime_id, "status": status, "note": note }));
        setFlashMessage('登録を編集しました。');
    }

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
                            {recentlySuccessful && <div className="mb-4 ml-7 text-gray-700 text-md">{flashMessage}</div>}

                        </div>

                        {/* アニメグループリストにデータがない場合に表示する */}
                        {animeGroupsLists.length !== 0 ?
                            animeGroupsLists :
                            <p className="text-center">投稿はありません。</p>
                        }
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}