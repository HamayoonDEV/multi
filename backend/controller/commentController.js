import Joi from "joi";
import Comment from "../models/comment.js";
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const commentController = {
  //create Comment method
  async createComment(req, res, next) {
    const commentSchema = Joi.object({
      content: Joi.string().required(),
      author: Joi.string().regex(mongoIdPattern).required(),
      blog: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = commentSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, author, blog } = req.body;
    let comment;
    try {
      const newComment = new Comment({
        content,
        author,
        blog,
      });
      comment = await newComment.save();
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(201).json({ comment });
  },
  //read all comments by blogId
  async readComments(req, res, next) {
    const readCommentSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = readCommentSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    try {
      const comments = await Comment.find({ blog: id });
      const commentArr = [];
      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        commentArr.push(comment);
      }
      return res.status(200).json({ comments: commentArr });
    } catch (error) {
      return next(error);
    }
  },
  //delete comment
  async deleteComment(req, res, next) {
    const deleteCommentSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = deleteCommentSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    try {
      await Comment.deleteOne({ _id: id });
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ message: "comment has been deleted!!" });
  },
};

export default commentController;
