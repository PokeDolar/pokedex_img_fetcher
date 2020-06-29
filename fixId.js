const Fs = require("fs");
const Path = require("path");
const Axios = require("axios");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PokedexImgSchema = new Schema({
  imageUrl: { type: "String", required: true },
  number: { type: "String", required: true },
  artist: { type: "String", required: true },
  filePath: { type: "String", required: true, unique: true },
  id: { type: "Number", required: true}
});

let PokemonImg = mongoose.model("PokeDex", PokedexImgSchema);

mongoose.connect("mongodb://localhost:27017/pokemontcgimages");


async function downloadImage(url, filename) {
  const path = Path.resolve(__dirname, `arts/`, `${filename}.png`);
  const writer = Fs.createWriteStream(path);
  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

(async () => {
  let pokemons = await PokemonImg.find();
  for (pokemon of pokemons){
    pokemon.id = parseInt(pokemon.number)
    pokemon.save()
  }
  console.log("acabou");
})();
