'use client';

import { useTransition } from 'react';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/app/sign-in/actions';

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    return (
        <form action={logoutAction}>
            <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors w-full text-left text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                <LogOut className="h-5 w-5" />
                {isPending ? 'Logging out...' : 'Logout'}
            </button>
        </form>
    );
}
