import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function WatchList({ auth, animeGroups, hiddenLists }) {
    const { data, setData, post, delete: destroy, recentlySuccessful } = useForm({
        // 検索キーワードの初期値を設定
        'keyword': ''
    });

    // フラッシュメッセージの設定
    const [flashMessage, setFlashMessage] = useState('');

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
                {/* 非表示リストの要素数が1でないかつ、表示する場合 */}
                {animeGroup.hidden_lists.length !== 1 &&
                    <div className="card bg-base-100 shadow-md mt-6 text-lg">
                        <div className="card-body flex">
                            <div className="flex">
                                <h2 className='card-title'>{animeGroup.name}</h2>
                                {/* アイコンを表示してクリック時に非表示リストを表示 */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-3
                                 mb-2  mt-2 size-6" onClick={addHiddenList} data-anime-group-id={animeGroup.id}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                </svg>
                                {/* 全てのアニメが視聴済みの場合、👑を表示 */}
                                {animeGroup.animes_count == animeGroup.watchList_count &&
                                    <span className="text-3xl ml-2 mb-2">👑</span>
                                }
                            </div>

                            <div className="anime_group">
                                <div className="card-actions relative overflow-x-auto shadow-sm sm:rounded-lg text-gray-300 active:text-gray-200">
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
                                                                {/* ウォッチリストが null（未視聴の場合）、未視聴を表示して、変更されたら日時をクリアする */}
                                                                {anime.watchlists == null && <option defaultValue="-1">未視聴</option>}
                                                                <option defaultValue="2" selected={anime.watchlists?.status == 2}>視聴中</option>
                                                                <option defaultValue="1" selected={anime.watchlists?.status == 1}>視聴済み</option>
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
                                                            <button className="btn btn-outline btn-secondary" onClick={deleteWatchList} data-id={anime.watchlists[0]?.id}>削除</button>
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
                }
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

    // 非表示リストにアニメグループを追加する処理
    function addHiddenList(event) {
        // 対象のアニメグループIDを取得
        const anime_group_id = event.target.dataset.animeGroupId;

        // 指定したアニメグループを非表示リストに追加
        post(route('watch_list.addHiddenList', { "anime_group_id": anime_group_id }));
    }

    // メモの内容を設定する処理
    function setNote(event) {
        // メモの内容を取得
        const note = event.target.value;

        // メモの内容を保存するリクエストを送信
        post(route('watch_list.setNote', { "note": note }))
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <form action="#" method="get">
                    <div className="col-auto flex">
                        <label className="font-semibold text-xl my-auto text-gray-800">視聴リスト</label>
                        <input
                            type="text"
                            name="keyword"
                            className="ml-4 mt-1 block w-96 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
                            defaultValue={data.keyword}
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

                            <div className="flex ml-60">
                                <label
                                    htmlFor="memo"
                                    className="xl:inline-block xl:ml-2 text-lg font-medium text-red-500 dark:text-white"
                                >
                                    視聴中の場合、先に時間を入力してから視聴中に変更してください。
                                </label>
                                <div className="tooltip" data-tip="視聴中の場合、先に時間を入力してから視聴中に変更してください。">
                                    <textarea
                                        name="memo"
                                        id="memo"
                                        rows="1"
                                        cols="12"
                                        placeholder="例：15:10"
                                        className="ml-8 rounded-xl"
                                        onChange={setNote}
                                        defaultValue={auth.user.notes}
                                    />
                                </div>
                            </div>
                        </div>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <div className="text-end text-3xl mr-8">
                                    {'+'}
                                </div>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                {
                                    // 非表示リストのリンクを表示
                                    hiddenLists.map(hiddenList =>
                                        <Dropdown.Link
                                            href={route('watch_list.deleteHiddenList', hiddenList.anime_group.id)}
                                            method="post"
                                        >
                                            {/* アニメグループのタイトルを表示 */}
                                            {hiddenList.anime_group.name}
                                        </Dropdown.Link>
                                    )
                                }
                            </Dropdown.Content>
                        </Dropdown>

                        {/* アニメグループリストにデータがない場合に表示 */}
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