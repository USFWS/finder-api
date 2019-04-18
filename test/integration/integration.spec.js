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

      describe('dealing with Species', function() {

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

      describe('dealing with Categories', function() {

        it('should allow the user to get a list of species categories', function(done) {
          agent.get('categories')
            .end(function(err, res) {
              expect(err).to.not.exist;
              expect(res.body).to.be.a('array');
              expect(res.body.length).to.equal(2);
              expect(res.statusCode).to.equal(200);
              done();
            });
        });

        it('should allow the user to get species category by id', function(done) {
          agent.get('categories/1')
            .end(function(err, res) {
              expect(err).to.not.exist;
              expect(res.body.name).to.equal("Highest Priority—Critically Imperiled");
              expect(res.statusCode).to.equal(200);
              done();
            });
        });

        it('should not allow the user to create a species category', function(done) {
          agent.post('categories/3')
            .send({
              "name": "test",
              "code": "test",
              "description": "test"
            })
            .end(function(err, res) {
              expect(err).to.not.exist;
              expect(res.body.message).to.equal('No access token.');
              expect(res.statusCode).to.equal(401);
              done();
            });
        });

        it('should not allow the user to update a species category', function(done) {
          agent.put('categories/2')
            .send({
              "name": "test",
              "code": "test",
              "description": "test"
            })
            .end(function(err, res) {
              expect(err).to.not.exist;
              expect(res.body.message).to.equal('No access token.');
              expect(res.statusCode).to.equal(401);
              done();
            });
        });

        it('should not allow the user to delete a species category', function(done) {
          agent.delete('categories/2')
            .end(function(err, res) {
              expect(err).to.not.exist;
              expect(res.body.message).to.equal('No access token.');
              expect(res.statusCode).to.equal(401);
              done();
            });
        });

      });

      describe('dealing with Offices', function() {

        it('should allow user to get a list of Offices', function(done) {
          agent.get('offices')
            .end(function (err, res) {
              expect(res.body).to.be.a('array');
              expect(res.body.length).to.equal(4);
              expect(res.statusCode).to.equal(200);
              done();
            });
        });

        it('should allow user to get an Office by id', function(done) {
          agent.get('offices/1')
            .end(function (err, res) {
              expect(res.body.name).to.equal("Alabama Ecological Services Field Office");
              expect(res.statusCode).to.equal(200);
              done();
            });
        });

        it('should not allow user to create an Office', function(done) {
          agent.post('offices/5')
            .send({
              "name": "Test office"
            })
            .end(function (err, res) {
              expect(res.body.message).to.equal('No access token.');
              expect(res.statusCode).to.equal(401);
              done();
            });
        });

        it('should not allow user to update an Office', function(done) {
          agent.put('offices/1')
            .send({
              "name": "Test office"
            })
            .end(function (err, res) {
              expect(res.body.message).to.equal('No access token.');
              expect(res.statusCode).to.equal(401);
              done();
            });
        });

        it('should not allow user to delete an Office', function(done) {
          agent.delete('offices/1')
            .end(function (err, res) {
              expect(res.body.message).to.equal('No access token.');
              expect(res.statusCode).to.equal(401);
              done();
            });
        });

      });

    });

    describe('for authenticated users', function() {
      var jwt;

      describe('with viewer privileges', function() {

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

        describe('dealing with Species', function() {

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

        describe('dealing with Categories', function() {

          it('should allow the user to get a list of categories', function(done) {
            agent.get('categories')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.equal(2);
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to get category by id', function(done) {
            agent.get('categories/1')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal("Highest Priority—Critically Imperiled");
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should not allow the user to create a category', function(done) {
            agent.post('categories')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "test",
                "code": "test",
                "description": "test"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You do not have editing privileges.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

          it('should not allow the user to update a category', function(done) {
            agent.put('categories/3')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "Updated name",
                "code": "test",
                "description": "test"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You do not have editing privileges.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

          it('should not allow the user to delete a category', function(done) {
            agent.delete('categories/2')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You must have admin privileges to complete this task.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

        });

        describe('dealing with Offices', function() {

          it('should allow the user to get a list of offices', function(done) {
            agent.get('offices')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.equal(4);
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to get an office by id', function(done) {
            agent.get('offices/1')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal("Alabama Ecological Services Field Office");
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should not allow the user to create an office', function(done) {
            agent.post('offices')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "test"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You do not have editing privileges.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

          it('should allow the user to update an office', function(done) {
            agent.put('offices/3')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "Updated name"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You do not have editing privileges.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

          it('should not allow the user to delete a species category', function(done) {
            agent.delete('offices/2')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You must have admin privileges to complete this task.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

        });

      });

      describe('with range editor privileges', function() {

        before(function(done) {
          // Create an authenticated user w/range editor privileges
          User.create({
            name: 'CC sabathia',
            email: 'cc@yankees.com',
            job: 'starting pitcher',
            accountType: 'range editor'
          }).exec(function (err, user) {
            jwt = sailsTokenAuth.createToken(user);
            done();
          });
        });

        describe('dealing with Species', function() {

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

          it('should not allow user to create a species', function(done){
            agent.post('species')
              .set('Authorization', 'Bearer ' + jwt)
              .send(newSpecies)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You only have permission to update a species’ range.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

          it('should not allow user to destroy a species by id', function(done){
            agent.delete('species/5')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You must have admin privileges to complete this task.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

          it('should allow user to only update a species’ range', function(done){
            agent.put('species/4')
              .set('Authorization', 'Bearer ' + jwt)
              .send(Object.assign(updateSpecies, { range: ['Maryland', 'Georgia'] }))
              .end(function(err, res) {
                expect(res.body.scientificName).to.equal('Chromolaena frustrata');
                expect(res.body.range).to.include('Maryland');
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

        describe('dealing with Categories', function() {

          it('should allow the user to get a list of categories', function(done) {
            agent.get('categories')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.equal(2);
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to get category by id', function(done) {
            agent.get('categories/1')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal("Highest Priority—Critically Imperiled");
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should not allow the user to create a category', function(done) {
            agent.post('categories')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "test",
                "code": "test",
                "description": "test"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You only have permission to update a species’ range.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

          it('should not allow the user to update a category', function(done) {
            agent.put('categories/3')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "Updated name",
                "code": "test",
                "description": "test"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You only have permission to update a species’ range.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

          it('should not allow the user to delete a category', function(done) {
            agent.delete('categories/2')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You must have admin privileges to complete this task.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

        });

        describe('dealing with Offices', function() {

          it('should allow the user to get a list of offices', function(done) {
            agent.get('offices')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.equal(4);
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to get an office by id', function(done) {
            agent.get('offices/1')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal("Alabama Ecological Services Field Office");
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should not allow the user to create an office', function(done) {
            agent.post('offices')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "test"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You only have permission to update a species’ range.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

          it('should allow the user to update an office', function(done) {
            agent.put('offices/3')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "Updated name"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You only have permission to update a species’ range.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

          it('should not allow the user to delete a species category', function(done) {
            agent.delete('offices/2')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You must have admin privileges to complete this task.');
                expect(res.statusCode).to.equal(403);
                done();
              });
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

        describe('dealing with Species', function() {

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

        describe('dealing with Categories', function() {

          it('should allow the user to get a list of categories', function(done) {
            agent.get('categories')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.equal(2);
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to get category by id', function(done) {
            agent.get('categories/1')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal("Highest Priority—Critically Imperiled");
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to create a category', function(done) {
            agent.post('categories')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "test",
                "code": "test",
                "description": "test"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal("test");
                expect(res.statusCode).to.equal(201);
                done();
              });
          });

          it('should allow the user to update a category', function(done) {
            agent.put('categories/3')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "Updated name",
                "code": "test",
                "description": "test"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal('Updated name');
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should not allow the user to delete a category', function(done) {
            agent.delete('categories/2')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You must have admin privileges to complete this task.');
                expect(res.statusCode).to.equal(403);
                done();
              });
          });

        });

        describe('dealing with Offices', function() {

          it('should allow the user to get a list of offices', function(done) {
            agent.get('offices')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.equal(4);
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to get an office by id', function(done) {
            agent.get('offices/1')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal("Alabama Ecological Services Field Office");
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to create an office', function(done) {
            agent.post('offices')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "adminRegion": "Southeast",
                "name": "Test office",
                "street": "Test way",
                "city": "testopolis",
                "state": "FL",
                "zip": "20393"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal("Test office");
                expect(res.statusCode).to.equal(201);
                done();
              });
          });

          it('should allow the user to update an office', function(done) {
            agent.put('offices/5')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "Updated name"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal('Updated name');
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should not allow the user to delete an office', function(done) {
            agent.delete('offices/2')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.message).to.equal('You must have admin privileges to complete this task.');
                expect(res.statusCode).to.equal(403);
                done();
              });
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

        describe('dealing with Species', function() {

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

        describe('dealing with Categories', function() {

          it('should allow the user to get a list of categories', function(done) {
            agent.get('categories')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.equal(3);
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to get category by id', function(done) {
            agent.get('categories/1')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal("Highest Priority—Critically Imperiled");
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to create a category', function(done) {
            agent.post('categories')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "another test",
                "code": "test 2",
                "description": "test 2"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal("another test");
                expect(res.statusCode).to.equal(201);
                done();
              });
          });

          it('should allow the user to update a category', function(done) {
            agent.put('categories/3')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "Updated name again",
                "code": "test",
                "description": "test"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal('Updated name again');
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to delete a category', function(done) {
            agent.delete('categories/2')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

        });

        describe('dealing with Offices', function() {

          it('should allow the user to get a list of offices', function(done) {
            agent.get('offices')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.equal(5);
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to get an office by id', function(done) {
            agent.get('offices/1')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal("Alabama Ecological Services Field Office");
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to create an office', function(done) {
            agent.post('offices')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "adminRegion": "Southeast",
                "name": "Another Test office",
                "street": "Test way 123",
                "city": "testopolis city",
                "state": "FL",
                "zip": "20393"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal("Another Test office");
                expect(res.statusCode).to.equal(201);
                done();
              });
          });

          it('should allow the user to update an office', function(done) {
            agent.put('offices/5')
              .set('Authorization', 'Bearer ' + jwt)
              .send({
                "name": "Updated name again"
              })
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal('Updated name again');
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

          it('should allow the user to delete an office', function(done) {
            agent.delete('offices/2')
              .set('Authorization', 'Bearer ' + jwt)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);
                done();
              });
          });

        });

      });
    });
  });
})();
