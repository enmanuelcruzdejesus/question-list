import React,{useState, useEffect} from 'react';
import './QuestionList.css'

const QUESTIONS_API_BASE_URL = 'http://localhost:5000/questions';
const SUBMISSIONS_API_BASE_URL = 'http://localhost:5000/submissions';

export default function QuestionList() {
  // Write your code here.
  const[questions, setQuestions]   = useState([]);
  const [submissions , setSubmissions] = useState([]);
  const questionsByCategory = getQuestionsByCategory(questions);
  const submissionsByQuestion = getSubByQuestion(submissions);
  const categories = Object.keys(questionsByCategory);


  //didMount lifecycle
  useEffect( ()=>{
    const fetchData = async() =>{
        const questionResponse = await fetch(QUESTIONS_API_BASE_URL);
        const questionObj = await questionResponse.json();
        
        setQuestions(questionObj);
      
        const submissionResponse = await fetch(SUBMISSIONS_API_BASE_URL);
        const submissionObj= await submissionResponse.json();
      
        setSubmissions(submissionObj);


        //DOING transformation 
      
    };
    fetchData();
  
  },[]);

  return (
    <>
      {
         categories.map(category =>(
              <Category  key={category} 
                         category={questionsByCategory[category]} 
                         submissionsByQuestion={submissionsByQuestion}/>
         ))
      }
    </>
  );
}

function Category({category, submissionsByQuestion}){
   let total = category.questions.length;
   let subs = category.questions.reduce((accum, question) => {
       if(submissionsByQuestion[question.id]?.status === 'CORRECT'){
         return accum  + 1;
       }
       return accum;
   },0)

   return (
     <>
      <div className="category" >
          <h2>{category.name}-{subs}/{total}</h2>
          {
            category.questions.map(q => (

              <Question key={q} 
                        question={q}
                        submissionsByQuestion={submissionsByQuestion}/>
            ))
          }
      </div>
     </>
   )
}

function Question({question,submissionsByQuestion}){
    const sub = submissionsByQuestion[question.id];
    let status = sub ? sub.status : '';

    if(status === 'CORRECT') {
      status = 'status correct';
    }
    else if (status === 'INCORRECT'){
       status = 'status incorrect';
    }
    else if(status === 'PARTIALLY_CORRECT'){
       status = 'status partially-incorrect';
    }
    else{
      status = 'status unattempted';
    }

   
    return(
      <>
        <div className="question">
           <div className={status}> </div>
           <h3>{question.name}</h3>
        </div>
      </>
    )
}

function  getQuestionsByCategory(questions){
    const map  = {}
    questions.forEach((question)=>{
        if(!map.hasOwnProperty(question.category)){
            const obj = {};
            obj.name = question.category;
            obj.questions = [];
            map[question.category] = obj;
        }
      
      map[question.category].questions.push(question);
    });
  
    return map;
              
}


function getSubByQuestion(submissions){
   
   let subMap = {}
   submissions.forEach(sub =>{
     subMap[sub.questionId] = sub;
   });

   return subMap;
}

