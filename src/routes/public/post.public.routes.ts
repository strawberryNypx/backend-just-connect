import { Router } from 'express';
import { FindAllPostController } from '../../controllers/post/FindAllPostController';
import { FindOnePostController } from '../../controllers/post/FindOnePostController';
import { FindAllPostUserController } from '../../controllers/post/FindAllPostUserController';

/**
 * @module postsPublicRoutes
 * @description Defines the public routes for accessing posts in the application.
 * Routes include:
 * - GET /: Retrieve all posts.
 * - GET /:id: Retrieve a specific post by its ID.
 * 
 * Controllers:
 * - FindAllPostController: Handles the retrieval of all posts.
 * - FindOnePostController: Handles the retrieval of a specific post.
 */
const postsPublicRoutes: Router = Router();
const findAllPostController = new FindAllPostController();
const findOnePostController = new FindOnePostController();
const findAllPostUserController = new FindAllPostUserController();

postsPublicRoutes.get('/', findAllPostController.findAll);
postsPublicRoutes.get('/:id', findOnePostController.findOne);
postsPublicRoutes.get('/user/:userId', findAllPostUserController.findAll);

export { postsPublicRoutes };