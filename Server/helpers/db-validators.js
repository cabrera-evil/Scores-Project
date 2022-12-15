const User = require("../models/user");
const Faculty = require("../models/faculty");

// Validate if the email exist
const emailExist = async (email = "") => {
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new Error(`Email: ${email} already exist`);
  }
};

// Validate if the user exist
const userExistByID = async (id = "") => {
  const userExist = await User.findById(id);
  if (!userExist) {
    throw new Error(`User ID:${id} does not exist`);
  }
};

// Validate if the career exist
const careerExistByName = async (name = "") => {
  const findFaculty = await Faculty.find();
  let flag = false;

  findFaculty.map((find) => {
    for (let i = 0; i < find.careers.length; i++) {
      if (find.careers[i].name === name) {
        flag = true;
      }
    }
  }
  )
  return flag;
};

// Get career name by id
const CareerIdByName = async (name = "") => {
  const findFaculty = await Faculty.find();
  let careerId;

  findFaculty.map((find) => {
    for (let i = 0; i < find.careers.length; i++) {
      if (find.careers[i].name === name) {
        careerId = find.careers[i].id;
      }
    }
  }
  )
  return careerId;
};

// Validate if the subject exist
const subjectExistById = async (id = "") => {
  const findFaculty = await Faculty.find();
  let flag = false;

  findFaculty.map((find) => {
    for (let i = 0; i < find.careers.length; i++) {
      for (let j = 0; j < find.careers[i].subjects.length; j++) {
        if (find.careers[i].subjects[j].id === id) {
          flag = true;
        }
      }
    }
  }
  )

  return flag;
};

// Validate if the subject exist by name
const subjectExistByName = async (name = "") => {
  const findFaculty = await Faculty.find();
  let flag = false;

  findFaculty.map((find) => {
    for (let i = 0; i < find.careers.length; i++) {
      for (let j = 0; j < find.careers[i].subjects.length; j++) {
        if (find.careers[i].subjects[j].name === name) {
          flag = true;
        }
      }
    }
  }
  )

  return flag;
};

// Get subject uv and name by id
const getSubjectById = async (id = "") => {
  const findFaculty = await Faculty.find();
  let subject = {};

  findFaculty.map((find) => {
    for (let i = 0; i < find.careers.length; i++) {
      for (let j = 0; j < find.careers[i].subjects.length; j++) {
        if (find.careers[i].subjects[j].id === id) {
          subject = {
            name: find.careers[i].subjects[j].name,
            uv: find.careers[i].subjects[j].uv,
            year: find.careers[i].subjects[j].year
          }
        }
      }
    }
  })

  return subject;
};

// Validate if the faculty exist
const facultyExistByID = async (id = "") => {
  const facultyExist = await Faculty.findById(id);
  if (!facultyExist) {
    throw new Error(`Faculty ID:${id} does not exist`);
  }
};

module.exports = {
  emailExist,
  userExistByID,
  careerExistByName,
  CareerIdByName,
  subjectExistById,
  subjectExistByName,
  getSubjectById,
  facultyExistByID,
};
