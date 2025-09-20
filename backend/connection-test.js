const { io } = require('socket.io-client');

console.log('🔍 Testing Socket.IO Connection Stability...\n');

const socket = io('http://localhost:5000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['websocket', 'polling'],
  upgrade: true,
  rememberUpgrade: true,
  forceNew: false
});

let connectCount = 0;
let disconnectCount = 0;
let messageCount = 0;

socket.on('connect', () => {
  connectCount++;
  console.log(`✅ Connected (${connectCount}): ${socket.id} at ${new Date().toISOString()}`);
  
  // Join a test session
  socket.emit('join_chat', { sessionId: 'test-session-123' });
  
  // Send a test message every 5 seconds
  const messageInterval = setInterval(() => {
    if (socket.connected) {
      messageCount++;
      console.log(`📨 Sending test message ${messageCount}...`);
      socket.emit('send_message', {
        message: `Test message ${messageCount}`,
        language: 'en',
        sessionId: 'test-session-123'
      });
    } else {
      clearInterval(messageInterval);
    }
  }, 5000);
});

socket.on('disconnect', (reason) => {
  disconnectCount++;
  console.log(`❌ Disconnected (${disconnectCount}): ${reason} at ${new Date().toISOString()}`);
});

socket.on('connect_error', (error) => {
  console.log(`🚨 Connection Error: ${error.message} at ${new Date().toISOString()}`);
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`🔄 Reconnected after ${attemptNumber} attempts at ${new Date().toISOString()}`);
});

socket.on('reconnect_error', (error) => {
  console.log(`❌ Reconnection Failed: ${error.message} at ${new Date().toISOString()}`);
});

socket.on('welcome', (data) => {
  console.log(`🎉 Welcome message received: ${data.message}`);
});

socket.on('joined_chat', (data) => {
  console.log(`👥 Joined chat session: ${data.sessionId}`);
});

socket.on('receive_message', (data) => {
  console.log(`📥 Received response: ${data.message.substring(0, 50)}...`);
});

socket.on('error', (error) => {
  console.log(`🚨 Socket Error: ${error.message || error} at ${new Date().toISOString()}`);
});

// Monitor connection stats
setInterval(() => {
  console.log(`\n📊 Connection Stats:
  - Status: ${socket.connected ? '✅ Connected' : '❌ Disconnected'}
  - Socket ID: ${socket.id || 'N/A'}
  - Transport: ${socket.io.engine?.transport?.name || 'N/A'}
  - Connect Count: ${connectCount}
  - Disconnect Count: ${disconnectCount}
  - Messages Sent: ${messageCount}
  - Uptime: ${Math.floor(process.uptime())}s
  `);
}, 10000);

// Test for 60 seconds then exit
setTimeout(() => {
  console.log('\n🏁 Test completed. Final stats:');
  console.log(`- Total Connections: ${connectCount}`);
  console.log(`- Total Disconnections: ${disconnectCount}`);
  console.log(`- Messages Sent: ${messageCount}`);
  console.log(`- Connection Stability: ${connectCount > disconnectCount ? '✅ Stable' : '❌ Unstable'}`);
  
  socket.disconnect();
  process.exit(0);
}, 60000);

console.log('Running connection stability test for 60 seconds...\n');