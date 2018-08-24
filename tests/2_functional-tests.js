/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  var validId; 
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Title',
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            // console.log(res.status)
            assert.property(res.body, 'comments', 'Comments are in array form');
            assert.property(res.body, 'title', 'Title is a string');
            assert.property(res.body, '_id', '_id is a string');
            validId = res.body._id;
            assert.equal(res.body.title, 'Title');
            assert.equal(res.body.comments.length, 0);
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err, res){
            // console.log(res.body);
            // console.log(typeof res.body._id)
            // console.log(res.status)
            assert.equal(res.status, 200);
            assert.equal(res.text, 'book title must not be blank');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        var testId = '5b7f4edb8041b439f4484a6a'
        chai.request(server)
          .get('/api/books/' +testId)
          .end(function(err, res){
            // console.log(res);
            assert.equal(res.status, 200);
            // assert.isArray(res.body, 'response should be an array');
            // assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            // assert.property(res.body[0], 'title', 'Books in array should contain title');
            // assert.property(res.body[0], '_id', 'Books in array should contain _id');
            assert.equal(res.text, 'could not update ' + testId+ ' because of incorrect id');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' +validId)
          .end(function(err, res){
            console.log(res.body);
            assert.equal(res.status, 200);
            assert.property(res.body, 'comments', 'comments should be an array');
            assert.property(res.body, 'title', 'book should contain a title ');
            assert.property(res.body, '_id', 'book should contain an id');
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + validId)
          .send({
            comment: 'This is good',
          })
          .end(function(err, res){
            // console.log(res.text);
            // console.log(typeof res.body._id)
            // console.log(res.status)
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'comments should be an array');
            assert.property(res.body, 'comments', 'book should contain comments');
            assert.property(res.body, 'title', 'book should contain a title');
            assert.property(res.body, '_id', 'book should contain an id');
            assert.include(res.body.comments, 'This is good', 'comments should include test comment submitted');
            done();
          });
      });
      
    });

  });

});
