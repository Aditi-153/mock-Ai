import Interview from "../models/interview.model.js";

import { calculateResult } from "../services/result.service.js";

import { generateQuestions } from "../services/question.service.js";

export const createInterview = async (req, res) => {
  try {
    const { role, experience, difficulty, interviewType } = req.body;
    if (!role || !experience || !difficulty || !interviewType) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const result = await generateQuestions({
      role,
      experience,
      difficulty,
      interviewType,
    });

    const questions = result.questions.map((question) => ({
      question,
      answer: "",
      score: 0,
      feedback: "",
    }));

    const interview = await Interview.create({
      userId: req.user._id,
      role,
      experience,
      difficulty,
      interviewType,
      questions,
    });

    return res.status(201).json({
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to create Interview",
      error: error.message,
    });
  }
};

export const getMyInterview = async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "interviews fetched successfully",
      interviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to fetch interviews",
      error: error.message,
    });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        message: "interview not found",
      });
    }

    return res.status(200).json({
      message: "interview fetched successfully",
      interview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to fetch interview",
      error: error.message,
    });
  }
};

export const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!interview) {
      return res.status(404).json({
        message: "interview not found",
      });
    }

    return res.status(200).json({
      message: "interview updated successfully",
      interview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to update interview",
    });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        message: "interview not found",
      });
    }

    return res.status(200).json({
      message: "interview deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to update interview",
      error: error.message,
    });
  }
};

export const completeInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        message: "interview not found",
      });
    }

    if (interview.status === "completed") {
      return res.status(400).json({
        message: "interview is already completed",
      });
    }

    if (!interview.questions || interview.questions.length === 0) {
      return res.status(400).json({
        message: "no questions found for this interview",
      });
    }

    const unansweredQuestions = interview.questions.filter(
  (question) => !question.answer?.trim(),
);

if (unansweredQuestions.length > 0) {
  return res.status(400).json({
    message: "Please answer all questions before completing the interview",
  });
}

    const messages = [];

    interview.questions.forEach((item) => {
      messages.push({
        type: "Assistant",
        message: item.question,
        createdAt: new Date(),
      });

      if (item.answer) {
        messages.push({
          type: "User",
          message: item.answer,
          createdAt: new Date(),
        });
      }
    });

    const result = await calculateResult(messages);

    interview.score = result.score * 10;
    interview.status = "completed";
    interview.suggestions = [result.feedback];

    await interview.save();

    return res.status(200).json({
      message: "interview completed successfully",
      result: {
        score: result.score,
        feedback: result.feedback,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message : "failed to complete interview",
      error : error.message,
    })
  }
};

export const updateQuestionAnswer = async (req, res) => {
  try {
    const { id, questionId } = req.params;
    const { answer } = req.body;

    if (answer === undefined) {
      return res.status(400).json({
        message: "Answer is required",
      });
    }

    const interview = await Interview.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    if (interview.status === "completed") {
      return res.status(400).json({
        message: "Interview is already completed",
      });
    }

    const question = interview.questions.id(questionId);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    question.answer = answer;

    await interview.save();

    return res.status(200).json({
      message: "Answer saved successfully",
      question,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to save answer",
      error: error.message,
    });
  }
};
