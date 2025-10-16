import { ref, watch, onUnmounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const WS_URL = 'ws://localhost:3001';

export function useWebSocketScore(score) {
  const competitorScore = ref(0);
  const clientId = uuidv4();
  const ws = new WebSocket(WS_URL);

  const parseData = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.log(data);
      return {};
    }
  };

  ws.onmessage = (event) => {
    const data = parseData(event.data);
    if (data.type === 'score' && data.clientId !== clientId) {
      competitorScore.value = data.score;
    }
  };

  watch(score, () => {
    ws.send(JSON.stringify({ type: 'score', score: score.value, clientId }));
  });

  onUnmounted(() => ws.close());

  return { competitorScore };
}
