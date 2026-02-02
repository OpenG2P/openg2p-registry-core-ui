'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
// we will redesign this page once desing is ready for error page
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('common')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#F3F1E4] px-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">
        {t('something_went_wrong')}
      </h2>

      <button
        onClick={() => reset()}
        className="rounded bg-blue-600 px-6 py-2 font-medium text-white shadow-sm transition hover:bg-blue-700"
      >
        {t('retry')}
      </button>
    </div>
  )
}
