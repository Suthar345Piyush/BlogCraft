const {mongoose , model , Schema} = require("mongoose");
const { createHmac , randomBytes} = require('crypto');
const { createTokenForUser } = require("../services/authentication");

const userSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      // required : true,
    },
    email:{
      type: String,
      required : true,
      unique : true,
    },
    salt :{
      type : String,
    },
    password:{
      type: String,
      required : true,
    },
    profileImageUrl:{
      type: String,
      default: "/images/avatar.png",
    },
    role : {
      type: String,
      enum : ["USER" , "ADMIN"],
      default : "USER",
    }
  },
  {timestamps : true}
);

userSchema.pre("save" , function (next) {
  const user = this;

  if(!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256" , salt)
     .update(user.password)
     .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
     
  next();
});

// Corrected matchPasswordAndGenerateToken method
userSchema.static("matchPasswordAndGenerateToken" , async function(email , password){
   const user = await this.findOne({email});
   if(!user) throw new Error("User not found");

   const salt = user.salt;
   const hashedPassword = user.password;
  
   // Fix: Use the password parameter instead of user.password
   const userProvidedHash = createHmac("sha256" , salt)
      .update(password)  // Changed from user.password to password
      .digest("hex");

   if(hashedPassword !== userProvidedHash){
     // Fix: Use throw instead of console.log and return
     throw new Error("Wrong Password");
   }

   // Generate and return token if password matches
   const token = createTokenForUser(user);
   return token;
});

const User = model('user' , userSchema);

module.exports = User;