const GEMINI_API_KEY = 'PASTE_YOUR_GEMINI_API_KEY_HERE';
const MODEL = 'gemini-2.5-flash';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Google Script');
}

function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    tools: [{ google_search: {} }]  // ← added by claude
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-goog-api-key': GEMINI_API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  const text = response.getContentText();
  const data = JSON.parse(text);

  if (code !== 200) {
    throw new Error(data.error?.message || 'Chat request failed');
  }

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    'No response returned.'
  );
}
