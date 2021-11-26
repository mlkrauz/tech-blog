const router = require('express').Router()
const { Post, User, Comment } = require('../models')
const withAuth = require('../utils/auth')

/**
 * Homepage
 */
router.get('/', async (req, res) => {
  Post.findAll({ include: User })
  .then(allPosts => 
    allPosts.map(singlePost => singlePost.get({ plain: true }))
  )
  .then(allPosts => res.render(
    'homepage', {
      allPosts,
      logged_in: req.session.logged_in
    }
  ))
  .catch(error => res.status(500).json(error))
})

/**
 * Create new post
 */
router.get('/post', withAuth, async (req, res) => {
  res.render(
    'newPost',
    { logged_in: req.session.logged_in }
  )
  .catch(error => res.status(500).json(error))
})

/**
 * Get post by ID
 */
router.get('/post/:id', async (req, res) => {
  Post.findByPk(req.params.id, { include: User })
  .then(singlePost => { 
    return { 
      post: singlePost.get({ plain: true })
    }
  })
  .then(singlePost => {
    return {
      post: singlePost.post,
      comments: await Comment.findAll(
        {
          where: { post_id: req.params.id },
          include: [User]
        }
      )
      .then(comments => comments.map(
        singleComment => singleComment.get({ plain: true })
      ))
    }
  })
  .then(postAndComments => res.render('post', {
    post: postAndComments.post,
    comments: postAndComments.comments
  }))
  .catch(error => res.status(500).json(error))
})

