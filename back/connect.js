import { MongoClient } from 'mongodb';
import {faker} from '@faker-js/faker';
import bcrypt from 'bcrypt';
const URI = 'mongodb+srv://shiv_test:test@cluster0.xzzdmgf.mongodb.net/test';

//function for database connection

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(URI, { useUnifiedTopology: true });
    console.log('Connected to database');
    const db = client.db('NERVESPARKS'); 
    return db;
  } catch (err) {
    console.error('issue connecting to MongoDB:', err);
    throw err;
  }
}


function generateBcryptHashPassword(  plainPassword  ) {
  const saltRounds = 10; 
  return bcrypt.hashSync(plainPassword, saltRounds);
}

const generateRandomId = () => faker.string.uuid();

const generateVehicle = () => {
  return {
    car_id: generateRandomId(),
    type: faker.vehicle.type(),
    name: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    car_info: {
      color: faker.vehicle.color(),
      price: faker.number.int({ min: 10000, max: 50000 }),
    },
  };
};

const insertDummyData = async () => {
  try {
    const db = await connectToDatabase();
    const adminCollection = db.collection('admin');
    const userCollection = db.collection('user');
    const dealershipCollection = db.collection('dealership');
    const dealCollection = db.collection('deal');
    const carsCollection = db.collection('cars');
    const soldVehiclesCollection = db.collection('sold_vehicles');

    // Insert Admin Data
    await adminCollection.insertOne({
      admin_id: 'shivdu2000@gmail.com', 
      password: generateBcryptHashPassword('shivam#234'), 
    });

    // Generate Users Data
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = {
        user_email: faker.internet.email(),
        user_id: generateRandomId(),
        user_location: faker.location.city() + ', ' + faker.location.state(),
        user_info: {
          name: faker.person.firstName(),
          age: faker.number.int({ min: 18, max: 60 }),
          occupation: faker.person.jobTitle(),
          phone: faker.phone.number(),
        },
        password: generateBcryptHashPassword('user_password'),
        vehicle_info: [],
      };
      users.push(user);
    }

    // Insert Users Data
    await userCollection.insertMany(users);

    // Generate Dealerships Data
    const dealerships = [];
    for (let i = 0; i < 10; i++) {
      const dealership = {
        dealership_email: faker.internet.email(),
        dealership_id: generateRandomId(),
        dealership_name: faker.company.buzzNoun(),
        dealership_location: faker.location.city() + ', ' + faker.location.state(),
        password: generateBcryptHashPassword('dealership_password'),
        dealership_info: {
          contact_person: faker.person.firstName(),
          contact_email: faker.internet.email(),
          phone: faker.phone.number(),
        },
        cars: [],
        deals: [],
        sold_vehicles: [],
      };
      dealerships.push(dealership);
    }

    // Insert Dealerships Data
    await dealershipCollection.insertMany(dealerships);

    const cars = [];
    for (let i = 0; i < 20; i++) {
      const car = generateVehicle();
      cars.push(car);
    }

    // Insert Car Data
    await carsCollection.insertMany(cars);

    // Generate Deals Data
    const deals = [];
    for (const car of cars) {
      const deal = {
        deal_id: generateRandomId(),
        car_id: car.car_id,
        deal_info: {
          discount: faker.number.int({ min: 500, max: 2000 }),
        },
      };
      deals.push(deal);
    }

    // Insert Deals Data
    await dealCollection.insertMany(deals);

    // Generate Sold Vehicle Data for Users and Dealerships
    const soldVehicles = [];
    for (const car of cars) {
      const soldVehicle = {
        vehicle_id: generateRandomId(),
        car_id: car.car_id,
        vehicle_info: {
          sale_price: faker.number.int({ min: 8000, max: 40000 }),
        },
      };
      soldVehicles.push(soldVehicle);
    }

           // Insert Sold Vehicle Data
    await soldVehiclesCollection.insertMany(soldVehicles);

    // Update User's vehicle_info
    for (const user of users) {
      const numVehicles = faker.number.int({ min: 1, max: 3 });
      const vehicles = faker.helpers.arrayElements(cars, numVehicles);
      user.vehicle_info = vehicles.map((car) => car.car_id);
      await userCollection.updateOne({ _id: user._id }, { $set: { vehicle_info: user.vehicle_info } });
    }

    // Update Dealership's cars, deals, and sold_vehicles
    for (const dealership of dealerships) {
      const numCars = faker.number.int({ min: 3, max: 8 });
      const carsToUpdate = faker.helpers.arrayElements(cars, numCars);
      dealership.cars = carsToUpdate.map((car) => car.car_id);

      const numDeals = faker.number.int({ min: 1, max: 5 });
      const dealsToUpdate = faker.helpers.arrayElements(deals, numDeals);
      dealership.deals = dealsToUpdate.map((deal) => deal.deal_id);

      const numSoldVehicles = faker.number.int({ min: 1, max: 3 });
      const soldVehiclesToUpdate = faker.helpers.arrayElements(soldVehicles, numSoldVehicles);
      dealership.sold_vehicles = soldVehiclesToUpdate.map((soldVehicle) => soldVehicle.vehicle_id);

      await dealershipCollection.updateOne(
        { _id: dealership._id },
        {
          $set: {
            cars: dealership.cars,
            deals: dealership.deals,
            sold_vehicles: dealership.sold_vehicles,
          },
        }
      );
    }

    console.log('data inserted successfully.');
  } catch (err) {
    console.error('Error inserting data:', err);
  } 
};

insertDummyData();