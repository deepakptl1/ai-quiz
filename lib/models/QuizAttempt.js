import mongoose from "mongoose";

const QuizAttemptSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  questions: [
    {
      question: String,
      options: [String],
      correctIndex: Number,
      userAnswer: { type: mongoose.Schema.Types.Mixed, default: null },
      isCorrect: Boolean,
      explanation: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.QuizAttempt ||
  mongoose.model("QuizAttempt", QuizAttemptSchema);
