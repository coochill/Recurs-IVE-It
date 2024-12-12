<p align="center"> 
    <img src="https://github.com/coochill/Recurs-IVE-It/blob/main/logo.png" width="300">
</p>

<h1 align="center">Recurs-IVE It!: Recursive Algorithm Simulator</h1>
<h3 align="center"> IT 314 Web Systems and Technologies</h3>
<h5 align="center"> 📅 Final Project - Batangas State University - Alangilan, 3rd Year, 1st Semester 2024 </h5>

---


# I. Project Overview: Recurs-IVE It

**Recurs-IVE It!** is a web-based Recursive Algorithm Simulator designed to help users understand and visualize recursion. It offers:

- **Interactive Visualizations**: Explore recursion in real time with animations.
- **Supported Algorithms**:
  - Fibonacci
  - Factorial
  - Merge Sort
  - Quick Sort (Random & Non-Random)
  - Catalan Numbers
- **Interactive Controls**: Play, pause, and resume animations.
- **Secure Data Handling**: Input validation and encryption.

This project provides a hands-on, engaging experience for students and developers to grasp recursion concepts with clarity.

---

# II. System Architecture

### 1. Frontend
- **Technologies**: HTML, CSS, JavaScript, React
- **Functionality**: User interface for input and visualization.

### 2. Backend

- **Technologies**: Python, Flask
- **Functionality**: Algorithm logic and server-side processing.

### 3. Database

- **Technology**: Firebase Firestore
- **Functionality**: Stores user session data and inputs securely.

### 4. Visualization Framework

- **Technology**: D3.js
- **Functionality**: Real-time animations for recursive algorithms.

### 5. Security
- **Tools**: HTTPS, Flask input validation, Firebase Authentication
- **Functionality**: Protects user data and prevents invalid inputs.

---

# III. Applied Computer Science Concept

This project emphasizes **recursion**, a fundamental programming concept where functions call themselves to solve problems. It enables users to:
- Analyze recursive algorithm behavior.
- Understand base cases and recursive cases.
- Learn divide-and-conquer strategies in sorting.

---

# IV. Algorithms Used

- **Fibonacci Sequence**: Recursive calls to calculate values.
- **Factorial**: Recursive computation of factorial values.
- **Merge Sort**: Divide-and-conquer visualization of array sorting.
- **Catalan Numbers**: Recursive combinatorial calculations.
- **Random/Non-Random Quick Sort**: Visualizes pivot selection effects on recursion depth.

---

# V. Security Mechanisms

- **Input Validation**: Prevents invalid or malicious inputs.
- **HTTPS**: Secures client-server communication.
- **Encryption**: Ensures sensitive data protection using Firebase libraries.
- **Error Handling**: Manages unexpected user actions.

---

# VI. Development Process and Design Decisions

The design and implementation of **Recurs-IVE It!** were heavily influenced by computer science theory, particularly in the following ways:

1. **Recursion as a Central Theme**:
   - The concept of recursion was chosen as it is a cornerstone in computer science, widely used in algorithms such as divide-and-conquer (e.g., Merge Sort and Quick Sort) and combinatorial problems (e.g., Catalan Numbers).
   - Visualization techniques were applied to break down recursive function calls into manageable steps, aiding comprehension.

2. **Divide-and-Conquer Approach**:
   - Algorithms like Merge Sort and Quick Sort leverage the divide-and-conquer paradigm. This inspired the creation of animations that clearly separate the divide, conquer, and merge stages for users to follow.

3. **Time Complexity Analysis**:
   - To ensure the efficiency of visualizations, we limited the recursion depth and optimized the rendering process. Understanding the computational complexity of recursive algorithms helped us balance clarity and performance.

4. **Algorithm Design**:
   - The project adhered to correctness principles by ensuring each recursive algorithm implemented its base and recursive cases accurately.
   - Concepts like tail recursion and memoization were considered to optimize resource usage and prevent stack overflow in visualizations (e.g., Fibonacci sequence).

5. **Human-Computer Interaction (HCI)**:
   - The user interface was designed based on cognitive load theory, ensuring the visualizations were intuitive and not overwhelming. This aligns with usability principles to make learning effective and engaging.

6. **Backend and Data Validation**:
   - The use of Flask for backend processing was influenced by its lightweight nature, ideal for quick prototyping. Security best practices in input validation and error handling were incorporated, demonstrating the importance of robust software design in theory.

7. **Visualization with D3.js**:
   - D3.js was selected for its ability to create dynamic and data-driven visualizations. The decision was informed by algorithm complexity, as D3.js allows custom control over animations, making it perfect for illustrating recursive call stacks and tree structures.

This thoughtful integration of computer science concepts with practical development tools and methods ensures that **Recurs-IVE It!** is both educational and efficient.

---

# VII. Correctness and Efficiency

The development of **Recurs-IVE It!** prioritized both correctness and efficiency in order to provide an accurate and optimized experience for users.

1. **Correctness**:
   - Each recursive algorithm was thoroughly tested to ensure it adheres to its base case and recursive step. This includes ensuring that edge cases, such as base case conditions and large input values, are handled correctly.
   - We also focused on preserving the theoretical integrity of the algorithms, ensuring that the visualizations accurately reflect the steps of the recursive process.

2. **Efficiency**:
   - The time and space complexity of the algorithms were taken into account during development. Efforts were made to minimize excessive recursion depth, and strategies like memoization were employed where applicable to reduce redundant calculations (e.g., Fibonacci).
   - The visualizations were optimized to minimize rendering delays and avoid performance bottlenecks, making sure the animations remain smooth and responsive for users.

---

## VIII. How to Run the Project

To run **Recurs-IVE It!**, follow these steps:

1. **Clone the Repository**:
   - Clone the repository to your local machine using the following command:
     ```bash
     git clone https://github.com/yourusername/recurs-ive-it.git
     ```

2. **Install Dependencies**:
   - Navigate to the project directory and install the necessary dependencies for both the frontend and backend:
     ```bash
     cd recurs-ive-it
     npm install    # For frontend (D3.js visualization)
     ```

     For the backend (Flask):
     ```bash
     cd backend
     pip install -r requirements.txt
     ```

3. **Run the Backend**:
   - Start the Flask server to handle backend requests:
     ```bash
     python app.py
     ```

4. **Run the Frontend**:
   - Navigate to the frontend directory and run the web application:
     ```bash
     cd frontend
     npm start
     ```

5. **Access the Application**:
   - Open a web browser and go to `http://localhost:3000` to interact with **Recurs-IVE It!**.

6. **Optional: Deployment**:
   - If you wish to deploy the project, consider using a platform like Heroku for the backend and Netlify for the frontend. Follow their respective documentation for deployment steps.

---

# IX. Contributors

- **Phoemela Kyle M. Sebastian** – Frontend Developer  
- **Christine Joyce L. De Leon** – Backend Developer  
- **Joy Susette V. Domingo** – Project Manager & Fullstack Developer  

---

# X. Acknowledgment

Special thanks to **Ms. Fatima Marie P. Agdon, MSCS**, our instructor, for her unwavering support and dedication in always reminding us of our goals and guiding us throughout this project. Her commitment and attention to detail helped us stay focused and motivated every step of the way.

We would also like to acknowledge the following team members for their outstanding contributions:

- **SEBASTIAN, PHOEMELA KYLE M.** (Frontend Developer)  
  - Developed a responsive and interactive UI for visualizing the Recursive Algorithm structure.
  - Implemented smooth user interactions for integrating media player controls.
  - Ensured cross-browser compatibility and a modern design layout.
  - Integrated media content such as diagrams and explanations for the Recursive Algorithm.

- **DE LEON, CHRISTINE JOYCE L.** (Backend Developer)  
  - Implemented the logic for handling data related to Recursive Algorithm operations.
  - Integrated Firebase Authentication for secure user sign-up and login processes, ensuring that user data and progress can be securely managed and tracked across sessions.
  - Implemented APIs for communication between frontend and backend.
  - Ensured security by validating user inputs and handling data securely.

A heartfelt thank you to my family and loved ones for their unwavering support, encouragement, and love throughout this journey. Their belief in me kept me motivated and focused, especially during sleepless nights. Their constant support and encouragement helped us to keep pushing forward and supporting each other.
