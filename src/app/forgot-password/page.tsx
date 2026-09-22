import type {Metadata} from 'next';
import { noIndexRobots } from '@/lib/metadata';
import { ForgotPasswordForm } from './forgot-password-form';

export const metadata: Metadata = {
    robots: noIndexRobots(),
    title: 'Forgot Password',
    description: 'Reset your password to regain access to your account.',
};

export default async function ForgotPasswordPage(_props: PageProps<'/forgot-password'>) {
    return (
        <div className="flex items-center justify-center px-4 py-12 min-h-[60vh]">
            <div className="w-full max-w-md">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
