import express from "express";
import bcryt from "bcryptjs";
import Movie from "../models/Movie.js"

const router = express.Router();

router.get("/api/movies", async (req,res)=>{
  try{
    const { name,
            genre,
            director,
            leadActor,
            leadActress,
            rating,
            imageUrl,
            yearOfRealease,
            limit,
          } = req.query;

    const allowedQueries = [
      "name",
      "genre",
      "director",
      "leadActor",
      "leadActress",
      "rating",
      "imageUrl",
      "yearOfRealease",
      "limit",];
    
    
    const unknownQuery = Object.keys(req.query).filter((q) =>  !allowedQueries.includes(q));
    // console.log(unknownQuery);
    // console.log(Boolean(unknownQuery));
    
    
    if(unknownQuery.length > 0){
      return res.status(400).json({message : `Unknown query params : ${unknownQuery.join(", ")}`})
    }

    let totalMovies = await Movie.countDocuments();
    // console.log(totalMovies);
    

    if(limit){
        const limtToNumber = Number(limit);
        if(isNaN(limtToNumber) || limit < 1 || limit > totalMovies){
          return res.status(400).json({message : "invalid limit value"})
        }
    }

    const filter = {};

    if(name){
      filter.name = name;
    }
    if(genre){
      filter.genre = genre;
    }
    if(director){
      filter.director = director;
    }
    if (leadActor){
       filter.leadActor = leadActor;
    }
    if (leadActress){
      filter.leadActress = leadActress;
    } 
    if (rating) {
      filter.rating = rating;
    }
    if (imageUrl){
      filter.imageUrl = imageUrl
    } ;
    if (yearOfRealease){
      filter.yearOfRelease = yearOfRelease;
    } 
    
    const movies = await Movie.find(filter).limit(Number(limit));

    res.status(200).json(movies);

  }catch (err) {
    res.status(500).json({ message: "Something went wrong"});
  }
});



router.get("/api/movies/:id", async(req,res)=>{
  try{
    const movie = await Movie.findById(req.params.id);
    if(movie){
      res.status(200).json(movie);
    }else{
      res.status(404).json({ message : `sorry movie with id ${req.params.id} not found`})
    }
  }catch(err){
    res.status(500).json({ message : err.message})
  }
});


router.post("/api/movies", async (req, res) => {
  // const name = req.body.name;
  // const genre = req.body.genre;
  // const director = req.body.director;


  // console.log("post operation working");
  
  const {  
    name,
    genre,
    director,
    leadActor,
    leadActress,
    rating,
    imageUrl,
    yearOfRealease
    } = req.body;
  
    if (!name || !genre || !director || !leadActor || !leadActress || !rating || !imageUrl || !yearOfRealease){
    return res
      .status(400)
      .json({ message: "name , genre , director , leadActor ,leadActress , rating , imageUrl , yearOfRealease should be mandotory" });
  } else {
    await Movie.create({ 
      name,
      genre,
      director,
      leadActor,
      leadActress,
      rating,
      imageUrl,
      yearOfRealease,
       });
    res.status(201).json({ message: "new movie created" });
  }
 
});

router.put("/api/movies/:id", async (req,res)=>{
  try{
    const {name,
      genre,
      director,
      leadActor,
      leadActress,
      rating,
      imageUrl,
      yearOfRelease,} = req.body;

const updatedData = {};
    if(name){
      updatedData.name = name;
    }
    if (genre) {
      updatedData.genre = genre;
    }
    if (director) {
      updatedData.director = director;
    }
    if (leadActor) {
      updatedData.leadActor = leadActor;
    }
    if (leadActress) {
      updatedData.leadActress = leadActress;
    }
    if (rating) {
      updatedData.rating = rating;
    }
    if (imageUrl) {
      updatedData.imageUrl = imageUrl;
    }
    if (yearOfRelease) {
      updatedData.yearOfRelease = yearOfRelease;
    }

    await Movie.findByIdAndUpdate(req.params.id , updatedData , {new : true});
    res.status(200).json({ message : `movie with id- ${req.params.id} has been edited`})
    
  }catch(err){
    res.status(500).json({ message : `something went wrong while editing`})
  }
});


router.delete("/api/movies/:id" , async(req,res) =>{
  try{
    await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json({ message : `movie with id - ${req.params.id} deleted`})
  }catch(err){
    res.status(500).json({ message : `sorry the id is wrong ${err.message}`})
  }
});

export default router;
