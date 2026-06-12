// controllers/articleController.js
const Article = require('../models/Article');
const fs = require("fs");
const path = require('path');

function mapUploadedFilesToBlocks(bodyBlocks, files) {
  const imageIndexes = [];
  bodyBlocks.forEach((b, idx) => {
    if (b.type === 'image' && (!b.url || b.url.trim() === '')) imageIndexes.push(idx);
  });
  files.forEach((file, i) => {
    const url = `/uploads/articles/${file.filename}`;
    const idx = imageIndexes[i];
    if (typeof idx !== 'undefined') {
      bodyBlocks[idx].url = url;
    } else {
      bodyBlocks.push({ type: 'image', url });
    }
  });
  return bodyBlocks;
}

function blocksToHtml(blocks) {
  return blocks.map(b => {
    if (b.type === 'text') return `<p>${b.value || ''}</p>`;
    if (b.type === 'image' && b.url) return `<img src="${b.url}" />`;
    return '';
  }).filter(s => s).join('');
}

function parseLangBlocks(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
}

const createArticle = async (req, res) => {
  try {
    let { title, title_it, title_fr, title_en, body, body_it, body_fr, body_en, author } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ message: 'Invalid body JSON' }); }
    }

    if (!Array.isArray(body) || body.length === 0) {
      return res.status(400).json({ message: 'Body must be a non-empty array of blocks' });
    }

    for (const b of body) {
      if (b.type !== 'text' && b.type !== 'image') {
        return res.status(400).json({ message: 'Block type must be "text" or "image"' });
      }
      if (b.type === 'text' && (!b.value || !b.value.trim())) {
        return res.status(400).json({ message: 'Text blocks must have non-empty value' });
      }
    }

    const deFiles  = req.files?.images    || [];
    const itFiles  = req.files?.images_it || [];
    const frFiles  = req.files?.images_fr || [];
    const enFiles  = req.files?.images_en || [];

    const mapped   = mapUploadedFilesToBlocks(body, deFiles);
    const mappedIt = mapUploadedFilesToBlocks(parseLangBlocks(body_it), itFiles);
    const mappedFr = mapUploadedFilesToBlocks(parseLangBlocks(body_fr), frFiles);
    const mappedEn = mapUploadedFilesToBlocks(parseLangBlocks(body_en), enFiles);

    const article = new Article({
      title: title.trim(),
      title_it: title_it || '',
      title_fr: title_fr || '',
      title_en: title_en || '',
      body: mapped,
      body_it: blocksToHtml(mappedIt),
      body_fr: blocksToHtml(mappedFr),
      body_en: blocksToHtml(mappedEn),
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




const updateArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);

    if (!article) return res.status(404).json({ message: "Not found" });

    const { title, title_it, title_fr, title_en, author, body, body_it, body_fr, body_en } = req.body;
    const parsedBody = JSON.parse(body);

    const deFiles = req.files?.images    || [];
    const itFiles = req.files?.images_it || [];
    const frFiles = req.files?.images_fr || [];
    const enFiles = req.files?.images_en || [];

    let imageIndex = 0;
    const updatedBody = parsedBody.map((block) => {
      if (block.type === 'image') {
        const uploadedFile = deFiles[imageIndex];
        if (uploadedFile) {
          const newURL = '/uploads/articles/' + uploadedFile.filename;
          if (block.url) {
            const oldPath = path.join(__dirname, '..', block.url);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }
          imageIndex++;
          return { type: 'image', url: newURL };
        }
        return { type: 'image', url: block.url || '' };
      }
      return block;
    });

    const mappedIt = mapUploadedFilesToBlocks(parseLangBlocks(body_it), itFiles);
    const mappedFr = mapUploadedFilesToBlocks(parseLangBlocks(body_fr), frFiles);
    const mappedEn = mapUploadedFilesToBlocks(parseLangBlocks(body_en), enFiles);

    article.title    = title;
    article.title_it = title_it || '';
    article.title_fr = title_fr || '';
    article.title_en = title_en || '';
    article.author   = author;
    article.body     = updatedBody;
    article.body_it  = blocksToHtml(mappedIt);
    article.body_fr  = blocksToHtml(mappedFr);
    article.body_en  = blocksToHtml(mappedEn);

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
