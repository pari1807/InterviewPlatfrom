import Resume from "../models/Resume.js";
import imageKit from "../lib/imageKit.js";
import fs from "fs";

// Create a new resume
export const createResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const clerkId = req.user.clerkId;
    const resumeData = req.body || {};

    const newResume = await Resume.create({
      ...resumeData,
      userId,
      clerkId,
    });

    return res.status(201).json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    console.error("createResume error:", error.message);
    return res.status(400).json({ message: error.message || "Failed to create resume" });
  }
};

// Get all resumes of the authenticated user
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.user._id;
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    return res.status(200).json({ resumes });
  } catch (error) {
    console.error("getUserResumes error:", error.message);
    return res.status(400).json({ message: error.message || "Failed to fetch resumes" });
  }
};

// Get a public resume by ID
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or is private" });
    }
    return res.status(200).json({ resume });
  } catch (error) {
    console.error("getPublicResumeById error:", error.message);
    return res.status(400).json({ message: error.message || "Invalid resume request" });
  }
};

// Get a private resume by ID for authenticated owner
export const getResumeById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }
    return res.status(200).json({ resume });
  } catch (error) {
    console.error("getResumeById error:", error.message);
    return res.status(400).json({ message: error.message || "Failed to fetch resume" });
  }
};

// Update a resume
export const updateResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy = {};
    if (resumeData) {
      resumeDataCopy = typeof resumeData === "string" ? JSON.parse(resumeData) : resumeData;
    }

    // Align project/projects & accentColor/accent_color for database serialization
    if (resumeDataCopy.project) {
      resumeDataCopy.projects = resumeDataCopy.project;
    } else if (resumeDataCopy.projects) {
      resumeDataCopy.project = resumeDataCopy.projects;
    }
    if (resumeDataCopy.accentColor) {
      resumeDataCopy.accent_color = resumeDataCopy.accentColor;
    } else if (resumeDataCopy.accent_color) {
      resumeDataCopy.accentColor = resumeDataCopy.accent_color;
    }

    if (image) {
      try {
        const imageBufferData = fs.createReadStream(image.path);

        const response = await imageKit.files.upload({
          file: imageBufferData,
          fileName: "resume.png",
          folder: "user-resumes",
          transformation: {
            pre: "w-300,h-300,fo-face,z-0.75" + (removeBackground ? ",e-bgremove" : ""),
          },
        });

        if (!resumeDataCopy.personal_info) {
          resumeDataCopy.personal_info = {};
        }
        resumeDataCopy.personal_info.image = response.url;
      } catch (imgErr) {
        console.warn("ImageKit upload warning:", imgErr.message);
      } finally {
        try {
          fs.unlinkSync(image.path);
        } catch (unlinkErr) {
          // ignore cleanup errors
        }
      }
    }

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      { ...resumeDataCopy, clerkId: req.user.clerkId },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    return res.status(200).json({ message: "Resume updated successfully", resume });
  } catch (error) {
    console.error("updateResume error:", error.message);
    return res.status(400).json({ message: error.message || "Failed to update resume" });
  }
};

// Delete a resume
export const deleteResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const { resumeId } = req.params;

    const resume = await Resume.findOneAndDelete({ userId, _id: resumeId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("deleteResume error:", error.message);
    return res.status(400).json({ message: error.message || "Failed to delete resume" });
  }
};
