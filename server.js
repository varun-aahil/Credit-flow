const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'logins',
  password: '16728',
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.get('/kyc', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'kyc.html'));
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!emailPattern.test(email) || !passwordPattern.test(password)) {
    return res.status(400).send('Invalid email or password format');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO logins (email, password) VALUES ($1, $2)';
    await pool.query(query, [email, hashedPassword]);

    res.send('Signup successful');
  } catch (error) {
    console.error('Error saving signup details:', error.message, error.stack);
    res.status(500).send('Error saving signup details');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return res.status(400).send('Invalid email format');
  }

  try {
    const query = 'SELECT * FROM logins WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        res.send('Login successful');
      } else {
        res.status(401).send('Invalid password');
      }
    } else {
      res.status(401).send('Email not registered');
    }
  } catch (error) {
    console.error('Error verifying login details:', error.message, error.stack);
    res.status(500).send('Error verifying login details');
  }
});

app.post('/apply', async (req, res) => {
  const {
    businessName,
    businessType,
    yearEstablished,
    loanAmount,
    loanPurpose,
    ownerName,
    email,
    phone
  } = req.body;

  try {
    const query = `
      INSERT INTO applications (
        business_name,
        business_type,
        year_established,
        loan_amount,
        loan_purpose,
        owner_name,
        email,
        phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    await pool.query(query, [
      businessName,
      businessType,
      yearEstablished,
      loanAmount,
      loanPurpose,
      ownerName,
      email,
      phone
    ]);

    res.redirect('/kyc');
  } catch (error) {
    console.error('Error saving application details:', error.message, error.stack);
    res.status(500).send('Error saving application details');
  }
});

app.post('/kyc', upload.fields([{ name: 'frontSide' }, { name: 'backSide' }, { name: 'selfie' }]), async (req, res) => {
  try {
    const { idType, idNumber } = req.body;
    const frontSide = req.files['frontSide'][0].path;
    const backSide = req.files['backSide'][0].path;
    const selfie = req.files['selfie'][0].path;

    const apiUrl = 'https://sandbox.kyc.com/api/verify';
    const apiKey = '';

    const kycData = {
      idType,
      idNumber,
      frontSide,
      backSide,
      selfie
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(kycData)
    });

    const apiResponse = await response.json();

    if (apiResponse.status === 'verified') {
      const query = `
        INSERT INTO kycs (
          id_type,
          id_number,
          front_side,
          back_side,
          selfie,
          verification_status
        ) VALUES ($1, $2, $3, $4, $5, 'verified')`;
      await pool.query(query, [idType, idNumber, frontSide, backSide, selfie]);
      res.send('KYC details verified and saved successfully!');
    } else {
      console.error('KYC verification failed:', apiResponse);
      res.status(400).send('KYC verification failed');
    }
  } catch (error) {
    console.error('Error during KYC verification:', error.message, error.stack);
    res.status(500).send('Error during KYC verification');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
