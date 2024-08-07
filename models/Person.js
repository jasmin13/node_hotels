const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the Person schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    enum: ["chef", "waiter", "manager"],
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  salary: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


personSchema.pre('save', async function(next) {
  const person = this;

  // Hash the password only if it has been modified (or is new)
  if (!person.isModified('password')) return next();

  try{

    // hash password generation
    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashedPassword = await bcrypt.hash(person.password, salt);

    // override plain password with hashed password
    person.password = hashedPassword;
    next();
  }
  catch(error){
    console.error("Error hashing password:", error);
    return next(error);
  }
})

personSchema.methods.comparePassword = async function(candidatePassword){
  try{
    // Use bcrypt to compare the provieded password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  }
  catch(error){
    console.error("Error comparing passwords:", error);
    throw error;
  }
}

// Create the Person model
const Person = mongoose.model("Person", personSchema);
module.exports = Person;
