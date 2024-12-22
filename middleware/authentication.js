//here  we make  a  generic middleware which check every user is  authenticated or not 

//making  a  generic  function 
const {validateToken} = require("../services/authentication");

function checkForAuthenticationCookie(cookieName){
  return (req , res , next) =>{
    const tokenCookieValue = req.cookies[cookieName];
    if(!tokenCookieValue){
      return next();
    }

    try{
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error){}
     return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
}