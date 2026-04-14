export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Disposition, X-WP-Nonce, X-Requested-With, Accept',
    'Access-Control-Expose-Headers': 'X-WP-Total, X-WP-TotalPages'
  };
}
