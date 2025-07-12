const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx');
const mongoose = require('mongoose');
var cors = require('cors')


const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define the file path for the Excel file
const filePath = 'data.xlsx';
app.use(cors())

mongoose.connect("mongodb+srv://aniruddhapatre123:fitandflex@cluster0.dfui0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  whatsapp: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

console.log(User)

app.post('/submit', (req, res) => {
  const { name, email, whatsapp } = req.body;

  let workbook;
  let worksheet;

  // Check if the Excel file already exists
  if (fs.existsSync(filePath)) {
    // Read the existing workbook
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets['Sheet1'];

    // Convert the worksheet to JSON format to append new data
    let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Append the new data to the worksheet
    data.push([name, email, whatsapp]);

    // Convert the data back to a worksheet
    worksheet = XLSX.utils.aoa_to_sheet(data);
    workbook.Sheets['Sheet1'] = worksheet;
  } else {
    // Create a new workbook and worksheet if it doesn't exist
    workbook = XLSX.utils.book_new();
    const data = [['Name', 'Email', 'WhatsApp'], [name, email, whatsapp]]; // Add headers and new data
    worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  }

  // Write the updated workbook back to the same file
  XLSX.writeFile(workbook, filePath);

  res.send('Data appended to the existing Excel file!');
});

app.get('/', (req, res) => {
  res.send('Welcome to the Form Submission Server!');
});



app.post('/saveit', async (req, res) => {
  console.log("Received request at /saveit");
  console.log(req.body);  // Log the received body to check if the data is being received

  const { name, email, whatsapp } = req.body;

  // Ensure data validation here, if needed
  if (!name || !email || !whatsapp) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
      const newUser = new User({ name, email, whatsapp });
      await newUser.save();  // Save to MongoDB
      console.log("User saved in the database");
      res.status(200).json({ message: 'User saved successfully' });
  } catch (error) {
      console.error('Error while saving user:', error);
      res.status(500).json({ error: 'Failed to save user' });
  }
});
 
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users
    res.status(200).json(users);      // Return the users in JSON format
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
