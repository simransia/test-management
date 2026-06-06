import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center">
      <div className="mx-auto w-full max-w-3xl px-4 text-center">
        <div className="animate-fade-in">
          <p className="text-8xl font-extrabold text-primary-200">404</p>
          <h1 className="mt-4 text-3xl font-bold text-neutral-900">
            Page not found
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <div className="mt-8">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-base font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

