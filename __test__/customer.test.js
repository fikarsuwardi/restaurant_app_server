const request = require("supertest");
const app = require("../app");
const { User, Category, Food } = require("../models/index");
const { createTokenFromData } = require("../helpers/token");

let validToken;

beforeAll((done) => {
  User.create({
    username: "beforetest",
    email: "beforetest@email.com",
    password: "123456789",
    role: "customer",
    phoneNumber: "123456",
    address: "wakanda",
  })
    .then((result) => {
      validToken = createTokenFromData({
        id: result.id,
        email: result.email,
        role: result.role,
      });
      // TEMPAT SEEDER DATA
      User.bulkCreate(require("../data/users.json"));
      Category.bulkCreate(require("../data/categories.json"));
      Food.bulkCreate(require("../data/food.json"));
      
      // console.log(validToken, "ini validToken");
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      // console.log(err, "ini error");
      done(err);
    });
});

let adminToken;

beforeAll((done) => {
  User.create({
    username: "admintest",
    email: "admintest@email.com",
    password: "123456789",
    role: "admin",
    phoneNumber: "123456",
    address: "wakanda",
  })
    .then((result) => {
      adminToken = createTokenFromData({
        id: result.id,
        email: result.email,
        role: result.role,
      });

      // console.log(adminToken, "ini admin token");
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      // console.log(err, "ini error");
      done(err);
    });
});

describe("Register Customer", () => {
  test("Register Success", async () => {
    const response = await request(app).post("/public/register").send({
      username: "test",
      email: "test@email.com",
      password: "123456",
      phoneNumber: "123456",
      address: "wakanda",
    });

    const { status, body } = response;

    expect(status).toBe(201);
    expect(body.data).toHaveProperty("id", expect.any(Number));
    expect(body).toHaveProperty("message", "Succes created user");
  });

  test("Email null", async () => {
    const response = await request(app).post("/public/register").send({
      username: "test",
      // email: "test@email.com",
      password: "123456",
      phoneNumber: "123456",
      address: "wakanda",
    });

    const { status, body } = response;
    // console.log(status, "ini status");
    // console.log(body, "ini body");

    expect(status).toBe(400);
    expect(body.error).toHaveProperty("message", "Email can't be null");
  });

  test("Password null", async () => {
    const response = await request(app).post("/public/register").send({
      username: "test",
      email: "test@email.com",
      // password: "123456",
      phoneNumber: "123456",
      address: "wakanda",
    });

    const { status, body } = response;
    // console.log(status, "ini status");
    // console.log(body, "ini body");

    expect(status).toBe(400);
    expect(body.error).toHaveProperty("message", "Password can't be null");
  });

  test("Email empty string", async () => {
    const response = await request(app).post("/public/register").send({
      username: "test",
      email: "",
      password: "123456",
      phoneNumber: "123456",
      address: "wakanda",
    });

    const { status, body } = response;
    // console.log(status, "ini status");
    // console.log(body, "ini body");

    expect(status).toBe(400);
    expect(body.error).toHaveProperty("message", "Email can't be empty");
  });

  test("Password empty string", async () => {
    const response = await request(app).post("/public/register").send({
      username: "test",
      email: "test@email.com",
      password: "",
      phoneNumber: "123456",
      address: "wakanda",
    });

    const { status, body } = response;
    // console.log(status, "ini status");
    // console.log(body, "ini body");

    expect(status).toBe(400);
    expect(body.error).toHaveProperty("message", "Password can't be empty");
  });

  test("Email already registered", async () => {
    const response = await request(app).post("/public/register").send({
      username: "test",
      email: "test@email.com",
      password: "123456",
      phoneNumber: "123456",
      address: "wakanda",
    });

    const { status, body } = response;
    // console.log(status, "ini status");
    // console.log(body, "ini body");

    expect(status).toBe(400);
    expect(body.error).toHaveProperty(
      "message",
      "Email address already in use!"
    );
  });

  test("Invalid email format", async () => {
    const response = await request(app).post("/public/register").send({
      username: "test",
      email: "testingemail.com",
      password: "123456",
      phoneNumber: "123456",
      address: "wakanda",
    });

    const { status, body } = response;
    // console.log(status, "ini status");
    // console.log(body, "ini body");

    expect(status).toBe(400);
    expect(body.error).toHaveProperty("message", "Invalid email format");
  });
});

describe("Login Customer", () => {
  test("Login success", async () => {
    const response = await request(app).post("/public/login").send({
      email: "beforetest@email.com",
      password: "123456789",
    });

    const { status, body } = response;
    // console.log(status, "ini status");
    // console.log(body, "ini body");

    expect(status).toBe(200);
    expect(body).toHaveProperty("message", "Succes Login");
    expect(body).toHaveProperty("access_token", expect.any(String));
  });

  test("Wrong password", async () => {
    const response = await request(app).post("/public/login").send({
      email: "beforetest@email.com",
      password: "passSalah",
    });

    const { status, body } = response;
    // console.log(status, "ini status");
    // console.log(body, "ini body");

    expect(status).toBe(401);
    expect(body.error).toHaveProperty("message", "Invalid (email / password)");
  });

  test("Email unregistered", async () => {
    const response = await request(app).post("/public/login").send({
      email: "testestes@email.com",
      password: "123456789",
    });

    const { status, body } = response;
    // console.log(status, "ini status");
    // console.log(body, "ini body");

    expect(status).toBe(401);
    expect(body.error).toHaveProperty("message", "Invalid (email / password)");
  });
});

describe("Customer Main Entity", () => {
  test("Success get main entity with access_token without using query filter parameter", async () => {
    const response = await request(app)
      .get("/public/food")
      .set("access_token", validToken);

    const { status, body } = response;
    // console.log(status, "ini status");
    // console.log(body, "ini body");

    expect(status).toBe(200);
    expect(body.data).toHaveLength(38);
  });

  test("Success get main entity without access_token without using query filter parameter", async () => {
    const response = await request(app).get("/public/food");

    const { status, body } = response;
    // console.log(status, "ini status");
    // console.log(body, "ini body");

    expect(status).toBe(200);
    expect(body.data).toHaveLength(38);
  });

  test("Success get main entity with access_token with using 1 query filter parameter", async () => {
    const response = await request(app)
      .get("/public/?name=ramen")
      .set("access_token", validToken);

    const { status, body } = response;
    // console.log(body.data, "ini body");
    // console.log(body.data.rows, "ini body2");
    expect(status).toBe(200);
    expect(body.data).toHaveProperty("count", 4);
    expect(body.data.rows).toHaveLength(4);
  });

  test("Success get main entity without access_token with using 1 query filter parameter", async () => {
    const response = await request(app).get("/public/?name=ramen");

    const { status, body } = response;
    // console.log(body.data, "ini body");
    // console.log(body.data.rows, "ini body2");
    expect(status).toBe(200);
    expect(body.data).toHaveProperty("count", 4);
    expect(body.data.rows).toHaveLength(4);
  });

  test("Success get main entity with access_token with using 2 query filter parameter", async () => {
    const response = await request(app)
      .get("/public/?name=ramen&categoryId=1")
      .set("access_token", validToken);

    const { status, body } = response;
    // console.log(body.data, "ini body");
    // console.log(body.data.rows, "ini body2");
    expect(status).toBe(200);
    expect(body.data).toHaveProperty("count", 4);
    expect(body.data.rows).toHaveLength(4);
  });

  test("Success get main entity without access_token with using 2 query filter parameter", async () => {
    const response = await request(app)
      .get("/public/?name=ramen&categoryId=1")
      .set("access_token", validToken);

    const { status, body } = response;
    // console.log(body.data, "ini body");
    // console.log(body.data.rows, "ini body2");
    expect(status).toBe(200);
    expect(body.data).toHaveProperty("count", 4);
    expect(body.data.rows).toHaveLength(4);
  });

  test("Success get main entity with suitable length (with access_token) when hit spesific page (check pagination)", async () => {
    const response = await request(app)
      .get("/public/?page=1")
      .set("access_token", validToken);

    const { status, body } = response;

    expect(status).toBe(200);
    expect(body.data).toHaveProperty("count", 38);
    expect(body.data.rows).toHaveLength(9);
  });

  test("Success get main entity with suitable length (without access_token) when hit spesific page (check pagination)", async () => {
    const response = await request(app).get("/public/?page=1");

    const { status, body } = response;
    expect(status).toBe(200);
    expect(body.data).toHaveProperty("count", 38);
    expect(body.data.rows).toHaveLength(9);
  });

  test("Succes get 1 main entity with given params id", async () => {
    const response = await request(app).get("/public/food/1");

    const { status, body } = response;
    // console.log(response.status, "-1111111111111111111");
    // console.log(response.body.data, "-000000000000000");
    expect(status).toBe(200);
    expect(body.data).toEqual(expect.any(Object));
    expect(body.data).toHaveProperty("id", 1);
  });

  test("Failed get main entity because given params id isn't registered in database", async () => {
    const response = await request(app).get("/public/food/99");

    const { status, body } = response;
    // console.log(response.status, "-1111111111111111111");
    // console.log(response.body.data, "-000000000000000");
    expect(status).toBe(404);
    expect(body.error).toHaveProperty("message", "Food not found");
  });
});

describe("Customer Favorite", () => {
  test("Success get favorite list with current user id login", async () => {
    const response = await request(app)
      .get("/public/favorite")
      .set("access_token", validToken);

    const { status, body } = response;
    // console.log(response.status, "-1111111111111111111");
    // console.log(response.body, "-000000000000000");

    expect(status).toBe(200);
    expect(body).toHaveProperty("data", []);
  });

  test("Success add favorite with food id given", async () => {
    const response = await request(app)
      .post("/public/favorite/1")
      .set("access_token", validToken);

    const { status, body } = response;
    // console.log(response.status, "-1111111111111111111");
    // console.log(response.body, "-000000000000000");

    expect(status).toBe(201);
    expect(body).toHaveProperty(
      "message",
      "Food id 1 successfully added to favorite"
    );
  });

  test("Failed add favorite because food id isn't registed", async () => {
    const response = await request(app)
      .post("/public/favorite/100")
      .set("access_token", validToken);

    const { status, body } = response;
    // console.log(response.status, "-1111111111111111111");
    // console.log(response.body, "-000000000000000");

    expect(status).toBe(404);
    expect(body.error).toHaveProperty("message", "Food not found");
  });

  test("Failed get favorites list because isn't logging yet", async () => {
    const response = await request(app)
    .get("/public/favorite");

    const { status, body } = response;
    // console.log(response.status, "-1111111111111111111");
    // console.log(response.body, "-000000000000000");

    expect(status).toBe(401);
    expect(body.error).toHaveProperty("message", "Please login or register");
  });

  test("Failed get list favorite because given token is not for customer role", async () => {
    const response = await request(app)
    .get("/public/favorite")
      .set("access_token", adminToken);

    const { status, body } = response;
    // console.log(response.status, "-1111111111111111111");
    // console.log(response.body, "-000000000000000");

    expect(status).toBe(403);
    expect(body.error).toHaveProperty("message", "Please login as customer");
  });
});

afterAll((done) => {
  User.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  })
    .then((response) => {
      done();
    })
    .catch((error) => {
      done(error);
    });
});
