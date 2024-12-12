import React, { useState, useEffect, useRef, Suspense, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { initMatrix } from './matrix';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FaGithub } from 'react-icons/fa';
import logo from './assets/logo.png';
import './landing.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import phemImg from './assets/phem.png';
import cjImg from './assets/cj.png';
import joyImg from './assets/joy.png';
import outputImg from './assets/output.png';

const Landing = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);
  const canvasRef = useRef(null);
  const aboutRef = useRef(null);
  const homeRef = useRef(null);
  const [text, setText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullText = "RECURS-IVE IT!";
  const typingSpeed = 100;
  const backspaceSpeed = 50;
 
  const orbitControlsRef = useRef(); 
  const [hasZoomedOut, setHasZoomedOut] = useState(false); 


  const handleGetStarted = () => {
    navigate('/recursion');
  };


  const handleDropdownClick = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };


  const handleLogout = async () => {
    const userId = localStorage.getItem('userID');


    if (userId) {
      try {
        const response = await fetch('http://localhost:5000/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });


        if (response.ok) {
          localStorage.removeItem('userID');
          setIsUserValid(false);
          navigate('/');
        } else {
          throw new Error('Logout failed');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    } else {
      console.log('No userId found for logout');
    }
  };


  useEffect(() => {
    let index = 0;
    let isTyping = true;
    let isBackspacing = false;


    const typingEffect = setInterval(() => {
      if (isTyping && !isBackspacing) {
        setText((prevText) => prevText + fullText[index]);
        index++;
        if (index === fullText.length) {
          isTyping = false;
          isBackspacing = true;
        }
      } else if (isBackspacing) {
        setText((prevText) => prevText.slice(0, -1));
        index--;
        if (index === 0) {
          isBackspacing = false;
          isTyping = true;
        }
      }
    }, isTyping ? typingSpeed : backspaceSpeed);


    const cursorBlinking = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);


    return () => {
      clearInterval(typingEffect);
      clearInterval(cursorBlinking);
    };
  }, []);


  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      startTransition(() => {
        initMatrix(canvasElement);
      });
    }
  }, []);


  useEffect(() => {
   
    if (orbitControlsRef.current && !hasZoomedOut) {
      orbitControlsRef.current.maxDistance = 25; 
      orbitControlsRef.current.minDistance = 10;  
      orbitControlsRef.current.zoomSpeed = 0.5;  

      orbitControlsRef.current.setAzimuthalAngle(0); 
      orbitControlsRef.current.setPolarAngle(Math.PI / 3); 
      orbitControlsRef.current.update();

      setHasZoomedOut(true);
    }
  }, [hasZoomedOut]); 


  const handleAboutClick = (event) => {
    event.preventDefault();
    aboutRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  };


  const handleHomeClick = (event) => {
    event.preventDefault();
    homeRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  };


  const Model = () => {
    const { scene } = useGLTF('/model/scene.gltf');


    useFrame(() => {
      scene.rotation.y += 0.002;
    });


    return <primitive object={scene} />;
  };


  return (
    <main>
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Recurs-IVE It!" />
        </div>
        <nav className="nav-links">
          <a href="#" onClick={handleHomeClick}>Home</a>
          <a href="#" onClick={handleAboutClick}>About</a>
          <div className="nav-dropdown">
            <button className="dropdown-btn" onClick={handleDropdownClick}>
              <FontAwesomeIcon icon={faUser} style={{ color: '#ffffff', fontSize: '22px' }} />
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content">
                {isUserValid ? (
                  <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                ) : (
                  <button className="dropdown-item" onClick={() => navigate('/AuthPage')}>Login</button>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>
      <div className="content" ref={homeRef}>
  <div className="text-container">
    <span>
      From base cases to <br /> brilliance — master it with
    </span>
    <h2>Recurs-IVE It!</h2>


    <button className="button" onClick={handleGetStarted}>Get Started</button>
  </div>
  <Suspense fallback={<div>Loading model...</div>}>
    <Canvas className="canvas">
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <Model />
      <OrbitControls ref={orbitControlsRef} />
    </Canvas>
  </Suspense>
</div>

<div className="about-container" ref={aboutRef}>
  <h2>About</h2>
  <p>
    Welcome to Recurs-IVE It! Our mission is to help you understand and master the concepts of recursion through a visualizer. <br/> Explore the world of recursion and uncover its power to solve complex problems with simplicity and elegance.
  </p>
  <p>
    Whether you're a beginner or looking to refine your skills, we've got something for everyone. Let's conquer recursion together!
  </p>


  <div className="cards-container">
    <div className="card">
      <h3>What is a Recursive Algorithm?</h3>
      <p>
        A recursive algorithm is a method of solving a problem where the solution involves solving smaller instances of the same problem. It calls itself with modified inputs until a base condition is met.
      </p>
    </div>
    <div className="card">
      <h3>Key Features</h3>
      <p>
        Recursive algorithms consist of two main parts: a base case, which stops the recursion, and the recursive case, which breaks the problem into smaller subproblems.
      </p>
    </div>
    <div className="card">
      <h3>Applications</h3>
      <p>
        Recursive algorithms are widely used in tasks like traversing data structures (e.g., trees and graphs), solving mathematical problems (e.g., factorials, Fibonacci), and implementing divide-and-conquer strategies.
      </p>
    </div>
    <div className="card">
      <h3>Benefits and Challenges</h3>
      <p>
        Recursion simplifies complex problems with elegant solutions but can lead to stack overflow or inefficiencies if not implemented with care. Understanding recursion is key to writing efficient algorithms.
      </p>
    </div>
  </div>


  <div className="recurs-ive-container">
    <div className="recurs-ive-description">
      <h2>What is Recurs-IVE It?</h2>
      <p>
        Recurs-IVE It is a powerful recursion visualizer that uses animated tree nodes to help you understand how recursion works step by step. Watch as recursive calls are transformed into a dynamic tree structure, making the flow of recursion intuitive and visually engaging.
      </p>
      <p>
        This tool is perfect for students, educators, and developers looking to demystify recursion. With its real-time animations and user-friendly interface, Recurs-IVE It provides a hands-on way to explore recursion like never before.
      </p>
    </div>
    <div className="recurs-ive-animation">
      <img src={outputImg} alt="output" />
    </div>
    </div>
    <div className="algorithm-container">
  <h2>Algorithms in Recurs-IVE It</h2>
  <div className="algorithm-grid">
    <div className="algorithm-item">
      <h3>Factorial</h3>
      <p>
        The factorial algorithm calculates the product of all positive integers up to a given number. It’s a classic example of recursion with a straightforward base case: factorial(0) = 1.
      </p>
    </div>
    <div className="algorithm-item">
      <h3>Fibonacci</h3>
      <p>
        The Fibonacci algorithm generates a sequence where each number is the sum of the two preceding ones. This demonstrates recursion with multiple calls and overlapping subproblems.
      </p>
    </div>
    <div className="algorithm-item">
      <h3>Merge Sort</h3>
      <p>
        Merge sort is a divide-and-conquer algorithm that splits an array into halves, recursively sorts them, and merges the sorted halves. It’s an efficient sorting technique with a time complexity of O(n log n).
      </p>
    </div>
    <div className="algorithm-item">
      <h3>Quick Sort</h3>
      <p>
        Quick sort is a divide-and-conquer algorithm that selects a pivot element, partitions the array around the pivot, and recursively sorts the partitions. It’s known for its average-case efficiency.
      </p>
    </div>
  </div>
</div>
</div>

 {/* Team Members Section */}
 <div className="team-container">
        <h2>Meet Our Team</h2>
        <div className="team-members">
          <div className="team-member">
          <img src={cjImg} alt="Member 1" className="team-member-img" />
            <h3>Christine Joyce De Leon</h3>
            <p>Backend Developer</p>
            <a href="https://github.com/sijeeyy" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
          </div>
          <div className="team-member">
          <img src={phemImg} alt="Member 1" className="team-member-img" />
            <h3>Phoemela Kyle Sebastian</h3>
            <p>Frontend Developer</p>
            <a href="https://github.com/phoemelakyle" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
          </div>
          <div className="team-member">
          <img src={joyImg} alt="Member 1" className="team-member-img" />
            <h3>Joy Susette Domingo</h3>
            <p>Fullstack Developer</p>
            <a href="https://github.com/coochill" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};


export default Landing;





