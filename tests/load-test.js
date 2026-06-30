import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '30s', target: 500 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<10'], // 95% of requests must complete below 10ms
  },
};

export default function () {
  const url = 'http://localhost:3000/v1/authz/check';
  const payload = JSON.stringify({
    resource: {
      namespace: 'document',
      object_id: 'doc-123'
    },
    relation: 'reader',
    subject: {
      namespace: 'user',
      object_id: 'user-456'
    },
    consistency_token: 'at_least_as_fresh'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201 || r.status === 200,
    'latency is low': (r) => r.timings.duration < 10,
  });

  sleep(0.01);
}
