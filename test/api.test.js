/**
 * Comprehensive Senior QA Automated Test Suite
 * Executes live HTTP requests against actual running backend.
 * Validates status codes, JSON response bodies, and error contracts.
 */

const http = require('http');
const app = require('../src/app');
const userStore = require('../src/data/userStore');

let server;
let baseUrl;

const results = [];

function recordTest(id, category, endpoint, scenario, expectedStatus, actualStatus, passed, responseBodySummary = '') {
  results.push({
    id,
    category,
    endpoint,
    scenario,
    expectedStatus,
    actualStatus,
    passed,
    responseBodySummary
  });
  const symbol = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${symbol}] [${category}] #${id} ${endpoint} - ${scenario} (Expected: ${expectedStatus}, Actual: ${actualStatus})`);
}

async function runQATestSuite() {
  console.log('\n========================================================================');
  console.log('   DECODELABS PROJECT 2 - SENIOR QA LIVE INTEGRATION TEST SUITE');
  console.log('========================================================================\n');

  // Start live server on an ephemeral loopback port
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`[QA SERVER INITIALIZED] Base URL: ${baseUrl}\n`);
      resolve();
    });
  });

  try {
    userStore.reset();

    // 1. GET Requests - Server Health
    {
      const res = await fetch(`${baseUrl}/api/health`);
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && body.data.status === 'healthy';
      recordTest(1, 'GET Requests', 'GET /api/health', 'Retrieve server health diagnostics', 200, res.status, passed, `uptime: ${body.data?.uptimeSeconds}s`);
    }

    // 2. GET Requests - All Resources
    {
      const res = await fetch(`${baseUrl}/api/users`);
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && Array.isArray(body.data.users) && body.data.count >= 3;
      recordTest(2, 'GET Requests', 'GET /api/users', 'Retrieve all seeded users collection', 200, res.status, passed, `count: ${body.data?.count}`);
    }

    // 3. GET Requests - Single Resource by ID
    {
      const res = await fetch(`${baseUrl}/api/users/1`);
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && body.data.id === 1 && body.data.name === 'Aarav Sharma';
      recordTest(3, 'GET Requests', 'GET /api/users/1', 'Retrieve single user by valid ID', 200, res.status, passed, `user: ${body.data?.name}`);
    }

    // 4. POST Requests - Valid Creation
    let newUserId;
    {
      const payload = {
        name: 'Pooja Hegde',
        email: 'pooja.hegde@example.com',
        role: 'user',
        status: 'active'
      };
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json();
      const passed = res.status === 201 && body.success === true && body.data.name === 'Pooja Hegde' && typeof body.data.id === 'number';
      if (passed) newUserId = body.data.id;
      recordTest(4, 'POST Requests', 'POST /api/users', 'Create user with valid attributes', 201, res.status, passed, `created id: ${newUserId}`);
    }

    // 5. PUT Requests - Valid Update
    {
      const payload = {
        name: 'Pooja Hegde Updated',
        status: 'inactive'
      };
      const res = await fetch(`${baseUrl}/api/users/${newUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && body.data.name === 'Pooja Hegde Updated' && body.data.status === 'inactive';
      recordTest(5, 'PUT Requests', `PUT /api/users/${newUserId}`, 'Update existing user attributes', 200, res.status, passed, `updated status: ${body.data?.status}`);
    }

    // 6. DELETE Requests - Valid Deletion
    {
      const res = await fetch(`${baseUrl}/api/users/${newUserId}`, {
        method: 'DELETE'
      });
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && body.data.deletedUserId === newUserId;
      recordTest(6, 'DELETE Requests', `DELETE /api/users/${newUserId}`, 'Delete existing user resource', 200, res.status, passed, `deleted id: ${newUserId}`);

      // Verify deletion
      const verifyRes = await fetch(`${baseUrl}/api/users/${newUserId}`);
      const verifyBody = await verifyRes.json();
      const verifyPassed = verifyRes.status === 404 && verifyBody.success === false;
      recordTest(6.1, 'DELETE Verification', `GET /api/users/${newUserId}`, 'Confirm deleted resource returns 404', 404, verifyRes.status, verifyPassed, verifyBody.message);
    }

    // 7. Missing Fields - Missing Email
    {
      const payload = { name: 'User Without Email' };
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json();
      const passed = res.status === 400 && body.success === false && JSON.stringify(body.error).includes('email');
      recordTest(7, 'Missing Fields', 'POST /api/users', 'Reject creation when required "email" is missing', 400, res.status, passed, `error: ${JSON.stringify(body.error)}`);
    }

    // 8. Missing Fields - Missing Name
    {
      const payload = { email: 'valid.email@example.com' };
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json();
      const passed = res.status === 400 && body.success === false && JSON.stringify(body.error).includes('name');
      recordTest(8, 'Missing Fields', 'POST /api/users', 'Reject creation when required "name" is missing', 400, res.status, passed, `error: ${JSON.stringify(body.error)}`);
    }

    // 9. Invalid Data Types - Numeric Name
    {
      const payload = {
        name: 998877, // Invalid type
        email: 'numeric.name@example.com'
      };
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json();
      const passed = res.status === 400 && body.success === false && JSON.stringify(body.error).includes('string');
      recordTest(9, 'Invalid Data Types', 'POST /api/users', 'Reject non-string name attribute', 400, res.status, passed, `error: ${JSON.stringify(body.error)}`);
    }

    // 10. Invalid Data Types - Non-Integer ID in URL Parameter
    {
      const res = await fetch(`${baseUrl}/api/users/not-an-integer-id`);
      const body = await res.json();
      const passed = res.status === 400 && body.success === false && body.message.includes('Invalid resource ID');
      recordTest(10, 'Invalid Data Types', 'GET /api/users/not-an-integer-id', 'Reject alphanumeric ID parameter in URL', 400, res.status, passed, `message: ${body.message}`);
    }

    // 11. Malformed JSON Request
    {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{ "name": "Broken", "email": broken_no_quotes }'
      });
      const body = await res.json();
      const passed = res.status === 400 && body.success === false && body.message.includes('Malformed JSON request');
      recordTest(11, 'Malformed JSON', 'POST /api/users', 'Catch syntax error and return clean JSON 400', 400, res.status, passed, `message: ${body.message}`);
    }

    // 12. Duplicate Records - Existing Email
    {
      const payload = {
        name: 'Duplicate Test',
        email: 'aarav.sharma@example.com' // Already exists
      };
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json();
      const passed = res.status === 400 && body.success === false && body.message.includes('already exists');
      recordTest(12, 'Duplicate Records', 'POST /api/users', 'Enforce email uniqueness constraint', 400, res.status, passed, `conflict message: ${body.message}`);
    }

    // 13. Nonexistent Resource IDs - GET
    {
      const res = await fetch(`${baseUrl}/api/users/88888`);
      const body = await res.json();
      const passed = res.status === 404 && body.success === false && body.message.includes('not found');
      recordTest(13, 'Nonexistent IDs', 'GET /api/users/88888', 'Return 404 on GET nonexistent user', 404, res.status, passed, `message: ${body.message}`);
    }

    // 14. Nonexistent Resource IDs - PUT
    {
      const res = await fetch(`${baseUrl}/api/users/88888`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Phantom User' })
      });
      const body = await res.json();
      const passed = res.status === 404 && body.success === false && body.message.includes('does not exist');
      recordTest(14, 'Nonexistent IDs', 'PUT /api/users/88888', 'Return 404 on PUT nonexistent user', 404, res.status, passed, `message: ${body.message}`);
    }

    // 15. Nonexistent Resource IDs - DELETE
    {
      const res = await fetch(`${baseUrl}/api/users/88888`, {
        method: 'DELETE'
      });
      const body = await res.json();
      const passed = res.status === 404 && body.success === false && body.message.includes('does not exist');
      recordTest(15, 'Nonexistent IDs', 'DELETE /api/users/88888', 'Return 404 on DELETE nonexistent user', 404, res.status, passed, `message: ${body.message}`);
    }

    // 16. Unauthorized Access - Missing Credentials (401)
    {
      const res = await fetch(`${baseUrl}/api/security/protected-user`);
      const body = await res.json();
      const passed = res.status === 401 && body.success === false && body.message.includes('credentials are missing');
      recordTest(16, 'Unauthorized Access', 'GET /api/security/protected-user', 'Reject request lacking authentication header', 401, res.status, passed, `message: ${body.message}`);
    }

    // 17. Unauthorized Access - Invalid Key (401)
    {
      const res = await fetch(`${baseUrl}/api/security/protected-user`, {
        headers: { 'x-api-key': 'completely-wrong-key' }
      });
      const body = await res.json();
      const passed = res.status === 401 && body.success === false && body.message.includes('Invalid or expired');
      recordTest(17, 'Unauthorized Access', 'GET /api/security/protected-user', 'Reject request with invalid API key', 401, res.status, passed, `message: ${body.message}`);
    }

    // 18. Forbidden Access - Standard User Accessing Admin (403)
    {
      const res = await fetch(`${baseUrl}/api/security/protected-admin`, {
        headers: { 'x-api-key': 'decodelabs-secret-key-2026' } // Valid user key, not admin
      });
      const body = await res.json();
      const passed = res.status === 403 && body.success === false && body.message.includes('Forbidden: Access denied');
      recordTest(18, 'Forbidden Access', 'GET /api/security/protected-admin', 'Reject authenticated user lacking admin role', 403, res.status, passed, `message: ${body.message}`);
    }

    // 19. Authorized Access - Admin Role Confirmed (200)
    {
      const res = await fetch(`${baseUrl}/api/security/protected-admin`, {
        headers: { 'x-api-key': 'admin-super-secret-key-2026' } // Valid admin key
      });
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && body.data.adminAccess === true;
      recordTest(19, 'Authorized Access', 'GET /api/security/protected-admin', 'Permit verified admin role', 200, res.status, passed, 'admin privilege verified');
    }

    // 20. Unsupported HTTP Methods - PATCH on /api/users (405 Method Not Allowed)
    {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Patch Test' })
      });
      const body = await res.json();
      const allowHeader = res.headers.get('allow');
      const passed = res.status === 405 && body.success === false && body.message.includes('not supported') && allowHeader.includes('GET');
      recordTest(20, 'Unsupported Methods', 'PATCH /api/users', 'Return 405 with Allow header for unsupported method', 405, res.status, passed, `Allow header: ${allowHeader}`);
    }

    // 21. Unsupported HTTP Methods - DELETE on /api/users collection (405 Method Not Allowed)
    {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'DELETE'
      });
      const body = await res.json();
      const allowHeader = res.headers.get('allow');
      const passed = res.status === 405 && body.success === false && allowHeader.includes('GET, POST');
      recordTest(21, 'Unsupported Methods', 'DELETE /api/users', 'Disallow deleting entire collection directly', 405, res.status, passed, `Allow header: ${allowHeader}`);
    }

    // 22. Undefined Endpoint Routing (404 Not Found)
    {
      const res = await fetch(`${baseUrl}/api/unmapped-endpoint-path`);
      const body = await res.json();
      const passed = res.status === 404 && body.success === false && body.message === 'Endpoint Not Found';
      recordTest(22, 'Undefined Routes', 'GET /api/unmapped-endpoint-path', 'Catch undefined URL with JSON 404 envelope', 404, res.status, passed, body.error);
    }

    // 23. Unexpected Server Errors (500 Internal Server Error)
    {
      const res = await fetch(`${baseUrl}/api/demo/status/500`);
      const body = await res.json();
      const passed = res.status === 500 && body.success === false && body.message === 'Internal Server Error';
      recordTest(23, 'Server Errors', 'GET /api/demo/status/500', 'Handle unhandled exception safely without leaking stack trace', 500, res.status, passed, `sanitized error: ${body.error}`);
    }

    // 24. Rate Limiting Resilience (429 Too Many Requests)
    {
      let hit429 = false;
      let lastStatus = 200;
      for (let i = 0; i < 7; i++) {
        const res = await fetch(`${baseUrl}/api/security/rate-limit-test`);
        lastStatus = res.status;
        if (res.status === 429) {
          hit429 = true;
          break;
        }
      }
      recordTest(24, 'Resilience & Quota', 'GET /api/security/rate-limit-test', 'Trigger 429 after exceeding quota ceiling', 429, lastStatus, hit429, 'rate limit threshold enforced');
    }

    // 25. HTTP 204 No Content
    {
      const res = await fetch(`${baseUrl}/api/demo/status/204`);
      const text = await res.text();
      const passed = res.status === 204 && text === '';
      recordTest(25, 'Status Codes', 'GET /api/demo/status/204', 'Demonstrate 204 with empty response body', 204, res.status, passed, 'empty body verified');
    }

    // 26. Security Headers - Hardening & Leakage Prevention
    {
      const res = await fetch(`${baseUrl}/api/health`);
      const nosniff = res.headers.get('x-content-type-options') === 'nosniff';
      const frameDeny = res.headers.get('x-frame-options') === 'DENY';
      const noPoweredBy = res.headers.get('x-powered-by') === null;
      const passed = nosniff && frameDeny && noPoweredBy;
      recordTest(26, 'Security Headers', 'GET /api/health', 'Verify nosniff, X-Frame-Options DENY, and X-Powered-By disabled', 200, res.status, passed, 'headers validated');
    }

    // 27. Input Validation - HTTP Parameter Pollution Resistance
    {
      const res = await fetch(`${baseUrl}/api/users?search=a&search=b&role=user&role=admin`);
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && Array.isArray(body.data.users);
      recordTest(27, 'Security Audit', 'GET /api/users?search=a&search=b', 'Handle duplicate query array parameters safely without 500 crash', 200, res.status, passed, 'HPP sanitized');
    }

    // 28. Sensitive Information Exposure - Health Banner Suppression
    {
      const res = await fetch(`${baseUrl}/api/health`);
      const body = await res.json();
      const noPlatform = body.data?.system?.platform === undefined;
      const noNodeVersion = body.data?.system?.nodeVersion === undefined;
      const passed = res.status === 200 && noPlatform && noNodeVersion;
      recordTest(28, 'Security Audit', 'GET /api/health', 'Confirm server platform & runtime version banner are withheld', 200, res.status, passed, 'fingerprint suppressed');
    }

    // 29. Request Size Limits - Payload Too Large (413)
    {
      const largePayload = {
        name: 'Large User',
        email: 'large@example.com',
        bio: 'x'.repeat(15 * 1024) // 15KB > 10KB limit
      };
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(largePayload)
      });
      const passed = res.status === 413;
      recordTest(29, 'Security Audit', 'POST /api/users', 'Enforce 10kb request body size limit (413 Payload Too Large)', 413, res.status, passed, 'oversized body rejected');
    }

    // 30. Boundary Validation - Email Max Length Limit
    {
      const longEmailPayload = {
        name: 'Boundary Test',
        email: 'a'.repeat(250) + '@example.com' // 262 characters > 254 limit
      };
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(longEmailPayload)
      });
      const body = await res.json();
      const passed = res.status === 400 && body.success === false && JSON.stringify(body.error).includes('254 characters');
      recordTest(30, 'Security Audit', 'POST /api/users', 'Reject email exceeding RFC 5321 maximum 254 length ceiling', 400, res.status, passed, 'email length ceiling enforced');
    }

  } catch (err) {
    console.error('[QA RUNNER EXCEPTION]:', err);
  } finally {
    server.close();
  }

  // Summary calculation
  const total = results.length;
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = total - passedCount;

  console.log('\n========================================================================');
  console.log(`   QA EXECUTION SUMMARY: ${passedCount} / ${total} TESTS PASSED`);
  if (failedCount === 0) {
    console.log('   🎉 QA CERTIFICATION: 100% SUITE PASS. ZERO DEFECTS DETECTED.');
  } else {
    console.log(`   ⚠️ QA DEFECT ALERT: ${failedCount} TEST(S) FAILED.`);
  }
  console.log('========================================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runQATestSuite();
