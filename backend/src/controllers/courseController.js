const fs = require("fs");
const path = require("path");

// 📌 Load Courses from JSON File
const getCoursesFromFile = () => {
    const filePath = path.join(__dirname, "../new course db.json"); // Ensure this path is correct
    try {
        const data = fs.readFileSync(filePath, "utf8");
        const parsedData = JSON.parse(data);
        return Array.isArray(parsedData) ? parsedData : parsedData.courses || [];
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return [];
    }
};

const saveCoursesToFile = (courses) => {
    const filePath = path.join(__dirname, "../new course db.json");
    try {
        fs.writeFileSync(filePath, JSON.stringify({ courses }, null, 2));
    } catch (error) {
        console.error("Error writing JSON file:", error);
    }
};

// 📌 Get All Courses
const getAllCourses = (req, res) => {
    const courses = getCoursesFromFile();
    res.json(courses);
};

// 📌 Get Topics by Course Name
const getTopicsByCourse = (req, res) => {
    const courseName = req.params.courseName.toLowerCase();
    const courses = getCoursesFromFile();

    if (!Array.isArray(courses)) {
        return res.status(500).json({ message: "Invalid courses data format" });
    }

    // Find course
    const course = courses.find((c) => c.name.toLowerCase() === courseName);

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    res.json(course.topics || []);
};

const getQuestionsByTopic = (req, res) => {
    const courseName = req.params.courseName.toLowerCase();
    const topicId = parseInt(req.params.topicId, 10); // Convert topicId to a number
    const courses = getCoursesFromFile();

    if (!Array.isArray(courses)) {
        return res.status(500).json({ message: "Invalid courses data format" });
    }

    // Find the course
    const course = courses.find((c) => c.name.toLowerCase() === courseName);

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    // Find the topic
    const topic = course.topics.find((t) => t.id === topicId);

    if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
    }

    res.json(topic.questions || []);
};

// 📌 Add Course
const addCourse = (req, res) => {
    const courses = getCoursesFromFile();
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Course name is required" });
    }

    // 🔍 Check if course already exists (case-insensitive)
    const existingCourse = courses.find(
        (course) => course.name.toLowerCase() === name.toLowerCase()
    );

    if (existingCourse) {
        return res.status(409).json({ message: "Course already exists" });
    }

    const newCourse = {
        id: Date.now(),
        name,
        topics: []
    };

    courses.push(newCourse);
    saveCoursesToFile(courses);

    res.status(201).json({ message: "Course added successfully", course: newCourse });
};

// 📌 Add Topic to Course
const addTopicToCourse = (req, res) => {
    const { courseName } = req.params;
    const { name } = req.body;

    const courses = getCoursesFromFile();
    const course = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase());

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    // 🔍 Check if the topic already exists (case-insensitive)
    const existingTopic = course.topics.find(
        (topic) => topic.name.toLowerCase() === name.toLowerCase()
    );

    if (existingTopic) {
        return res.status(409).json({ message: "Topic already exists in this course" });
    }

    const newTopic = {
        id: Date.now(),
        name,
        questions: []
    };

    course.topics.push(newTopic);
    saveCoursesToFile(courses);

    res.status(201).json({ message: "Topic added", topic: newTopic });
};

// 📌 Add Question to Topic
const addQuestionToTopic = (req, res) => {
    const { courseName, topicId } = req.params;
    const { question, options, answer } = req.body;

    const courses = getCoursesFromFile();
    const course = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase());

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    const topic = course.topics.find(t => t.id === parseInt(topicId));
    if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
    }

    // 🔍 Check if the question already exists in the topic (case-insensitive)
    const existingQuestion = topic.questions.find(
        (q) => q.question.toLowerCase() === question.toLowerCase()
    );

    if (existingQuestion) {
        return res.status(409).json({ message: "This question already exists in this topic" });
    }

    const newQuestion = {
        id: Date.now(),
        question,
        options,
        answer
    };

    topic.questions.push(newQuestion);
    saveCoursesToFile(courses);

    res.status(201).json({ message: "Question added", question: newQuestion });
};


// 📌 Update Course Name
const updateCourseName = (req, res) => {
    const { courseId } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Course name is required" });
    }

    const courses = getCoursesFromFile();
    const course = courses.find((c) => c.id === parseInt(courseId));

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    // Check if the new name is the same as the current one
    if (course.name.toLowerCase() === name.toLowerCase()) {
        return res.status(400).json({ message: "The new course name is the same as the current name" });
    }

    // Update course name
    course.name = name;
    saveCoursesToFile(courses);

    res.json({ message: "Course name updated successfully", course });
};


// 📌 Update Topic Name
// 📌 Update Topic Name
const updateTopicName = (req, res) => {
    const { courseName, topicId } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Topic name is required" });
    }

    const courses = getCoursesFromFile();
    const course = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase());

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    const topic = course.topics.find(t => t.id === parseInt(topicId));

    if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
    }

    // Check if the new name is the same as the current one
    if (topic.name.toLowerCase() === name.toLowerCase()) {
        return res.status(400).json({ message: "The new topic name is the same as the current name" });
    }

    // Update topic name
    topic.name = name;
    saveCoursesToFile(courses);

    res.json({ message: "Topic name updated successfully", topic });
};


// 📌 Update Question Content
const updateQuestion = (req, res) => {
    const { courseName, topicId, questionId } = req.params;
    const { question, options, answer } = req.body;

    if (!question || !options || !answer) {
        return res.status(400).json({ message: "Question, options, and answer are required" });
    }

    const courses = getCoursesFromFile();
    const course = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase());

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    const topic = course.topics.find(t => t.id === parseInt(topicId));
    if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
    }

    const questionToUpdate = topic.questions.find(q => q.id === parseInt(questionId));

    if (!questionToUpdate) {
        return res.status(404).json({ message: "Question not found" });
    }

    // Check if the updated question is the same as the current one
    if (questionToUpdate.question.toLowerCase() === question.toLowerCase() && 
        JSON.stringify(questionToUpdate.options) === JSON.stringify(options) && 
        questionToUpdate.answer.toLowerCase() === answer.toLowerCase()) {
        return res.status(400).json({ message: "The new question, options, and answer are the same as the current ones" });
    }

    // Update question
    questionToUpdate.question = question;
    questionToUpdate.options = options;
    questionToUpdate.answer = answer;

    saveCoursesToFile(courses);

    res.json({ message: "Question updated successfully", question: questionToUpdate });
};


module.exports = {
    getAllCourses,
    getTopicsByCourse,
    getQuestionsByTopic,
    addCourse,
    addTopicToCourse,
    addQuestionToTopic,
    updateCourseName,
    updateTopicName,
    updateQuestion
};
