import React, { useEffect, useState } from 'react';

const MealsScreenPreview = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => setProgress(64), 100);
  }, []);

  const CircularProgress = ({ calories = 544, maxCalories = 1500 }) => {
    const progressPercent = (calories / maxCalories) * 100;
    const radius = 66;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progressPercent / 100) * circumference;

    return (
      <div className="relative w-[148px] h-[148px]">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="74"
            cy="74"
            r={radius}
            stroke="#DEF7EC"
            strokeWidth="16"
            fill="none"
          />
          <circle
            cx="74"
            cy="74"
            r={radius}
            stroke="#10B981"
            strokeWidth="16"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1500 ease-out"
            style={{
              strokeDashoffset: progress === 0 ? circumference : offset
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[28px] font-bold text-[#56B683]">{calories}</div>
          <div className="text-[14px] text-[#56B683]">kcal left</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#FAF9F6] min-h-screen">
      {/* Header */}
      <div className="px-6 pt-12 pb-5">
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-5 shadow-sm">
          <span className="text-xl">←</span>
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Meals</h1>
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <button className="text-gray-600">‹</button>
            <span className="text-base">Yesterday</span>
            <button className="text-gray-600">›</button>
          </div>
        </div>
      </div>

      {/* Calories Today Card */}
      <div className="mx-6 mb-4 bg-white rounded-3xl p-5 shadow-sm">
        <h2 className="text-lg text-gray-400 mb-5">Calories today</h2>

        <div className="flex items-center justify-between mb-4">
          <CircularProgress calories={544} maxCalories={1500} />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-[#DEF7EC] rounded-xl px-3 py-2.5 min-w-[120px]">
              <span className="text-xl">🏌️</span>
              <div>
                <div className="text-lg font-bold text-[#10B981]">1500</div>
                <div className="text-xs text-gray-600">Base goal</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#DEF7EC] rounded-xl px-3 py-2.5 min-w-[120px]">
              <span className="text-xl">🥑</span>
              <div>
                <div className="text-lg font-bold text-[#10B981]">1136</div>
                <div className="text-xs text-gray-600">Food</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#DBEAFE] rounded-xl px-3 py-2.5 min-w-[120px]">
              <span className="text-xl">🏄</span>
              <div>
                <div className="text-lg font-bold text-[#3B82F6]">+355</div>
                <div className="text-xs text-gray-600">Movement</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400">
          1500 - 1136 +180 = 550
        </div>
      </div>

      {/* What Did You Eat Card */}
      <div className="mx-6 mb-4 bg-white rounded-3xl p-5 shadow-sm">
        <h2 className="text-lg text-gray-400 mb-5">What did you eat</h2>

        {[
          { name: 'French toast', cal: 250 },
          { name: 'Greek yogurt with apple', cal: 350 },
          { name: 'Breaded chicken, salad, potato', cal: 580 },
          { name: 'Coffee and milk', cal: 80 }
        ].map((meal, i) => (
          <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
            <span className="text-base text-black">{meal.name}</span>
            <span className="text-base font-semibold text-[#10B981]">{meal.cal}kcal</span>
          </div>
        ))}

        <button className="w-full text-center py-4 text-sm text-gray-400">
          + 8 meals
        </button>
      </div>

      {/* Macros Today Card */}
      <div className="mx-6 mb-10 bg-white rounded-3xl p-5 shadow-sm">
        <h2 className="text-lg text-gray-400 mb-5">Macros today</h2>

        {[
          { icon: '🥩', name: 'Name', value: '79.8g' },
          { icon: '🍞', name: 'Carbs', value: '79.8g' },
          { icon: '🥑', name: 'Fats', value: '79.8g' },
          { icon: '🥬', name: 'Fiber', value: '79.8g' }
        ].map((macro, i) => (
          <div key={i} className="flex items-center mb-4">
            <span className="text-xl mr-2">{macro.icon}</span>
            <span className="text-base text-black w-20">{macro.name}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded mx-3">
              <div className="w-3/4 h-full bg-[#DEF7EC] rounded"></div>
            </div>
            <span className="text-base font-semibold text-[#10B981] w-12 text-right">
              {macro.value}
            </span>
          </div>
        ))}

        <button className="w-full text-center py-2 text-sm text-gray-400">
          + 15 Micronutrients
        </button>
      </div>
    </div>
  );
};

export default MealsScreenPreview;
