const express = require("express")
const app = express()
const path = require('path')
const dotenv = require("dotenv")
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const postRoute = require("./routes/posts")
const categoryRoute = require("./routes/categories")
const multer = require("multer")

dotenv.config()
app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "/images")))

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: true
}) .then(console.log("Connected to MongoDB"))
   .catch(err => console.log(err))

const storage = multer.diskStorage({
	destination:(req, file, callback) => {
		callback(null,"images")
	}, filename:(req, file, callback) => {
		callback(null, req.body.name)
	}
})

app.use('/', express.static(path.resolve(__dirname, 'assets')))

const upload = multer({storage:storage})
app.post("/api/upload", upload.single("file"),(req,res) => {
	res.status(200).json("File has been uploaded")
});

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/categories", categoryRoute)


// app.use("/", (req,res) => {
// 	console.log("hi Ian")
// })

app.listen(13371, '127.0.0.1', () => {
	console.log("Server up")
} );