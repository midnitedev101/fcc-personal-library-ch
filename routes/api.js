/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app, db) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      db.collection('books').find({}).toArray(function (err, books) {
        if(err) {
          // next(err); 
          // res.json({status: 'Could not insert issue on database.'})
          res.json({status: 'Find method returns error: ' +err});
        } else {
          // next(null, issue);
          // console.log(issue);
          // console.log(books)
          // res.send(books);
          
          var bookList = books.map((ele) => {
            // console.log(ele)
            return {_id: ele._id, title: ele.title, commentcount: ele.comments.length}
          });
          // console.log(bookList)
          // res.json({_id: books._id, title: books.title, comments: books.comments.length});
          res.send(bookList)
        }
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      var comments = [];
    
      if (title && title.length >= 1) {
        var toPost = {title: title, comments: comments}
        //response will contain new book object including atleast _id and title
        db.collection('books').insertOne(toPost, function (err, books) {
            if(err) {
              // next(err); 
              // res.json({status: 'Could not insert issue on database.'})
              res.send('Could not insert book on database.');
            } else {
              // next(null, issue);
              // res.json(toInsert);
              // res.json({title: issue.ops[0].title, comments: issue.ops[0].comments, _id: issue.ops[0]._id});
              res.json(books.ops[0])
            }
          });
        // res.json({{"title":"catcher in the rye","comments":[],"_id":"5b7f1589118e85004f7127cc"})
      } else {
        res.send('book title must not be blank')
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      db.collection('books').remove({}, function (err, books) {
        if(err) {                                                               // findOneAndDelete returns no errors
          // next(err); 
          // console.log(err);
          // res.json({failed: 'could not delete ' + _id});
          // console.log('could not delete any books')
          res.send('could not delete any books')
        } else {                                                                // findOneAndDelete returns no errors
          // next(null, issue);
          // console.log(issue)
          if (books.result.n >= 1) {                                             // Found id to be deleted
            // res.json({success: 'deleted ' + _id});
            // console.log('complete delete successful ');
            res.send('complete delete successful');
          } else {                                                                 // Cannot find document to be deleted
            // res.json({failed: 'could not delete ' + _id});
            // console.log('could not delete any books')
            res.send('could not delete any books')
          }
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      // console.log(req.params.id)
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      // console.log(bookid.length);
      if (bookid.length > 24 || bookid.length < 24) { 
            // res.json({failed: 'could not update ' + _id + ' because of incorrect id'});
            res.send('could not update ' + bookid + ' because of incorrect id');
      } else {
        db.collection('books').findOne({_id: new ObjectId(bookid)}, function (err, books) {
          if(err) {
            // next(err); 
            // res.json({status: 'Could not insert issue on database.'})
            // console.log('error')
            res.json({status: 'Find method returns error: ' +err});
          } else {
            if (books != null) {
              // console.log(books)
              res.send(books)
            } else {
              res.send('could not update ' + bookid + ' because of incorrect id');
            }
          }
        });
      }
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      if (bookid.length != 24) { 
            // res.json({failed: 'could not update ' + _id + ' because of incorrect id'});
            res.send('could not update ' + bookid + ' because of incorrect id');
        } else {
          // if (Object.keys(toBeUpdated).length <= 1) {
          //   // console.log('no updates');
          //   res.send('no updated field sent')
          // } else {
            // console.log(Object.keys(toBeUpdated).length)
            // console.log(toBeUpdated);
            db.collection('books').findOneAndUpdate(
              {_id: ObjectId(bookid)},
              // { $push: {comments: comment}}, {returnNewDocument: true}, function (err, books) {
              { $push: {comments: comment}}, {returnOriginal: false}, function (err, books) {
                if(err) {
                  // next(err); 
                  // res.json({status: 'could not update ' +_id})
                  res.send('could not update ' +bookid);
                } else {
                  // next(null, issue);
                  // res.json({status: 'successfully updated'})
                  console.log(books.value);
                  // res.send('successfully updated ' +bookid);
                  res.send(books.value)
                }
              });
          // }
        }
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      
      db.collection('books').findOneAndDelete(                                  
      {_id: ObjectId(bookid)}, {projection: {_id: 1}},  function (err, issue) {
        if(err) {                                                               // findOneAndDelete returns no errors
          // next(err); 
          // console.log(err);
          // res.json({failed: 'could not delete ' + _id});
          res.send('could not delete ' + bookid)
        } else {                                                                // findOneAndDelete returns no errors
          // next(null, issue);
          // console.log(issue)
          if (issue.value != null)                                              // Found id to be deleted
            // res.json({success: 'deleted ' + _id});
            res.send('deleted ' + bookid);
          else                                                                  // Cannot find document to be deleted
            // res.json({failed: 'could not delete ' + _id});
            res.send('could not delete ' + bookid)
        }
      });
    });
  
};
