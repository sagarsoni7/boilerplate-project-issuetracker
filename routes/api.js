/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
//Import model
let user = require('../schema.js').user;

const CONNECTION_STRING = process.env.DB; 
// MongoClient.connect(CONNECTION_STRING, function(err, db) {
//   if(err)  err;
//   // console.log(db)
// });
mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true })

module.exports = function (app) {
 
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      let finder = {};
      if(req.query.issue_title) finder.issue_title = req.query.issue_title;
      if(req.query.issue_text) finder.issue_text = req.query.issue_text;
      if(req.query.created_by) finder.created_by = req.query.created_by;
      if(req.query.assigned_to) finder.assigned_to = req.query.assigned_to;
      if(req.query.status_text) finder.status_text = req.query.status_text;
      if(req.query.open) finder.open = req.query.open;
      if(req.query._id) finder._id = req.query._id;
     
      user.find(finder, (err, data) => {
                  if(err) res.json("No data matching criteria found.");
                  res.json(data)
                })
    })
    
    
    .post(function (req, res, next){
      var project = req.params.project;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
     
      let assigned_to; 
      (req.body.assigned_to)? assigned_to = req.body.assigned_to : assigned_to = '';
      let status_text;
      (req.body.status_text)? status_text = req.body.status_text : status_text = '';
    
      let requirement = issue_title && issue_text && created_by;
      let newEntry = {
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        created_on: new Date().toString(),
        updated_on: new Date().toString(),
        open: true
      };
    if(requirement) {
        user.create(newEntry, (err, data) => {
        if(err) console.log(err);
        res.json({
          _id: data._id,
          issue_title: data.issue_title,
          issue_text: data.issue_text,
          created_by: data.created_by,
          assigned_to: data.assigned_to,
          status_text: data.status_text,
          created_on: data.created_on,
          updated_on: data.updated_on,
          open: data.open
        })
      })
    } else {
      res.send('missing inputs')
    }
    
    
    })
    
    .put(async function (req, res){
      var project = req.params.project;
      let _id = req.body._id;
  
     let issue_title; 
     req.body.issue_title !== ''? issue_title = req.body.issue_title : await user.findOne({_id:_id}, (err, data) => {
                                                                                                 if(err) console.log(err);
                                                                                                 issue_title = data.issue_title  
                                                                                                });

      let issue_text; 
     req.body.issue_text !== ''? issue_text = req.body.issue_text : await user.findOne({_id:_id}, (err, data) => {
                                                                                                 if(err) console.log(err);
                                                                                                 issue_text = data.issue_text  
                                                                                                });
      let created_by; 
     req.body.created_by !== ''? created_by = req.body.created_by : await user.findOne({_id:_id}, (err, data) => {
                                                                                                 if(err) console.log(err);
                                                                                                 created_by = data.created_by  
                                                                                                });
      let assigned_to; 
     req.body.assigned_to !== ''? assigned_to = req.body.assigned_to : await user.findOne({_id:_id}, (err, data) => {
                                                                                                 if(err) console.log(err);
                                                                                                 assigned_to = data.assigned_to  
                                                                                                });
      let status_text; 
     req.body.status_text !== ''? status_text = req.body.status_text : await user.findOne({_id:_id}, (err, data) => {
                                                                                                 if(err) console.log(err);
                                                                                                 status_text = data.status_text  
                                                                                                });
    
      let open = req.body.open == null ? true : false;
      let eitherOne = req.body.issue_title || req.body.issue_text || req.body.created_by || req.body.assigned_to || req.body.status_text || !open;
      
      if(_id && eitherOne) {
          await user.findOneAndUpdate({_id: _id},
                              {$set:{
                                issue_title: issue_title,
                                issue_text: issue_text,
                                created_by: created_by,
                                assigned_to: assigned_to,
                                status_text: status_text,
                                updated_on: new Date().toString(),
                                open: open                                
                              }}, { new : true }, (err, data) => {
          if(err) res.send("could not update " + _id );
          res.send("successfully updated")
        }
                            
      )
      } else {////////////
        res.send("no updated field sent")
      }
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      let _id = req.body._id;
    
      if(_id) {
        user.findOneAndDelete({ _id:_id }, function(err) {
          if(err) res.send("could not delete " + _id);
          res.send('deleted '+ _id)
        });
      } else {
        res.send("_id error")
      }
    
    
    });
};

                        