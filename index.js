const express = require('express');
const { createClient } = require('bedrock-protocol');

const options = {
  host: 'PlayNova.aternos.me',
  port: 44333,
  username: 'AFK_Bot',
  offline: true,
  version: '1.21.93'
};

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('AFK Bot is running!'));

function connectBot() {
  const client = createClient(options);
  let entityId;
  let moveInterval;
  let chatInterval;

  console.log('Starting bedrock-afk-bot...');

  client.on('connect', () => {
    console.log('✅ Connected to server');
  });

  client.on('join', () => {
    console.log('✅ Bot joined the game');
  });

  client.on('start_game', (packet) => {
    entityId = BigInt(packet.runtime_entity_id);
    console.log(`✅ Bot received start_game. entityId = ${entityId}`);

    setTimeout(() => {
      console.log('✅ Bot fully spawned and ready');

      let x = 0;
      let direction = 1;

      // Move every 0.5s
      moveInterval = setInterval(() => {
        if (!client?.raknet?.connected) return;
        try {
          x += direction;
          if (x > 4 || x < 0) direction *= -1;

          console.log(`🚶 Bot walking to x=${x}`);
          client.write('move_player', {
            runtime_entity_id: entityId,
            position: { x, y: 70, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            pitch: 0,
            head_yaw: 0,
            yaw: 0,
            mode: 0,
            on_ground: true,
            ridden_runtime_entity_id: BigInt(0),
            teleport_cause: 0,
            teleport_item: 0,
            entity_type: BigInt(1),
            tick: BigInt(Date.now())
          });
          console.log(`✅ Move successfully sent to x = ${x}`);
        } catch (e) {
          console.error('⚠️ Move send failed:', e.message);
        }
      }, 500);

      // Chat every 60s
      chatInterval = setInterval(() => {
        if (!client?.raknet?.connected) return;
        try {
          client.queue('text', {
            type: 'chat',
            needs_translation: false,
            source_name: options.username,
            xuid: '',
            platform_chat_id: '',
            message: 'AFK Bot working!'
          });
          console.log('💬 Sent AFK chat message');
        } catch (e) {
          console.error('⚠️ Chat send failed:', e.message);
        }
      }, 60000);
    }, 3000);
  });

  client.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', reason);
    clearInterval(moveInterval);
    clearInterval(chatInterval);
    setTimeout(connectBot, 5000);
  });

  client.on('error', (err) => {
    console.error('⚠️ Error:', err.message);
  });
}

connectBot();

app.listen(port, () => {
  console.log(`Web server listening on port ${port}`);
});
