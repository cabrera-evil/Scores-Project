const { response, request } = require("express");
const Faculty = require("../models/faculty");
const uuidv4 = require('uuid').v4;

const { careerExistByName, subjectExistByName } = require("../helpers/db-validators");

// Get all faculty
const facultyGet = async (req, res) => {
    const filters = req.query;
    const facultyFiltered = await Faculty.find(filters);

    // Find filtered faculty
    const faculties = facultyFiltered.filter(faculty => {
        let isValid = true;
        for (const key in filters) {
            isValid = isValid && faculty[key] == filters[key];
        }
        return isValid;
    })

    const total = faculties.length;

    res.json({
        total,
        faculties
    });
};


// Post a new Faculty
const facultyPost = async (req, res) => {
    const faculty = new Faculty(req.body);

    // Generate a unique id for careers
    faculty.careers.forEach(career => {
        career.id = uuidv4();
    });
    // Generate a unique id for subjects
    if (faculty.careers.subjects) {
        faculty.careers.subjects.forEach(element => {
            element.id = uuidv4();

            if (element.evaluations) {
                element.evaluations.forEach(evaluation => {
                    evaluation.id = uuidv4();
                });
            }
        });
    }

    await faculty.save();
    res.json({
        faculty,
    });
};

// Patch an specific Faculty field
const facultyPatch = async (req, res = response) => {
    // Patch to add new subjects or careers

    const { id } = req.params;
    const { subjects, careers } = req.body;

    // Find the faculty
    const faculty = await Faculty.findById(id);

    // Add new subjects
    if (subjects) {
        // Verify if the subjects exist
        const subjectsDB = await subjectExistByName(subjects[0].name);

        if (!subjectsDB) {
            subjects.forEach(subject => {
                const newSubject = {
                    id: uuidv4(),
                    career_id: subject.career_id,
                    name: subject.name,
                    uv: subject.uv,
                    year: subject.year,
                }
                // Verify his career
                for (let i = 0; i < faculty.careers.length; i++) {
                    if (faculty.careers[i].id === subject.career_id) {
                        faculty.careers[i].subjects.push(newSubject);
                    }
                }
            });
        } else {
            return res.status(400).json({
                msg: `The subject ${subjects[0].name} already exist in the database`
            });
        }
    }

    // Add new careers
    if (careers) {
        for (i = 0; i < careers.length; i++) {
            // Verify if career exist
            const careerDB = await careerExistByName(careers[i].name);
            if (!careerDB) {
                careers.forEach(career => {
                    const newCareer = {
                        id: uuidv4(),
                        name: career.name,
                        subjects: career.subjects ? career.subjects : [],
                    }
                    faculty.careers.push(newCareer);
                });
            }
            else {
                return res.status(400).json({
                    msg: `The career ${careers[0].name} already exist in the database`
                });
            }
        }
    }

    // Save updated faculty
    const facultyDB = await Faculty.findByIdAndUpdate(id, faculty, { new: true });

    res.json({
        facultyDB,
    });
};

// Delete an specific Faculty
const facultyDelete = async (req, res = response) => {
    const { id } = req.params;

    const facultyDB = await Faculty.findByIdAndDelete(id);
    res.json({
        facultyDB,
    });
};

module.exports = {
    facultyGet,
    facultyPost,
    facultyPatch,
    facultyDelete,
};
