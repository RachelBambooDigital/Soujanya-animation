import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";

// Initialize AWS Translate Client
const translateClient = new TranslateClient({ region: "us-east-1" });

/**
 * Translate text to the target language
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., "es" for Spanish)
 * @returns {Promise<string>} - Translated text
 */
const translateText = async (text, targetLanguage) => {
  if (!text || targetLanguage === "en") return text; // Skip translation for English or empty text

  const params = {
    Text: text,
    SourceLanguageCode: "en", // Assuming source language is English
    TargetLanguageCode: targetLanguage,
  };

  try {
    const command = new TranslateTextCommand(params);
    const response = await translateClient.send(command);
    return response.TranslatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text; // Fallback to original text in case of an error
  }
};

export default translateText;
