const expect = require('chai').expect;
const request = require('supertest');
const should = require('should');
const http = require('should-http');
const Users = require ("../../db/models/users")
const app = require('../../app');

describe('users signup' , () => {

    before((done) => {
        Users.remove({}, () => { 
            done();
         })
    })

    after((done) => {
        Users.remove({}, () => { 
            done();
         })
    })

    it('should signup user using email and password', (done) => {
        request(app)
            .post('/users/signup')
            .send({
                "user":{
                "email":"email1@ema.com",
                "password":"Contra$ena.1"
                }
            })
            .expect("Content-type", /json/)
            .end((err, res) => {
                res.should.be.json();
                res.should.have.status(200);
                console.log("body", res.body)
                res.body.should.have.property('token')
                done();
            })
    })

    it('should login previouly created user using email and password and return token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            "user":{
            "email":"email1@ema.com",
            "password":"Contra$ena.1"
            }
        })
        .expect("Content-type", /json/)
        .end((err,res) => {
            res.should.be.json();
            res.should.have.status(200);
            console.log("body",res.body);
            res.body.should.have.property('token');
            done();
        })
    })

    it('should reject repeated email and password and return error JSON', (done) => {
        request(app)
        .post('/users/signup')
        .send({
            "user":{
            "email":"email1@ema.com",
            "password":"Contra$ena.1"
            }
        })
        .expect("Content-type", /json/)
        .end((err,res) => {
            res.should.be.json();
            res.should.have.status(406);
            console.log("body",res.body);
            res.body.should.have.property('error');
            done();
        })
    })
})