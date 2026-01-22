import type {Metadata} from 'next';
import { getActiveCustomer } from '@/lib/vendure/actions';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Profile',
};
import { ChangePasswordForm } from './change-password-form';
import { EditProfileForm } from './edit-profile-form';
import { EditEmailForm } from './edit-email-form';

export default async function ProfilePage(_props: PageProps<'/account/profile'>) {
    try {
        const customer = await getActiveCustomer();

        if (!customer) {
            redirect('/sign-in');
        }

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your account information
                    </p>
                </div>

                <EditProfileForm customer={customer} />

                <EditEmailForm currentEmail={customer?.emailAddress || ''} />

                <ChangePasswordForm />
            </div>
        );
    } catch (error) {
        console.error('Error loading profile:', error);
        redirect('/sign-in');
    }
}
