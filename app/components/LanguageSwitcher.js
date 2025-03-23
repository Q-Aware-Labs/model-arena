'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState('en');

  useEffect(() => {
    // Extract current locale from pathname
    const locale = pathname.split('/')[1] || 'en';
    setCurrentLocale(locale);
  }, [pathname]);

  const handleLanguageChange = (e) => {
    const newLocale = e.target.value;
    const currentPath = pathname;
    const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={currentLocale}
        onChange={handleLanguageChange}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
} 