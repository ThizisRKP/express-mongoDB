import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {type : String , required : true},
    password : {type : String , required : true},
    role : { type : String , required : true},
});

export default mongoose.model("User" , userSchema);

// we can say User is model or collection
// here "User" is called model, this model create inside database(mongoDB),main file classDB,
// Here the name was User but in mongodb this model will be => users, capital (U) changes small (u) and (s) was added by default in mongodb
// userScema is a rules thats denotes what kind of object ,we want to create inside the database,
// After we posted our data in database , obeject should ctreate under our scema (rules),
// so, the database have the object but mongoDB bu default generate _id for each objects, its called primary key, when we create id and use it in our database its called forign key (or) secondary key