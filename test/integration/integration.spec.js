/*jshint expr: true*/
(function () {
  'use strict';
  var expect = require('chai').expect;
  var request = require('supertest');
  var agent = request.agent("http://localhost:1337/");

  describe('API integration tests', function() {
    var newSpecies, anotherNewSpecies, deleteSpecies, updateSpecies;

    before(function(done) {
      newSpecies = {
        id: 5,
        scientificName: 'Latin name',
        taxon: 'Amphibian',
        leadOffice: 'Vero Beach'
      };

      anotherNewSpecies = {
        id: 6,
        scientificName: 'Another Latin name',
        taxon: 'Amphibian',
        leadOffice: 'Vero Beach'
      };

      deleteSpecies = {
        "scientificName": "Chromolaena frustrata"
      };

      updateSpecies = {
        "scientificName": "Spondylurus culebrae",
      };

      done();
    });

    describe('for unauthenticated users', function() {

      it('should allow user to get list of species', function(done) {
        agent.get('species')
          .end(function(err, res) {
            expect(res.body).to.be.instanceof(Array);
            expect(res.statusCode).to.equal(200);
            done();
          });
      });

      it('should allow user to get species by id', function(done) {
        // Species comes from species test fixture
        agent.get('species/1')
          .end(function(err, res) {
            expect(res.body.id).to.equal(1);
            expect(res.body.scientificName).to.equal('Ammodramus maritimus macgillivraii');
            expect(res.statusCode).to.equal(200);
            done();
          });
      });

      it('should not allow user create a species', function(done){
        agent.post('species')
          .send(newSpecies)
          .end(function(err, res) {
            expect(res.body.message).to.equal('No access token.');
            expect(res.statusCode).to.equal(401);
            done();
          });
      });

      it('should not allow user destroy a species', function(done){
        agent.delete('species/4')
          .end(function(err, res) {
            expect(res.body.message).to.equal('No access token.');
            expect(res.statusCode).to.equal(401);
            done();
          });
      });

      it('should not allow user update a species', function(done){
        agent.post('species/3')
          .send(updateSpecies)
          .end(function(err, res) {
            expect(res.body.message).to.equal('No access token.');
            expect(res.statusCode).to.equal(401);
            done();
          });
      });

      it('should not allow user to change account type', function(done) {
        agent.put('user/1')
          .send({ "accountType": "admin" })
          .end(function (err, res) {
            expect(res.body.message).to.equal('No access token.');
            expect(res.statusCode).to.equal(401);
            done();
          });
      });
    });

    describe('for authenticated users', function() {
      var jwt;

      describe('with viewer privileges', function() {
        
        console.log(sails.config.TOKEN_SECRET);

        before(function(done) {
          // Create an authenticated user w/viewer privileges
          User.create({
            name: 'bilbo baggins',
            email: 'viewer@gmail.com',
            job: 'tester',
            accountType: 'viewer'
          }).exec(function (err, user) {
            jwt = sailsTokenAuth.createToken(user);
            done();
          });
        });

        it('should allow user to get list of species', function(done) {
          agent.get('species')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res) {
              expect(err).to.not.exist;
              expect(res.body).to.be.instanceof(Array);
              done();
            });
        });

        it('should allow user to get species by id', function(done) {
          agent.get('species/1')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res) {
              expect(res.body.id).to.equal(1);
              expect(res.body.scientificName).to.equal('Ammodramus maritimus macgillivraii');
              done();
            });
        });

        it('should not allow user to create a species', function(done){

          agent.post('species/3')
            .set('Authorization', 'Bearer ' + jwt)
            .send(newSpecies)
            .end(function(err, res) {
              expect(res.body.message).to.equal('You do not have editing privileges.');
              expect(res.statusCode).to.equal(403);
              done();
            });
        });

        it('should not allow user to destroy a species', function(done){
          agent.delete('species/1')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res) {
              expect(res.body.message).to.equal('You must have admin privileges to complete this task.');
              expect(res.statusCode).to.equal(403);
              done();
            });
        });

        it('should not allow user to update a species', function(done){
          agent.post('species/1')
            .set('Authorization', 'Bearer ' + jwt)
            .send(updateSpecies)
            .end(function(err, res) {
              expect(res.body.message).to.equal('You do not have editing privileges.');
              expect(res.statusCode).to.equal(403);
              done();
            });
        });

        it('should not allow user to change account type', function(done) {
          agent.put('user/1')
            .set('Authorization', 'Bearer ' + jwt)
            .send({ "accountType": "admin" })
            .end(function (err, res) {
              expect(res.body.message).to.equal('You must have admin privileges to complete this task.');
              expect(res.statusCode).to.equal(403);
              done();
            });
        });
      });

      describe('with editor privileges', function() {

        before(function(done) {
          // Create an authenticated user w/editor privileges
          User.create({
            name: 'jimmy key',
            email: 'editor@gmail.com',
            job: 'tester',
            accountType: 'editor'
          }).exec(function (err, user) {
            jwt = sailsTokenAuth.createToken(user);
            done();
          });
        });

        it('should allow user to get list of species', function(done) {
          agent.get('species')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res) {
              expect(res.body).to.be.instanceof(Array);
              expect(res.statusCode).to.equal(200);
              done();
            });
        });

        it('should allow user to get species by id', function(done) {
          agent.get('species/1')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res) {
              expect(res.body.id).to.equal(1);
              expect(res.body.scientificName).to.equal('Ammodramus maritimus macgillivraii');
              done();
            });
        });

        it('should allow user to create a species', function(done){
          agent.post('species')
            .set('Authorization', 'Bearer ' + jwt)
            .send(newSpecies)
            .end(function(err, res) {
              expect(res.statusCode).to.equal(201);
              done();
            });
        });

        it('should not allow user to destroy a species by id', function(done){
          agent.delete('species/5')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res) {
              expect(res.statusCode).to.equal(403);
              done();
            });
        });

        it('should allow user to update a species', function(done){
          agent.put('species/4')
            .set('Authorization', 'Bearer ' + jwt)
            .send(updateSpecies)
            .end(function(err, res) {
              expect(res.body.scientificName).to.equal('Spondylurus culebrae');
              expect(res.statusCode).to.equal(200);
              done();
            });
        });

        it('should not allow user to change account type', function(done) {
          agent.put('user/1')
            .set('Authorization', 'Bearer ' + jwt)
            .send({ "accountType": "admin" })
            .end(function (err, res) {
              expect(res.body.message).to.equal('You must have admin privileges to complete this task.');
              expect(res.statusCode).to.equal(403);
              done();
            });
        });
      });

      describe('with admin privileges', function() {

        before(function(done) {
          // Create an authenticated user w/admin privileges
          User.create({
            name: 'donald drumpf',
            email: 'admin@gmail.com',
            job: 'tester',
            accountType: 'admin'
          }).exec(function (err, user) {
            jwt = sailsTokenAuth.createToken(user);
            done();
          });
        });

        it('should allow user to get list of species', function(done) {
          agent.get('species')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res) {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.instanceof(Array);
              done();
            });
        });

        it('should allow user to get species by id', function(done) {
          agent.get('species/1')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res) {
              expect(res.statusCode).to.equal(200);
              expect(res.body.scientificName).to.equal('Ammodramus maritimus macgillivraii');
              done();
            });
        });

        it('should allow user to create a species', function(done){
          agent.post('species')
            .set('Authorization', 'Bearer ' + jwt)
            .send(anotherNewSpecies)
            .end(function(err, res) {
              expect(res.statusCode).to.equal(201);
              done();
            });
        });

        it('should allow user to destroy a species', function(done){
          agent.delete('species/6')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res) {
              expect(res.statusCode).to.equal(200);
              done();
            });
        });

        it('should allow user to update a species', function(done){
          agent.put('species/1')
            .set('Authorization', 'Bearer ' + jwt)
            .send({ scientificName: 'Testing 123' })
            .end(function(err, res) {
              expect(res.body.scientificName).to.equal('Testing 123');
              expect(res.statusCode).to.equal(200);
              done();
            });
        });

        it('should allow user to change account type', function(done) {
          agent.put('user/2')
            .set('Authorization', 'Bearer ' + jwt)
            .send({ "accountType": "admin" })
            .end(function (err, res) {
              expect(res.body.accountType).to.equal('admin');
              expect(res.statusCode).to.equal(200);
              done();
            });
        });
      });
    });
  });
})();
