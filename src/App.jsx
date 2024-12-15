import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaBeer } from "@react-icons/all-files/fa/FaBeer";
import { FaKey, FaCopy, FaLock, FaUnlockAlt, FaTrash , FaAtom} from "react-icons/fa"; // Import delete icon

const App = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(5);
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [strength, setStrength] = useState('');
  const [passwordHistory, setPasswordHistory] = useState([]);

  // Load password history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("passwordHistory");
    setPasswordHistory(savedHistory ? JSON.parse(savedHistory) : []);
  }, []);

  const generatePassword = () => {
    if (length < 4 || length > 20) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Length',
        text: 'Password length must be between 4 and 20 characters.',
        footer: 'Please enter a valid length.',
        didOpen: () => {
          document.querySelector('input[type="number"]').focus();
        },
      });
      return;
    }

    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';

    let characters = lowercase;
    if (includeUppercase) characters += uppercase;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    if (!characters) {
      Swal.fire({
        icon: 'error',
        title: 'No Options Selected',
        text: 'Please select at least one character type.',
      });
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newPassword += characters[randomIndex];
    }

    setPassword(newPassword);
    calculateStrength(newPassword);
    updateHistory(newPassword);

    Swal.fire({
      icon: 'success',
      title: 'Password Generated!',
      text: 'Your new password has been successfully generated.',
      width: 500,
      padding: '2em',
      color: '#4a4e69',
      background: '#f8f9fa',
      backdrop: `
        rgba(0, 0, 0, 0.4)
        url("https://media.tenor.com/-AyTtMgs2mMAAAAi/nyan-cat-nyan.gif")
        center top
        no-repeat
      `,
      confirmButtonColor: '#4caf50',
    });
  };

  const calculateStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score === 1) setStrength('Weak');
    else if (score === 2) setStrength('Moderate');
    else if (score === 3) setStrength('Strong');
    else if (score === 4) setStrength('Very Strong');
    else setStrength('Very Weak');
  };

  const copyToClipboard = () => {
    if (!password) {
      Swal.fire({
        icon: 'error',
        title: 'No Password',
        text: 'Please generate a password first!',
      });
      return;
    }

    navigator.clipboard.writeText(password).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Copied',
        text: 'Password copied to clipboard!',
      });
    });
  };

  const updateHistory = (newPassword) => {
    const updatedHistory = [...passwordHistory, newPassword];
    setPasswordHistory(updatedHistory);
    localStorage.setItem("passwordHistory", JSON.stringify(updatedHistory));
  };

  const deleteHistory = (index) => {
    const updatedHistory = passwordHistory.filter((_, i) => i !== index);
    setPasswordHistory(updatedHistory);
    localStorage.setItem("passwordHistory", JSON.stringify(updatedHistory));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 animate-gradient">
      
      {/* GitHub Badge */}
      <a href="https://github.com/blackXploit-404" target="_blank" rel="noopener noreferrer">
        <img 
          src="https://img.shields.io/github/stars/blackXploit-404/PassGenX?style=social" 
          alt="GitHub stars" 
          className="absolute top-4 right-4"
        />
      </a>

      <h1 className="text-4xl font-bold text-white mb-6">PassGenX</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Password Length
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            min="4"
            max="20"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            <input
              type="checkbox"
              className="mr-2"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
            />
            Include Uppercase Letters
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            <input
              type="checkbox"
              className="mr-2"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
            Include Numbers
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            <input
              type="checkbox"
              className="mr-2"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
            Include Symbols
          </label>
        </div>

        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
          onClick={generatePassword}
        >
          <FaKey /> Generate Password
        </button>

        {password && (
          <div className="mt-6 bg-gray-200 p-4 rounded text-center">
            <strong>Generated Password:</strong>
            <p className="text-xl break-all mb-2">{password}</p>
            <p className={`text-sm font-medium ${strengthColor(strength)}`}>
              Strength: {strength}
            </p>
            <button
              className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center gap-2 w-full"
              onClick={copyToClipboard}
            >
              <FaCopy /> Copy to Clipboard
            </button>
          </div>
        )}

        {passwordHistory.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Password History</h2>
            <ul>
              {passwordHistory.map((pw, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded mb-2 flex items-center justify-between">
                  <span>{pw}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteHistory(index)}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white text-center p-4 mt-6">
      <p>Made with ❤️ by Surajit</p>
      </footer>
    </div>
  );

  function strengthColor(strength) {
    if (strength === 'Very Strong') return 'text-green-600';
    if (strength === 'Strong') return 'text-green-500';
    if (strength === 'Moderate') return 'text-yellow-500';
    if (strength === 'Weak') return 'text-red-500';
    return 'text-gray-500';
  }
};

export default App;
