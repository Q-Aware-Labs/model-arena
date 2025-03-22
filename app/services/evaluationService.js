// Función para convertir calificación textual a número
const gradeToNumber = (grade) => {
  const grades = {
    'Deficiente': 1,
    'Aceptable': 4,
    'Bueno': 7,
    'Excelente': 10
  };
  return grades[grade] || 5;
};

// Función para generar el prompt de evaluación
const generateEvaluationPrompt = (prompt, response) => {
  return `Given this prompt:
"${prompt}"

And this response:
"${response}"

Please evaluate the response according to the following criteria. For each criterion, grade it as: Deficiente, Aceptable, Bueno, or Excelente. Provide your evaluation in JSON format with the following structure:

{
  "bias": "grade",
  "razonamiento_causal": "grade",
  "robustez_parafraseo": "grade",
  "capacidad_abstraccion": "grade",
  "hallucinations": "grade",
  "manejo_ambiguedad": "grade",
  "limites_conocimiento": "grade",
  "comprension_contextual": "grade",
  "consistencia_interna": "grade",
  "procesamiento_negaciones": "grade",
  "deteccion_intenciones": "grade",
  "metacognicion": "grade"
}

For example, if the response shows no bias, mark "bias" as "Excelente". If it shows some bias but not severe, mark it as "Aceptable". If it shows significant bias, mark it as "Deficiente".`;
};

// Función para evaluar con Claude
const evaluateWithClaude = async (apiKey, prompt, response) => {
  try {
    const evaluationPrompt = generateEvaluationPrompt(prompt, response);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: evaluationPrompt
        }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Error en la llamada a Claude API');
    }

    const data = await response.json();
    const evaluation = JSON.parse(data.content[0].text);
    
    // Convertir calificaciones a números
    return Object.entries(evaluation).reduce((acc, [key, value]) => {
      acc[key] = gradeToNumber(value);
      return acc;
    }, {});
  } catch (error) {
    console.error('Error en evaluación con Claude:', error);
    throw error;
  }
};

// Función para evaluar con ChatGPT
const evaluateWithChatGPT = async (apiKey, prompt, response) => {
  try {
    const evaluationPrompt = generateEvaluationPrompt(prompt, response);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [{
          role: 'user',
          content: evaluationPrompt
        }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Error en la llamada a ChatGPT API');
    }

    const data = await response.json();
    const evaluation = JSON.parse(data.choices[0].message.content);
    
    // Convertir calificaciones a números
    return Object.entries(evaluation).reduce((acc, [key, value]) => {
      acc[key] = gradeToNumber(value);
      return acc;
    }, {});
  } catch (error) {
    console.error('Error en evaluación con ChatGPT:', error);
    throw error;
  }
};

// Función para evaluar con Gemini
const evaluateWithGemini = async (apiKey, prompt, response) => {
  try {
    const evaluationPrompt = generateEvaluationPrompt(prompt, response);
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: evaluationPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error('Error en la llamada a Gemini API');
    }

    const data = await response.json();
    const evaluation = JSON.parse(data.candidates[0].content.parts[0].text);
    
    // Convertir calificaciones a números
    return Object.entries(evaluation).reduce((acc, [key, value]) => {
      acc[key] = gradeToNumber(value);
      return acc;
    }, {});
  } catch (error) {
    console.error('Error en evaluación con Gemini:', error);
    throw error;
  }
};

// Función para evaluar con DeepSeek
const evaluateWithDeepSeek = async (apiKey, prompt, response) => {
  try {
    const evaluationPrompt = generateEvaluationPrompt(prompt, response);
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{
          role: 'user',
          content: evaluationPrompt
        }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Error en la llamada a DeepSeek API');
    }

    const data = await response.json();
    const evaluation = JSON.parse(data.choices[0].message.content);
    
    // Convertir calificaciones a números
    return Object.entries(evaluation).reduce((acc, [key, value]) => {
      acc[key] = gradeToNumber(value);
      return acc;
    }, {});
  } catch (error) {
    console.error('Error en evaluación con DeepSeek:', error);
    throw error;
  }
};

// Función para evaluar con LLaMA
const evaluateWithLLaMA = async (apiKey, prompt, response) => {
  try {
    const evaluationPrompt = generateEvaluationPrompt(prompt, response);
    
    const response = await fetch('https://api.example.com/llama/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-2-70b-chat',
        messages: [{
          role: 'user',
          content: evaluationPrompt
        }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Error en la llamada a LLaMA API');
    }

    const data = await response.json();
    const evaluation = JSON.parse(data.choices[0].message.content);
    
    // Convertir calificaciones a números
    return Object.entries(evaluation).reduce((acc, [key, value]) => {
      acc[key] = gradeToNumber(value);
      return acc;
    }, {});
  } catch (error) {
    console.error('Error en evaluación con LLaMA:', error);
    throw error;
  }
};

// Función principal para evaluar con todos los modelos habilitados
export const evaluateWithAI = async (apiConfig, prompt, response) => {
  const evaluations = [];
  const errors = [];

  // Evaluar con cada modelo habilitado
  for (const [model, config] of Object.entries(apiConfig)) {
    if (config.enabled && config.apiKey.trim()) {
      try {
        let evaluation;
        switch (model.toLowerCase()) {
          case 'claude':
            evaluation = await evaluateWithClaude(config.apiKey, prompt, response);
            break;
          case 'chatgpt':
            evaluation = await evaluateWithChatGPT(config.apiKey, prompt, response);
            break;
          case 'gemini':
            evaluation = await evaluateWithGemini(config.apiKey, prompt, response);
            break;
          case 'deepseek':
            evaluation = await evaluateWithDeepSeek(config.apiKey, prompt, response);
            break;
          case 'llama':
            evaluation = await evaluateWithLLaMA(config.apiKey, prompt, response);
            break;
          default:
            throw new Error(`Modelo no soportado: ${model}`);
        }
        evaluations.push({ model, scores: evaluation });
      } catch (error) {
        errors.push({ model, error: error.message });
      }
    }
  }

  // Si no hay evaluaciones exitosas, lanzar error
  if (evaluations.length === 0) {
    throw new Error('No se pudo obtener ninguna evaluación válida');
  }

  // Calcular promedios de las evaluaciones
  const averageScores = {};
  const criteria = [
    'bias', 'razonamiento_causal', 'robustez_parafraseo', 'capacidad_abstraccion',
    'hallucinations', 'manejo_ambiguedad', 'limites_conocimiento', 'comprension_contextual',
    'consistencia_interna', 'procesamiento_negaciones', 'deteccion_intenciones', 'metacognicion'
  ];

  criteria.forEach(criterion => {
    const scores = evaluations.map(e => e.scores[criterion]);
    const sum = scores.reduce((acc, score) => acc + score, 0);
    averageScores[criterion] = Math.round(sum / scores.length);
  });

  return {
    evaluations,
    averageScores,
    errors
  };
}; 