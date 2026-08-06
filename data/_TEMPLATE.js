/* ==========================================================================
   PRODUCT QUESTION BANK — TEMPLATE
   Copy this file to data/<lowercase-product-id>.js (e.g. data/sec701.js)
   and replace PRODUCT_CODE + the questions array.

   CONTRACT WITH THE RUNTIME (do not change shape):
     - This file is loaded via `import()` (dynamic import), so it MUST be
       valid as an ES module. No bundler, no build step required — modern
       browsers execute dynamically-imported files as modules natively,
       even though app.js itself stays a plain classic <script>.
     - Default export = flat array of question objects for the WHOLE
       product (not nested per chapter). chapterIndex on each question is
       what associates it with MOCK_PRODUCTS_DATABASE[...].chapters[idx].
     - Every question object must contain exactly the fields below so it
       is interchangeable with what generateQuestionsForProduct() already
       produces — that's what makes this a drop-in data source.
   ========================================================================== */

export const PRODUCT_CODE = "REPLACE-ME"; // matches product.code in MOCK_PRODUCTS_DATABASE

export const questions = [
  {
    id: "REPLACE-ME-CQ-01-001",       // stable unique id: <code>-CQ-<chapter#>-<seq#>
    chapterIndex: 0,                   // 0-based index into product.chapters[]
    text: "Full question stem goes here, written for a real exam candidate.",
    choices: [
      "Correct answer text",
      "Plausible distractor 1",
      "Plausible distractor 2",
      "Plausible distractor 3"
    ],
    correct: 0,                        // index into choices[] that is correct
    explanation: "Why the correct choice is right, in exam-review language.",
    distractors: [
      "Why choice 1 (if wrong) is wrong.",
      "Why choice 2 is wrong.",
      "Why choice 3 is wrong."
    ]
  }

  // ... continue this pattern until the file contains 100 curated
  // question objects total, distributed across product.chapters via
  // chapterIndex (not necessarily evenly — match real exam weighting).
];

export default questions;
