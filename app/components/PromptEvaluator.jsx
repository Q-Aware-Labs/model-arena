import React, { useState, useEffect } from 'react';
import { XCircle, AlertCircle, CheckCircle, Star, RefreshCw, Loader2, Eye, EyeOff } from 'lucide-react';
import CustomRadarChart from './CustomRadarChart';
import { evaluateWithAI } from '../services/evaluationService';

// Componente principal
export default function ResponseEvaluator() {
  // Criterios de evaluación
  const [criteria, setCriteria] = useState([
    { id: 1, name: "Sesgo (Bias)", description: "Ausencia de tendencias ideológicas, culturales o de género", score: 5, icon: "⚖️", isNA: false },
    { id: 2, name: "Razonamiento causal", description: "Coherencia lógica en relaciones causa-efecto", score: 5, icon: "🧠", isNA: false },
    { id: 3, name: "Robustez a parafraseo", description: "Estabilidad ante cambios en la formulación", score: 5, icon: "🔄", isNA: false },
    { id: 4, name: "Capacidad de abstracción", description: "Generalización de conceptos a nuevos contextos", score: 5, icon: "🔍", isNA: false },
    { id: 5, name: "Hallucinations", description: "Ausencia de información fabricada", score: 5, icon: "🔮", isNA: false },
    { id: 6, name: "Manejo de ambigüedad", description: "Tratamiento de múltiples interpretaciones", score: 5, icon: "❓", isNA: false },
    { id: 7, name: "Límites de conocimiento", description: "Reconocimiento de lo que no sabe", score: 5, icon: "🛑", isNA: false },
    { id: 8, name: "Comprensión contextual", description: "Integración de elementos visuales y textuales", score: 5, icon: "👁️", isNA: false },
    { id: 9, name: "Consistencia interna", description: "Ausencia de contradicciones", score: 5, icon: "🧩", isNA: false },
    { id: 10, name: "Procesamiento de negaciones", description: "Manejo de afirmaciones negativas", score: 5, icon: "❌", isNA: false },
    { id: 11, name: "Detección de intenciones", description: "Identificación de lo que busca el usuario", score: 5, icon: "🎯", isNA: false },
    { id: 12, name: "Metacognición", description: "Reflexión sobre sus propias limitaciones", score: 5, icon: "💭", isNA: false }
  ]);

  // Estado para el modelo seleccionado y la respuesta a evaluar
  const [selectedModel, setSelectedModel] = useState("Claude");
  const [responseText, setResponseText] = useState("");
  const [promptText, setPromptText] = useState("");
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [evaluationMode, setEvaluationMode] = useState(false);
  
  // Estado para automatización con IA
  const [isAIEvaluation, setIsAIEvaluation] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    claude: { enabled: false, apiKey: "", url: "https://api.anthropic.com/v1/messages" },
    chatgpt: { enabled: false, apiKey: "", url: "https://api.openai.com/v1/chat/completions" },
    gemini: { enabled: false, apiKey: "", url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent" },
    llama: { enabled: false, apiKey: "", url: "https://api.example.com/llama" },
    deepseek: { enabled: false, apiKey: "", url: "https://api.deepseek.com" }
  });

  const [apiKeyVisibility, setApiKeyVisibility] = useState({});

  // Actualizar puntuación total cuando cambian los criterios
  useEffect(() => {
    // Filtrar criterios que no son N/A
    const applicableCriteria = criteria.filter(criterion => !criterion.isNA);
    
    if (applicableCriteria.length === 0) {
      setTotalScore(0);
      return;
    }

    const sum = applicableCriteria.reduce((acc, criterion) => acc + criterion.score, 0);
    setTotalScore((sum / (applicableCriteria.length * 10) * 100).toFixed(1));
  }, [criteria]);

  // Función para actualizar la puntuación de un criterio
  const handleScoreChange = (id, newScore) => {
    setCriteria(criteria.map(criterion => 
      criterion.id === id ? { ...criterion, score: parseInt(newScore) } : criterion
    ));
  };

  // Función para alternar el estado N/A de un criterio
  const handleNAChange = (id) => {
    setCriteria(criteria.map(criterion => 
      criterion.id === id ? { ...criterion, isNA: !criterion.isNA } : criterion
    ));
  };

  // Función para cambiar configuración de API
  const handleApiConfigChange = (model, field, value) => {
    setApiConfig({
      ...apiConfig,
      [model]: {
        ...apiConfig[model],
        [field]: value
      }
    });
  };

  // Función para evaluar con IA
  const handleAIEvaluation = async () => {
    if (!responseText.trim()) {
      alert("Por favor, ingresa una respuesta para evaluar");
      return;
    }

    if (!promptText.trim()) {
      alert("Por favor, ingresa el prompt utilizado");
      return;
    }

    // Verificar si al menos hay un modelo habilitado con API key
    const enabledModels = Object.values(apiConfig).filter(config => 
      config.enabled && config.apiKey.trim() !== ""
    );
    
    if (enabledModels.length === 0) {
      alert("Por favor, habilita al menos un modelo de IA y proporciona una API key válida");
      return;
    }

    setIsEvaluating(true);
    
    try {
      const result = await evaluateWithAI(apiConfig, promptText, responseText);
      
      // Actualizar puntuaciones en la UI
      setCriteria(criteria.map(criterion => {
        const criterionKey = criterion.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        return {
          ...criterion,
          score: result.averageScores[criterionKey] || criterion.score
        };
      }));

      // Mostrar errores si los hay
      if (result.errors.length > 0) {
        const errorMessage = result.errors.map(e => `${e.model}: ${e.error}`).join('\n');
        alert(`Algunas evaluaciones fallaron:\n${errorMessage}`);
      }
      
    } catch (error) {
      console.error("Error al realizar evaluación con IA:", error);
      alert("Ha ocurrido un error al evaluar con IA. Por favor, verifica tu conexión e intenta nuevamente.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Preparar datos para el gráfico de radar
  const radarData = criteria.map(criterion => ({
    subject: criterion.name,
    A: criterion.score,
    fullMark: 10,
  }));

  // Función para obtener color según puntuación
  const getScoreColor = (score) => {
    if (score <= 3) return "text-red-500";
    if (score <= 6) return "text-amber-500";
    if (score <= 8) return "text-blue-500";
    return "text-green-500";
  };

  // Función para obtener icono según puntuación
  const getScoreIcon = (score) => {
    if (score <= 3) return <XCircle className="w-5 h-5" />;
    if (score <= 6) return <AlertCircle className="w-5 h-5" />;
    if (score <= 8) return <CheckCircle className="w-5 h-5" />;
    return <Star className="w-5 h-5" />;
  };

  // Función para agregar un nuevo modelo
  const handleAddModel = () => {
    // Guardar evaluación actual
    if (evaluationMode) {
      console.log("Modelo:", selectedModel);
      console.log("Puntuaciones:", criteria);
      console.log("Puntuación total:", totalScore);
      
      // Aquí se podría implementar almacenamiento o exportación
      alert(`Evaluación de ${selectedModel} guardada (${totalScore}%)`);
      
      // Reiniciar para nueva evaluación
      setCriteria(criteria.map(criterion => ({ ...criterion, score: 5 })));
      setResponseText("");
      setEvaluationMode(false);
    } else {
      setEvaluationMode(true);
    }
  };

  // Verificar si algún modelo está habilitado para evaluación y tiene API key
  const hasEnabledModels = Object.values(apiConfig).some(config => 
    config.enabled && config.apiKey.trim() !== ""
  );

  // Add this new function to toggle visibility
  const toggleApiKeyVisibility = (model) => {
    setApiKeyVisibility(prev => ({
      ...prev,
      [model]: !prev[model]
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Encabezado */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">ModelArena</h1>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <select 
                className="w-full sm:w-auto bg-white text-gray-800 rounded px-3 py-1 font-medium"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="Claude">Claude</option>
                <option value="ChatGPT">ChatGPT</option>
                <option value="Gemini">Gemini</option>
                <option value="LLaMA">LLaMA</option>
                <option value="DeepSeek">DeepSeek</option>
                <option value="Otro">Otro</option>
              </select>
              <button 
                onClick={handleAddModel}
                className="w-full sm:w-auto bg-white text-indigo-600 px-4 py-1 rounded font-medium hover:bg-indigo-100 transition-colors"
              >
                {evaluationMode ? "Guardar Evaluación" : "Nueva Evaluación"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-grow flex flex-col gap-6">
        {/* Toggle para modo de evaluación */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Modo de evaluación</h2>
              <p className="text-sm text-gray-500">Elige cómo quieres evaluar las respuestas</p>
            </div>
            <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end">
              <span className={`mr-2 ${!isAIEvaluation ? 'font-semibold text-indigo-600' : 'text-gray-500'}`}>Manual</span>
              <div 
                className={`relative w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${isAIEvaluation ? 'bg-indigo-600' : 'bg-gray-300'}`}
                onClick={() => setIsAIEvaluation(!isAIEvaluation)}
              >
                <div 
                  className={`absolute top-1 left-1 w-4 h-4 transition-transform duration-200 ease-in-out bg-white rounded-full transform ${isAIEvaluation ? 'translate-x-6' : ''}`}
                ></div>
              </div>
              <span className={`ml-2 ${isAIEvaluation ? 'font-semibold text-indigo-600' : 'text-gray-500'}`}>Con IA</span>
            </div>
          </div>
        </div>

        {/* Configuración de APIs (solo visible en modo IA) */}
        {isAIEvaluation && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Configuración de APIs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(apiConfig).map(([model, config]) => (
                <div key={model} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={`${model}-enabled`} className="font-medium capitalize">
                      {model}
                    </label>
                    <div className="flex items-center">
                      <input
                        id={`${model}-enabled`}
                        type="checkbox"
                        checked={config.enabled}
                        onChange={e => handleApiConfigChange(model, "enabled", e.target.checked)}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-500">Habilitar</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label htmlFor={`${model}-api-key`} className="block text-sm text-gray-500">API Key</label>
                      <div className="relative">
                        <input
                          id={`${model}-api-key`}
                          type={apiKeyVisibility[model] ? "text" : "password"}
                          value={config.apiKey}
                          onChange={e => handleApiConfigChange(model, "apiKey", e.target.value)}
                          placeholder="Ingresa tu API key"
                          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 pr-10"
                          disabled={!config.enabled}
                        />
                        <button
                          type="button"
                          onClick={() => toggleApiKeyVisibility(model)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                          disabled={!config.enabled}
                        >
                          {apiKeyVisibility[model] ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAIEvaluation}
                disabled={isEvaluating || !hasEnabledModels}
                className={`flex items-center px-4 py-2 rounded font-medium ${
                  isEvaluating || !hasEnabledModels
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Evaluando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Evaluar con IA
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sección izquierda - Texto y gráfico */}
          <div className="lg:w-1/2 flex flex-col space-y-6">
            {/* Panel de prompt */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-700">Prompt utilizado</h2>
                <button
                  onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                >
                  {isPromptExpanded ? (
                    <>
                      Mostrar menos
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Leer más
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              <div className={`transition-all duration-300 ease-in-out ${isPromptExpanded ? 'max-h-96' : 'max-h-24'}`}>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Ingresa el prompt que utilizaste para obtener la respuesta..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  style={{ height: isPromptExpanded ? '200px' : '80px' }}
                ></textarea>
              </div>
            </div>

            {/* Panel de texto de respuesta */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-700">Respuesta a evaluar</h2>
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">
                  Modelo: {selectedModel}
                </span>
              </div>
              <textarea 
                className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Pega aquí la respuesta del LLM que quieres evaluar..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
              ></textarea>
            </div>

            {/* Gráfico de radar */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Resultado de la evaluación</h2>
              <div className="flex items-center justify-center py-2">
                <div className="text-5xl font-bold mr-2" style={{color: `hsl(${totalScore * 1.2}, 80%, 45%)`}}>
                  {totalScore}%
                </div>
                <div className="text-gray-500 text-sm">
                  Puntuación<br/>global
                </div>
              </div>
              
              <div className="w-full h-72 flex justify-center">
                <CustomRadarChart data={radarData} />
              </div>
            </div>
          </div>

          {/* Sección derecha - Criterios de evaluación */}
          <div className="lg:w-1/2 bg-white p-4 rounded-lg shadow-md overflow-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Criterios de evaluación</h2>
            
            {isEvaluating && (
              <div className="bg-indigo-50 p-3 rounded-lg mb-4 flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 text-indigo-600 animate-spin" />
                <span className="text-indigo-600 font-medium">Solicitando evaluaciones a los modelos seleccionados...</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">{criterion.icon}</span>
                    <h3 className="font-medium text-gray-800">{criterion.name}</h3>
                    <div className="ml-auto flex items-center">
                      {!criterion.isNA && (
                        <span className={`font-bold mr-2 ${getScoreColor(criterion.score)}`}>
                          {criterion.score}
                        </span>
                      )}
                      {!criterion.isNA && (
                        <span className={getScoreColor(criterion.score)}>
                          {getScoreIcon(criterion.score)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">{criterion.description}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={criterion.score}
                        onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 ${
                          criterion.isNA || isAIEvaluation || isEvaluating ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                        disabled={criterion.isNA || isAIEvaluation || isEvaluating}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`na-${criterion.id}`}
                        checked={criterion.isNA}
                        onChange={() => handleNAChange(criterion.id)}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        disabled={isAIEvaluation || isEvaluating}
                      />
                      <label htmlFor={`na-${criterion.id}`} className="ml-2 text-sm text-gray-500">
                        N/A
                      </label>
                    </div>
                  </div>
                  
                  {!criterion.isNA && (
                    <div className="flex text-xs text-gray-400 justify-between mt-1">
                      <span>Deficiente</span>
                      <span>Aceptable</span>
                      <span>Bueno</span>
                      <span>Excelente</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        Herramienta de evaluación para respuestas de modelos de IA • 2025
      </footer>
    </div>
  );
}