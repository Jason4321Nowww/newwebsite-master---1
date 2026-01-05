// controllers/articleController.js
const Article = require('../models/Article');
const fs = require("fs");
const path = require('path');

function mapUploadedFilesToBlocks(bodyBlocks, files) {
  // Find image blocks without url and assign uploaded files in order
  const imageIndexes = [];
  bodyBlocks.forEach((b, idx) => {
    if (b.type === 'image' && (!b.url || b.url.trim() === '')) imageIndexes.push(idx);
  });

  if (files.length > imageIndexes.length) {
    // more files than empty image placeholders: attach extras at end
    // but we will still insert into the empty placeholders first
  }

  files.forEach((file, i) => {
    const idx = imageIndexes[i];
    const url = `/uploads/articles/${file.filename}`;
    if (typeof idx !== 'undefined') {
      bodyBlocks[idx].url = url;
    } else {
      // append new image block
      bodyBlocks.push({ type: 'image', url });
    }
  });

  return bodyBlocks;
}

const createArticle = async (req, res) => {
  try {
    let { title, body, author } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    // body expected as JSON string or already parsed
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ message: 'Invalid body JSON' }); }
    }

    if (!Array.isArray(body) || body.length === 0) {
      return res.status(400).json({ message: 'Body must be a non-empty array of blocks' });
    }

    // validate blocks basic
    for (const b of body) {
      if (b.type !== 'text' && b.type !== 'image') {
        return res.status(400).json({ message: 'Block type must be "text" or "image"' });
      }
      if (b.type === 'text' && (!b.value || !b.value.trim())) {
        return res.status(400).json({ message: 'Text blocks must have non-empty value' });
      }
    }

    const files = req.files || [];
    const mapped = mapUploadedFilesToBlocks(body, files);

    const article = new Article({
      title: title.trim(),
      body: mapped,
      author: author ? author.trim() : undefined
    });

    await article.save();
    return res.status(201).json({ message: 'Article created', article });
  } catch (err) {
    console.error('CreateArticle', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error('GetArticles', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    console.error('GetArticleById', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// const updateArticle = async (req, res) => {
//   try {
//     let { title, body, author } = req.body;
//     const files = req.files || [];

//     const article = await Article.findById(req.params.id);
//     if (!article) return res.status(404).json({ message: 'Article not found' });

//     // If body provided, parse and validate
//     if (typeof body === 'string' && body.trim() !== '') {
//       try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ message: 'Invalid body JSON' }); }
//     }

//     if (body && !Array.isArray(body)) {
//       return res.status(400).json({ message: 'Body must be an array of blocks' });
//     }

//     let newBody = article.body;
//     if (body) {
//       // replace body if provided (keeps existing image urls where present)
//       newBody = body;
//     }

//     // Map uploaded files to image placeholders or append
//     if (files.length > 0) {
//       newBody = mapUploadedFilesToBlocks(newBody, files);
//     }

//     const updated = await Article.findByIdAndUpdate(req.params.id, {
//       title: title ? title.trim() : article.title,
//       body: newBody,
//       author: author ? author.trim() : article.author
//     }, { new: true });

//     res.json({ message: 'Article updated', article: updated });
//   } catch (err) {
//     console.error('UpdateArticle', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };




const   updateArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);

    if (!article) return res.status(404).json({ message: "Not found" });

    const { title, author, body } = req.body;
    const parsedBody = JSON.parse(body);

    let imageIndex = 0;

    const updatedBody = parsedBody.map((block, blockIndex) => {
      if (block.type === "image") {
        const uploadedFile = req.files[imageIndex];

        // If user selected new file → replace old one
        if (uploadedFile) {
          const newURL = "/uploads/articles/" + uploadedFile.filename;

          // remove old image if exists
          if (block.url) {
            const oldPath = path.join(__dirname, "..", block.url);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }

          imageIndex++;
          return { type: "image", url: newURL };
        }

        // If no new file selected → keep old URL
        return { type: "image", url: block.url || "" };
      }

      return block;
    });

    article.title = title;
    article.author = author;
    article.body = updatedBody;

    await article.save();

    res.json({ message: "Updated successfully", article });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};



const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    console.error('DeleteArticle', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createArticle, getArticles, getArticleById, updateArticle, deleteArticle };
