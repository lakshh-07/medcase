console.log("SERVER FILE LOADED");

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// 🔹 Supabase Client (Server-Side Secure)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🔹 Gemini Client (NEW SDK)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post("/ai/compare", async (req, res) => {
    try {
      const { disease } = req.body;
  
      if (!disease) {
        return res.status(400).json({
          success: false,
          error: "Disease is required"
        });
      }
  
      // 🔹 Fetch from cases table (correct column name)
      const { data: cases, error } = await supabase
        .from("cases")
        .select("*")
        .ilike("disease", `%${disease}%`);
  
      if (error) throw error;
  
      if (!cases || cases.length === 0) {
        return res.json({
          success: false,
          message: "No matching data found in database."
        });
      }
  
      // 🔹 Structure dataset using REAL columns
      const treatments = cases.slice(0, 10).map(item => ({
        hospital_name: item.hospital_name,
        disease_spec: item.disease_spec,
        treatment: item.treatment,
        severity: item.severity,
        total_cost_inr: item.total_cost_inr,
        outcome: item.outcome,
        side_effects: item.side_effects
      }));
  
      const dataset = {
        disease,
        records: treatments
      };
  
      const prompt = `
  You are a healthcare decision-support assistant.
  
  STRICT RULES:
  - Use ONLY the provided dataset.
  - Do NOT invent hospitals or treatments.
  - Compare based on cost, severity, outcome, and side effects.
  
  DATA:
  ${JSON.stringify(dataset, null, 2)}
  
  TASK:
  1. Compare treatment effectiveness.
  2. Compare cost differences.
  3. Analyze severity vs outcome.
  4. Recommend best overall hospital-treatment option.
  5. Add disclaimer: "This is for informational purposes only."
  
  Return response with clear section headings.
  `;
  
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
  
      res.json({
        success: true,
        analysis: result.text,
        metadata: {
          recordsAnalyzed: treatments.length
        }
      });
  
    } catch (err) {
      console.log("=========== ERROR START ===========");
      console.dir(err, { depth: null });
      console.log("=========== ERROR END =============");
  
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  });

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});