import React, { useState, useCallback, useEffect } from 'react';
import { Scale, Heart, Info, Activity, Moon, Sun, History, ChevronRight, X } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiHistory, setBmiHistory] = useState<Array<{
    bmi: number;
    date: string;
    weight: number;
    height: number;
  }>>(() => {
    const saved = localStorage.getItem('bmiHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTip, setSelectedTip] = useState(0);

  const healthTips = [
    "Regular exercise can help maintain a healthy BMI",
    "Stay hydrated! Drink at least 8 glasses of water daily",
    "Get 7-9 hours of sleep for optimal health",
    "Eat a balanced diet rich in fruits and vegetables",
    "Take regular breaks from sitting to stay active"
  ];

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('bmiHistory', JSON.stringify(bmiHistory));
  }, [bmiHistory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedTip(prev => (prev + 1) % healthTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculateBMI = useCallback(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      const roundedBmi = parseFloat(bmiValue.toFixed(1));
      setBmi(roundedBmi);
      
      // Add to history
      setBmiHistory(prev => [
        {
          bmi: roundedBmi,
          date: new Date().toLocaleDateString(),
          weight: weightInKg,
          height: parseFloat(height)
        },
        ...prev.slice(0, 9) // Keep only last 10 entries
      ]);
    }
  }, [height, weight]);

  const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500 dark:text-blue-400' };
    if (bmi < 24.9) return { category: 'Normal weight', color: 'text-green-500 dark:text-green-400' };
    if (bmi < 29.9) return { category: 'Overweight', color: 'text-yellow-500 dark:text-yellow-400' };
    return { category: 'Obese', color: 'text-red-500 dark:text-red-400' };
  };

  const getHealthRisk = (bmi: number): string => {
    if (bmi < 18.5) return 'Increased risk for various health issues including nutritional deficiencies';
    if (bmi < 24.9) return 'Lowest risk for health problems';
    if (bmi < 29.9) return 'Increased risk for heart disease, high blood pressure, and diabetes';
    return 'High risk for heart disease, diabetes, and many other health issues';
  };

  const bmiExamples = [
    { height: 170, weight: 70, description: 'Average adult male' },
    { height: 165, weight: 60, description: 'Average adult female' },
    { height: 180, weight: 75, description: 'Athletic build' },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300
      ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Navbar */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Activity className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Amar Health
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-600'} 
                  hover:bg-opacity-80 transition-colors duration-200`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="hidden sm:flex space-x-4">
                <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} 
                  px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}>Home</a>
                <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} 
                  px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}>About</a>
                <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} 
                  px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}>Contact</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Health Tip Banner */}
          <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} 
            transition-colors duration-300`}>
            <div className="flex items-center space-x-3">
              <Info className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <p className="text-sm sm:text-base animate-fade-in">
                {healthTips[selectedTip]}
              </p>
            </div>
          </div>

          {/* Calculator Card */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 sm:p-8 mb-8 
            transform hover:scale-[1.02] transition-all duration-300`}>
            <div className="flex items-center justify-center mb-6">
              <Scale className={`w-10 h-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-3`} />
              <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                BMI Calculator
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg transition-colors duration-200
                      ${darkMode ? 
                        'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500' : 
                        'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="Enter height in centimeters"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg transition-colors duration-200
                      ${darkMode ? 
                        'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500' : 
                        'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="Enter weight in kilograms"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={calculateBMI}
                    className={`flex-1 ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} 
                      text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center group`}
                  >
                    <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    Calculate BMI
                  </button>
                  <button
                    onClick={() => setShowHistory(true)}
                    className={`p-3 rounded-lg transition duration-200
                      ${darkMode ? 
                        'bg-gray-700 hover:bg-gray-600 text-gray-300' : 
                        'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                  >
                    <History className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center">
                {bmi ? (
                  <div className={`w-full p-6 rounded-xl
                    ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="text-center mb-4">
                      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Your BMI</h2>
                      <p className={`text-4xl font-bold mt-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {bmi}
                      </p>
                      <p className={`text-lg font-semibold mt-2 ${getBMICategory(bmi).color}`}>
                        {getBMICategory(bmi).category}
                      </p>
                    </div>
                    
                    <div className={`flex items-start mt-4 p-4 rounded-lg
                      ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <Info className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mt-1 mr-2 flex-shrink-0`} />
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {getHealthRisk(bmi)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Enter your height and weight to calculate BMI</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Examples Card */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 sm:p-8`}>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
              Adult BMI Examples
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {bmiExamples.map((example, index) => {
                const heightInMeters = example.height / 100;
                const bmi = parseFloat((example.weight / (heightInMeters * heightInMeters)).toFixed(1));
                const category = getBMICategory(bmi);
                
                return (
                  <div key={index} className={`p-4 rounded-xl transition-colors duration-200
                    ${darkMode ? 
                      'bg-gray-700 hover:bg-gray-600' : 
                      'border border-gray-200 hover:border-indigo-200'}`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                      {example.description}
                    </h3>
                    <div className={`space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <p>Height: {example.height} cm</p>
                      <p>Weight: {example.weight} kg</p>
                      <p>BMI: <span className={`font-semibold ${category.color}`}>{bmi}</span></p>
                    </div>
                    <div className={`mt-2 text-sm font-medium ${category.color}`}>
                      {category.category}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-lg rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>BMI History</h3>
              <button
                onClick={() => setShowHistory(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {bmiHistory.length === 0 ? (
                <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No BMI calculations yet
                </p>
              ) : (
                bmiHistory.map((entry, index) => (
                  <div key={index} className={`p-4 rounded-lg
                    ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          BMI: <span className={getBMICategory(entry.bmi).color}>{entry.bmi}</span>
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Height: {entry.height}cm, Weight: {entry.weight}kg
                        </p>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {entry.date}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mt-12 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Activity className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span className={`ml-2 text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Amar Health
              </span>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              © {new Date().getFullYear()} Amar Health. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-indigo-600'} 
                transition-colors duration-200`}>Privacy Policy</a>
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-indigo-600'} 
                transition-colors duration-200`}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;