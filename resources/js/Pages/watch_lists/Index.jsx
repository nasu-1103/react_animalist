import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

// アニメグループリストを表示し、非表示追加、ステータス変更、削除の設定
const AnimeGroupsLists = ({ animeGroup, addHiddenList, changeStatus, deleteWatchList }) => {
    // アニメごとのメモを管理、ウォッチリストにメモがなければ空文字を設定
    const [notes, setNotes] = useState(animeGroup.animes.map(anime => anime.watchlists?.notes ?? ''));
    return (
        <>
            {/* アニメグループの情報を表示 */}
            <div className="text-gray-900">
                {/* アニメグループが非表示リストに1つ以上ある場合、表示 */}
                {animeGroup.hidden_lists.length !== 1 &&
                    <div className="card bg-base-100 shadow-md mt-6 text-lg">
                        <div className="card-body flex">
                            <div className="flex">
                                <h2 className="card-title">{animeGroup.name}</h2>
                                {/* アイコンを表示してクリック時に非表示リストを表示 */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-3
                                    mb-2 mt-2 size-6" onClick={() => addHiddenList(animeGroup.id)}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                </svg>
                                {/* 全てのアニメが視聴済みの場合、👑を表示 */}
                                {animeGroup.animes_count === animeGroup.watchList_count &&
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
                                            {animeGroup.animes.map((anime, animeIndex) => {

                                                return (
                                                    <tr key={anime.id} className="w-full text-center">
                                                        <td className="border border-slate-300 px-6 py-4">{anime.episode}話</td>
                                                        <td className="border border-slate-300 px-6 py-4">{anime.sub_title}</td>
                                                        <td className="border border-slate-300 px-6 py-4">{anime.watchlists?.created_at}</td>
                                                        <td className="border border-slate-300 px-6 py-4">
                                                            <select onChange={(e) => changeStatus(e, anime.id, notes[animeIndex])} defaultValue={anime.watchlists ? `${anime.watchlists.status}` : "-1"} className='align-top rounded-xl mt-2'>
                                                                {/* ウォッチリストが null（未視聴の場合）、未視聴を表示して、変更されたら日時をクリアする */}
                                                                {anime.watchlists === null && <option value="-1">未視聴</option>}
                                                                <option value="2">視聴中</option>
                                                                <option value="1">視聴済み</option>
                                                            </select>
                                                            <textarea
                                                                name="note"
                                                                id={`note-${anime.id}`}
                                                                rows="1"
                                                                cols="12"
                                                                placeholder="メモ"
                                                                className="ml-6 rounded-xl xl:inline-block mt-2"
                                                                value={notes[animeIndex]}
                                                                onChange={(e) => setNotes(notes.map((note, idx) => idx === animeIndex ? e.target.value : note))}
                                                            >
                                                            </textarea>
                                                        </td>
                                                        <td className="flex border border-slate-300 px-6 py-6 justify-center gap-4">
                                                            <button className="btn btn-outline btn-secondary" onClick={() => deleteWatchList(anime.watchlists?.id, anime.watchlists?.anime_id)}>削除</button>
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
            </div >
        </>
    )
}

export default function WatchList({ auth, animeGroups, hiddenLists }) {
    const { data, setData, post, delete: destroy, recentlySuccessful } = useForm({
        // 検索キーワードの初期値を設定
        'keyword': ''
    });

    // フラッシュメッセージの設定
    const [flashMessage, setFlashMessage] = useState('');

    // キーワードと一致するアニメグループを検索
    const animeGroupsLocal = animeGroups.filter(
        animeGroup => !!(animeGroup.name.includes(data.keyword) ||
            // 各アニメのサブタイトルにキーワードが含まれているか検索
            animeGroup.animes.map(anime => anime.sub_title.indexOf(data.keyword) !== -1).includes(true))
    );

    // ウォッチリストの削除処理
    function deleteWatchList(id, animeId) {
        destroy(route('watch_list.destroy', { "watch_list": id }));
        setFlashMessage('登録を削除しました。');

        // 画面をリロードして、データを再取得
        window.location.reload()
    }

    // ステータス変更の処理
    function changeStatus(event, animeId, note) {
        const status = event.target.value;
        post(route('watch_list.store', { "anime_id": animeId, "status": status, "note": note }));
        setFlashMessage('登録を編集しました。');
    }

    // 非表示リストにアニメグループを追加する処理
    function addHiddenList(animeGroupId) {

        // 指定したアニメグループを非表示リストに追加
        post(route('watch_list.addHiddenList', { "anime_group_id": animeGroupId }));
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
                            {/* クリックでドロップダウンを表示する */}
                            <Dropdown.Trigger>
                                <div className="text-end text-3xl mr-8">
                                    {/* 非表示リストのアイコンを表示 */}
                                    {'+'}
                                </div>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                {
                                    // 非表示リストのリンクを表示
                                    hiddenLists.map(hiddenList =>
                                        <Dropdown.Link
                                            key={hiddenList.anime_group.id}
                                            href={route('watch_list.deleteHiddenList', hiddenList.anime_group.id)}
                                            as={"button"}
                                            method="post"
                                        >
                                            {/* アニメグループのタイトルを表示 */}
                                            {hiddenList.anime_group.name}
                                        </Dropdown.Link>
                                    )
                                }
                            </Dropdown.Content>
                        </Dropdown>

                        {/* データがある場合、各アニメグループごとにリストを作成 */}
                        {animeGroupsLocal.length !== 0 ?
                            animeGroupsLocal.map(animeGroup => (
                                <AnimeGroupsLists
                                    key={animeGroup.id}
                                    animeGroup={animeGroup}
                                    addHiddenList={addHiddenList}
                                    changeStatus={changeStatus}
                                    deleteWatchList={deleteWatchList}
                                />
                            )) :
                            // アニメグループリストにデータがない場合に表示
                            <p className="text-center">投稿はありません。</p>
                        }
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}