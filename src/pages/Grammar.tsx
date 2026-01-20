import { useStore } from '../store/useStore';

export default function Grammar() {
  const { user } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Grammar Lessons</h1>
        <p className="text-gray-600">Understand Japanese grammar patterns</p>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Grammar Lessons Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            Comprehensive grammar explanations and exercises for {user?.currentLevel}
          </p>
          <div className="text-sm text-gray-500">
            This feature is under development
          </div>
        </div>
      </div>
    </div>
  );
}
