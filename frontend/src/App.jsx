import { useState } from 'react';
import axios from 'axios';
import './index.css';

// Configure Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

function App() {
  const [step, setStep] = useState(1); // 1: Name, 2: OTP, 3: Playground
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [playgroundMessage, setPlaygroundMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestOtp = async () => {
    if (!username) return;
    try {
      const res = await api.post('/gatekeeper/request-otp', { username });
      setMessage(res.data.message);
      setError('');
      setStep(2);
    } catch (err) {
      setError('Uh oh! The gatekeeper is sleeping. (Backend might be down)');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    try {
      const res = await api.post('/gatekeeper/verify-otp', { username, otp });
      setToken(res.data.token);
      setMessage(res.data.message);
      setError('');
      setStep(3);
    } catch (err) {
      setError('Wrong Magic Word! Try again.');
    }
  };

  const accessProtected = async (endpoint) => {
    try {
      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaygroundMessage(res.data.message);
      setError('');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Uh Oh! The Slide Guard says your sticker is missing or ripped! (401 Unauthorized)');
      } else {
        setError('Something went wrong!');
      }
      setPlaygroundMessage('');
    }
  };


  const [showCode, setShowCode] = useState(false);

  const snippets = {
    1: {
      title: "Backend: Receiving the Knock",
      file: "AuthController.java",
      code: `@PostMapping("/request-otp")
public ResponseEntity<?> requestOtp(@RequestBody Map<String, String> request) {
    String username = request.get("username");
    // 1. Generate a random 6-digit code
    String otp = otpService.generateOtp(username);
    
    // 2. "Send" it (Print to console)
    System.out.println("Magic Word for " + username + " is: " + otp);
    
    return ResponseEntity.ok("Message sent!");
}`
    },
    2: {
      title: "Backend: Checking the Magic Word",
      file: "OtpService.java",
      code: `public boolean validateOtp(String username, String otp) {
    // 1. Check if username exists in map
    // 2. Check if OTP matches
    // 3. Check if expired (3 mins)
    if (storedOtp.equals(otp)) {
        otpStorage.remove(username); // One-time use!
        return true;
    }
    return false;
}`
    },
    3: {
      title: "Backend: The Slide Guard (Filter)",
      file: "JwtAuthenticationFilter.java",
      code: `protected void doFilterInternal(...) {
    // 1. Get Token from Header
    String authHeader = request.getHeader("Authorization"); // "Bearer xy..."
    
    // 2. Validate Token Signature
    if (jwtUtil.validateToken(jwt)) {
        // 3. Let them pass!
        SecurityContextHolder.getContext().setAuthentication(...);
    }
    
    // 4. Continue to the Slide/Sandbox
    filterChain.doFilter(request, response);
}`
    }
  };

  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>The Secret Sticker Playground</h1>
        <button
          onClick={() => setShowCode(!showCode)}
          className="secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          {showCode ? 'Hide Blueprints 🙈' : 'Show Blueprints 🤓'}
        </button>
      </div>

      <div className="state-tracker">
        <div className={`step ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>1</div>
        <div className={`step ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>2</div>
        <div className={`step ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>3</div>
      </div>

      {showCode && snippets[step] && (
        <div className="code-card">
          <div className="code-header">
            <span>📄 {snippets[step].file}</span>
            <span className="badge">Backend Logic</span>
          </div>
          <pre>{snippets[step].code}</pre>
          <p className="caption">{snippets[step].title}</p>
        </div>
      )}

      {error && <div className="message-box" style={{ background: '#FFEBEE', color: '#D32F2F' }}>{error}</div>}
      {message && !error && <div className="message-box">{message}</div>}

      {step === 1 && (
        <div className="card">
          <h2>Entrance</h2>
          <div className="input-group">
            <label>What's your name?</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Ziyad"
            />
          </div>
          <button onClick={handleRequestOtp}>Ask for the Magic Word</button>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h2>The Gatekeeper</h2>
          <p style={{ marginBottom: '1rem' }}>Check the backend console for the magic word!</p>
          <div className="input-group">
            <label>What is the Magic Word?</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              maxLength={6}
            />
          </div>
          <button onClick={handleVerifyOtp}>Show Magic Word</button>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <h2>You're In!</h2>
          <p>Here is your Secret Sticker (JWT):</p>
          <div className="sticker-box">
            <div className="sticker-content">
              {token}
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button className="secondary" onClick={() => accessProtected('/slide')}>Go to the Slide</button>
            <button className="secondary" onClick={() => accessProtected('/sandbox')}>Go to the Sandbox</button>
          </div>

          {playgroundMessage && (
            <div className="message-box" style={{ background: '#E8F5E9', color: '#2E7D32', fontSize: '1.2rem' }}>
              {playgroundMessage}
            </div>
          )}

          <div className="how-it-works">
            <h3>How did this happen? 🧠</h3>
            <div className="explanation-step">
              <span className="icon">👋</span>
              <div className="text">
                <strong>1. The Knock (Request OTP)</strong>
                <p>You told the <strong>Gatekeeper</strong> (Backend) your name. The Gatekeeper wanted to be sure it's really you.</p>
              </div>
            </div>
            <div className="explanation-step">
              <span className="icon">📱</span>
              <div className="text">
                <strong>2. The Magic Word (OTP)</strong>
                <p>The Gatekeeper sent a temporary <strong>Magic Word</strong> (OTP) to your phone (Console Log). This is 2-Factor Authentication!</p>
              </div>
            </div>
            <div className="explanation-step">
              <span className="icon">🎫</span>
              <div className="text">
                <strong>3. The Secret Sticker (JWT)</strong>
                <p>When you said the magic word, the Gatekeeper gave you this <strong>Secret Sticker</strong> (JWT). It has your name on it and is signed with a special fancy pen (Digital Signature).</p>
              </div>
            </div>
            <div className="explanation-step">
              <span className="icon">🛝</span>
              <div className="text">
                <strong>4. Playing (Authorization)</strong>
                <p>Now, when you go to the <strong>Slide</strong>, you don't ask for a Magic Word again. You just show your Sticker! The Slide Guard checks if the signature is real and lets you in.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
