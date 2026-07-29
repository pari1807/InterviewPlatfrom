export const resumes = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [
          { type: "good", tip: "Strong technical skills keywords matched" },
          { type: "good", tip: "Clean standard headings detected" }
        ],
      },
      toneAndStyle: {
        score: 90,
        tips: [
          { type: "good", tip: "Professional action-verb framing", explanation: "Uses clear impact action verbs like Architected and Scaled." }
        ],
      },
      content: {
        score: 90,
        tips: [
          { type: "good", tip: "Quantifiable metrics included", explanation: "Metrics like 'improved performance by 40%' enhance credibility." }
        ],
      },
      structure: {
        score: 90,
        tips: [
          { type: "good", tip: "Clear chronological section ordering", explanation: "Experience is presented chronologically." }
        ],
      },
      skills: {
        score: 90,
        tips: [
          { type: "good", tip: "High skill overlap with job description", explanation: "React, TypeScript, and Node.js match target job." }
        ],
      },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 65,
      ATS: {
        score: 70,
        tips: [
          { type: "good", tip: "Standard contact details section" },
          { type: "improve", tip: "Add Docker & Kubernetes cloud keywords" }
        ],
      },
      toneAndStyle: {
        score: 75,
        tips: [
          { type: "good", tip: "Clear professional summary", explanation: "Summary clearly states target cloud role." }
        ],
      },
      content: {
        score: 60,
        tips: [
          { type: "improve", tip: "Quantify infrastructure scale", explanation: "Mention cloud instance counts or traffic metrics." }
        ],
      },
      structure: {
        score: 70,
        tips: [
          { type: "good", tip: "Readable bullet points", explanation: "Bullet points are concise." }
        ],
      },
      skills: {
        score: 65,
        tips: [
          { type: "improve", tip: "Include AWS/Azure certification details", explanation: "Cloud certifications boost ATS ranking." }
        ],
      },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 78,
      ATS: {
        score: 82,
        tips: [
          { type: "good", tip: "Swift and SwiftUI keywords highlighted" }
        ],
      },
      toneAndStyle: {
        score: 80,
        tips: [
          { type: "good", tip: "Sleek presentation tone", explanation: "Clear emphasis on user experience design." }
        ],
      },
      content: {
        score: 75,
        tips: [
          { type: "good", tip: "App Store published links included", explanation: "Direct app links demonstrate hands-on output." }
        ],
      },
      structure: {
        score: 80,
        tips: [
          { type: "good", tip: "Distinct project highlights block", explanation: "Projects stand out cleanly." }
        ],
      },
      skills: {
        score: 75,
        tips: [
          { type: "good", tip: "CoreData & Combine frameworks present", explanation: "Matches iOS developer requirements." }
        ],
      },
    },
  },
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
  AIResponseFormat,
}) =>
  `You are an expert in ATS (Applicant Tracking System) and resume analysis.
  Please analyze and rate this resume and suggest how to improve it.
  The rating can be low if the resume is bad.
  Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
  If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
  If available, use the job description for the job user is applying to to give more detailed feedback.
  If provided, take the job description into consideration.
  The job title is: ${jobTitle}
  The job description is: ${jobDescription}
  Provide the feedback using the following format: ${AIResponseFormat}
  Return the analysis as a JSON object, without any other text and without the backticks.
  Do not include any other text or comments.`;
