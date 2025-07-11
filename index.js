const { createClient } = require('bedrock-protocol');
const readline = require('readline');

const options = {
  host: 'PlayNova.aternos.me',
  port: 44333,
  username: 'AFK_Bot',
  offline: true,
  version: '1.21.93'
};

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

function connectBot() {
  const client = createClient(options);
  let entityId;

  console.log('Starting bedrock-afk-bot...');

  client.on('connect', () => {
    console.log('✅ Connected to server');
  });

  client.on('join', () => {
    console.log('✅ Bot joined the game');
  });

  client.on('start_game', async (packet) => {
    entityId = packet.runtime_entity_id;
    console.log(`✅ Bot received start_game. entityId = ${entityId}`);

const confirm = 'y'; // auto-confirm on headless platforms like Render

    if (confirm.trim().toLowerCase() !== 'y') {
      const manual = await askQuestion('✏️ Enter the correct entityId: ');
      try {
        entityId = BigInt(manual.trim());
        console.log(`✅ Manually using entityId = ${entityId}`);
      } catch (e) {
        console.error('❌ Invalid manual entityId. Aborting.');
        process.exit(1);
      }
    } else {
      entityId = BigInt(entityId);
    }

setTimeout(() => {
  console.log('✅ Bot fully spawned and ready');

 let jumping = false;

setInterval(() => {
  try {
    jumping = !jumping;
    const y = jumping ? 70.5 : 70.0;

    console.log(`🔁 Jumping ${jumping ? 'up' : 'down'} with entityId = ${entityId}`);
    client.write('move_player', {
      runtime_entity_id: entityId,
      position: { x: 0.1, y, z: 0.1 },
      rotation: { x: 0, y: 0, z: 0 },
      pitch: 0,
      head_yaw: 0,
      yaw: 0,
      mode: 0,
      on_ground: !jumping,
      ridden_runtime_entity_id: BigInt(0),
      teleport_cause: 0,
      teleport_item: 0,
      entity_type: BigInt(1),
      tick: BigInt(0)
    });
    console.log('✅ Jump move sent');
  } catch (e) {
    console.error('⚠️ Move send failed:', e.message);
  }
}, 5000); // Jump every 5 seconds
}, 3000);



  });

  client.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', reason);
    setTimeout(connectBot, 5000);
  });

  client.on('error', (err) => {
    console.error('⚠️ Error:', err.message);
  });
}

connectBot();
