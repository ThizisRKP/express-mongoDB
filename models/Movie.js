import mongoose from "mongoose";
const movieSchema = new mongoose.Schema({
    name : {type : String , required : true},
    genre : {type : String , required : true},
    director : {type : String , required : true},
    leadActor: { type: String, required: true },
    leadActress: { type: String, required: true },
    rating: { type: Number, min: 0, max: 10, required: true },
    imageUrl : {type : String,required : true},
    yearOfRealease : {type : String , required : true},
})

  export default mongoose.model("Movie",movieSchema)