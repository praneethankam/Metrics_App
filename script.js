document.addEventListener('DOMContentLoaded',function(){

const searchButton = document.getElementById("search-btn"); 
const usernameInput = document.getElementById("username"); 
const statsContainer = document.querySelector(".stats-container"); 
const easyProgressCircle = document.querySelector(".easy-progress"); 
const mediumProgressCircle = document.querySelector(".medium-progress"); 
const hardProgressCircle = document.querySelector(".hard-progress"); 
const easyLabel = document.getElementById("easy-label"); 
const mediumLabel = document.getElementById("medium-label"); 
const hardLabel = document.getElementById("hard-label"); 
const cardStatsContainer = document.querySelector(".stats-cards");
alert('use lakshayk12 as username')

function ValidateUserName(username){
    if(username.trim()===''){
        alert('USERNAME should not be empty')
        return false
    }
    const regex = /^[a-zA-Z0-9_-]{3,16}$/;
    const ismatching = regex.test(username)
    if(!ismatching){
        alert('INVALID USERNAME') 
    }
    return ismatching;
}

function updateprogress(total,solved,circle,label){
    const perc = (solved/total)*100;
    
    circle.style.setProperty('--progress-degree',`${perc}%`)
    label.textContent  = `${solved}/${total}`
}

function displayuserdata(parseddata){
    const totalques = parseddata.data.allQuestionsCount[0].count
    const totalEasyques = parseddata.data.allQuestionsCount[1].count
    const totalMediumques = parseddata.data.allQuestionsCount[2].count
    const totalHardques = parseddata.data.allQuestionsCount[3].count

    const totalsolvedques = parseddata.data.matchedUser.submitStats.acSubmissionNum[0].count
    const totalsolvedEasyques = parseddata.data.matchedUser.submitStats.acSubmissionNum[1].count
    const totalsolvedMediumques = parseddata.data.matchedUser.submitStats.acSubmissionNum[2].count
    const totalsolvedHardques = parseddata.data.matchedUser.submitStats.acSubmissionNum[3].count
    
    updateprogress(totalEasyques,totalsolvedEasyques,easyProgressCircle,easyLabel)
    updateprogress(totalMediumques,totalsolvedMediumques,mediumProgressCircle,mediumLabel)
    updateprogress(totalHardques,totalsolvedHardques,hardProgressCircle,hardLabel)

    const cardsdata = [{label:'Overall Submissions', value: parseddata.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
    {label:'Overall Easy Submissions', value: parseddata.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
    {label:'Overall Medium Submissions', value: parseddata.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
    {label:'Overall Hard Submissions', value: parseddata.data.matchedUser.submitStats.totalSubmissionNum[3].submissions}]

    console.log(cardsdata)
    cardStatsContainer.innerHTML=cardsdata.map(data=>
        `<div class="card"> 
        <h3>${data.label}</h3>
        <p>${data.value}</p>
        </div>`
    ).join('')
    
}    
async function getuserdata(username){
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    const url='https://leetcode.com/graphql/';
    const graphql = JSON.stringify({ query: "\n query userSessionProgress($username: String!) {\n allQuestionsCount {\n difficulty\n count\n }\n matchedUser (username: $username) {\n submitStats {\n acSubmissionNum {\n difficulty\n count\n submissions\n } \ntotalSubmissionNum {\n difficulty\n count\n submissions\n }\n }\n }\n}\n ",
     variables: { "username": `${username}` }
    }) 
    const options = {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:graphql,
        redirect:"follow"

    }
   try{
    searchButton.textContent='searching...'
    searchButton.disabled= true
   
    cardStatsContainer.style.setProperty('display',"none")
    statsContainer.style.setProperty('display','none')

    

    const response = await fetch(proxyurl + url,options)
    if(!response.ok){
        throw new Error('unable to fetch ')
        
    }
  
    const parseddata =await response.json()
    console.log('data found',parseddata)
    displayuserdata(parseddata)
   }
   catch(error){
    cardStatsContainer.innerHTML=`<p>${error.message}</p>`
   }
   finally{
    searchButton.textContent ='search'
    searchButton.disabled = false
    cardStatsContainer.style.setProperty('display',"flex")
    statsContainer.style.setProperty('display','block')
   }

}

searchButton.addEventListener('click',function(){
    const username = usernameInput.value
    console.log(username)
    if(ValidateUserName(username)){
        getuserdata(username)
    }
})

})