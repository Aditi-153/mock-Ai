export const validateResult = (result, totalQuestions) => {
  if (!result) return false;

  if (!Number.isInteger(totalQuestions) || totalQuestions <= 0) {
    return false;
  }

  if (!Array.isArray(result.questionEvaluations)) {
    return false;
  }

  if (result.questionEvaluations.length !== totalQuestions) {
    return false;
  }

  if (
    !Array.isArray(result.strengths) ||
    !Array.isArray(result.weaknesses) ||
    !Array.isArray(result.suggestions)
  ) {
    return false;
  }

  if (
    !Number.isInteger(result.score) ||
    result.score < 0 ||
    result.score > 10
  ) {
    return false;
  }

  const indexes = new Set();

  for (const item of result.questionEvaluations) {
    if (
      !Number.isInteger(item.questionIndex) ||
      item.questionIndex < 0 ||
      item.questionIndex >= totalQuestions ||
      indexes.has(item.questionIndex)
    ) {
      return false;
    }

    if (
      !Number.isInteger(item.score) ||
      item.score < 0 ||
      item.score > 10
    ) {
      return false;
    }

    if (
      typeof item.feedback !== "string" ||
      !item.feedback.trim()
    ) {
      return false;
    }

    indexes.add(item.questionIndex);
  }

  return (
    result.strengths.every((item) => typeof item === "string") &&
    result.weaknesses.every((item) => typeof item === "string") &&
    result.suggestions.every((item) => typeof item === "string")
  );
};