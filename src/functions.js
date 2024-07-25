
function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// Function to compute the modular inverse
function modInverse(a, m) {
  const m0 = m;
  let y = 0, x = 1;
  
  if (m === 1) return 0;
  
  while (a > 1) {
    const q = Math.floor(a / m);
    let t = m;
    
    m = a % m;
    a = t;
    t = y;
    
    y = x - q * y;
    x = t;
  }
  
  if (x < 0) x += m0;
  
  return x;
}

// Function to generate RSA key pairs
export function generateRSAKeyPair(p, q, e) {
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  
  // Ensure e and phi are coprime
  if (gcd(e, phi) !== 1) {
    e = 3;
    while (gcd(e, phi) !== 1) {
      e += 2;
    }
  }
  
  const d = modInverse(e, phi);
  
  return [n, d, phi];
}

// Function to perform modular exponentiation
function modpow(base, exp, mod) {
  if (mod === 1) return 0;
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) { // If exp is odd, multiply base with result
      result = (result * base) % mod;
    }
    exp = exp >> 1; // Divide exp by 2
    base = (base * base) % mod; // Square the base
  }
  return result;
}

// Function to encrypt a message using RSA
export function rsaEncrypt(message, e, n) {
  let encryptedMessage = [];

  for (let i = 0; i < message.length; i++) {
    let asciiOfMessage = message.charCodeAt(i);
    let encryptedNum = modpow(asciiOfMessage, e, n);
    encryptedMessage.push(String.fromCharCode(encryptedNum));
  }

  return encryptedMessage.join('');
}