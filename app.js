require('dotenv').config();
const express = require('express');
const { Schema, model, connect } = require('mongoose');
const app = express();

app.use(express.json());

const defaultArticles = [
  {
    title: 'REST',
    content:
      "REST is short for REpresentational State Transfer. IIt's an architectural style for designing APIs.",
  },

  {
    title: 'API',
    content:
      'API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer.',
  },

  {
    title: 'Bootstrap',
    content:
      'This is a framework developed by Twitter that contains pre-made front-end templates for web design',
  },

  {
    title: 'DOM',
    content:
      'The Document Object Model is like an API for interacting with our HTML',
  },

  {
    title: 'Jack Bauer',
    content:
      "Jack Bauer once stepped into quicksand. The quicksand couldn't escape and nearly drowned.",
    __v: 0,
  },
];

connect(process.env.MONGO_URL, (err) => {
  if (err) {
    console.log('There was an error during connection. ', err);
  } else {
    console.log('Database Connected.');
  }
});

const articleSchema = new Schema({
  title: String,
  content: String,
});

const Article = model('Article', articleSchema);

app
  .route('/articles')
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (err) {
        console.log(err);
      } else {
        if (foundArticles.length === 0) {
          Article.insertMany(defaultArticles, (err, insertedArticles) => {
            if (err) {
              console.log(err);
            } else {
              res.status(201).json(insertedArticles);
            }
          });
        } else {
          res.status(200).json(foundArticles);
        }
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article(req.body);
    newArticle.save((err) => {
      if (err) {
        res.json(err);
      } else {
        res.json({
          message: 'Article successfully saved',
        });
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err, deletedArticles) => {
      if (err) {
        console.log(err);
      } else {
        res.json({
          message: 'Successfully deleted all articles',
        });
      }
    });
  });

app
  .route('/articles/:articleId')
  .get((req, res) => {
    const { articleId } = req.params;
    Article.findById(articleId, (err, foundArticle) => {
      if (err) {
        return res.json(err);
      } else {
        return res.status(200).json(foundArticle);
      }
    });
  })
  .put((req, res) => {
    const { articleId } = req.params;
    Article.replaceOne(
      { _id: articleId },
      { ...req.body },
      null,
      (err, docs) => {
        if (err) {
          res.json(err);
        } else {
          res.status(200).json({ message: 'Article Replaced Successfully' });
        }
      }
    );
  })
  .patch((req, res) => {
    const { articleId } = req.params;
    Article.updateOne(
      { _id: articleId },
      { ...req.body },
      (err, updatedArticle) => {
        if (err) {
          res.json(err);
        } else {
          return res
            .status(200)
            .json({ message: 'Article Updated Successfully' });
        }
      }
    );
  })
  .delete((req, res) => {
    const { articleId } = req.params;
    Article.findByIdAndRemove(articleId, (err, deletedArticle) => {
      if (err) {
        res.json(err);
      } else {
        res.json(deletedArticle);
      }
    });
  });

app.listen(3000, () => console.log('Server is running on port 3000'));
