const Result = require("../models/Result");
const PDFDocument = require("pdfkit");

const generateCertificate = async (req, res) => {
  const { username, courseName } = req.params;

  try {
    // Fetch all results for this user and course
    const results = await Result.find({ username, courseName });

    if (results.length === 0) {
      return res.status(404).json({ message: "Sorry you have not attempted any quiz in this course.." });
    }

    const totalTopics = 5; // You can update this if it's dynamic
    const maxScorePerTopic = 5; // Assume max score per topic is 5
    const maxTotalScore = totalTopics * maxScorePerTopic;

    const userTotalScore = results.reduce((acc, curr) => acc + curr.score, 0);
    const percentage = (userTotalScore / maxTotalScore) * 100;

    if (percentage < 75) {
      return res.status(403).json({
        message: "You are not eligible for the certificate. Score at least 75%.",
        percentage: `${percentage.toFixed(2)}%`
      });
    }

    // Create a PDF certificate
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=certificate.pdf");

    doc.fontSize(24).text("Certificate of Completion", { align: "center" });
    doc.moveDown();
    doc.fontSize(18).text(`Awarded to: ${results[0].username}`, { align: "center" });
    doc.moveDown();
    doc.text(`For successfully completing: ${courseName}`, { align: "center" });
    doc.moveDown();
    doc.text(`Scored: ${userTotalScore}/${maxTotalScore} (${percentage.toFixed(2)}%)`, {
      align: "center"
    });

   
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("Error generating certificate:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { generateCertificate };
