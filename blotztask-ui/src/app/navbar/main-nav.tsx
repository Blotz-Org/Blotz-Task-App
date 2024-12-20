'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './main-nav.module.css';

export function MainNav() {
  const { data: session } = useSession();

  //TODO : Do we need this ? if not remove
  // const [providers, setProviders] = useState<Record<
  //   string,
  //   ClientSafeProvider
  // > | null>(null);

  // load the registered nextauth providers, in our case is the credential provider
  // useEffect(() => {
  //   (async () => {
  //     const res = await getProviders();
  //     setProviders(res);
  //   })();
  // }, []);

  return (
    <nav className="w-full py-5 px-8 bg-primary-dark">
      <div className="sm:flex hidden justify-end">
        {session?.user ? (
          <div className="flex gap-6">
            <Link href="/task-dayview" className={styles['nav-btn']}>
              <span className={styles['link-underline']}>Day View</span>
            </Link>
            {/* Add the link to the Monthly view page */}
            <Link href="/monthly-stats" className={styles['nav-btn']}>
              <span className={styles['link-underline']}>Monthly Summary</span>
            </Link>
            <Link href="/task-list" className={styles['nav-btn']}>
              <span className={styles['link-underline']}>All Task</span>
            </Link>
            <Link href="/test-connection" className={styles['nav-btn']}>
              <span className={styles['link-underline']}>Test Connection</span>
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className={styles['nav-btn']}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex gap-6">
            <Link href="/signIn">
              <button type="button" className={styles['nav-secondary-btn']}>
                <span>Sign in</span>
              </button>
            </Link>
            <Link href="/signup">
              <button type="button" className={styles['nav-btn']}>
                <span>Sign up</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
