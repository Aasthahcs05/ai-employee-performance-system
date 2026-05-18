const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

dotenv.config();

const app = express();

app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://your-frontend-url.onrender.com"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6
    }
  },
  { timestamps: true }
);

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Employee email is required"],
      unique: true,
      lowercase: true
    },
    department: {
      type: String,
      required: [true, "Department is required"]
    },
    skills: {
      type: [String],
      required: [true, "Skills are required"],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one skill is required"
      }
    },
    performanceScore: {
      type: Number,
      required: [true, "Performance score is required"],
      min: [0, "Performance score cannot be less than 0"],
      max: [100, "Performance score cannot be more than 100"]
    },
    experience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: [0, "Experience cannot be negative"]
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Employee = mongoose.model("Employee", employeeSchema);

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Invalid token."
    });
  }
};

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI-Based Employee Performance Analytics Backend is running"
  });
});

app.post("/api/auth/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized error"
      });
    }

    res.status(200).json({
      success: true,
      message: "Valid login. JWT token generated",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/employees", protect, async (req, res, next) => {
  try {
    const {
      name,
      email,
      department,
      skills,
      performanceScore,
      experience
    } = req.body;

    if (
      !name ||
      !email ||
      !department ||
      !skills ||
      performanceScore === undefined ||
      experience === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Validation error: all employee fields are required"
      });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience
    });

    res.status(201).json({
      success: true,
      message: "Employee stored successfully",
      employee
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate email error"
      });
    }

    next(error);
  }
});

app.get("/api/employees", protect, async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/employees/search", protect, async (req, res, next) => {
  try {
    const { department, skill, name } = req.query;

    const filter = {};

    if (department) {
      filter.department = { $regex: department, $options: "i" };
    }

    if (skill) {
      filter.skills = { $regex: skill, $options: "i" };
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const employees = await Employee.find(filter).sort({ performanceScore: -1 });

    res.status(200).json({
      success: true,
      message: "Filtered employee list",
      count: employees.length,
      employees
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/employees/:id", protect, async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/employees/:id", protect, async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Updated data shown",
      employee
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/employees/:id", protect, async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee removed successfully"
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/ai/recommend", protect, async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No employees found for AI recommendation"
      });
    }

    const employeeData = employees.map((emp) => ({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      skills: emp.skills,
      performanceScore: emp.performanceScore,
      experience: emp.experience
    }));

    const prompt = `
You are an HR analytics AI assistant.

Analyze this employee performance data:
${JSON.stringify(employeeData, null, 2)}

Generate a professional HR report with:
1. Promotion Recommendation for high performance employees
2. Employee Ranking from best to lowest
3. Training Suggestions for missing or weak skills
4. Improvement Feedback for low score employees
5. Short final HR recommendation

Use clear headings and bullet points.
`;

    if (!process.env.OPENROUTER_API_KEY) {
      const fallbackRecommendation = employees
        .map((emp, index) => {
          let feedback = "";

          if (emp.performanceScore >= 85) {
            feedback = "Promotion suggestion: This employee is a strong candidate for promotion.";
          } else if (emp.performanceScore >= 60) {
            feedback = "Training suggestion: This employee should improve technical and soft skills.";
          } else {
            feedback = "Improvement feedback: This employee needs focused training and performance monitoring.";
          }

          return `${index + 1}. ${emp.name} - Score: ${emp.performanceScore} - ${feedback}`;
        })
        .join("\n");

      return res.status(200).json({
        success: true,
        message: "Fallback AI-style recommendation generated because OpenRouter API key is missing",
        recommendation: fallbackRecommendation
      });
    }

    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert HR analytics and employee performance recommendation assistant."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const recommendation = aiResponse.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      message: "AI recommendation generated successfully",
      recommendation
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.log(err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((item) => item.message);

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format"
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });