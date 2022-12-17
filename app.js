const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded());
app.use(express.static("public"));

mongoose.set("strictQuery", false);

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Article = mongoose.model("Article", articleSchema);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

// const sampleArticles = [
//     {
//         title: "API",
//         content:
//             "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer.",
//     },

//     {
//         title: "Bootstrap",
//         content:
//             "This is a framework developed by Twitter that contains pre-made front-end templates for web design",
//     },

//     {
//         title: "DOM",
//         content:
//             "The Document Object Model is like an API for interacting with our HTML",
//     },
// ];

// for (const sampleArticle of sampleArticles) {
//     let newArticle = new Article(sampleArticle);
//     newArticle.save();
// }

app.route("/articles")
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
        });
        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.find(
            { title: req.params.articleTitle },
            (err, foundArticle) => {
                if (!err) {
                    res.send(foundArticle);
                } else {
                    res.send(err);
                }
            }
        );
    })
    .put((req, res) => {
        Article.replaceOne(
            { title: req.params.articleTitle },
            req.body,
            (err) => {
                if (!err) {
                    res.send("Successfully updated article.");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .patch((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            req.body,
            (err) => {
                if (!err) {
                    res.send("Successfully updated article.");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (!err) {
                res.send("Successfully deleted article.");
            } else {
                res.send(err);
            }
        });
    });

connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server started on port 3000");
        console.log("listening for requests...");
    });
});
