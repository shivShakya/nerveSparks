import express from 'express';
import body_parser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from 'dotenv';
import cors from 'cors';
env.config();
import { MongoClient } from 'mongodb';
const mongoURI = 'mongodb+srv://shiv_test:test@cluster0.xzzdmgf.mongodb.net/test';
const client = new MongoClient(mongoURI, { useUnifiedTopology: true });

// Database connection
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('NERVESPARKS');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
};


const PORT = 3000;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const app = express();


app.use(body_parser.json());
app.use(cors());

app.use(async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    req.db = db;
    next();
  } catch (err) {
    console.error('Error connecting to the database:', err);
    res.status(500).json({ error: 'Error connecting to the database' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const db = req.db;
    let collection;

    switch (role) {
      case 'admin':
        collection = db.collection('admin');
        break;
      case 'user':
        collection = db.collection('user');
        break;
      case 'dealership':
        collection = db.collection('dealership');
        break;
      default:
        return res.status(401).json({ message: "Invalid role" });
    }

    const user = await collection.findOne({ user_email: email });

    if (!user) {
      return res.status(401).json({ message: "Invalid Email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        user : user
      },
      JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json(token);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


function authenticateToken(req , res , next){
       const token = req.headers['authorization'];

       if(!token){
           return res.status(403).json({ message : 'No token provided'});
       }

       jwt.verify(token , JWT_SECRET_KEY , (err, user) => {
               if(err){
                   return res.status(403).json({message : 'Invalid token'});
               }

               req.user = user;
               next();
       });
}

//To view all cars
app.get('/cars',authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const carsCollection = db.collection('cars');

    const cars = await carsCollection.find().toArray();
    res.json(cars);
  } catch (err) {
    console.error("can't get any car", err);
    res.status(500).json({ error: 'error' });
  }
});


//To view all dealership
app.get('/dealership',authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const dealerCollection = db.collection('dealership');

    const dealer = await dealerCollection.find().toArray();
    res.json(dealer);
  } catch (err) {
    console.error('Error retrieving dealership:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//To view all cars in a dealership
app.get('/dealerships/:dealershipId/cars',authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const dealershipCollection = db.collection('dealership');

    const dealershipId = req.params.dealershipId;
    const dealership = await dealershipCollection.findOne({ dealership_id: dealershipId});

    if (!dealership) {
      return res.status(404).json({ message: 'Dealership not found' });
    }

    const carsCollection = db.collection('cars');
    const cars = await carsCollection.find({ car_id: { $in: dealership.cars } }).toArray();

    res.json(cars);
  } catch (err) {
    console.error('Error retrieving cars from dealership:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//To view dealerships with a certain car
app.get('/cars/:carId/dealerships',authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const dealershipsCollection = db.collection('dealership');

    const carId = req.params.carId;
    const dealerships = await dealershipsCollection.find({ cars: carId }).toArray();

    res.json(dealerships);
  } catch (err) {
    console.error('Error retrieving dealerships with a certain car:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//To view all vehicles owned by user
app.get('/users/:userId/vehicles',authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const userCollection = db.collection('user');

    const userId = req.params.userId;
    const user = await userCollection.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const carsCollection = db.collection('cars');
    const ownedCars = await carsCollection.find({ car_id: { $in: user.vehicle_info } }).toArray();

    res.json(ownedCars);
  } catch (err) {
    console.error('Error retrieving vehicles owned by user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/cars/:carId/deals',authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const carsCollection = db.collection('cars');

    const carId = req.params.carId;
    const car = await carsCollection.findOne({ car_id: carId });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const dealCollection = db.collection('deal');
    const deals = await dealCollection.find({ car_id: carId }).toArray();

    res.json(deals);
  } catch (err) {
    console.error('Error retrieving deals on a certain car:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//To view all deals from a certain dealership
app.get('/dealerships/:dealershipId/deals',authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const dealershipCollection = db.collection('dealership');

    const dealershipId = req.params.dealershipId;
    const dealership = await dealershipCollection.findOne({ car_id: dealershipId });

    if (!dealership) {
      return res.status(404).json({ message: 'Dealership not found' });
    }

    const dealCollection = db.collection('deal');
    const deals = await dealCollection.find({ deal_id: { $in: dealership.deals } }).toArray();

    res.json(deals);
  } catch (err) {
    console.error('Error retrieving deals from a certain dealership:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//To allow user to buy a car after a deal is made
app.post('/users/:userId/buy/:carId',authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const userCollection = db.collection('user');
    const carsCollection = db.collection('cars');

    const userId = req.params.userId;
    const carId = req.params.carId;

    // Find the user and the car by their respective IDs
    const user = await userCollection.findOne({ user_id: userId });
    const car = await carsCollection.findOne({ cars_id: carId });

    if (!user || !car) {
      return res.status(404).json({ message: 'User or Car not found' });
    }

    // Check if the car is available for sale (in the deals collection)
    const dealCollection = db.collection('deal');
    const deal = await dealCollection.findOne({ car_id: carId });

    if (!deal) {
      return res.status(404).json({ message: 'Car is not available for sale' });
    }

    // Update the user's vehicle_info with the new car's ID
    user.vehicle_info.push(carId);
    await userCollection.updateOne({ user_id: userId }, { $set: { vehicle_info: user.vehicle_info } });

    // Remove the car from the deals collection as it is now sold
    await dealCollection.deleteOne({ car_id: carId });

    res.json({ message: 'Car purchased successfully' });
  } catch (err) {
    console.error('Error buying a car:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// To view all cars sold by a dealership
app.get('/dealerships/:dealershipId/sold_cars', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const dealershipCollection = db.collection('dealership');
    const soldVehiclesCollection = db.collection('sold_vehicles');

    const dealershipId = req.params.dealershipId;
    const dealership = await dealershipCollection.findOne({ dealership_id:dealershipId });

    if (!dealership) {
      return res.status(404).json({ message: 'Dealership not found' });
    }

    const soldCars = await soldVehiclesCollection.find({ dealership_id: dealershipId }).toArray();
    res.json(soldCars);
  } catch (err) {
    console.error('Error retrieving cars sold by a dealership:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// To add cars to a dealership
app.post('/dealerships/:dealershipId/cars', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const dealershipCollection = db.collection('dealership');
    const carsCollection = db.collection('cars');

    const dealershipId = req.params.dealershipId;
    const dealership = await dealershipCollection.findOne({ dealership_id: dealershipId });

    if (!dealership) {
      return res.status(404).json({ message: 'Dealership not found' });
    }

    const { car_ids } = req.body;
    if (!Array.isArray(car_ids)) {
      return res.status(400).json({ message: 'car_ids should be an array' });
    }

    const carsToAdd = await carsCollection.find({ car_id: { $in: car_ids } }).toArray();

    if (carsToAdd.length !== car_ids.length) {
      return res.status(404).json({ message: 'Some cars not found' });
    }

    await dealershipCollection.updateOne({ dealership_id: dealershipId }, { $push: { cars: { $each: car_ids } } });

    res.json({ message: 'Cars added to dealership successfully' });
  } catch (err) {
    console.error('Error adding cars to a dealership:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// To view deals provided by a dealership
app.get('/dealerships/:dealershipId/deals', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const dealershipCollection = db.collection('dealership');
    const dealCollection = db.collection('deal');

    const dealershipId = req.params.dealershipId;
    const dealership = await dealershipCollection.findOne({ dealership_id:dealershipId });

    if (!dealership) {
      return res.status(404).json({ message: 'Dealership not found' });
    }

    const deals = await dealCollection.find({ dealership_id: dealershipId }).toArray();
    res.json(deals);
  } catch (err) {
    console.error('Error retrieving deals provided by a dealership:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// To add deals to a dealership
app.post('/dealerships/:dealershipId/deals', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const dealershipCollection = db.collection('dealership');
    const dealCollection = db.collection('deal');

    const dealershipId = req.params.dealershipId;
    const dealership = await dealershipCollection.findOne({ _id: ObjectId(dealershipId) });

    if (!dealership) {
      return res.status(404).json({ message: 'Dealership not found' });
    }

    const { car_id, deal_info } = req.body;
    const car = await db.collection('cars').findOne({ _id: ObjectId(car_id) });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const newDeal = {
      deal_id: ObjectId().toString(),
      car_id: car_id,
      deal_info: deal_info
    };

    await dealCollection.insertOne(newDeal);
    await dealershipCollection.updateOne({ _id: ObjectId(dealershipId) }, { $push: { deals: newDeal.deal_id } });

    res.json({ message: 'Deal added to dealership successfully' });
  } catch (err) {
    console.error('Error adding deals to a dealership:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// To view all vehicles dealership has sold
app.get('/dealerships/:dealershipId/sold_vehicles', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const dealershipCollection = db.collection('dealership');
    const soldVehiclesCollection = db.collection('sold_vehicles');

    const dealershipId = req.params.dealershipId;
    const dealership = await dealershipCollection.findOne({ _id: ObjectId(dealershipId) });

    if (!dealership) {
      return res.status(404).json({ message: 'Dealership not found' });
    }

    const soldCars = await soldVehiclesCollection.find({ dealership_id: dealershipId }).toArray();
    res.json(soldCars);
  } catch (err) {
    console.error('Error retrieving sold vehicles of a dealership:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// To add new vehicle to the list of sold vehicles after a deal is made
app.post('/dealerships/:dealershipId/sold_vehicles', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const dealershipCollection = db.collection('dealership');
    const soldVehiclesCollection = db.collection('sold_vehicles');

    const dealershipId = req.params.dealershipId;
    const dealership = await dealershipCollection.findOne({ _id: ObjectId(dealershipId) });

    if (!dealership) {
      return res.status(404).json({ message: 'Dealership not found' });
    }

    const { car_id, vehicle_info } = req.body;
    const car = await db.collection('cars').findOne({ _id: ObjectId(car_id) });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const newSoldVehicle = {
      vehicle_id: ObjectId().toString(),
      car_id: car_id,
      vehicle_info: vehicle_info,
      dealership_id: dealershipId
    };

    await soldVehiclesCollection.insertOne(newSoldVehicle);

    res.json({ message: 'New sold vehicle added successfully' });
  } catch (err) {
    console.error('Error adding new sold vehicle:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log("Server is started on PORT no. " + PORT);
});
