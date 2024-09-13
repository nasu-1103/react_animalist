import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-4 text-sm text-gray-600">
                ご登録ありがとうございます。入力いただいたメールアドレス宛に確認メールを送信しました。
                メールをご確認いただき、メールに記載されたURLをクリックして登録を完了してください。メールが届いていない場合、メールを再送できます。
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    入力いただいたメールアドレスに新しい確認メールを送信しました。
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>確認メールを再送する</PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        ログアウト
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
