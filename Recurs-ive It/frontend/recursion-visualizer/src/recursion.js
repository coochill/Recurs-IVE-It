import React, { useState, useEffect } from 'react';
import './recursion.css';
import RecursionTree from './recursiontree';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; 
import logo from './assets/logo.png';
import { FaGithub } from 'react-icons/fa';

function Recursion() {
    const [algorithms, setAlgorithms] = useState([]); 
    const [selectedOption, setSelectedOption] = useState(""); 
    const [isInputVisible, setIsInputVisible] = useState([true, true]); 
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [parameterValues, setParameterValues] = useState({}); 
    const [algorithmName, setAlgorithmName] = useState("");
    const [algorithmResult, setAlgorithmResult] = useState(null); 
    const [totalBaseCases, setTotalBaseCases] = useState(0); 
    const [totalRepeats, setTotalRepeats] = useState(0); 
    const [totalCurrentNumbers, setTotalCurrentNumbers] = useState(0); 
    const [moreContent, setMoreContent] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [currentModalIndex, setCurrentModalIndex] = useState(0); 
    const [modalContent, setModalContent] = useState([]); 
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [colorGuide, setColorGuide] = useState('');
    const [isUserValid, setIsUserValid] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false); 
    const [isPopupVisible, setIsPopupVisible] = useState(false); 
    const [isPlaying, setIsPlaying] = useState(false);
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
       
        const fetchAlgorithms = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-algorithms');
                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();
                setAlgorithms(data);
                if (data.length > 0) {
                    setSelectedOption(data[0].id); 
                    handleOptionChange({ target: { value: data[0].id } });
                }
            } catch (error) {
                console.error("Error fetching algorithms:", error);
            }
        };

        const fetchColorGuide = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-color-guide');
                if (!response.ok) throw new Error("Error fetching color guide");
                const data = await response.json();
                setColorGuide(data.field_values || 'Default content'); 
            } catch (error) {
                console.error("Error fetching color guide:", error);
                setColorGuide('Error loading content');
            }
        };

        fetchAlgorithms();
        fetchColorGuide();
    }, []);

    useEffect(() => {
        const checkOrientation = () => {
            if (window.innerWidth < window.innerHeight) {
                setIsPortrait(true);
                setIsPopupVisible(true); 
            } else {
                setIsPortrait(false);
                setIsPopupVisible(false);
            }
        };

        checkOrientation(); 
        window.addEventListener("resize", checkOrientation); 


        return () => {
            window.removeEventListener("resize", checkOrientation); 
        };
    }, []);

    useEffect(() => {
        const validateUser = async (userId) => {
            try {
                const response = await fetch('http://localhost:5000/validate_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                });
                if (response.status === 429) {
                alert("Too many requests. Please try again later.");
                return;
            }
                const data = await response.json();
                if (data.valid) {
                    setIsUserValid(true);
                } else {
                    setIsUserValid(false);
                }
            } catch (error) {
                console.error('Error validating user:', error);
                setIsUserValid(false);
            }
        };

        const storedUserId = localStorage.getItem('userID');
        if (storedUserId) {
            console.log('Retrieved userID from localStorage:', storedUserId);
            validateUser(storedUserId);
        } else {
            console.log('No userID found in localStorage.');
            setIsUserValid(false); 
        }

        const handlePopState = (event) => {
            if (isUserValid) {
                event.preventDefault();
                navigate(1); 
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isUserValid, navigate]);

    const handleLogout = async () => {
        const userId = localStorage.getItem('userID');
   
        if (userId) {
            try {
            
                const response = await fetch('http://localhost:5000/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId })
                });
           
                if (response.ok) {
                    localStorage.removeItem('userId'); 
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

    const handleOptionChange = async (event) => {
        const algorithmId = event.target.value;
        setSelectedOption(algorithmId);
        try {
            const response = await fetch('http://localhost:5000/get-algorithm-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: algorithmId })
            });
            const data = await response.json();
            setCode(data.code || "Algorithm code not found.");
            setDescription(data.description || "Algorithm description not found.");
            setParameterValues(data.parameters.reduce((acc, param) => ({ ...acc, [param]: "" }), {}));
        } catch (error) {
            console.error("Error fetching algorithm details:", error);
            setCode("Error fetching algorithm code.");
            setDescription("Error fetching algorithm description.");
            setParameterValues({});
        }
    };

    const handleParameterChange = (param, value) => {
        if (/^\d*$/.test(value)) {
            setParameterValues((prev) => ({ ...prev, [param]: value }));
        }
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prevState) => !prevState);
    };
   
    const handleRunClick = async () => {
        setIsPlaying(true);
   
        const payload = {
            algorithm: selectedOption,
            parameters: {
                ...parameterValues,
                n: parseInt(parameterValues.n, 10), 
            },
        };
   
        try {
            const response = await fetch('http://localhost:5000/run-algorithm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
   
            if (response.status === 429) {
                alert("Too many requests. Please try again later.");
                setIsPlaying(false); 
                return;
            }

            const data = await response.json();
            if (data.status === "success") {
                setAlgorithmName(data.algorithm_name);
                setAlgorithmResult(data.result);
                setTotalBaseCases(data.total_base_cases || 0);
                setTotalRepeats(data.total_repeated_subproblems || 0);
                setTotalCurrentNumbers(data.total_nodes || 0);
                console.log(data.result);
            } else {
                console.error(data.message || data.error);
                setIsPlaying(false); 
            }
        } catch (error) {
            console.error("Error running algorithm:", error);
            setIsPlaying(false); 
        }
    };

    const handleSeeMoreClick = (event) => {
        event.preventDefault();
        setIsModalOpen(true); 
        setModalContent([description]); 
    };
   
    const closeModal = () => {
        setIsModalOpen(false); 
    };

    const Header = () => {
        const [isLoggedIn, setIsLoggedIn] = useState(false); 
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
     
        const handleDropdownClick = () => {
          setIsDropdownOpen(!isDropdownOpen);
        };
     
        const handleLogin = () => {
          setIsLoggedIn(true); 
        };
     
        const handleLogout = () => {
          setIsLoggedIn(false); 
        };
    }
   
    const handleDropdownClick = () => {
        setIsDropdownOpen((prevState) => !prevState); 
      };


      const handlePlay = () => {
        setIsPlaying(true);
    };


    const handlePause = () => {
        setIsPlaying(false); 
    };
    return (
           <div id="app">
           <header className="header">
        <div className="logo">
          <img src={logo} alt="Recurs-IVE It!" />
        </div>
        <nav className="nav-links">
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
     {isPopupVisible && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>Please rotate your device to landscape mode for a better experience.</p>
                    </div>
    </div>
)}

<div className={`algorithm-result-container ${isSidebarCollapsed ? 'expanded' : ''}`}>
  {algorithmResult ? (
    <>
      <RecursionTree
        data={algorithmResult}
        algorithmName={algorithmName}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
      />
    </>
  ) : (
    <p></p>
  )}
</div>
<div className="control-buttons">
  {isPlaying ? (
    <button onClick={handlePause}>
      <i className="fas fa-pause"></i> 
    </button>
  ) : (
    <button onClick={handlePlay}>
      <i className="fas fa-play"></i> 
    </button>
  )}
</div>

<div className="p-container">
  <p>Total Base Cases: {totalBaseCases}</p>
  <p>Total Repeats: {totalRepeats}</p>
  <p>Total Current Numbers: {totalCurrentNumbers}</p>
</div>

                <button
                       className={`toggle-button ${isSidebarCollapsed ? 'collapsed' : ''}`}
                       onClick={toggleSidebar}
                    >
                        {isSidebarCollapsed ? '☰' : '×'}
                    </button>
                
                <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div class="sidebar-content">
                  
                    <div className="color guide">
                    <p
        className="description-html"
        dangerouslySetInnerHTML={{ __html: colorGuide }}
      ></p>
                    <a href="#" className="see-more-link" onClick={handleSeeMoreClick}>See More</a>
                    </div>

                    {moreContent.map((content, index) => (
                        <div key={index}>{content}</div>
                    ))}
             
                <div className="input-container">
                    <div className="container">
                    <div className="row">
    <div className="dropdown-group">
     
        <label htmlFor="input-n" className="form-label">n =</label>
        <select
            id="input-n"
            className="number-select"
            value={parameterValues.n || ""}
            onChange={(e) => handleParameterChange('n', e.target.value)}
        >
            {[...Array(11).keys()].map((num) => (
                <option key={num} value={num}>
                    {num}
                </option>
            ))}
        </select>

        <select
    className="form-select"
    value={selectedOption}
    onChange={handleOptionChange}
>
    {algorithms.map((algorithm, index) => (
        <option
            key={algorithm.id}
            value={algorithm.id}
            disabled={(!isUserValid && (index === 3 || index === 4 || index === 5))}
            title={(!isUserValid && (index === 3 || index === 4 || index === 5)) ? "Login required to access this algorithm" : ""}
        >
            {algorithm.name}
        </option>
    ))}
</select>
        <button className="run-button" onClick={handleRunClick}>
            Run
        </button>
    </div>
</div>

<div
        className="output-div"
        aria-placeholder="Output..."
        >
        <p
        className="description-html"
        dangerouslySetInnerHTML={{ __html: code}}
      ></p>
        </div>
        </div>
    </div>
   
</div>
</div>
{isModalOpen && (
    <div
        className="custom-modal-overlay"
        onClick={(e) => e.stopPropagation()}
    >
        <div
            className="custom-modal-content"
            onClick={(e) => e.stopPropagation()} 
        >
            <button
                className="custom-modal-close-button"
                onClick={closeModal}
            >
                x
            </button>

            <div className="custom-color-guide scrollable-content">
            <div
                        className="description-html"
                        dangerouslySetInnerHTML={{
                            __html: modalContent[currentModalIndex]
                        }}
                    />
            </div>
        </div>
    </div>
   
)}
</div>

    );
}

export default Recursion;