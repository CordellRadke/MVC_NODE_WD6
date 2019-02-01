const express = require('express');
const router = express.Router();
const expressValidator = require('express-validator');
router.use(expressValidator());
const path = require('path');
const mongoose = require('mongoose');
const GRADES = mongoose.model('Grade');


router.get('/', (req, res, next) => {
   
    GRADES.find()
    .populate('students')
    .exec((err, students)=>{
        console.log('?????')
        console.log(students)
        res.render('student/list', {
            list: students
        });
    })
});

router.post('/', (req, res) => {
    if (req.body._id == ''){
    console.log('student posted.');
        insertRecord(req, res);
    }else{
        console.log('student updated');
        updateRecord(req, res);
        }
});

router.post('/:id', (req, res) => {
 
        console.log('Updating...');
        updateRecord(req, res);
            
});

//****UPDATE STUDENT RECORD******/
function updateRecord(req, res) {
  
        //avoid validation errors
    req.body.percent = parseInt(req.body.percent);
    if(Number.isInteger(req.body.percent)){
        if(req.body.percent === null || req.body.percent == ""){
            req.body.percent = 0;
        }
        if(req.body.percent > 100){
            req.body.percent = 100;
        }
      } else{
        //req.body.percent = 0;
        req.checkBody('percent', 'Percentage must be a number').isDecimal();
      }

      console.log("***********");
      console.log(req.body);
      console.log("***********");

      let GRADES = mongoose.model('Grade');

        //VALIDATE
        req.checkBody('fullName', 'Name can not be empty').notEmpty();
      GRADES.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, student) =>{
          // update grade
          let letterGrade = "A";
          console.log(`Attempting to get letter grade for ${req.body.percent}`);
          if(req.body.percent > -1 && req.body.percent <= 100){
              console.log(`inside assigning letterGrade`);
              // assign grade
              let val = Math.floor(req.body.percent)
              if (val >= 90){
                letterGrade = "A";
            } else if (val <= 89 && val >= 80){
                letterGrade = "B";
            } else if (val <= 79 && val >= 70){
                letterGrade = "C";
            } else if (val <= 69 && val >= 60){
                letterGrade = "D";
            } else if (val < 60){
                letterGrade = "F";   
            } 
          }
        
          const errors = req.validationErrors();
            if (errors) { 

                res.redirect("/");
                
            } else{
                student.studentlettergrade = letterGrade;
                student.studentname = req.body.fullName;
                student.studentpercent = req.body.percent;
               
                console.log(`this is the student *****************`);
                console.log(student);
                console.log(`********************************`);
                
                student.save(err =>{
                    console.log("trying to save a grade")
                    if(err) throw err;
                    console.log("Grade saved successfully")
                    res.redirect('/');
                }) 
            }
      })
    
    
}


//****ADD STUDENT RECORD******/
function insertRecord(req, res, next){
    console.log('Attempting to create item');
    console.log(req.body);
    
     //avoid validation errors
     req.body.percent = parseInt(req.body.percent);
     if(Number.isInteger(req.body.percent)){
         if(req.body.percent === null || req.body.percent == ""){
             req.body.percent = 0;
         }
         if(req.body.percent > 100){
             req.body.percent = 100;
         }
       } else{
         //req.body.percent = 0;
         req.checkBody('percent', 'Percentage must be a number').isDecimal();
       }
   

    let letterGrade = "A";
    console.log(`Attempting to get letter grade for ${req.body.percent}`);
     //VALIDATE
     req.checkBody('fullName', 'Name can not be empty').notEmpty();
    if(req.body.percent > -1 && req.body.percent <= 100){
        console.log('inside assigning letter grade');
        // Assign grade
        let val = Math.floor(req.body.percent)
        if (val >= 90){
            letterGrade = "A";
        } else if (val <= 89 && val >= 80){
            letterGrade = "B";
        } else if (val <= 79 && val >= 70){
            letterGrade = "C";
        } else if (val <= 69 && val >= 60){
            letterGrade = "D";
        } else if (val < 60){
            letterGrade = "F";   
        } 
    }

    const errors = req.validationErrors();
    if (errors) { 
        res.render('student/list', {errors})
    } else{
        // if valid create student and save
        let GRADE = mongoose.model('Grade')
        let myGrade = new GRADE({
            studentname: req.body.fullName,
            studentpercent: req.body.percent,
            studentlettergrade: letterGrade
        })
        console.log(myGrade);
        myGrade.save(err =>{
            console.log("trying to save a grade")
            if(err) throw err;
            console.log("Grade saved successfully")
            res.redirect('/');
        }) 
    }
};



router.get("/delete/:id", (req, res, next) =>{
    let GRADES = mongoose.model('Grade');
    GRADES.findByIdAndRemove(req.params.id, (err, students) =>{
        if(!err){
            res.redirect('/');
        }
        else{
            console.log('Error in Student delete:' + err);
        }
    })
})

router.get('/:id', (req, res, next) =>{

    let GRADES = mongoose.model('Grade')
    GRADES.findById(req.params.id, (err, students) => {
        if (!err) {
            res.render("student/edit", {
                viewTitle: "Update Student",
                student: students
            });
        }
    });

})



module.exports = router;

