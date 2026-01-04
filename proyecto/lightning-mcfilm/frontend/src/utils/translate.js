export const translateText = async (text, targetLang = 'es') => {
  if (!text) return text;

  // Si ya está en el idioma objetivo, no traducimos (evitamos llamadas innecesarias)
  if (targetLang === 'en') return text;

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    const data = await res.json();
    return data.responseData.translatedText || text;
  } catch (err) {
    console.error('Error traduciendo:', err);
    return text; // fallback al original si falla
  }
};