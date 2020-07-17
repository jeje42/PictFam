import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export const register = (registrations: { route: string; callback: (message: { body: string }) => void }[], token: string) => {
  const socket = SockJS(`/ws`);
  const stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    registrations.forEach(function (registration) {
      stompClient.subscribe(registration.route, registration.callback);
    });
  });
};
