import { useStore } from '../store/useStore';
import { JLPT_LEVELS, JLPT_LEVEL_INFO } from '../utils/jlptHelpers';
import { JLPT_REQUIREMENTS, getSectionName, getSectionMaxScore } from '../utils/jlptScoring';

export default function Progress() {
  const { user, progress } = useStore();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Progress</h1>
        <p className="text-gray-600">Track your journey from N5 to N1</p>
      </div>

      {/* Visual Journey Map */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Journey Map</h2>

        <div className="space-y-6">
          {JLPT_LEVELS.map((level) => {
            const levelProgress = progress.find((p) => p.level === level);
            const info = JLPT_LEVEL_INFO[level];
            const isCurrentLevel = user.currentLevel === level;
            const isPastLevel = JLPT_LEVELS.indexOf(level) < JLPT_LEVELS.indexOf(user.currentLevel);

            return (
              <div
                key={level}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isCurrentLevel
                    ? `border-${info.color} bg-${info.color} bg-opacity-5`
                    : isPastLevel
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className={`badge-${level.toLowerCase()} text-lg px-4 py-2`}>
                      {level}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{info.name}</h3>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                  </div>
                  {isCurrentLevel && (
                    <span className="px-3 py-1 bg-n4 text-white rounded-full text-sm font-semibold">
                      Current Level
                    </span>
                  )}
                </div>

                {/* Skill Bars */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Vocabulary</span>
                      <span className="text-sm font-bold text-n5">
                        {levelProgress?.skills.vocabulary || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-n5 h-2 rounded-full transition-all"
                        style={{ width: `${levelProgress?.skills.vocabulary || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Kanji</span>
                      <span className="text-sm font-bold text-n4">
                        {levelProgress?.skills.kanji || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-n4 h-2 rounded-full transition-all"
                        style={{ width: `${levelProgress?.skills.kanji || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Grammar</span>
                      <span className="text-sm font-bold text-n3">
                        {levelProgress?.skills.grammar || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-n3 h-2 rounded-full transition-all"
                        style={{ width: `${levelProgress?.skills.grammar || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Reading</span>
                      <span className="text-sm font-bold text-n2">
                        {levelProgress?.skills.reading || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-n2 h-2 rounded-full transition-all"
                        style={{ width: `${levelProgress?.skills.reading || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* JLPT Score Estimation */}
                {levelProgress?.estimatedJLPTScore && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-gray-700">Estimated JLPT Score</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        levelProgress.estimatedJLPTScore.passed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {levelProgress.estimatedJLPTScore.passed ? '✓ PASS' : 'BELOW PASS'}
                      </span>
                    </div>

                    {/* Total Score */}
                    <div className="bg-gradient-to-r from-n4-light to-n4 text-white rounded-lg p-4 mb-3">
                      <div className="text-center">
                        <div className="text-sm opacity-90 mb-1">Total Score</div>
                        <div className="text-4xl font-bold">
                          {levelProgress.estimatedJLPTScore.total}
                          <span className="text-xl opacity-80">/180</span>
                        </div>
                        <div className="text-sm opacity-90 mt-1">
                          Pass mark: {JLPT_REQUIREMENTS[level].totalPassMark}/180
                        </div>
                      </div>
                    </div>

                    {/* Section Scores */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {/* Language Knowledge */}
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-600 mb-1">
                          {getSectionName('languageKnowledge', level)}
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                          {levelProgress.estimatedJLPTScore.languageKnowledge}
                          <span className="text-sm text-gray-600">
                            /{getSectionMaxScore('languageKnowledge', level)}
                          </span>
                        </div>
                      </div>

                      {/* Reading (N1-N3 only) */}
                      {JLPT_REQUIREMENTS[level].hasSeparateReading && (
                        <div className="bg-gray-50 rounded p-3">
                          <div className="text-xs text-gray-600 mb-1">Reading</div>
                          <div className="text-2xl font-bold text-gray-800">
                            {levelProgress.estimatedJLPTScore.reading}
                            <span className="text-sm text-gray-600">/60</span>
                          </div>
                        </div>
                      )}

                      {/* Listening */}
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-600 mb-1">Listening</div>
                        <div className="text-2xl font-bold text-gray-800">
                          {levelProgress.estimatedJLPTScore.listening}
                          <span className="text-sm text-gray-600">/60</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          No lessons yet
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {levelProgress?.vocabularyMastered || 0}
                    </div>
                    <div className="text-xs text-gray-600">of {info.vocabulary} vocab</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {levelProgress?.kanjiMastered || 0}
                    </div>
                    <div className="text-xs text-gray-600">of {info.kanji} kanji</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {levelProgress?.grammarPatternsMastered || 0}
                    </div>
                    <div className="text-xs text-gray-600">grammar patterns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {levelProgress?.articlesRead || 0}
                    </div>
                    <div className="text-xs text-gray-600">articles read</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-3xl font-bold text-n4 mb-1">
            {progress.reduce((sum, p) => sum + p.vocabularyMastered, 0)}
          </div>
          <div className="text-gray-600">Total Vocabulary Mastered</div>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-2">📚</div>
          <div className="text-3xl font-bold text-n3 mb-1">
            {progress.reduce((sum, p) => sum + p.articlesRead, 0)}
          </div>
          <div className="text-gray-600">Total Articles Read</div>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-2">⏱️</div>
          <div className="text-3xl font-bold text-n2 mb-1">
            {Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-gray-600">Days Learning</div>
        </div>
      </div>
    </div>
  );
}
