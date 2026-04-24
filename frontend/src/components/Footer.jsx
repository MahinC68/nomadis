import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-coral transition-colors">
            <span className="text-2xl">🌍</span>
            <span className="font-bold text-lg">Nomadis</span>
          </Link>
          <p className="text-sm text-center">
            Powered by FastAPI · scikit-learn · OpenAI · React
          </p>
          <p className="text-sm">© 2025 Nomadis. Travel smarter.</p>
        </div>
      </div>
    </footer>
  )
}
