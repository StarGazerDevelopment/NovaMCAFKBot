  client.on('start_game', (packet) => {
    try {
      entityId = BigInt(packet.runtime_entity_id);
      console.log(`✅ Bot received start_game. entityId = ${entityId}`);
    } catch (e) {
      console.error('❌ Failed to convert entityId to BigInt:', e.message);
      return;
    }

    setTimeout(() => {
      console.log('✅ Bot fully spawned and ready');

      let x = 0;
      let direction = 1;

      moveInterval = setInterval(() => {
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

      chatInterval = setInterval(() => {
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
