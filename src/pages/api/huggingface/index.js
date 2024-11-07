import { HFInference } from "@huggingface/inference";

const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;
const Inference = new HFInference(HF_ACCESS_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text, lang } = req.body;

  if (!text || !lang) {
    return res.status(400).json({ error: "Missing text or language parameter" });
  }

  const languageModels = {
    "en-es": "Helsinki-NLP/opus-mt-en-es",
    "es-en": "Helsinki-NLP/opus-mt-es-en",
    "en-fr": "Helsinki-NLP/opus-mt-en-fr",
    "fr-en": "Helsinki-NLP/opus-mt-fr-en",
    "en-de": "Helsinki-NLP/opus-mt-en-de",
    "de-en": "Helsinki-NLP/opus-mt-de-en",
    "en-it": "Helsinki-NLP/opus-mt-en-it",
    "it-en": "Helsinki-NLP/opus-mt-it-en",
    "en-pt": "Helsinki-NLP/opus-mt-en-pt",
    "pt-en": "Helsinki-NLP/opus-mt-pt-en",
    "en-nl": "Helsinki-NLP/opus-mt-en-nl",
    "nl-en": "Helsinki-NLP/opus-mt-nl-en",
    "en-pl": "Helsinki-NLP/opus-mt-en-pl",
    "pl-en": "Helsinki-NLP/opus-mt-pl-en",
  };

  const model = languageModels[lang];

  if (!model) {
    console.error("Invalid language parameter:", lang);
    return res.status(400).json({ error: "Invalid language parameter" });
  }

  try {
    const translationResponse = await Inference.translate({
      model,
      inputs: text,
    });

    res.status(200).json({
      translation_text: translationResponse.translation_text,
    });
  } catch (error) {
    console.error("Error during translation:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
