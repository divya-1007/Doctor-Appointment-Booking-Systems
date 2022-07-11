let mongoose = require("mongoose");
var User = require("../src/models/User");
var chai = require('chai');
var expect = require('chai').expect;
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
const request = require('supertest');
var index = require('../app');
let server = require('../src/controller/UserController').UserSignup
const assert = require('chai').assert;


//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Tasks API', () => {

    /**
     * Test the GET route
     */
    // describe("GET /api/tasks", () => {
    //     it("It should GET all the tasks", (done) => {
    //         chai.request(server)
    //             .get("/api/tasks")
    //             .end((err, response) => {
    //                 response.should.have.status(200);
    //                 response.body.should.be.a('array');
    //                 response.body.length.should.be.eq(3);
    //             done();
    //             });
    //     });

    //     it("It should NOT GET all the tasks", (done) => {
    //         chai.request(server)
    //             .get("/api/task")
    //             .end((err, response) => {
    //                 response.should.have.status(404);
    //             done();
    //             });
    //     });

    // });


    /**
     * Test the GET (by id) route
     */
    // describe("GET /api/tasks/:id", () => {
    //     it("It should GET a task by ID", (done) => {
    //         const taskId = 1;
    //         chai.request(server)                
    //             .get("/api/tasks/" + taskId)
    //             .end((err, response) => {
    //                 response.should.have.status(200);
    //                 response.body.should.be.a('object');
    //                 response.body.should.have.property('id');
    //                 response.body.should.have.property('name');
    //                 response.body.should.have.property('completed');
    //                 response.body.should.have.property('id').eq(1);
    //             done();
    //             });
    //     });

    //     it("It should NOT GET a task by ID", (done) => {
    //         const taskId = 123;
    //         chai.request(server)                
    //             .get("/api/tasks/" + taskId)
    //             .end((err, response) => {
    //                 response.should.have.status(404);
    //                 response.text.should.be.eq("The task with the provided ID does not exist.");
    //             done();
    //             });
    //     });

    // });
    

    /**
     * Test the POST route
     */
    describe("POST /api/signin ", () => {
    //   it("It POST /api/signin ", () => {
        it("It should POST a new task", (done) => {
            const task = {
                email: "divyasynetalsolutions@gmail.com",
                password: "Test123!@#"
            };
            chai.request(index)                
                .post("/api/signin")
                .send(task)
                .end((err, response) => {
                    response.should.have.status(200);
                    expect("divyasynetalsolutions@gmail.com").to.be.an('string').eq("divyasynetalsolutions@gmail.com");
                    console.log( response.body)
                    //  response.body.should.be.a('object');
                    // response.body.should.have.property({'data':'data'})
                    // expect('divyasynetalsolutions@gmail.com').to.be.a('string');
                    // response.body.should.be.a('object');
                    // response.body.should.have.property('email').eq("divyasynetalsolutions@gmail.com");
                    // expect(response.body).to.deep.equal({});
                    // response.body.should.have.property('password').eq("Test123!@#");
                done();
                });
        // });
      })
        // it("It should NOT POST a new task without the name property", (done) => {
        //     const task = {
        //         completed: false
        //     };
        //     chai.request(server)                
        //         .post("/api/signin")
        //         .send(task)
        //         .end((err, response) => {
        //             response.should.have.status(400);
        //             response.text.should.be.eq("The name should be at least 3 chars long!");
        //         done();
        //         });
        // });

    });


    /**
     * Test the PUT route
     */
    // describe("PUT /api/tasks/:id", () => {
    //     it("It should PUT an existing task", (done) => {
    //         const taskId = 1;
    //         const task = {
    //             name: "Task 1 changed",
    //             completed: true
    //         };
    //         chai.request(server)                
    //             .put("/api/tasks/" + taskId)
    //             .send(task)
    //             .end((err, response) => {
    //                 response.should.have.status(200);
    //                 response.body.should.be.a('object');
    //                 response.body.should.have.property('id').eq(1);
    //                 response.body.should.have.property('name').eq("Task 1 changed");
    //                 response.body.should.have.property('completed').eq(true);
    //             done();
    //             });
    //     });

    //     it("It should NOT PUT an existing task with a name with less than 3 characters", (done) => {
    //         const taskId = 1;
    //         const task = {
    //             name: "Ta",
    //             completed: true
    //         };
    //         chai.request(server)                
    //             .put("/api/tasks/" + taskId)
    //             .send(task)
    //             .end((err, response) => {
    //                 response.should.have.status(400);
    //                 response.text.should.be.eq("The name should be at least 3 chars long!");
    //             done();
    //             });
    //     });        
    // });
    

    /**
     * Test the PATCH route
     */

    // describe("PATCH /api/tasks/:id", () => {
    //     it("It should PATCH an existing task", (done) => {
    //         const taskId = 1;
    //         const task = {
    //             name: "Task 1 patch"
    //         };
    //         chai.request(server)                
    //             .patch("/api/tasks/" + taskId)
    //             .send(task)
    //             .end((err, response) => {
    //                 response.should.have.status(200);
    //                 response.body.should.be.a('object');
    //                 response.body.should.have.property('id').eq(1);
    //                 response.body.should.have.property('name').eq("Task 1 patch");
    //                 response.body.should.have.property('completed').eq(true);
    //             done();
    //             });
    //     });

    //     it("It should NOT PATCH an existing task with a name with less than 3 characters", (done) => {
    //         const taskId = 1;
    //         const task = {
    //             name: "Ta"
    //         };
    //         chai.request(server)                
    //             .patch("/api/tasks/" + taskId)
    //             .send(task)
    //             .end((err, response) => {
    //                 response.should.have.status(400);
    //                 response.text.should.be.eq("The name should be at least 3 chars long!");
    //             done();
    //             });
    //     });        
    // });
    

    /**
     * Test the DELETE route
     */
    // describe("DELETE /api/tasks/:id", () => {
    //     it("It should DELETE an existing task", (done) => {
    //         const taskId = 1;
    //         chai.request(server)                
    //             .delete("/api/tasks/" + taskId)
    //             .end((err, response) => {
    //                 response.should.have.status(200);
    //             done();
    //             });
    //     });

    //     it("It should NOT DELETE a task that is not in the database", (done) => {
    //         const taskId = 145;
    //         chai.request(server)                
    //             .delete("/api/tasks/" + taskId)
    //             .end((err, response) => {
    //                 response.should.have.status(404);
    //                 response.text.should.be.eq("The task with the provided ID does not exist.");
    //             done();
    //             });
    //     });

    // });




});
    
 
   