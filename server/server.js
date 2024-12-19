
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');  

const app = express();

app.use(express.json());  
app.use(cors());  


const mongoURI = 'mongodb+srv://sairevu1:sairevu1@cluster0.p9igt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB:', error));

app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Task Management API is running');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
