import { redirect } from 'next/navigation';

export default async function AccountPage({
    searchParams,
}: PageProps<'/account'>) {
    // Note: OAuth revalidation handled in the profile page or via route handlers
    // Redirect to profile page as the default account page
    redirect('/account/profile');
}
