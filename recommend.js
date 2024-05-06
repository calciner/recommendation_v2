// Setup constants for course numbers.
const Astronomy = 0;
const BasicsOfCoding = 1;
const Biochemistry = 2;
const Chemistry = 3;
const Circuits = 4;
const EnvironmentalScience = 5;
const Psychology = 6;
const Zoology = 7;
const Statistics = 8;

// Setup groups.
const groupOfScience = [Astronomy, BasicsOfCoding, Chemistry, Circuits, EnvironmentalScience];
const groupOfLife = [Biochemistry, Zoology, EnvironmentalScience, Chemistry];
const groupOfData = [BasicsOfCoding, Statistics, Psychology, EnvironmentalScience];

// Setup course data.
// Refer Number : [is two types of class (boolean), number of classes (int), prefix name (string), postfix name (string)]
var data = {
    [Astronomy]: [true, 4, "Astrovid", ""], // Astronomy
    [BasicsOfCoding]: [true, 4, "Bc", ""], // Basics of Coding
    [Biochemistry]: [false, 2, "Bio", ""], // Biochemistry
    [Chemistry]: [false, 4, "Chem", ""], // Chemistry
    [Circuits]: [true, 3, "Circuit", ""], // Circuits
    [EnvironmentalScience]: [false, 4, "Es", "s"], // Environmental Science ***only have student version
    [Psychology]: [true, 4, "Psych", ""], // Psychology
    [Zoology]: [true, 5, "Zoo", ""], // Zoology
    [Statistics]: [true, 5, "Stat", ""] // Statistics
};

// Example of accessing the data for Chemistry
console.log(data[Chemistry]); // Output: [false, 4, "Chem", ""]


// Function to add one course to the relationship set to ensure no repeats.
function addCourseToSet(rSet, group, courseNum) {
    if (group.includes(courseNum)) {
        group.forEach(k => {
            if (k !== courseNum) {
                rSet.add(k);
            }
        });
    }
}

// // Initialize an object to collect all courses that have a relationship with the target course.
// var relation = {};

// // Assuming 'data' is an object with courses as keys
// Object.keys(data).forEach(i => {
//     const relationSet = new Set();
//     addCourseToSet(relationSet, groupOfScience, Number(i));
//     addCourseToSet(relationSet, groupOfLife, Number(i));
//     addCourseToSet(relationSet, groupOfData, Number(i));
//     relation[i] = Array.from(relationSet); // Convert set to array for easier usage in JavaScript.
// });

// Example of logging the relations object to see the relationships
// console.log(relation);


//****************************** */
// 
//  set history to a tuple, store the direction of visit next video
// 
//
//******************************* */

// Function to simulate watch history based on the number of classes
function createWatchHistory(data) {
    const watchHistory = {};

    for (let course in data) {
        const numberOfWatches = data[course][1];
        watchHistory[course] = [];

        // Simulate each watch by pushing a string that represents a "watch" event
        for (let i = 1; i <= numberOfWatches; i++) {
            let randomN = Math.random();
            if(randomN > 0.5){
                watchHistory[course].push(false);
            }else{
                watchHistory[course].push(true);
            }
            
        }
    }

    return watchHistory;
}



// Generate watch history from the data
var watchHistory = createWatchHistory(data);

console.log(watchHistory);

function separateString(input) {
    console.log("input:",input);
    // Regular expression to match the parts of the string:
    // - \D+ matches one or more non-digit characters at the beginning.
    // - \d+ matches one or more digit characters.
    // - \D* matches zero or more non-digit characters at the end (optional).
    const regex = /^(\D+)(\d+)(\D*)$/;

    // Apply the regex to the input string to extract parts.
    const match = input.match(regex);

    if (match) {
        // Extract the parts using the captured groups
        const [_, letters, numbers, suffix] = match;
        return { letters, numbers, suffix: suffix || '' }; // Use empty string if suffix is undefined
    } else {
        // Return a default format if the string doesn't match the expected pattern
        return { letters: input, numbers: '', suffix: '' };
    }
}

// Example usage
// const examples = ["Astrovid3s", "Astrovid3", "Bc20"];
// examples.forEach(example => {
//     const separated = separateString(example);
//     console.log(`Input: ${example}, Output:`, separated);
// });

function getYetWatchedLessen(courseNum){
    for(let i=0;i<data[courseNum][1];i++){
        if(watchHistory[courseNum][i] == false){
            return i+1;
        }
    }
    return 0;
}

function randomLizeArrayElement(relation){
    return relation.sort(()=> Math.random - 0.5);
}

function getRelationship(courseNum) {
    let relation = [];
    const relationSet = new Set();
    addCourseToSet(relationSet, groupOfScience, courseNum);
    addCourseToSet(relationSet, groupOfLife, courseNum);
    addCourseToSet(relationSet, groupOfData, courseNum);
    // console.log(relationSet);
    relation = Array.from(relationSet); 
    let notInRelation = [];
    Object.keys(data).forEach(i => {
        if (relation.includes(Number(i)) || Number(i) == courseNum) {
            return;
        } else {
            notInRelation.push(Number(i)); 
        }
    });
    relation = randomLizeArrayElement(relation);
    notInRelation = randomLizeArrayElement(notInRelation);
    return {relation, notInRelation};
}

//bug here, if suffix is none and data[course][0] is true
//******************************************* */
function getENCourseName(course,lesson,suffix){
    if(data[course][0] == true){
        return data[course][2] + String(lesson) + suffix;
    }else{
        return data[course][2] + String(lesson) + data[course][3];
    }
}


function getRecommentList(lessen){
    let courseInfo = separateString(lessen);
    let courseN = 0;
    Object.keys(data).forEach(i =>{
        // console.log(i,data[i][2],courseInfo["letters"]);
        if(data[i][2] == courseInfo["letters"]){
            courseN = Number(i);
            return;
        } 
    });
    let temp = getRelationship(courseN);
    console.log(temp);
    let relation = temp["relation"];
    let notInRelation = temp["notInRelation"]
    // console.log(relation);
    // console.log(notInRelation);
    RecList = {};
    let count = 0;
    let tempRecomendCourese = 0;
    while(count < 5 && relation.length > 0){
        tempRecomendCourese = relation.pop();
        result  = getYetWatchedLessen(tempRecomendCourese);
        if(result == 0) {continue;}
        else {
            RecList[count] = getENCourseName(tempRecomendCourese,result,courseInfo["suffix"]);
            count++;
            
        }
    }

    while(count < 5 && notInRelation.length > 0){
        tempRecomendCourese = notInRelation.pop();
        result  = getYetWatchedLessen(tempRecomendCourese);
        if(result == 0) {continue;}
        else {
            RecList[count] = getENCourseName(tempRecomendCourese,result,courseInfo["suffix"]);
            count++;
        }
    }
    while(count < 5){
        let restCourse = [];
        Object.keys(data).forEach(i => {
            if (RecList.includes(Number(i)) || Number(i) == courseN) {
                return;
            } else {
                restCourse.push(Number(i)); 
            }
        });
        restCourse = randomLizeArrayElement(restCourse);
        tempRecomendCourese = restCourse.pop();
        result  = 1;
        RecList[count] = getENCourseName(tempRecomendCourese,result,courseInfo["suffix"]);
        count++
    }

    return RecList;
    
}
// xx = getRecommentList("Bc2",data);
// console.log(`Input: Bc20, Output:`, xx);
console.log("=========================");
console.log("test");
console.log("=========================");
let count = 15;
let list = getRecommentList("Astrovid3s");
console.log("output:",list);
console.log("\n\n");

while(count > 0){
    var randomNumber = Math.floor(Math.random() * 5);
    console.log("pick:",randomNumber);
    list = getRecommentList(list[randomNumber]);
    console.log("output:",list);
    console.log("\n\n");
    count--;
}

