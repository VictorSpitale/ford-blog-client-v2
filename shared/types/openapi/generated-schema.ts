/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/api/auth/login": {
    post: operations["AuthController_login"];
  };
  "/api/auth/logout": {
    get: operations["AuthController_logout"];
  };
  "/api/auth/jwt": {
    get: operations["AuthController_verifyToken"];
  };
  "/api/auth/g-jwt/{token}": {
    get: operations["AuthController_setCookieFromGoogle"];
  };
  "/api/auth/google": {
    get: operations["AuthController_googleAuth"];
  };
  "/api/auth/google/redirect": {
    get: operations["AuthController_googleAuthRedirect"];
  };
  "/api/users": {
    get: operations["UsersController_getUsers"];
    post: operations["UsersController_create"];
  };
  "/api/users/{id}": {
    get: operations["UsersController_getUserById"];
    delete: operations["UsersController_deleteUser"];
    patch: operations["UsersController_updateUser"];
  };
  "/api/users/upload/{id}": {
    delete: operations["UsersController_removeProfilePicture"];
    patch: operations["UsersController_uploadProfilePicture"];
  };
  "/api/users/password": {
    post: operations["UsersController_sendPasswordRecovery"];
  };
  "/api/users/password/{token}": {
    post: operations["UsersController_recoverPassword"];
  };
  "/api/posts": {
    get: operations["PostsController_getPosts"];
    post: operations["PostsController_create"];
  };
  "/api/posts/last": {
    get: operations["PostsController_getLastPosts"];
  };
  "/api/posts/query": {
    get: operations["PostsController_getQueriedPosts"];
  };
  "/api/posts/liked/{id}": {
    get: operations["PostsController_getLikedPost"];
  };
  "/api/posts/{slug}": {
    get: operations["PostsController_getPost"];
    delete: operations["PostsController_deletePost"];
    patch: operations["PostsController_updatePost"];
  };
  "/api/posts/like/{slug}": {
    patch: operations["PostsController_likePost"];
  };
  "/api/posts/unlike/{slug}": {
    patch: operations["PostsController_unlikePost"];
  };
  "/api/posts/comment/{slug}": {
    post: operations["PostsController_commentPost"];
    delete: operations["PostsController_deletePostComment"];
    patch: operations["PostsController_editPostComment"];
  };
  "/api/posts/isLiked/{slug}": {
    get: operations["PostsController_patchLikePost"];
  };
  "/api/categories": {
    get: operations["CategoriesController_getCategories"];
    post: operations["CategoriesController_create"];
  };
  "/api/categories/{id}": {
    get: operations["CategoriesController_getCategoryById"];
  };
}

export interface components {
  schemas: {
    LoginUserDto: {
      /**
       * @description User's email
       * @example John@Doe.fr
       */
      email: string;
      /** @description User's hashed password */
      password: string;
    };
    HttpErrorDto: {
      /**
       * @description Http status code
       * @example 400
       */
      statusCode: number;
      /**
       * @description Http error message
       * @example Error occurred
       */
      message: string;
      /**
       * @description Error number
       * @example 6
       */
      code: number;
    };
    UserDto: {
      /**
       * @description User's pseudo
       * @example John Doe
       */
      pseudo: string;
      /**
       * @description User's email
       * @example John@Doe.fr
       */
      email: string;
      /**
       * @description User's id
       * @example 61f59acf09f089c9df951c37
       */
      _id: string;
      /**
       * @description User's role
       * @default 0
       * @enum {string}
       */
      role: "0" | "1" | "2";
      /** @description User's hashed password */
      password: string;
      /**
       * @description Url to the picture
       * @example https://storage.googleapis.com/name
       */
      picture: string;
      /**
       * Format: YYYY-mm-ddTHH:MM:ssZ
       * @description User's created date
       */
      createdAt: string;
      /**
       * Format: YYYY-mm-ddTHH:MM:ssZ
       * @description User's last update date
       */
      updatedAt: string;
    };
    CreateUserDto: {
      /**
       * @description User's pseudo
       * @example John Doe
       */
      pseudo: string;
      /**
       * @description User's email
       * @example John@Doe.fr
       */
      email: string;
      /**
       * @description User's password
       * @example password
       */
      password: string;
    };
    HttpValidationError: {
      /**
       * @description Http status code
       * @example 400
       */
      statusCode: number;
      /**
       * @description Http error messages
       * @example x must not be empty,x must be a string
       */
      message: string;
      /**
       * @description Http error message
       * @example Error occurred
       */
      error: string;
    };
    UpdateUserDto: {
      /**
       * @description User's pseudo
       * @example John Doe
       */
      pseudo?: string;
      /**
       * @description User's password
       * @example password
       */
      password?: string;
    };
    PasswordPreRecoveryDto: {
      /**
       * @description User's email
       * @example John@Doe.fr
       */
      email: string;
      /** @description User's locale */
      locale: string;
    };
    PasswordRecoveryDto: {
      /**
       * @description User's password
       * @example password
       */
      password: string;
    };
    CreatePostDto: {
      /**
       * @description Post's title
       * @example The new ford mustang
       */
      title: string;
      /**
       * @description Post's slug
       * @example the-new-ford-mustang
       */
      slug: string;
      /**
       * @description Post's desc
       * @example It is the story about...
       */
      desc: string;
      /**
       * @description Source's name
       * @example auto-moto
       */
      sourceName: string;
      /**
       * @description Source's link
       * @example https://auto-moto.fr
       */
      sourceLink: string;
      /**
       * @description Post's category ids
       * @example [621bd3239a004010c4ba3b06e]
       */
      categories: string[];
      /**
       * Format: binary
       * @description File to upload, converted to picture url
       */
      file?: string;
    };
    CategoryDto: {
      /**
       * @description Category's name
       * @example Sport
       */
      name: string;
      /**
       * @description Category's id
       * @example 61f59acf09f089c9df951c37
       */
      _id: string;
    };
    CommenterDto: {
      /**
       * @description User id
       * @example 61f59acf09f089c9df951c37
       */
      _id: string;
      /**
       * @description User's pseudo
       * @example John Doe
       */
      pseudo: string;
      /**
       * @description User's profile picture
       * @example url_to_picture
       */
      picture?: string;
    };
    CommentDto: {
      /**
       * @description Comment's id
       * @example 61f59acf09f089c9df951c37
       */
      _id: string;
      /**
       * @description Commenter's informations
       * @example {
       *         id: "61f59acf09f089c9df951c37",
       *         pseudo: 'John',
       *         picture: 'url_to_picture'
       *     }
       */
      commenter: components["schemas"]["CommenterDto"];
      /**
       * @description Comment
       * @example What a beautiful car!
       */
      comment: string;
      /** @description Comment's created date (timestamp) */
      createdAt: number;
      /** @description Comment's last update date (timestamp) */
      updatedAt?: number;
    };
    PostDto: {
      /**
       * @description Post's title
       * @example The new ford mustang
       */
      title: string;
      /**
       * @description Post's slug
       * @example the-new-ford-mustang
       */
      slug: string;
      /**
       * @description Post's desc
       * @example It is the story about...
       */
      desc: string;
      /**
       * @description Source's name
       * @example auto-moto
       */
      sourceName: string;
      /**
       * @description Source's link
       * @example https://auto-moto.fr
       */
      sourceLink: string;
      /**
       * @description Post's id
       * @example 61f59acf09f089c9df951c37
       */
      _id: string;
      /**
       * @description Post's category ids
       * @example [{
       *             "_id": "621bd3239a004010c4ba3b06",
       *             "name": "sport"
       *         }]
       */
      categories: components["schemas"]["CategoryDto"][];
      /**
       * @description Number of likes
       * @example 12
       */
      likes: number;
      /**
       * @description Auth user like status
       * @example true
       */
      authUserLiked: boolean;
      /**
       * @description Post's comments
       * @example [{
       *             "_id": "621bd3239a004010c4ba3b06",
       *             "comment": "my comment",
       *             "createdAt": "date",
       *             "updatedAt": "date",
       *             "commenter": {
       *             "pseudo": "John Doe",
       *             "picture": "url_to_profile"
       *             }
       *         }]
       */
      comments: components["schemas"]["CommentDto"][];
      /**
       * @description Url to the picture
       * @example https://storage.googleapis.com/name
       */
      picture: string;
      /**
       * Format: YYYY-mm-ddTHH:MM:ssZ
       * @description Post's created date
       */
      createdAt: string;
      /**
       * Format: YYYY-mm-ddTHH:MM:ssZ
       * @description Post's last update date
       */
      updatedAt: string;
    };
    PaginatedPostDto: {
      /**
       * @description Has more posts
       * @example true
       */
      hasMore: boolean;
      /** @description Posts */
      posts: components["schemas"]["PostDto"][];
      /**
       * @description Page number
       * @example 1
       */
      page: number;
    };
    BasicPostDto: {
      /**
       * @description Post's title
       * @example The new ford mustang
       */
      title: string;
      /**
       * @description Post's slug
       * @example the-new-ford-mustang
       */
      slug: string;
      /**
       * @description Post's desc
       * @example It is the story about...
       */
      desc: string;
      /**
       * @description Url to the picture
       * @example https://storage.googleapis.com/name
       */
      picture: string;
    };
    UpdatePostDto: {
      /**
       * @description Post's title
       * @example The new ford mustang
       */
      title?: string;
      /**
       * @description Post's desc
       * @example It is the story about...
       */
      desc?: string;
      /**
       * @description Source's name
       * @example auto-moto
       */
      sourceName?: string;
      /**
       * @description Source's link
       * @example https://auto-moto.fr
       */
      sourceLink?: string;
      /**
       * @description Post's category ids
       * @example [621bd3239a004010c4ba3b06e]
       */
      categories?: string[];
    };
    CreateCommentDto: {
      /**
       * @description Comment
       * @example What a beautiful car!
       */
      comment: string;
    };
    UpdateCommentDto: {
      /**
       * @description Comment's id
       * @example 61f59acf09f089c9df951c37
       */
      _id: string;
      /**
       * @description Comment
       * @example What a beautiful car!
       */
      comment: string;
      /**
       * @description comment id
       * @example 61f59acf09f089c9df951c37
       */
      commenterId: string;
    };
    DeleteCommentDto: {
      /**
       * @description Comment's id
       * @example 61f59acf09f089c9df951c37
       */
      _id: string;
      /**
       * @description comment id
       * @example 61f59acf09f089c9df951c37
       */
      commenterId: string;
    };
    CreateCategoryDto: {
      /**
       * @description Category's name
       * @example Sport
       */
      name: string;
    };
  };
}

export interface operations {
  AuthController_login: {
    parameters: {};
    responses: {
      /** Setting jwt cookie */
      200: unknown;
      /** Bad credentials */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
    /** User's credentials */
    requestBody: {
      content: {
        "application/json": components["schemas"]["LoginUserDto"];
      };
    };
  };
  AuthController_logout: {
    parameters: {};
    responses: {
      /** Removing the jwt cookie */
      200: unknown;
      /** Jwt failed */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  AuthController_verifyToken: {
    parameters: {};
    responses: {
      /** User information */
      200: {
        content: {
          "application/json": components["schemas"]["UserDto"];
        };
      };
      /** Jwt failed */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** User not found */
      404: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  AuthController_setCookieFromGoogle: {
    parameters: {
      path: {
        /** Jwt token */
        token: string;
      };
    };
    responses: {
      /** Setting jwt on Google Auth */
      200: unknown;
      /** Google Auth failed */
      400: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  AuthController_googleAuth: {
    parameters: {};
    responses: {
      200: unknown;
    };
  };
  AuthController_googleAuthRedirect: {
    parameters: {};
    responses: {
      200: unknown;
    };
  };
  UsersController_getUsers: {
    parameters: {};
    responses: {
      /** List all users */
      200: {
        content: {
          "application/json": components["schemas"]["UserDto"][];
        };
      };
      /** Jwt failed | Insufficient permissions */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  UsersController_create: {
    parameters: {};
    responses: {
      /** The user has been created */
      201: {
        content: {
          "application/json": components["schemas"]["UserDto"];
        };
      };
      /** Validations failed */
      400: {
        content: {
          "application/json": components["schemas"]["HttpValidationError"];
        };
      };
      /** The user already exist */
      409: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateUserDto"];
      };
    };
  };
  UsersController_getUserById: {
    parameters: {
      path: {
        /** User id */
        id: string;
      };
    };
    responses: {
      /** User found */
      200: {
        content: {
          "application/json": components["schemas"]["UserDto"];
        };
      };
      /** Id is not a valid id */
      400: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** User not found */
      404: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  UsersController_deleteUser: {
    parameters: {
      path: {
        /** User id */
        id: string;
      };
    };
    responses: {
      /** User account deleted */
      200: unknown;
      /** Jwt failed | Insufficient permissions */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  UsersController_updateUser: {
    parameters: {
      path: {
        /** User id */
        id: string;
      };
    };
    responses: {
      /** The updated user */
      200: {
        content: {
          "application/json": components["schemas"]["UserDto"];
        };
      };
      /** Validations failed */
      400: {
        content: {
          "application/json": components["schemas"]["HttpValidationError"];
        };
      };
      /** Jwt failed | Insufficient permissions */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateUserDto"];
      };
    };
  };
  UsersController_removeProfilePicture: {
    parameters: {
      path: {
        /** User id */
        id: string;
      };
    };
    responses: {
      /** Profile picture deleted */
      200: unknown;
      /** Jwt failed | Insufficient permissions */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  UsersController_uploadProfilePicture: {
    parameters: {
      path: {
        /** User id */
        id: string;
      };
    };
    responses: {
      /** The profile picture url */
      200: {
        content: {
          "application/json": {
            /**
             * @description url to the profile picture
             * @example https://storage.googleapis.com/path
             */
            picture: string;
          };
        };
      };
      /** Bad file format */
      400: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** Jwt failed | Insufficient permissions */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** Upload failed */
      500: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          /** Format: binary */
          file: string;
        };
      };
    };
  };
  UsersController_sendPasswordRecovery: {
    parameters: {};
    responses: {
      /** Email sent */
      200: unknown;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PasswordPreRecoveryDto"];
      };
    };
  };
  UsersController_recoverPassword: {
    parameters: {
      path: {
        /** Recovery token */
        token: string;
      };
    };
    responses: {
      /** Password changed */
      200: unknown;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PasswordRecoveryDto"];
      };
    };
  };
  PostsController_getPosts: {
    parameters: {
      query: {
        /** Page to fetch, 3 items per page */
        page?: number;
      };
    };
    responses: {
      /** List all posts */
      200: {
        content: {
          "application/json": components["schemas"]["PaginatedPostDto"];
        };
      };
      /** Jwt failed */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  PostsController_create: {
    parameters: {};
    responses: {
      /** The post has been created */
      201: {
        content: {
          "application/json": components["schemas"]["PostDto"];
        };
      };
      /** Validations failed */
      400: {
        content: {
          "application/json": components["schemas"]["HttpValidationError"];
        };
      };
      /** Unauthorized access */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** A post with this slug already exist */
      409: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreatePostDto"];
      };
    };
  };
  PostsController_getLastPosts: {
    parameters: {};
    responses: {
      /** List the 6 last posts */
      200: {
        content: {
          "application/json": components["schemas"]["PostDto"][];
        };
      };
    };
  };
  PostsController_getQueriedPosts: {
    parameters: {
      query: {
        search: string;
      };
    };
    responses: {
      /** List the 5 queried posts */
      200: {
        content: {
          "application/json": components["schemas"]["PostDto"][];
        };
      };
      /** Search query failed, search must be defined and more than 2 characters */
      400: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  PostsController_getLikedPost: {
    parameters: {
      path: {
        /** User id */
        id: string;
      };
    };
    responses: {
      /** Posts list */
      200: {
        content: {
          "application/json": components["schemas"]["BasicPostDto"][];
        };
      };
      /** Jwt failed | Insufficient permissions */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  PostsController_getPost: {
    parameters: {
      path: {
        /** Post's slug to query */
        slug: string;
      };
    };
    responses: {
      /** The post got by its slug */
      200: {
        content: {
          "application/json": components["schemas"]["PostDto"];
        };
      };
      /** The post doesnt exist */
      404: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  PostsController_deletePost: {
    parameters: {
      path: {
        /** Post slug */
        slug: string;
      };
    };
    responses: {
      /** The post has been deleted */
      200: unknown;
      /** Jwt failed | Insufficient permissions */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** The post doesnt exist */
      404: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  PostsController_updatePost: {
    parameters: {
      path: {
        /** Post slug */
        slug: string;
      };
    };
    responses: {
      /** The post has been updated */
      201: {
        content: {
          "application/json": components["schemas"]["PostDto"];
        };
      };
      /** Validations failed */
      400: {
        content: {
          "application/json": components["schemas"]["HttpValidationError"];
        };
      };
      /** Unauthorized access */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** The post doesnt exist */
      404: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdatePostDto"];
      };
    };
  };
  PostsController_likePost: {
    parameters: {
      path: {
        /** Post slug */
        slug: string;
      };
    };
    responses: {
      /** The post has been liked, return the number of likes */
      200: {
        content: {
          "application/json": number;
        };
      };
      /** Jwt failed */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** The post doesnt exist */
      404: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  PostsController_unlikePost: {
    parameters: {
      path: {
        /** Post slug */
        slug: string;
      };
    };
    responses: {
      /** The post has been unliked, return the number of likes */
      200: {
        content: {
          "application/json": number;
        };
      };
      /** Jwt failed */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** The post doesnt exist */
      404: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
  PostsController_commentPost: {
    parameters: {
      path: {
        /** Post slug */
        slug: string;
      };
    };
    responses: {
      /** The post has been commented */
      201: {
        content: {
          "application/json": components["schemas"]["PostDto"];
        };
      };
      /** Validations failed */
      400: {
        content: {
          "application/json": components["schemas"]["HttpValidationError"];
        };
      };
      /** Unauthorized access */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** The post doesnt exist */
      404: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateCommentDto"];
      };
    };
  };
  PostsController_deletePostComment: {
    parameters: {
      path: {
        /** Post slug */
        slug: string;
      };
    };
    responses: {
      /** The updated post */
      201: {
        content: {
          "application/json": components["schemas"]["PostDto"];
        };
      };
      /** Validations failed */
      400: {
        content: {
          "application/json": components["schemas"]["HttpValidationError"];
        };
      };
      /** Unauthorized access */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** The post doesnt exist */
      404: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DeleteCommentDto"];
      };
    };
  };
  PostsController_editPostComment: {
    parameters: {
      path: {
        /** Post slug */
        slug: string;
      };
    };
    responses: {
      /** The updated post */
      201: {
        content: {
          "application/json": components["schemas"]["PostDto"];
        };
      };
      /** Validations failed */
      400: {
        content: {
          "application/json": components["schemas"]["HttpValidationError"];
        };
      };
      /** Unauthorized access */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** The post doesnt exist */
      404: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateCommentDto"];
      };
    };
  };
  PostsController_patchLikePost: {
    parameters: {
      path: {
        /** Post slug */
        slug: string;
      };
    };
    responses: {
      /** The like status */
      200: {
        content: {
          "application/json": boolean;
        };
      };
    };
  };
  CategoriesController_getCategories: {
    parameters: {};
    responses: {
      /** List all categories */
      200: {
        content: {
          "application/json": components["schemas"]["CategoryDto"][];
        };
      };
    };
  };
  CategoriesController_create: {
    parameters: {};
    responses: {
      /** The category has been created */
      201: {
        content: {
          "application/json": components["schemas"]["CategoryDto"];
        };
      };
      /** Validations failed */
      400: {
        content: {
          "application/json": components["schemas"]["HttpValidationError"];
        };
      };
      /** Jwt failed | Insufficient permissions */
      401: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** The category already exist */
      409: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateCategoryDto"];
      };
    };
  };
  CategoriesController_getCategoryById: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** Category found */
      200: {
        content: {
          "application/json": components["schemas"]["CategoryDto"];
        };
      };
      /** Id is not a valid id */
      400: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
      /** Category not found */
      404: {
        content: {
          "application/json": components["schemas"]["HttpErrorDto"];
        };
      };
    };
  };
}

export interface external {}
