const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const uuidv4 = require('uuid').v4;

const { careerExistByName, CareerIdByName, getSubjectById } = require("../helpers/db-validators");

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
    else {
        user.career_id = await CareerIdByName(user.career);
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

                // If the subject already has failed attempts, add one more in time
                if (subject.failed_attempts) {
                    subjects[0].times = subject.failed_attempts.length + 1;
                }

                // If subject isn't approved and it's not current, add failed attempt
                if (!subject.approved && !subject.current) {
                    const failed_attempts = [
                        {
                            times: subject.times,
                            average: subject.average,
                            evaluations: subject.evaluations
                        }
                    ];

                    // Add a new object into the array
                    subject.failed_attempts = subject.failed_attempts ? subject.failed_attempts.concat(failed_attempts) : failed_attempts;

                    // Update times and average

                    // Add one more time
                    subject.times = subject.times + 1;
                    subject.average = subjects[0].average ? subjects[0].average : 0;
                    subject.evaluations = subjects[0].evaluations ? subjects[0].evaluations : [];
                }

                // Update current subject
                if (subject) {
                    subject.current = subjects[0].current;
                }

                // Delete subject
                if (subjects[0].delete) {
                    const index = user.subjects.indexOf(subject);
                    user.subjects.splice(index, 1);
                }
            }
        })
        // If there's no subject with the same id, add it (with 5 current subjects as limit)
        if (!flag && user.subjects.length < 5) {
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
        for (let i = 0; i < evaluations.length; i++) {
            const subject = await user.subjects.find(subject => subject.id == evaluations[i].subject_id);
            if (subject) {
                let flag = false;

                // Check if evaluation already exists
                subject.evaluations.forEach((evaluation) => {
                    if (evaluation.id == evaluations[i].id) {
                        flag = true;

                        // Delete evaluation
                        if (evaluations[i].delete) {
                            const index = subject.evaluations.indexOf(evaluation);
                            subject.evaluations.splice(index, 1);

                            // Update subject average
                            subject.average = calculateAverage(subject.evaluations);
                            if (subject.average >= 6) {
                                subject.approved = true;
                            }
                            else {
                                subject.approved = false;
                            }
                        }

                        // Update evaluation grade
                        if (evaluations[i].grade && evaluations[i].grade >= 0 && evaluations[i].grade <= 10) {
                            // Set new evaluation grade
                            evaluation.grade = evaluations[i].grade ? evaluations[i].grade : 0;

                            // Calculate average
                            subject.average = calculateAverage(subject.evaluations);
                            subject.approved = subject.average >= 6 ? true : false;
                        }
                    }
                })
                // If there's no evaluation with the same id, add it
                if (!flag) {
                    // Read all existent evaluation names, and add a number to the new one
                    let evaluationNames = [];
                    subject.evaluations.forEach((evaluation) => {
                        evaluationNames.push(evaluation.name);
                    })

                    // Add a number to the new evaluation name
                    let counter = 1;
                    let newEvaluationName = `${evaluations[i].name}-${counter}`;

                    // Check if the name already exists
                    while (evaluationNames.includes(newEvaluationName)) {
                        newEvaluationName = `${evaluations[i].name}-${counter}`;
                        counter++;
                    }

                    // New evaluation data
                    const newEvaluation = {
                        id: uuidv4(),
                        subject_id: evaluations[i].subject_id,
                        name: newEvaluationName,
                        percentage: evaluations[i].percentage,
                        grade: evaluations[i].grade ? evaluations[i].grade : 0,
                    }
                    // Save new evaluation's data
                    subject.evaluations.push(newEvaluation);

                    // Calculate average
                    if (newEvaluation.grade && newEvaluation.grade >= 0 && newEvaluation.grade <= 10) {
                        // Update subject average
                        subject.average = calculateAverage(subject.evaluations);
                        subject.approved = subject.average >= 6 ? true : false;
                    }
                };
            }
        }
    }

    // Update user's data
    if (req.body.password) {
        // Encrypt password
        const salt = bcrypt.genSaltSync();
        // Update password
        user.password = bcrypt.hashSync(req.body.password, salt);
    }
    if (req.body.role) {
        if (validateRole(req.body.role))
            user.role = req.body.role;
    }

    // Calculate CUM
    user.cum = calculateCum(user.subjects);

    // Save updated user
    const userDB = await User.findByIdAndUpdate(id, user, { new: true });

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

// Validate role
const validateRole = (role) => {
    if (role == 'ADMIN_ROLE' || role == 'USER_ROLE')
        return true;
    else
        return false;
}

// Calculate subject average
const calculateAverage = (evaluations) => {
    let total = 0;

    evaluations.forEach((evaluation) => {
        total += evaluation.grade * evaluation.percentage;
    })

    // round total to 2 decimals
    total = (total / 100).toFixed(1);

    return total;
}

// Calculate CUM
const calculateCum = (subjects) => {
    let cum = 0;
    let uv = 0;

    subjects.forEach((subject) => {
        if (subject.approved || !subject.current) {
            if (!subject.failed_attempts) {
                cum += subject.average * subject.uv;
                uv += subject.uv;
            }
        }
    })

    // round total to 2 decimals
    cum = (cum / uv).toFixed(2);

    return cum;
}

module.exports = {
    usersGet,
    usersPost,
    usersPatch,
    usersDelete,
};
