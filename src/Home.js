import React, { useState } from 'react';
import { generateRSAKeyPair, rsaEncrypt } from './functions';
import video from './video/as.mp4';
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

function isPrime(number) {
  if (number <= 1) {
    return false;
  }
  if (number <= 3) {
    return true;
  }
  if (number % 2 === 0 || number % 3 === 0) {
    return false;
  }
  for (let i = 5; i * i <= number; i += 6) {
    if (number % i === 0 || number % (i + 2) === 0) {
      return false;
    }
  }
  return true;
}

const Home = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  const [prime1, setPrime1] = useState('');
  const [prime2, setPrime2] = useState('');
  const [message, setMessage] = useState('');
  const publicKey = 17;
  const [privateKey, setPrivateKey] = useState('');
  const [nVal, setNVal] = useState('');
  const [totient, setTotient] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [prime1Error, setPrime1Error] = useState('');
  const [prime2Error, setPrime2Error] = useState('');
  const [messageError, setMessageError] = useState('');

  const handlePrime1Change = (e) => {
    setPrime1(e.target.value);
    setPrime1Error('');

  };

  const handlePrime2Change = (e) => {
    setPrime2(e.target.value);
    setPrime2Error('');
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    if (newMessage.length > 30) {
      setMessageError('  Cannot exceed 30 characters');
      return;
    }
    setMessage(newMessage);
  };

  const handleGenerateKeys = () => {
    let failure = false;
    
    if (prime1 > 100) {
      setPrime1Error('Number must be less than 100');
      failure = true;

    } else if (!(isPrime(prime1))) {
      setPrime1Error('Number must be prime');
      failure = true;
    }

    if (prime2 > 100) {
      setPrime2Error('Number must be less than 100');
      failure = true;

    } else if (!(isPrime(prime2))) {
      setPrime2Error('Number must be prime');
      failure = true;
    }

    if (!failure) {

      if (prime1 === prime2) {
        setPrime2Error('Numbers must be unique');
      }
    }

    if (failure) {
      return;
    }

    const keys = generateRSAKeyPair(prime1, prime2, publicKey);
    setNVal(keys[0]);
    setPrivateKey(keys[1]);
    setTotient(keys[2]);
  };

  const handleEncryptSubmit = () => {
    setEncryptedMessage(rsaEncrypt(message, publicKey, nVal));
  };

  const handleDecryptSubmit = () => {
    setEncryptedMessage(rsaEncrypt(encryptedMessage, privateKey, nVal));
  };

  return (
    <div className="home">
      <video className="background-video" autoPlay loop muted>
        <source src={video} type="video/mp4" />
      </video>
      <div className="content-container">
        <h1 className="title">RSA Encryption</h1>
        <div className='sheldon'>
          <div className="primeContainer">
            <div className="prime1label">
              <label>
                Prime 1:
                <input className="primeInput" type="number" value={prime1} onChange={handlePrime1Change} />
                {prime1Error && <span>{prime1Error}</span>}
              </label>
            </div>
            <div>
              <label>
                Prime 2:
                <input className="primeInput" type="number" value={prime2} onChange={handlePrime2Change} />
                {prime2Error && <span>{prime2Error}</span>}
              </label>
            </div>
            <button className="generateKeyButton" onClick={handleGenerateKeys}>Generate Keys</button>
          </div>
          <div className="messageContainer">
            <div>
              <label className='message-label'>
                Message:
              </label>
              <input className="message-input" type="text" value={message} onChange={handleMessageChange} />
              {messageError && <span>{messageError}</span>}
            </div>
            <div className="buttonContainer">
              <button onClick={handleEncryptSubmit}>Encrypt</button>
              <button onClick={handleDecryptSubmit}>Decrypt</button>
            </div>
          </div>
          <div className='output-message-container'>
            <label className='output-label'>Output:</label>
            <p className='output-message'>{encryptedMessage !== ""} {encryptedMessage}</p>
          </div>
        </div>
      </div>
      {encryptedMessage !== "" && (
        <div className="cards">
          <Slider {...settings}>
            <div className="card1">
              <h2 className='step-number'>Step 1</h2>
              <div className="words">
                <h3>𝑛 = {prime1} x {prime2} = {nVal}</h3>
                <p>Multiply {prime1} by {prime2}. The result (n = {nVal}) is a number only divisible by {prime1} & {prime2} (besides 1 and itself).</p>
              </div>
            </div>
            <div className="card2">
              <h2 className='step-number'>Step 2</h2>
              <div className="words">
                <h3>ϕ(n) = ({prime1} − 1) x ({prime2} − 1) = {totient}</h3>
                <p>Calculate Euler's totient - The number of relatively prime positive integers up to 𝑛.
                </p>
              </div>
            </div>
            <div className="card3">
              <h2 className='step-number'>Step 3</h2>
              <div className="words">
                <h3>𝑒  =  {publicKey}</h3>
                <p>Choose the Public Exponent 𝑒. Common values include 3, 17, & 65537</p>
              </div>
            </div>
            <div className="card4">
              <h2 className='step-number'>Step 4</h2>
              <div className="words">
                <h3>{privateKey}</h3>
                <p>Calulate 𝑑 : the modular multiplicative inverse of {publicKey} mod {totient}.
                𝑑 is a number such that ({publicKey} x d) mod {totient} = 1</p>
              </div>
            </div>
            <div className="card5">
              <h2 className='step-number'>Step 5</h2>
              <div className="words">
                <h3>Public Key: ({publicKey}, {nVal})</h3>
                <h3>Private Key: ({privateKey}, {nVal})</h3>
                <p>Form the public key : (e, n) & private key: (d, n)</p>
              </div>
            </div>
            <div className="card6">
              <h2 className='step-number'>Step 6</h2>
              <div className="words">
                <h3>({message.charCodeAt(0)} ({message.charAt(0)}) ) ^ {publicKey} mod {nVal} = {encryptedMessage.charCodeAt(0)} ({encryptedMessage.charAt(0)})</h3>
                <p>Take the ASCII value of each character in the message, Raise it to the power of e, & mod that value by 𝑛</p>
              </div>
            </div>
            <div className="card7">
              <h2 className='step-number'>Step 7</h2>
              <div className="words">
                <h3>({encryptedMessage.charCodeAt(0)} ({encryptedMessage.charAt(0)}) ) ^ {privateKey} mod {nVal} = {message.charCodeAt(0)} ({message.charAt(0)})</h3>
                <p>Same process for decryption using the decrypted message and private key</p>
              </div>
            </div>
          </Slider>
        </div>
      )}
    </div>
  );
};

export default Home;
