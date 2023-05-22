show dbs;

use "database"

# Insert
db.profiles.insertOne({
    name: 'Iman',
    email: 'Iman@gmail.com',
    address: 'DIY',
    hobby: [
        'reading', 'football'
    ]
})

# Read ALl
db.profiles.find()

# Read by ID
db.profiles.find({"name" :"Iman"})

# Update
db.profiles.updateOne({_id: ObjectId("646bb8f39ba0da077c4717ba")},{$set:{name:"abdur",address:"Jakarta"}})

# Delete
db.profiles.deleteOne({name : "abdur"})