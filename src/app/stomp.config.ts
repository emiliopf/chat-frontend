import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import envConfig from '../assets/env-config.json'

export const stompConfig: InjectableRxStompConfig = {
  // Which server?
  brokerURL: `ws://${envConfig.host}/ws`,

  // Headers
  // Typical keys: login, passcode, host
  connectHeaders: {
    login: '',
    passcode: '',
    // userid: 'foo',
    // 'client-id': 'fpoiuy',
    // id: 'mycustomid'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 30000,

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  debug: (msg: string): void => {
    console.log(new Date(), msg);
  },
};

