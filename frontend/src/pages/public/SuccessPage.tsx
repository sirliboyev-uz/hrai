import { useParams } from 'react-router-dom';
import { CheckCircle, Bot } from 'lucide-react';

function SuccessPage() {
  const { publicLink } = useParams<{ publicLink: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">HR AI</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Application Submitted!
        </h1>

        <p className="text-lg text-gray-600 mb-2">
          Thank you for applying.
        </p>

        <p className="text-gray-600">
          We will review your application and get back to you soon.
        </p>
      </main>
    </div>
  );
}

export default SuccessPage;
