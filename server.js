const express = require('express');
const z = require('zod');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Global cache (simple in-memory cache)
const globalCache = {};

// Zod schema for request validation
const userSchema = z.object({
    name: z.string(),
    age: z.number().int().positive(),
});

// Middleware to validate request body using zod
const validateRequest = (schema) => (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      res.status(400).json({ error: err.errors });
    }
};

// Simple route to demonstrate the server and middleware
app.post('/user', validateRequest(userSchema), (req, res) => {
    const {name, age} = req.body;
    globalCache[name] = age;
    res.status(201).json({message: 'User added successfully', cache: globalCache});
});

// Route to retrieve data from global cache
app.get('/user/:name', (req, res) => {
    const { name } = req.params;
    const age = globalCache[name];
    if (age !== undefined) {
      res.status(200).json({ name, age });
    } else {
      res.status(404).json({ message: 'User not found!' });
    }
});


app.listen(3000, function() {
    console.log(`listening on http://localhost:3000`);
})