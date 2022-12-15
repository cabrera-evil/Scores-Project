const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const uuidv4 = require('uuid').v4;

const { careerExistByName, subjectExistById, getSubjectById } = require("../helpers/db-validators");

// Get all users
const usersGet = async (req = request, res = response) => {
    const filters = req.query;
    const usersFiltered = await User.find(filters);

    // Find filtered users
    const users = usersFiltered.filter(user => {
        let isValid = true;
        for (const key in filters) {
            isValid = isValid && user[key] == filters[key];
        }
        return isValid;
    })

    const total = users.length;

    res.json({
        total,
        users
    });
};

// Post a new user
const usersPost = async (req, res) => {
    const user = new User(req.body);

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);

    // Validate career
    const careerDB = await careerExistByName(user.career);
    if (!careerDB) {
        return res.status(400).json({
            msg: `The career ${user.career} does not exist in the database`
        });
    }

    await user.save();
    res.json({
        user,
    });
};

// Patch an specific user field
const usersPatch = async (req, res = response) => {
    // Patch to add a new subject or evaluations or edit existent ones

    const { id } = req.params;
    const { subjects, evaluations } = req.body;

    // Find user
    const user = await User.findById(id);

    // Add new subject
    if (subjects) {
        let flag = false;
        // Check if subject already exists
        user.subjects.forEach((subject) => {
            if (subject.id == subjects[0].id) {
                flag = true;
            }
        }
        )
        // If there's no subject with the same name, add it
        if (!flag) {
            let subjectData = await getSubjectById(subjects[0].id);

            const newSubject = {
                id: subjects[0].id,
                name: subjectData.name,
                uv: subjectData.uv,
                year: subjectData.year,
                average: subjects[0].average ? subjects[0].average : 0,
                approved: subjects[0].approved ? subjects[0].approved : false,
                current: subjects[0].current ? subjects[0].current : true,
                times: subjects[0].times ? subjects[0].times : 1,
                evaluations: subjects[0].evaluations ? subjects[0].evaluations : []
            }
            user.subjects.push(newSubject);
        };
    }

    // Add new evaluation
    if (evaluations) {
        // Find his subject per id
        const subject = user.subjects.find(subject => subject.id == evaluations[0].subject_id);
        if (subject) {
            // Check if evaluation already exists
            let flag = false;
            subject.evaluations.forEach((evaluation) => {
                if (evaluation.name == evaluations[0].name) {
                    flag = true;
                }
            }
            )
            // If there's no evaluation with the same name, add it
            if (!flag) {
                const newEvaluation = {
                    id: uuidv4(),
                    subject_id: evaluations[0].subject_id,
                    name: evaluations[0].name,
                    percentage: evaluations[0].percentage,
                    grade: evaluations[0].grade ? evaluations[0].grade : 0,
                }
                subject.evaluations.push(newEvaluation);

                // Update subject average
                subject.average = calculateAverage(subject.evaluations);
                if (subject.average >= 6) {
                    subject.approved = true;
                }
            };
        }
    }

    // Edit evaluation grade
    if (evaluations) {
        // Find his subject per id
        const subject = user.subjects.find(subject => subject.id == evaluations[0].subject_id);
        if (subject) {
            // Check if evaluation already exists
            let flag = false;
            subject.evaluations.forEach((evaluation) => {
                if (evaluation.name == evaluations[0].name) {
                    flag = true;
                }
            }
            )
            // If there's no evaluation with the same name, add it
            if (flag) {
                const evaluation = subject.evaluations.find(evaluation => evaluation.name == evaluations[0].name);
                evaluation.grade = evaluations[0].grade ? evaluations[0].grade : 0;

                subject.average = calculateAverage(subject.evaluations);
                if (subject.average >= 6) {
                    subject.approved = true;
                }
            };
        }
    }

    // Calculate CUM
    user.cum = calculateCum(user.subjects);

    // Save updated user
    const userDB = await User.findByIdAndUpdate(id, user, { new: true })

    res.json({
        userDB,
    });
};

// Delete an specific user
const usersDelete = async (req, res = response) => {
    const { id } = req.params;

    const userDB = await User.findByIdAndDelete(id);
    res.json({
        userDB,
    });
};

// Helper functions

// Calculate subject average
const calculateAverage = (evaluations) => {
    let total = 0;

    evaluations.forEach((evaluation) => {
        total += evaluation.grade * evaluation.percentage;
    })

    return total / 100;
}

// Calculate CUM
const calculateCum = (subjects) => {
    let cum = 0;
    let uv = 0;

    if (subjects.approved) {
        subjects.forEach((subject) => {
            cum += subject.average * subject.uv;
            uv += subject.uv;
        });
        if (uv > 0) {
            return cum / uv;
        }
    }

    return 0;
}

module.exports = {
    usersGet,
    usersPost,
    usersPatch,
    usersDelete,
};
