// Simple test app to verify basic functionality
import { Logo } from './components/Logo';

export default function TestApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <Logo className="w-32 h-32 mx-auto" />
        <h1 className="text-4xl font-bold">CAN|EDU Games</h1>
        <p className="text-xl text-gray-700">✅ Basic app is working!</p>
        <p className="text-sm text-gray-600">If you see this, the core setup is correct.</p>
      </div>
    </div>
  );
}
