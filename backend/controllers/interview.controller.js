import Interview from "../models/interview.model";

export const createInterview = async (req, res) => {
  try {
    const { role, experience, difficulty, interviewType } = req.body;
    if (!role || !experience || !difficulty || !interviewType) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const interview = await Interview.create({
      userId: req.user._id,
      role,
      experience,
      difficulty,
      interviewType,
    });

    return res.status(200).json({
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

