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

export const getMyInterview = async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      messsage: "interviews fetched successfully",
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


