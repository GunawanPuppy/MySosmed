const {database} = require("../config/mongodb")
const {hash} = require("../helpers/bcrypt")

const users = [
    {
        name: "admin",
        username:"admin",
        email: "admin@mail.com",
        password: "12345",
    }
]

//cara seeding 
async function seeding(){
    const userDB = database.collection("users")
    const newUsers = users.map((el) => {
        el.password = hash(el.password)
        return el
    })
    const result = await userDB.insertMany(newUsers)
    console.log(result);
}

seeding()