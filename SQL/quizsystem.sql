-- 1. Create the Database
-- You must execute this line first in MySQL Workbench:
-- CREATE DATABASE QuizSystem;
-- 2. Use the newly created database
Create Database If Not Exists QuizSystem;
USE QuizSystem;
-- 3. Create the Strong Entities
-- Subject/Course (Strong Entity)
-- Stores the 5 subjects: English, Maths, Chemistry, Physics, Biology
CREATE TABLE Subject (
    SubjectID INT PRIMARY KEY AUTO_INCREMENT,
    SubjectName VARCHAR(50) UNIQUE NOT NULL
);
-- Student (Strong Entity - Who attempts the quiz)
CREATE TABLE Student (
    StudentID INT PRIMARY KEY,
    SName VARCHAR(100) NOT NULL,
    -- Store a placeholder password. In a real app, use a strong hash.
    SPassword VARCHAR(50) NOT NULL
);
-- Instructor (Strong Entity - Who manages the quiz)
CREATE TABLE Instructor (
    InstructorID INT PRIMARY KEY AUTO_INCREMENT,
    IName VARCHAR(100) NOT NULL,
    -- Instructor is associated with one course
    SubjectID INT,
    IPassword VARCHAR(50) NOT NULL,
    FOREIGN KEY (SubjectID) REFERENCES Subject(SubjectID)
);
-- Admin (New - For admin management)
CREATE TABLE Admin (
    AdminID INT PRIMARY KEY AUTO_INCREMENT,
    AName VARCHAR(100) NOT NULL,
    APassword VARCHAR(50) NOT NULL
);
-- Question (Strong Entity - The quiz content)
-- Contains the question text, options, and correct answer
CREATE TABLE Question (
    QuestionID INT PRIMARY KEY AUTO_INCREMENT,
    SubjectID INT NOT NULL,
    QuestionText TEXT NOT NULL,
    OptionA VARCHAR(255) NOT NULL,
    OptionB VARCHAR(255) NOT NULL,
    OptionC VARCHAR(255) NOT NULL,
    OptionD VARCHAR(255) NOT NULL,
    CorrectOption CHAR(1) NOT NULL, -- 'A', 'B', 'C', or 'D'
    Difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    FOREIGN KEY (SubjectID) REFERENCES Subject(SubjectID)
);
-- 4. Create the Intermediary Entity
-- QuizAttempt (Strong Entity - Links Student, Subject, and Score)
-- A successful quiz attempt is stored here.
CREATE TABLE QuizAttempt (
    AttemptID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT NOT NULL,
    SubjectID INT NOT NULL,
    AttemptTimestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    Score INT NOT NULL,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (SubjectID) REFERENCES Subject(SubjectID)
);
-- 5. Create the Weak Entity
-- QuestionAttempt (Weak Entity - Depends on QuizAttempt)
-- Tracks the specific questions asked and the student's answer for a single QuizAttempt.
-- The composite key (AttemptID, QuestionID) is its identifier.
CREATE TABLE QuestionAttempt (
    AttemptID INT, -- PK part, FK to QuizAttempt
    QuestionID INT, -- PK part, FK to Question
    StudentAnswer CHAR(1) NULL, -- 'A', 'B', 'C', 'D' or NULL if skipped
    PRIMARY KEY (AttemptID, QuestionID),
    FOREIGN KEY (AttemptID) REFERENCES QuizAttempt(AttemptID) ON DELETE CASCADE,
    FOREIGN KEY (QuestionID) REFERENCES Question(QuestionID)
);
-- 6. Insert Initial Data
-- Subjects (5 Courses)
INSERT INTO Subject (SubjectName) VALUES
('English'),
('Maths'),
('Chemistry'),
('Physics'),
('Biology');
-- Default User Credentials: Student@123 / Admin@123
-- Instructors (Dummy Data)
-- Admin@123 for all instructors
INSERT INTO Instructor (IName, SubjectID, IPassword) VALUES
('Gohar Rehman', 1, 'Proff@123'),
('Haris Saleem', 2, 'Proff@123'),
('Shabbir Ahmad', 3, 'Proff@123'),
('Majid Khan', 4, 'Proff@123'),
('Sadia', 5, 'Proff@123');
-- Admin (Default)
INSERT INTO Admin (AdminID, AName, APassword) VALUES
(111, 'Rashid Cheema', 'Admin@123');
-- 7. Insert 20 Questions for Each Subject (Total 100 Questions)
-- Helper function to get Subject IDs
SET @EnglishID = (SELECT SubjectID FROM Subject WHERE SubjectName = 'English');
SET @MathsID = (SELECT SubjectID FROM Subject WHERE SubjectName = 'Maths');
SET @ChemistryID = (SELECT SubjectID FROM Subject WHERE SubjectName = 'Chemistry');
SET @PhysicsID = (SELECT SubjectID FROM Subject WHERE SubjectName = 'Physics');
SET @BiologyID = (SELECT SubjectID FROM Subject WHERE SubjectName = 'Biology');
-- English Questions (SubjectID = 1) - 20 Questions
INSERT INTO Question (SubjectID, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectOption, Difficulty) VALUES
(@EnglishID, 'Which literary device uses "like" or "as" to compare two unlike things?', 'Metaphor', 'Simile', 'Hyperbole', 'Alliteration', 'B', 'Easy'),
(@EnglishID, 'Identify the plural form of "child".', 'Childs', 'Childrens', 'Children', 'Childern', 'C', 'Easy'),
(@EnglishID, 'What is the main verb in the sentence: "She quickly ran to the store."', 'She', 'quickly', 'ran', 'store', 'C', 'Easy'),
(@EnglishID, 'The word "ubiquitous" means:', 'Rare', 'Present everywhere', 'Confusing', 'Unique', 'B', 'Medium'),
(@EnglishID, 'Who wrote the play "Romeo and Juliet"?', 'Charles Dickens', 'William Shakespeare', 'Jane Austen', 'F. Scott Fitzgerald', 'B', 'Easy'),
(@EnglishID, 'Which of these is a coordinating conjunction?', 'Although', 'Because', 'And', 'While', 'C', 'Medium'),
(@EnglishID, 'Identify the indirect object in: "He gave his friend a book."', 'He', 'friend', 'book', 'gave', 'B', 'Hard'),
(@EnglishID, 'A stanza of four lines is called a:', 'Couplet', 'Tercet', 'Quatrain', 'Octave', 'C', 'Medium'),
(@EnglishID, 'The prefix "un-" means:', 'Again', 'Not', 'Before', 'In favor of', 'B', 'Easy'),
(@EnglishID, 'Correct the sentence: "I went to the store, and bought milk."', 'I went to the store and bought milk.', 'I went to the store; bought milk.', 'I went to the store. And bought milk.', 'No change needed.', 'A', 'Medium'),
(@EnglishID, 'What is the synonym for "benevolent"?', 'Wicked', 'Kind', 'Angry', 'Sad', 'B', 'Easy'),
(@EnglishID, 'Which sentence uses a semicolon correctly?', 'I like apples; and bananas.', 'It was raining; therefore, we stayed inside.', 'She is smart; talented.', 'They went home; they were tired.', 'B', 'Medium'),
(@EnglishID, 'What type of poem is a sonnet?', 'Long narrative', '14-line lyric', 'Free verse', 'Haiku', 'B', 'Medium'),
(@EnglishID, 'The term for a recurring symbol in a literary work is:', 'Theme', 'Plot', 'Motif', 'Setting', 'C', 'Hard'),
(@EnglishID, 'What is an antonym for "ephemeral"?', 'Temporary', 'Lasting', 'Fleeting', 'Swift', 'B', 'Hard'),
(@EnglishID, 'Identify the part of speech: "Beautifully"', 'Noun', 'Adjective', 'Adverb', 'Verb', 'C', 'Easy'),
(@EnglishID, 'Which punctuation mark is used to indicate possession?', 'Comma', 'Apostrophe', 'Hyphen', 'Colon', 'B', 'Easy'),
(@EnglishID, 'A novel told in the form of letters is an:', 'Picaresque', 'Epistolary', 'Gothic', 'Bildungsroman', 'B', 'Hard'),
(@EnglishID, 'What is the passive voice of "The dog chases the ball"?', 'The ball is chased by the dog.', 'The ball was chased by the dog.', 'The dog is chasing the ball.', 'The ball chased the dog.', 'A', 'Medium'),
(@EnglishID, 'Which is correct: "Less people" or "Fewer people"?', 'Less people', 'Fewer people', 'Both are correct', 'Neither is correct', 'B', 'Medium');
-- Maths Questions (SubjectID = 2) - 20 Questions
INSERT INTO Question (SubjectID, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectOption, Difficulty) VALUES
(@MathsID, 'What is the value of 5! (5 factorial)?', '10', '25', '120', '50', 'C', 'Easy'),
(@MathsID, 'What is the square root of 144?', '10', '12', '14', '11', 'B', 'Easy'),
(@MathsID, 'If 2x + 5 = 15, what is the value of x?', '5', '10', '2.5', '7.5', 'A', 'Easy'),
(@MathsID, 'How many sides does a hexagon have?', '5', '6', '7', '8', 'B', 'Easy'),
(@MathsID, 'What is the next number in the sequence: 2, 4, 8, 16, ...?', '24', '30', '32', '64', 'C', 'Easy'),
(@MathsID, 'Calculate 1/3 + 1/6.', '1/2', '2/9', '1/3', '3/6', 'A', 'Medium'),
(@MathsID, 'If a circle has a radius of 4, what is its area? (use π)', '8π', '16π', '4π', '2π', 'B', 'Medium'),
(@MathsID, 'Solve for x: (x - 3)(x + 2) = 0', '3 and -2', '3 and 2', '-3 and 2', '-3 and -2', 'A', 'Medium'),
(@MathsID, 'What is the slope of the line y = 3x - 5?', '-5', '3', '0', '1', 'B', 'Easy'),
(@MathsID, 'In a right triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides. What theorem is this?', 'Euclidean', 'Pythagorean', 'Bernoulli', 'Newtonian', 'B', 'Easy'),
(@MathsID, 'What is the probability of rolling a 3 on a standard six-sided die?', '1/6', '1/3', '1/2', '1/5', 'A', 'Easy'),
(@MathsID, 'Simplify: 3a + 5b - a + 2b', '2a + 7b', '4a + 7b', '3a + 7b', '2a + 3b', 'A', 'Easy'),
(@MathsID, 'What is the formula for circumference of a circle?', 'πr²', '2πr', 'πd²', 'r/2', 'B', 'Medium'),
(@MathsID, 'If the price of a shirt is $20 and it is discounted by 25%, what is the final price?', '$15', '$5', '$18', '$10', 'A', 'Medium'),
(@MathsID, 'What is the log base 10 of 100?', '1', '10', '2', '100', 'C', 'Medium'),
(@MathsID, 'How many degrees are in a straight angle?', '90°', '180°', '360°', '45°', 'B', 'Easy'),
(@MathsID, 'A function f(x) = x² is an example of what type of function?', 'Linear', 'Quadratic', 'Cubic', 'Exponential', 'B', 'Easy'),
(@MathsID, 'Find the median of the set {1, 5, 2, 8, 4}.', '4', '5', '2', '8', 'A', 'Medium'),
(@MathsID, 'What is the reciprocal of 7?', '0.7', '-7', '1/7', '7/1', 'C', 'Easy'),
(@MathsID, 'If two lines are parallel, what is true about their slopes?', 'They are opposite reciprocals', 'They are equal', 'They multiply to -1', 'The product is 1', 'B', 'Medium');
-- Chemistry Questions (SubjectID = 3) - 20 Questions
INSERT INTO Question (SubjectID, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectOption, Difficulty) VALUES
(@ChemistryID, 'What is the chemical symbol for water?', 'Wo', 'H2O', 'H', 'Wt', 'B', 'Easy'),
(@ChemistryID, 'The pH of an acidic solution is:', 'Exactly 7', 'Less than 7', 'Greater than 7', '14', 'B', 'Easy'),
(@ChemistryID, 'What is the lightest element?', 'Oxygen', 'Hydrogen', 'Helium', 'Carbon', 'B', 'Easy'),
(@ChemistryID, 'Which of the following is a noble gas?', 'Oxygen', 'Chlorine', 'Neon', 'Nitrogen', 'C', 'Easy'),
(@ChemistryID, 'The process of a solid turning directly into a gas is called:', 'Melting', 'Evaporation', 'Sublimation', 'Condensation', 'C', 'Medium'),
(@ChemistryID, 'What is the main component of natural gas?', 'Propane', 'Butane', 'Methane', 'Ethane', 'C', 'Medium'),
(@ChemistryID, 'The bond in NaCl (table salt) is primarily:', 'Covalent', 'Ionic', 'Metallic', 'Hydrogen', 'B', 'Medium'),
(@ChemistryID, 'What does the term "stoichiometry" refer to?', 'Study of light', 'Study of matter composition', 'Calculation of reactants and products', 'Study of organic compounds', 'C', 'Hard'),
(@ChemistryID, 'How many protons does an atom of Carbon (C) have?', '6', '12', '14', '8', 'A', 'Easy'),
(@ChemistryID, 'What is the formula for ozone?', 'O', 'O2', 'O3', 'CO2', 'C', 'Easy'),
(@ChemistryID, 'Which instrument is used to measure the volume of a liquid?', 'Balance', 'Thermometer', 'Beaker', 'Graduated cylinder', 'D', 'Easy'),
(@ChemistryID, 'What type of reaction absorbs heat?', 'Exothermic', 'Endothermic', 'Combustion', 'Synthesis', 'B', 'Medium'),
(@ChemistryID, 'Who is known as the father of modern chemistry?', 'Boyle', 'Dalton', 'Lavoisier', 'Mendeleev', 'C', 'Hard'),
(@ChemistryID, 'In the periodic table, what are the vertical columns called?', 'Periods', 'Rows', 'Blocks', 'Groups', 'D', 'Easy'),
(@ChemistryID, 'The maximum number of electrons in the second energy shell (n=2) is:', '2', '8', '18', '32', 'B', 'Medium'),
(@ChemistryID, 'What is the common name for sodium bicarbonate (NaHCO₃)?', 'Table salt', 'Baking soda', 'Lye', 'Vinegar', 'B', 'Easy'),
(@ChemistryID, 'A catalyst is used to:', 'Stop a reaction', 'Slow down a reaction', 'Change the products', 'Speed up a reaction', 'D', 'Easy'),
(@ChemistryID, 'Which of these metals is the most reactive?', 'Gold', 'Copper', 'Potassium', 'Silver', 'C', 'Hard'),
(@ChemistryID, 'What is the molar mass of H₂O (approx.)?', '16 g/mol', '18 g/mol', '1 g/mol', '17 g/mol', 'B', 'Easy'),
(@ChemistryID, 'The oxidation state of Oxygen in most compounds is:', '-1', '-2', '+1', '+2', 'B', 'Medium');
-- Physics Questions (SubjectID = 4) - 20 Questions
INSERT INTO Question (SubjectID, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectOption, Difficulty) VALUES
(@PhysicsID, 'What is the SI unit of force?', 'Joule', 'Watt', 'Newton', 'Pascal', 'C', 'Easy'),
(@PhysicsID, 'The acceleration due to gravity on Earth is approximately:', '9.8 m/s', '9.8 m/s²', '10 m/s', '9.0 m/s²', 'B', 'Easy'),
(@PhysicsID, 'Which term describes resistance to change in motion?', 'Velocity', 'Momentum', 'Inertia', 'Force', 'C', 'Easy'),
(@PhysicsID, 'What is the speed of light in a vacuum (approx.)?', '3 x 10⁸ m/s', '3 x 10⁶ m/s', '3 x 10⁵ m/s', '3 x 10⁷ m/s', 'A', 'Medium'),
(@PhysicsID, 'Who developed the theory of relativity?', 'Isaac Newton', 'Galileo Galilei', 'Albert Einstein', 'Nikola Tesla', 'C', 'Easy'),
(@PhysicsID, 'What is the unit of electrical resistance?', 'Volt', 'Ampere', 'Ohm', 'Coulomb', 'C', 'Medium'),
(@PhysicsID, 'The energy stored in a stretched spring is what type of energy?', 'Kinetic', 'Thermal', 'Potential', 'Chemical', 'C', 'Medium'),
(@PhysicsID, 'What is the phenomenon responsible for the bending of light when it passes from air to water?', 'Reflection', 'Diffraction', 'Refraction', 'Dispersion', 'C', 'Easy'),
(@PhysicsID, 'According to the formula F=ma, if mass is constant, force is directly proportional to:', 'Velocity', 'Acceleration', 'Time', 'Distance', 'B', 'Easy'),
(@PhysicsID, 'How many laws of motion did Isaac Newton formulate?', 'One', 'Two', 'Three', 'Four', 'C', 'Easy'),
(@PhysicsID, 'What is a transverse wave?', 'Vibrations parallel to direction of travel', 'Vibrations perpendicular to direction of travel', 'A sound wave', 'A standing wave', 'B', 'Medium'),
(@PhysicsID, 'What is the SI unit for electric current?', 'Ohm', 'Volt', 'Watt', 'Ampere', 'D', 'Easy'),
(@PhysicsID, 'When a falling object reaches terminal velocity, its acceleration is:', 'Equal to gravity', 'Zero', 'Maximum', 'Negative', 'B', 'Hard'),
(@PhysicsID, 'What is a quantum?', 'The largest unit of energy', 'A discrete packet of energy', 'A continuous wave', 'A type of atom', 'B', 'Hard'),
(@PhysicsID, 'Which color of visible light has the longest wavelength?', 'Violet', 'Green', 'Blue', 'Red', 'D', 'Medium'),
(@PhysicsID, 'What is the magnetic field created by a current-carrying wire called?', 'Lenz field', 'Electromagnetism', 'Solenoid', 'Induced current', 'B', 'Medium'),
(@PhysicsID, 'The rate at which work is done is called:', 'Energy', 'Force', 'Power', 'Momentum', 'C', 'Easy'),
(@PhysicsID, 'What is sound intensity measured in?', 'Hertz', 'Decibels', 'Meters', 'Watts', 'B', 'Easy'),
(@PhysicsID, 'A transformer is used to change:', 'Frequency', 'Current', 'Voltage', 'Resistance', 'C', 'Medium'),
(@PhysicsID, 'The fundamental particle that carries the strong nuclear force is the:', 'Electron', 'Neutrino', 'Gluon', 'Photon', 'C', 'Hard');
-- Biology Questions (SubjectID = 5) - 20 Questions
INSERT INTO Question (SubjectID, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectOption, Difficulty) VALUES
(@BiologyID, 'What is the powerhouse of the cell?', 'Nucleus', 'Mitochondria', 'Ribosome', 'Vacuole', 'B', 'Easy'),
(@BiologyID, 'What is the process by which plants make their own food?', 'Respiration', 'Photosynthesis', 'Transpiration', 'Fermentation', 'B', 'Easy'),
(@BiologyID, 'Which of the following is the largest organ in the human body?', 'Heart', 'Brain', 'Liver', 'Skin', 'D', 'Easy'),
(@BiologyID, 'The primary function of red blood cells is to:', 'Fight infection', 'Clot blood', 'Transport oxygen', 'Produce antibodies', 'C', 'Easy'),
(@BiologyID, 'What structure in a plant cell contains chlorophyll?', 'Mitochondria', 'Cell wall', 'Chloroplast', 'Cytoplasm', 'C', 'Easy'),
(@BiologyID, 'What is the building block of proteins?', 'Lipids', 'Amino acids', 'Nucleic acids', 'Carbohydrates', 'B', 'Medium'),
(@BiologyID, 'The study of heredity and the variation of inherited characteristics is called:', 'Ecology', 'Anatomy', 'Genetics', 'Botany', 'C', 'Medium'),
(@BiologyID, 'Which scientist is known as the "Father of Genetics"?', 'Charles Darwin', 'Gregor Mendel', 'Louis Pasteur', 'Robert Hooke', 'B', 'Medium'),
(@BiologyID, 'In which part of the human body is insulin produced?', 'Liver', 'Kidney', 'Pancreas', 'Stomach', 'C', 'Medium'),
(@BiologyID, 'What is the role of DNA?', 'Produce energy', 'Store genetic information', 'Pump blood', 'Break down food', 'B', 'Easy'),
(@BiologyID, 'What is the process of cell division that results in two identical daughter cells?', 'Meiosis', 'Mitosis', 'Fertilization', 'Mutation', 'B', 'Medium'),
(@BiologyID, 'Which gas do plants primarily absorb from the atmosphere?', 'Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Methane', 'C', 'Easy'),
(@BiologyID, 'The habitat of an organism is:', 'Its role in the environment', 'The environment where it lives', 'How it finds food', 'Its relationship with other organisms', 'B', 'Easy'),
(@BiologyID, 'Which organelle is responsible for synthesizing proteins?', 'Golgi apparatus', 'Endoplasmic reticulum', 'Ribosome', 'Lysosome', 'C', 'Hard'),
(@BiologyID, 'What is the term for a sugar found in milk?', 'Fructose', 'Glucose', 'Sucrose', 'Lactose', 'D', 'Easy'),
(@BiologyID, 'Which vitamin is synthesized by the skin upon exposure to sunlight?', 'Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin E', 'C', 'Easy'),
(@BiologyID, 'The longest bone in the human body is the:', 'Humerus', 'Tibia', 'Femur', 'Fibula', 'C', 'Medium'),
(@BiologyID, 'What is the primary function of the nervous system?', 'Digestion', 'Movement', 'Communication and control', 'Reproduction', 'C', 'Easy'),
(@BiologyID, 'What are organisms that cannot make their own food called?', 'Autotrophs', 'Producers', 'Heterotrophs', 'Consumers', 'C', 'Medium'),
(@BiologyID, 'The genetic code is read in groups of three bases called:', 'Genes', 'Chromosomes', 'Codons', 'Alleles', 'C', 'Hard');