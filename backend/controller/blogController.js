import Joi from "joi";
import fs from "fs";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";
import { SERVER_BACKEND_PATH_STRING } from "../config/index.js";
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const blogController = {
  //create blog
  async createBlog(req, res, next) {
    const blogCreateSchema = Joi.object({
      content: Joi.string().required(),
      title: Joi.string().required(),
      photopath: Joi.string().required(),
      author: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = blogCreateSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { content, title, photopath, author } = req.body;

    //read photopath in buffer
    const buffer = Buffer.from(
      photopath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    //allocat random names
    const imagePath = `${Date.now()}-${author}.png`;
    //store locally
    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      return next(error);
    }
    //store in database
    let blog;
    try {
      const newBlog = new Blog({
        content,
        title,
        author,
        photopath: `${SERVER_BACKEND_PATH_STRING}/storage/${imagePath}`,
      });
      blog = await newBlog.save();
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(201).json({ blog });
  },
  //get all blogs method
  async getAll(req, res, next) {
    try {
      const blogs = await Blog.find({});
      const blogArr = [];
      for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        blogArr.push(blog);
      }
      return res.status(200).json({ blogs: blogArr });
    } catch (error) {
      return next(error);
    }
  },
  //get blog by id
  async getById(req, res, next) {
    const getBlogSchema = Joi.object({
      id: Joi.string().required(),
    });
    const { error } = getBlogSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    let blog;
    try {
      blog = await Blog.findOne({ _id: id });
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(201).json({ blog });
  },
  //update blog
  async update(req, res, next) {
    const updateBlogSchema = Joi.object({
      content: Joi.string(),
      title: Joi.string(),
      photopath: Joi.string(),
      author: Joi.string().regex(mongoIdPattern).required(),
      blogId: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = updateBlogSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, title, photopath, author, blogId } = req.body;
    try {
      const blog = await Blog.findOne({ _id: blogId });
      if (photopath) {
        let previous = blog.photopath;
        previous = previous.split("/").at(-1);
        fs.unlinkSync`storage/${previous}`;

        //read photopath in buffer
        const buffer = Buffer.from(
          photopath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
          "base64"
        );
        //allocat random names
        const imagePath = `${Date.now()}-${author}`;
        //store locally
        try {
          fs.writeFileSync(`storage/${imagePath}`, buffer);
        } catch (error) {
          return next(error);
        }
        //update database
        await Blog.updateOne(
          { _id: blogId },
          {
            title,
            content,
            photopath: `${SERVER_BACKEND_PATH_STRING}/storage/${imagePath}`,
          }
        );
      } else {
        await Blog.updateOne({ _id: blogId }, { title, content });
      }
    } catch (error) {
      return next(error);
    }
    //sending respone
    res.status(200).json({ message: "blog has been updated!!" });
  },
  //delete blog
  async delete(req, res, next) {
    const deleteSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = deleteSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    try {
      await Blog.deleteOne({ _id: id });
      await Comment.deleteMany();
    } catch (error) {
      return next(error);
    }
    //sending resonse
    res.status(200).json({ message: "Blog has been deleted!!" });
  },
};
export default blogController;
