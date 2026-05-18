const axios = require('axios');

exports.getRecommendations = async (req, res, next) => {
  try {
    const { employees } = req.body;
    if (!employees || !Array.isArray(employees)) {
      return res.status(400).json({ message: 'Employees data required in array format' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      // Mock data fallback if no API key is provided
      const mockRecommendations = employees.map(emp => ({
        employeeId: emp._id,
        name: emp.name,
        promotionSuggestion: emp.performanceScore >= 85 ? "Highly Recommended for Promotion" : (emp.performanceScore >= 70 ? "Consider for Future Promotion" : "Not Ready"),
        trainingSuggestions: emp.skills.length < 3 ? ["Core Skill Enhancement", "Bootcamp Training"] : ["Leadership & Management", "Advanced Tech Skills"],
        feedback: emp.performanceScore < 60 ? "Needs improvement in daily tasks and skill acquisition." : "Performing well and meeting expectations.",
        score: emp.performanceScore
      })).sort((a, b) => b.score - a.score);
      
      return res.json({ recommendations: mockRecommendations, isMock: true });
    }

    // Call OpenRouter
    const prompt = `You are an HR AI Assistant. I will provide you a list of employees. For each employee, analyze their performanceScore, skills, and experience.
    Return a JSON object containing an array called "recommendations".
    Each recommendation should have the properties:
    "employeeId" (must match the provided id), "name", "promotionSuggestion" (string), "trainingSuggestions" (array of strings), "feedback" (string), "score".
    Sort the recommendations by score descending (highest to lowest).
    Here is the data: ${JSON.stringify(employees)}`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo', // Or any free model from OpenRouter like 'meta-llama/llama-3-8b-instruct:free'
      messages: [{ role: 'user', content: prompt }],
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'MERN AI App'
      }
    });

    const aiContent = response.data.choices[0].message.content;
    let parsedData;
    try {
        // Try parsing assuming the model followed the JSON instruction
        parsedData = JSON.parse(aiContent.match(/\{[\s\S]*\}/)[0] || aiContent);
    } catch(e) {
        return res.status(500).json({ message: 'Failed to parse AI response' });
    }

    res.json(parsedData);
  } catch (error) {
    console.error('AI API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to fetch AI recommendations' });
  }
};
