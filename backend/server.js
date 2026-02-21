import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/ai/compare", async (req, res) => {
  try {
    const { disease, city } = req.body;

    if (!disease || !city) {
      return res.status(400).json({ error: "Disease and city required" });
    }

    // 🔹 Fetch hospitals
    const { data: hospitals, error: hospitalError } = await supabase
      .from("hospitals")
      .select("id, name, city, rating, specialization, avg_cost")
      .ilike("city", `%${city}%`);

    if (hospitalError) throw hospitalError;

    // 🔹 Fetch treatments
    const { data: treatments, error: treatmentError } = await supabase
      .from("treatments")
      .select("id, disease, method, risk_level, recovery_time, cost_range")
      .ilike("disease", `%${disease}%`);

    if (treatmentError) throw treatmentError;

    if (!hospitals?.length || !treatments?.length) {
      return res.json({
        message: "Not enough data for accurate comparison",
        hospitals,
        treatments
      });
    }

    // Limit data sent to AI (important)
    const dataset = {
      disease,
      city,
      hospitals: hospitals.slice(0, 5),
      treatments: treatments.slice(0, 5)
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
You are a healthcare decision-support assistant.

Use ONLY the provided dataset.
Do NOT invent hospitals or treatments.

DATA:
${JSON.stringify(dataset, null, 2)}

TASK:
1. Compare treatment options (cost, risk, recovery).
2. Compare hospitals (rating, affordability, specialization).
3. Suggest best hospital-treatment combination.
4. Provide concise "Best Course of Action".
5. Add disclaimer: Informational only.

Return structured response with headings.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({
      success: true,
      analysis: response.text(),
      metadata: {
        hospitalsAnalyzed: dataset.hospitals.length,
        treatmentsAnalyzed: dataset.treatments.length
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI comparison failed" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});