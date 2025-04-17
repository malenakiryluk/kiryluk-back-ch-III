import {expect} from "chai"
import {describe, it} from "mocha"
import supertest from "supertest"
import mongoose from 'mongoose';

await mongoose.connect(`mongodb+srv://malenakiryluk:malena2014!@cluster0.tab2i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)

const requester=supertest("http://localhost:8080")

describe("pruebas sobre los endpoints de pets", function() {
    this.timeout(6000)

    describe("Pruebas básicas",()=>{
        before(async()=>{
            await mongoose.connection.collection("pets").deleteMany({specie:"test"})
        })

        it("Al enviar datos correctos y completos el status es 200", async()=>{
            let mockPet={name:"Roger",specie:"test",birthDate:new Date()}

            let {statusCode}=await requester.post("/api/pets").send(mockPet)
            expect(statusCode).to.be.eq(200)
        })

        it("Al NO enviar datos completos el status es 400", async()=>{
            let mockPet={name:"Roger",birthDate:new Date()}

            let {statusCode}=await requester.post("/api/pets").send(mockPet)
            expect(statusCode).to.be.eq(400)
        })

        it("Al NO enviar datos completos la respuesta tiene una propiedad status con valor error", async()=>{
            let mockPet={name:"Roger",birthDate:new Date()}

            let {body}=await requester.post("/api/pets").send(mockPet)
            expect(body).to.have.property("status").and.to.be.eq("error")
        })

        it("al enviar una ptecion con datos correctos se registra en la DB", async()=>{
            let mockPet={name:"Roger",specie:"test",birthDate:new Date()}

            let {statusCode, body}=await requester.post("/api/pets").send(mockPet)
            // console.log(resultado.status)
            expect(body).to.has.property("payload")
            expect(body).to.has.property("status").and.to.be.eq("success")
            expect(body.payload).to.have.property("name").and.to.be.eq(mockPet.name)
            expect(body.payload).to.has.property("_id")
        })

        it("Al hacer una peticion de tipo get a api/pets el status es 200", async()=>{
            let {statusCode}=await requester.get("/api/pets")
            expect(statusCode).to.be.eq(200)
        })

        it("Al hacer una peticion de tipo get a api/pets retorna un apropiedad payloas de tipo array", async()=>{
            let {body}=await requester.get("/api/pets")
            expect(body).to.have.property("payload")

            if (Array.isArray(body.payload)) {
                body.payload.forEach(mascota=>{
                    expect(mascota).to.have.property("name")
                    expect(mascota).to.have.property("specie")
                    expect(mascota).to.have.property("birthDate")
                    expect(mascota).to.have.property("_id")
                })
            }
        })
    })
})
