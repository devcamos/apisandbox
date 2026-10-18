import { defineAifQuestion } from "@/lib/learning/aif-c01-question-bank/define"
import type { AifExamQuestion } from "@/lib/learning/aif-c01-question-bank/types"

/**
 * Domain 1 — Fundamentals of AI and ML (AIF-C01).
 * Heavy coverage of evaluation metrics (precision, recall, F1, accuracy, confusion matrix)
 * plus core AI/ML concepts, AWS service use cases, and lifecycle stages.
 */
export const domain1Questions: AifExamQuestion[] = [
  defineAifQuestion({
    id: "aif-d1-001",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "precision",
    difficulty: "easy",
    stem: "What does precision measure for a binary classifier?",
    options: [
      {
        id: "A",
        text: "Of all the examples the model labeled positive, how many were truly positive.",
        explanation:
          "Correct. Precision asks: when the model says “yes,” how often is it right? Formula: TP ÷ (TP + FP).",
      },
      {
        id: "B",
        text: "Of all the truly positive examples, how many the model found.",
        explanation:
          "That describes recall, not precision. Recall uses false negatives; precision uses false positives.",
      },
      {
        id: "C",
        text: "The share of all predictions (positive and negative) that were correct.",
        explanation:
          "That is accuracy. Accuracy looks at every prediction, not only the positive ones.",
      },
      {
        id: "D",
        text: "How balanced precision and recall are in one number.",
        explanation:
          "That is the idea behind the F1 score. F1 combines precision and recall; it is not precision itself.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d1-002",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "recall",
    difficulty: "easy",
    stem: "What does recall measure for a binary classifier?",
    options: [
      {
        id: "A",
        text: "Of all the examples the model labeled positive, how many were truly positive.",
        explanation:
          "That is precision. Precision worries about false alarms (false positives), not missed cases.",
      },
      {
        id: "B",
        text: "Of all the truly positive examples in the data, how many the model correctly found.",
        explanation:
          "Correct. Recall asks: of every real “yes” case, how many did we catch? Formula: TP ÷ (TP + FN).",
      },
      {
        id: "C",
        text: "How many true negatives the model produced.",
        explanation:
          "True negatives matter for accuracy and specificity, but recall focuses on finding positives.",
      },
      {
        id: "D",
        text: "The model’s training loss on the last epoch.",
        explanation:
          "Training loss is an optimization signal during training, not the same as recall on labeled outcomes.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-003",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "precision",
    difficulty: "medium",
    stem: "A fraud model scores 100 alerts as fraud. Of those, 80 are real fraud (TP = 80) and 20 are false alarms (FP = 20). What is precision?",
    options: [
      {
        id: "A",
        text: "0.80",
        explanation:
          "Correct. Precision = TP ÷ (TP + FP) = 80 ÷ (80 + 20) = 80 ÷ 100 = 0.80. Four out of five alerts were real fraud.",
      },
      {
        id: "B",
        text: "0.20",
        explanation:
          "0.20 is the false-alarm share among alerts (20 ÷ 100), not precision. Precision is the true share: 0.80.",
      },
      {
        id: "C",
        text: "1.00",
        explanation:
          "Precision is 1.0 only if every positive prediction is correct (FP = 0). Here there are 20 false alarms.",
      },
      {
        id: "D",
        text: "0.50",
        explanation:
          "0.50 would mean half the alerts were wrong. Here 80 of 100 were right, so precision is 0.80.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d1-004",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "recall",
    difficulty: "medium",
    stem: "There are 60 real defective parts on a line. The model finds 45 of them (TP = 45) and misses 15 (FN = 15). What is recall?",
    options: [
      {
        id: "A",
        text: "0.45",
        explanation:
          "Do not divide by 100 unless the total of TP + FN is 100. Here TP + FN = 60, so 45 ÷ 60 is not 0.45.",
      },
      {
        id: "B",
        text: "0.75",
        explanation:
          "Correct. Recall = TP ÷ (TP + FN) = 45 ÷ (45 + 15) = 45 ÷ 60 = 0.75. The model caught three-quarters of the defects.",
      },
      {
        id: "C",
        text: "0.25",
        explanation:
          "0.25 is the miss rate (15 ÷ 60). Recall is the catch rate: 45 ÷ 60 = 0.75.",
      },
      {
        id: "D",
        text: "15",
        explanation:
          "15 is the count of missed defects (FN), not a recall score. Recall is a ratio between 0 and 1.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-005",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "accuracy",
    difficulty: "medium",
    stem: "A test set has TP = 70, TN = 20, FP = 5, and FN = 5 (100 examples). What is accuracy?",
    options: [
      {
        id: "A",
        text: "0.70",
        explanation:
          "0.70 only counts true positives over the whole set. Accuracy also counts true negatives as correct.",
      },
      {
        id: "B",
        text: "0.85",
        explanation:
          "That would be (70 + 15) ÷ 100 or a similar mix-up. Correct count is TP + TN = 90.",
      },
      {
        id: "C",
        text: "0.90",
        explanation:
          "Correct. Accuracy = (TP + TN) ÷ total = (70 + 20) ÷ 100 = 90 ÷ 100 = 0.90.",
      },
      {
        id: "D",
        text: "0.95",
        explanation:
          "0.95 would need 95 correct predictions. Here TP + TN = 90, so accuracy is 0.90.",
      },
    ],
    correctOptionIds: ["C"],
  }),

  defineAifQuestion({
    id: "aif-d1-006",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "f1-score",
    difficulty: "medium",
    stem: "A model has precision = 0.80 and recall = 0.80. What is its F1 score?",
    options: [
      {
        id: "A",
        text: "0.64",
        explanation:
          "0.64 is precision × recall (0.8 × 0.8). F1 is the harmonic mean, not the product.",
      },
      {
        id: "B",
        text: "0.80",
        explanation:
          "Correct. F1 = 2 × (P × R) ÷ (P + R) = 2 × (0.8 × 0.8) ÷ (0.8 + 0.8) = 1.28 ÷ 1.6 = 0.80. When P and R match, F1 equals that value.",
      },
      {
        id: "C",
        text: "1.60",
        explanation:
          "1.60 is P + R. F1 never goes above 1.0; it is a balanced average of the two rates.",
      },
      {
        id: "D",
        text: "0.00",
        explanation:
          "F1 is 0 only if precision or recall is 0. Here both are 0.80, so F1 is 0.80.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-007",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "confusion-matrix",
    difficulty: "easy",
    stem: "In a confusion matrix for a “spam vs not spam” model, what is a false positive (FP)?",
    options: [
      {
        id: "A",
        text: "A spam email the model correctly labels as spam.",
        explanation:
          "That is a true positive (TP): the model said spam and it really was spam.",
      },
      {
        id: "B",
        text: "A normal email the model incorrectly labels as spam.",
        explanation:
          "Correct. False positive means the model cried “spam!” when the email was fine—a false alarm.",
      },
      {
        id: "C",
        text: "A spam email the model misses and labels as not spam.",
        explanation:
          "That is a false negative (FN): a real positive case the model failed to catch.",
      },
      {
        id: "D",
        text: "A normal email the model correctly leaves in the inbox.",
        explanation:
          "That is a true negative (TN): predicted not spam, and it really was not spam.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-008",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "precision",
    difficulty: "medium",
    stem: "A hospital triage tool flags patients for an expensive follow-up scan. False alarms waste money and scare patients. Which metric should the team prioritize first?",
    options: [
      {
        id: "A",
        text: "Precision",
        explanation:
          "Correct. High precision means when the tool says “scan needed,” it is usually right—fewer false alarms.",
      },
      {
        id: "B",
        text: "Recall only, with no regard for false alarms",
        explanation:
          "Maxing recall alone can flood the clinic with false positives. Costly scans need precision attention too.",
      },
      {
        id: "C",
        text: "Training set size",
        explanation:
          "More data can help models, but it is not the evaluation metric that tracks false alarms.",
      },
      {
        id: "D",
        text: "Inference latency in milliseconds",
        explanation:
          "Latency measures speed, not whether positive flags are trustworthy. Precision tracks that trust.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d1-009",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "recall",
    difficulty: "medium",
    stem: "A factory must catch almost every cracked part before shipping. Missing a cracked part is far worse than occasionally rechecking a good part. Which metric matters most?",
    options: [
      {
        id: "A",
        text: "Precision",
        explanation:
          "Precision reduces false alarms. Here missing cracks (false negatives) is the main risk, so recall comes first.",
      },
      {
        id: "B",
        text: "Recall",
        explanation:
          "Correct. High recall means few missed cracked parts. Extra rechecks of good parts are acceptable in this story.",
      },
      {
        id: "C",
        text: "Accuracy alone on a set that is 99% good parts",
        explanation:
          "Accuracy can look great while still missing rare cracks. Rare defects need recall (or similar) checks.",
      },
      {
        id: "D",
        text: "Model file size on disk",
        explanation:
          "File size is an ops detail. It does not tell you how many cracked parts you miss.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-010",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "accuracy",
    difficulty: "medium",
    stem: "A dataset has 990 normal logins and 10 account takeovers. A model that always predicts “normal” scores 99% accuracy. Why is accuracy misleading here?",
    options: [
      {
        id: "A",
        text: "Because 99% is above a common 95% pass mark, so the model must be useful.",
        explanation:
          "A high accuracy number does not prove usefulness when the rare class is what you care about.",
      },
      {
        id: "B",
        text: "Because the model never finds any takeovers, so recall for the rare class is 0.",
        explanation:
          "Correct. Always saying “normal” is right on 990 cases but catches 0 of 10 attacks. Accuracy hides that failure.",
      },
      {
        id: "C",
        text: "Because accuracy cannot be computed when classes are uneven.",
        explanation:
          "Accuracy can still be computed. The problem is that it can look excellent while missing the rare class.",
      },
      {
        id: "D",
        text: "Because precision and recall are always equal to accuracy.",
        explanation:
          "They are not the same. Precision and recall focus on the positive class; accuracy mixes everything.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-011",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "precision",
    difficulty: "easy",
    stem: "A classifier marks 10 messages as urgent. Nine really are urgent (TP = 9) and one is not (FP = 1). What is precision?",
    options: [
      {
        id: "A",
        text: "0.10",
        explanation:
          "0.10 would be 1 ÷ 10 (the error share). Precision is the correct share among positives: 9 ÷ 10.",
      },
      {
        id: "B",
        text: "0.90",
        explanation:
          "Correct. Precision = 9 ÷ (9 + 1) = 0.90. Nine of the ten “urgent” flags were right.",
      },
      {
        id: "C",
        text: "9.00",
        explanation:
          "Precision is a rate from 0 to 1, not a raw count. The count TP = 9 is not the precision score.",
      },
      {
        id: "D",
        text: "0.50",
        explanation:
          "Nothing in the counts supports a coin-flip precision. 9 of 10 positives were correct.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-012",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "recall",
    difficulty: "medium",
    stem: "There are 12 real urgent messages. The model finds 9 (TP = 9) and misses 3 (FN = 3). What is recall?",
    options: [
      {
        id: "A",
        text: "0.75",
        explanation:
          "Correct. Recall = 9 ÷ (9 + 3) = 9 ÷ 12 = 0.75. Three-quarters of real urgents were found.",
      },
      {
        id: "B",
        text: "0.90",
        explanation:
          "0.90 would match a precision example with FP = 1, not this recall setup with FN = 3.",
      },
      {
        id: "C",
        text: "3.00",
        explanation:
          "3 is the miss count (FN). Recall is the catch rate 9 ÷ 12, not the miss count itself.",
      },
      {
        id: "D",
        text: "1.00",
        explanation:
          "Recall is 1.0 only if FN = 0. Here three urgents were missed, so recall is below 1.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d1-013",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "f1-score",
    difficulty: "medium",
    stem: "A model has TP = 40, FP = 10, and FN = 10. What is the F1 score?",
    options: [
      {
        id: "A",
        text: "0.50",
        explanation:
          "Work the rates first. Precision = 40 ÷ 50 = 0.8 and recall = 40 ÷ 50 = 0.8, so F1 is not 0.5.",
      },
      {
        id: "B",
        text: "0.80",
        explanation:
          "Correct. P = 40 ÷ (40 + 10) = 0.8; R = 40 ÷ (40 + 10) = 0.8; F1 = 2 × 0.8 × 0.8 ÷ (0.8 + 0.8) = 0.8.",
      },
      {
        id: "C",
        text: "0.90",
        explanation:
          "0.90 might look like (40 + something) ÷ total, but F1 from these counts is 0.80.",
      },
      {
        id: "D",
        text: "1.00",
        explanation:
          "F1 is 1.0 only with perfect precision and recall (no FP and no FN). Here both FP and FN are 10.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-014",
    format: "multi-response",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "precision",
    difficulty: "medium",
    stem: "Which statements about precision are correct? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "Precision falls when false positives rise, if true positives stay the same.",
        explanation:
          "Correct. More false alarms in the denominator of TP ÷ (TP + FP) pulls precision down.",
      },
      {
        id: "B",
        text: "Precision is the same formula as recall.",
        explanation:
          "False. Recall uses FN in the denominator; precision uses FP. They answer different questions.",
      },
      {
        id: "C",
        text: "Precision ignores true negatives.",
        explanation:
          "Correct. The precision formula only uses TP and FP. TN never appears in it.",
      },
      {
        id: "D",
        text: "Precision is always higher than accuracy.",
        explanation:
          "False. Precision can be higher or lower than accuracy depending on the counts.",
      },
      {
        id: "E",
        text: "Precision requires unlabeled production data only.",
        explanation:
          "False. To compute precision you need labeled outcomes so you know which positives were true.",
      },
    ],
    correctOptionIds: ["A", "C"],
  }),

  defineAifQuestion({
    id: "aif-d1-015",
    format: "multi-response",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "recall",
    difficulty: "medium",
    stem: "Which statements about recall are correct? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "Raising the positive decision threshold usually increases recall.",
        explanation:
          "False. A stricter threshold usually means fewer positive calls, which often lowers recall.",
      },
      {
        id: "B",
        text: "Recall focuses on how many real positive cases the model finds.",
        explanation:
          "Correct. Recall is the catch rate for the positive class: TP ÷ (TP + FN).",
      },
      {
        id: "C",
        text: "Missing a real positive case increases the false-negative count and hurts recall.",
        explanation:
          "Correct. Every miss is an FN; more FN makes the recall fraction smaller.",
      },
      {
        id: "D",
        text: "Recall is identical to specificity.",
        explanation:
          "False. Specificity is about correctly identifying negatives; recall is about finding positives.",
      },
      {
        id: "E",
        text: "Recall cannot be used for medical screening tasks.",
        explanation:
          "False. Screening often prioritizes high recall so few true cases are missed.",
      },
    ],
    correctOptionIds: ["B", "C"],
  }),

  defineAifQuestion({
    id: "aif-d1-016",
    format: "multi-response",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "f1-score",
    difficulty: "medium",
    stem: "Which statements about the F1 score are correct? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "F1 is the harmonic mean of precision and recall.",
        explanation:
          "Correct. The usual formula is F1 = 2PR ÷ (P + R), which is the harmonic mean of P and R.",
      },
      {
        id: "B",
        text: "If either precision or recall is 0, F1 is 0.",
        explanation:
          "Correct. The product PR becomes 0, so F1 becomes 0. You cannot “average away” a zero rate.",
      },
      {
        id: "C",
        text: "F1 always equals accuracy.",
        explanation:
          "False. Accuracy includes true negatives; F1 does not. They match only in special cases.",
      },
      {
        id: "D",
        text: "F1 can be greater than 1 when the model is strong.",
        explanation:
          "False. Precision and recall are at most 1, so F1 is also at most 1.",
      },
      {
        id: "E",
        text: "F1 ignores false positives completely.",
        explanation:
          "False. False positives lower precision, and lower precision lowers F1.",
      },
    ],
    correctOptionIds: ["A", "B"],
  }),

  defineAifQuestion({
    id: "aif-d1-017",
    format: "multi-response",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "evaluation-metrics",
    difficulty: "hard",
    stem: "A team is choosing evaluation metrics for a rare-event detector. Which choices are appropriate? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "Track precision and recall (or F1) for the rare positive class.",
        explanation:
          "Correct. These metrics show how well you find rare events without drowning in false alarms.",
      },
      {
        id: "B",
        text: "Rely only on overall accuracy because it is simplest.",
        explanation:
          "Risky. With rare events, accuracy can look excellent while you miss nearly every event.",
      },
      {
        id: "C",
        text: "Inspect a confusion matrix to see FP and FN counts, not only a single score.",
        explanation:
          "Correct. The matrix shows the kinds of mistakes. One summary number can hide that detail.",
      },
      {
        id: "D",
        text: "Delete all negative examples so every metric becomes 100%.",
        explanation:
          "That would break evaluation. You need realistic negatives to measure false alarms.",
      },
      {
        id: "E",
        text: "Skip a held-out test set if training loss looks low.",
        explanation:
          "False. Low training loss can mean memorization. You still need held-out evaluation.",
      },
    ],
    correctOptionIds: ["A", "C"],
  }),

  defineAifQuestion({
    id: "aif-d1-018",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "accuracy",
    difficulty: "hard",
    stem: "On 1,000 examples a model has TP = 0, TN = 990, FP = 0, FN = 10. What is accuracy, and what does it imply?",
    options: [
      {
        id: "A",
        text: "Accuracy = 0.99; the model is excellent at finding the positive class.",
        explanation:
          "Accuracy is 0.99, but TP = 0 means it found zero positives. Excellence for the rare class is false.",
      },
      {
        id: "B",
        text: "Accuracy = 0.99; the model never predicts positive, so recall for positives is 0.",
        explanation:
          "Correct. (TP + TN) ÷ 1000 = 990 ÷ 1000 = 0.99, yet recall = 0 ÷ (0 + 10) = 0. High accuracy, zero catch rate.",
      },
      {
        id: "C",
        text: "Accuracy = 0.00 because there are no true positives.",
        explanation:
          "Accuracy still counts true negatives. 990 correct “negative” calls give accuracy 0.99, not 0.",
      },
      {
        id: "D",
        text: "Accuracy = 0.10 because FN = 10.",
        explanation:
          "Do not turn the FN count into accuracy. Accuracy uses all correct predictions over all examples.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-019",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "confusion-matrix",
    difficulty: "medium",
    stem: "A confusion matrix shows: predicted Positive / actual Positive = 30; predicted Positive / actual Negative = 5; predicted Negative / actual Positive = 10; predicted Negative / actual Negative = 55. How many false negatives are there?",
    options: [
      {
        id: "A",
        text: "5",
        explanation:
          "5 is predicted Positive but actual Negative—that cell is false positives (FP), not FN.",
      },
      {
        id: "B",
        text: "10",
        explanation:
          "Correct. False negatives are actual Positive cases predicted Negative. That cell is 10.",
      },
      {
        id: "C",
        text: "30",
        explanation:
          "30 is true positives (TP): predicted Positive and actually Positive.",
      },
      {
        id: "D",
        text: "55",
        explanation:
          "55 is true negatives (TN): predicted Negative and actually Negative.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-020",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "f1-score",
    difficulty: "hard",
    stem: "A model has precision = 0.60 and recall = 0.90. What is F1, rounded to two decimal places?",
    options: [
      {
        id: "A",
        text: "0.75",
        explanation:
          "0.75 is the simple average (0.60 + 0.90) ÷ 2. F1 uses the harmonic mean, which is lower here.",
      },
      {
        id: "B",
        text: "0.72",
        explanation:
          "Correct. F1 = 2 × 0.60 × 0.90 ÷ (0.60 + 0.90) = 1.08 ÷ 1.50 = 0.72. Harmonic mean pulls toward the lower rate.",
      },
      {
        id: "C",
        text: "0.54",
        explanation:
          "0.54 is the product 0.60 × 0.90. F1 multiplies by 2 and divides by the sum, giving 0.72.",
      },
      {
        id: "D",
        text: "1.50",
        explanation:
          "1.50 is P + R. F1 must stay between 0 and 1.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-021",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "evaluation-metrics",
    difficulty: "medium",
    stem: "You lower the score threshold so the model labels more examples as positive. What usually happens to precision and recall?",
    options: [
      {
        id: "A",
        text: "Recall often rises; precision often falls.",
        explanation:
          "Correct. More positive calls catch more real cases (higher recall) but also add false alarms (lower precision).",
      },
      {
        id: "B",
        text: "Precision and recall both always rise together.",
        explanation:
          "They often trade off when you move a threshold. Both rising together is not the usual effect.",
      },
      {
        id: "C",
        text: "Recall always falls to zero.",
        explanation:
          "Lowering the threshold usually finds more positives, so recall tends to rise, not fall to zero.",
      },
      {
        id: "D",
        text: "Accuracy becomes undefined.",
        explanation:
          "Accuracy remains defined. Threshold changes can move accuracy up or down, but the metric still exists.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d1-022",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "precision",
    difficulty: "easy",
    stem: "A model has TP = 50 and FP = 50. What is precision?",
    options: [
      {
        id: "A",
        text: "0.00",
        explanation:
          "Precision is 0 only if TP = 0. Here half the positive predictions are correct.",
      },
      {
        id: "B",
        text: "0.50",
        explanation:
          "Correct. Precision = 50 ÷ (50 + 50) = 0.50. Half of the positive flags were true.",
      },
      {
        id: "C",
        text: "1.00",
        explanation:
          "Precision is 1.0 only with FP = 0. Here FP equals TP, so precision is 0.50.",
      },
      {
        id: "D",
        text: "50",
        explanation:
          "50 is a raw count. Precision is the ratio 0.50, not the count itself.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-023",
    format: "multi-response",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "confusion-matrix",
    difficulty: "medium",
    stem: "Which cells of a binary confusion matrix are used to compute precision? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "True positives (TP)",
        explanation:
          "Correct. TP is the numerator and part of the denominator in precision = TP ÷ (TP + FP).",
      },
      {
        id: "B",
        text: "False positives (FP)",
        explanation:
          "Correct. FP sits in the denominator. Extra false alarms lower precision.",
      },
      {
        id: "C",
        text: "True negatives (TN)",
        explanation:
          "False. TN does not appear in the precision formula.",
      },
      {
        id: "D",
        text: "False negatives (FN)",
        explanation:
          "False for precision. FN appears in recall = TP ÷ (TP + FN), not in precision.",
      },
      {
        id: "E",
        text: "The model’s learning rate",
        explanation:
          "False. Learning rate is a training setting, not a confusion-matrix cell.",
      },
    ],
    correctOptionIds: ["A", "B"],
  }),

  defineAifQuestion({
    id: "aif-d1-024",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "recall",
    difficulty: "easy",
    stem: "A model finds every real positive case: TP = 100 and FN = 0. What is recall?",
    options: [
      {
        id: "A",
        text: "0.00",
        explanation:
          "Recall is 0 when the model finds nothing (TP = 0 with positives present). Here it found all of them.",
      },
      {
        id: "B",
        text: "0.50",
        explanation:
          "Nothing in TP = 100 and FN = 0 suggests a half score. The catch rate is perfect.",
      },
      {
        id: "C",
        text: "1.00",
        explanation:
          "Correct. Recall = 100 ÷ (100 + 0) = 1.00. Perfect catch rate for the positive class.",
      },
      {
        id: "D",
        text: "100",
        explanation:
          "100 is the TP count. Recall is the rate 1.00, not the raw count.",
      },
    ],
    correctOptionIds: ["C"],
  }),

  defineAifQuestion({
    id: "aif-d1-025",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "f1-score",
    difficulty: "hard",
    stem: "A model has precision = 1.00 because it never makes a false positive, but recall = 0.00 because it never predicts positive when it should. What is F1?",
    options: [
      {
        id: "A",
        text: "1.00",
        explanation:
          "Perfect precision alone is not enough. With recall 0, the harmonic mean collapses to 0.",
      },
      {
        id: "B",
        text: "0.50",
        explanation:
          "The simple average of 1 and 0 is 0.5, but F1 uses the harmonic mean and becomes 0 when either side is 0.",
      },
      {
        id: "C",
        text: "0.00",
        explanation:
          "Correct. F1 = 2 × 1 × 0 ÷ (1 + 0) = 0. If you catch nothing, F1 is zero even with perfect precision on the empty positive set edge case—or when recall is zero.",
      },
      {
        id: "D",
        text: "Undefined forever for every dataset",
        explanation:
          "F1 is defined whenever you can compute P and R with a non-zero denominator. Here the value is 0, not “undefined forever.”",
      },
    ],
    correctOptionIds: ["C"],
  }),

  defineAifQuestion({
    id: "aif-d1-026",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "evaluation-metrics",
    difficulty: "medium",
    stem: "You need one summary score that balances false alarms and missed positives for an imbalanced problem. Which metric is the best default among these options?",
    options: [
      {
        id: "A",
        text: "Overall accuracy alone",
        explanation:
          "Accuracy can hide rare-class failures. It is a weak default for imbalanced detection work.",
      },
      {
        id: "B",
        text: "F1 score for the positive class",
        explanation:
          "Correct. F1 balances precision and recall for the class you care about, which helps when classes are uneven.",
      },
      {
        id: "C",
        text: "Number of parameters in the model",
        explanation:
          "Parameter count is a model-size detail, not a measure of prediction quality on held-out cases.",
      },
      {
        id: "D",
        text: "GPU utilization percentage",
        explanation:
          "GPU use is an infrastructure metric. It does not tell you if predictions are good.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-027",
    format: "multi-response",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.1",
    topic: "supervised-learning",
    difficulty: "easy",
    stem: "Which examples are supervised learning problems? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "Predicting house price from labeled past sales with known sale prices.",
        explanation:
          "Correct. Each training example has a known target (price). That is classic supervised regression.",
      },
      {
        id: "B",
        text: "Clustering customers into groups with no pre-labeled group names.",
        explanation:
          "That is unsupervised learning. There is no labeled “correct group” for each customer during training.",
      },
      {
        id: "C",
        text: "Classifying support tickets as billing or technical using historical labeled tickets.",
        explanation:
          "Correct. Labels exist for past tickets, so the model learns a supervised classification mapping.",
      },
      {
        id: "D",
        text: "An agent learning a game only from win/lose rewards with no action labels.",
        explanation:
          "That is reinforcement learning: the agent learns from rewards, not from labeled correct actions.",
      },
      {
        id: "E",
        text: "Compressing images with an autoencoder without class labels.",
        explanation:
          "Autoencoders are typically unsupervised (or self-supervised) representation learning, not labeled supervised class prediction.",
      },
    ],
    correctOptionIds: ["A", "C"],
  }),

  defineAifQuestion({
    id: "aif-d1-028",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.1",
    topic: "learning-paradigms",
    difficulty: "medium",
    stem: "How does reinforcement learning (RL) mainly differ from typical supervised learning?",
    options: [
      {
        id: "A",
        text: "RL learns from rewards and penalties for actions over time, not from a fixed labeled answer for every input.",
        explanation:
          "Correct. An RL agent tries actions, gets feedback (reward), and improves a policy. Supervised learning maps inputs to known labels.",
      },
      {
        id: "B",
        text: "RL always requires a confusion matrix during every training step.",
        explanation:
          "Confusion matrices are for evaluating classifiers. RL training centers on rewards and policies, not required confusion matrices.",
      },
      {
        id: "C",
        text: "RL cannot be used for any sequential decision task.",
        explanation:
          "The opposite is true: RL is especially aimed at sequential decisions (games, robots, routing).",
      },
      {
        id: "D",
        text: "RL is identical to unsupervised clustering.",
        explanation:
          "Clustering groups unlabeled data. RL optimizes actions for cumulative reward—a different goal.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d1-029",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.2",
    topic: "aws-ml-services",
    difficulty: "easy",
    stem: "A team wants a managed environment to build, train, tune, and deploy custom ML models on AWS. Which service fits best?",
    options: [
      {
        id: "A",
        text: "Amazon SageMaker AI",
        explanation:
          "Correct. Amazon SageMaker AI is the managed platform for the ML development lifecycle: prepare data, train, tune, deploy, and monitor models.",
      },
      {
        id: "B",
        text: "Amazon Transcribe",
        explanation:
          "Amazon Transcribe turns speech into text. It is not a general train-and-deploy platform for custom models.",
      },
      {
        id: "C",
        text: "Amazon Comprehend",
        explanation:
          "Amazon Comprehend analyzes text (sentiment, entities, and more). It is not the full custom ML workbench.",
      },
      {
        id: "D",
        text: "Amazon Q",
        explanation:
          "Amazon Q is an AI assistant for work and builders. It is not the primary managed ML training and hosting platform.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d1-030",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.2",
    topic: "aws-ml-services",
    difficulty: "easy",
    stem: "A support team wants to detect sentiment and extract key phrases from thousands of customer emails without training their own NLP model. Which AWS service is the best fit?",
    options: [
      {
        id: "A",
        text: "Amazon Transcribe",
        explanation:
          "Amazon Transcribe converts audio to text. Sentiment and key phrases from written email are Amazon Comprehend’s job.",
      },
      {
        id: "B",
        text: "Amazon Comprehend",
        explanation:
          "Correct. Amazon Comprehend provides NLP APIs such as sentiment analysis and key-phrase extraction on text.",
      },
      {
        id: "C",
        text: "Amazon SageMaker AI only, with no NLP APIs needed",
        explanation:
          "You could build a custom model in Amazon SageMaker AI, but for ready-made NLP on text, Amazon Comprehend is the direct fit.",
      },
      {
        id: "D",
        text: "Amazon Bedrock for speech-to-text alone",
        explanation:
          "Amazon Bedrock serves foundation models through APIs. Speech-to-text is Amazon Transcribe; email NLP here points to Amazon Comprehend.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-031",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.2",
    topic: "aws-ml-services",
    difficulty: "easy",
    stem: "A call center wants to turn recorded customer phone calls into searchable text so agents can review what was said. Which AWS service should they use?",
    options: [
      {
        id: "A",
        text: "Amazon Comprehend as the speech-to-text engine",
        explanation:
          "Amazon Comprehend analyzes text that already exists. It does not convert audio into text by itself.",
      },
      {
        id: "B",
        text: "Amazon Transcribe",
        explanation:
          "Correct. Amazon Transcribe is the speech-to-text service that converts audio recordings into text.",
      },
      {
        id: "C",
        text: "Amazon SageMaker AI JumpStart only for OCR on paper",
        explanation:
          "OCR is about images of text. Phone calls are audio; Amazon Transcribe is the speech-to-text service.",
      },
      {
        id: "D",
        text: "Amazon Q Developer to replace the phone system",
        explanation:
          "Amazon Q helps people with questions and coding tasks. It is not the service that transcribes call audio.",
      },
    ],
    correctOptionIds: ["B"],
  }),

  defineAifQuestion({
    id: "aif-d1-032",
    format: "multi-response",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "ml-lifecycle",
    difficulty: "medium",
    stem: "Which activities are typical stages in an AI/ML development lifecycle? (Select THREE.)",
    options: [
      {
        id: "A",
        text: "Define the business problem and success metrics before modeling.",
        explanation:
          "Correct. Clear goals and metrics (for example precision or recall targets) come before training.",
      },
      {
        id: "B",
        text: "Prepare and split data, then train and evaluate a model on held-out data.",
        explanation:
          "Correct. Data prep, training, and honest evaluation are core lifecycle stages.",
      },
      {
        id: "C",
        text: "Deploy the model and monitor it in production for drift and quality.",
        explanation:
          "Correct. Shipping is not the end—you watch real traffic for quality drops and data drift.",
      },
      {
        id: "D",
        text: "Skip evaluation if the model trains without crashing.",
        explanation:
          "False. A model can train cleanly and still predict poorly. Evaluation is required.",
      },
      {
        id: "E",
        text: "Hard-code production labels from the training set forever with no refresh plan.",
        explanation:
          "False. Labels and data age. Lifecycle practice includes refreshing data and re-evaluating over time.",
      },
    ],
    correctOptionIds: ["A", "B", "C"],
  }),
]
