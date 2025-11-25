import { A2AClient, Task, State } from '@a2a-js/sdk';

const API_BASE_URL = 'http://localhost:41242'; // Assuming the server runs on this port

class A2AService {
  private client: A2AClient;
  private task: Task | null = null;
  private onMessageCallback: ((message: any) => void) | null = null;
  private onStateChangeCallback: ((state: State) => void) | null = null;

  constructor() {
    this.client = new A2AClient({
      url: API_BASE_URL,
    });
  }

  async createTask() {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      const taskId = await response.json();
      this.task = await this.client.getTask(taskId);
      this.setupTaskListeners();
      return this.task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  private setupTaskListeners() {
    if (!this.task) return;

    this.task.on('state.*', (state: State) => {
      if (this.onStateChangeCallback) {
        this.onStateChangeCallback(state);
      }
    });

    this.task.on('stream.text.delta', (data: { delta: string }) => {
      if (this.onMessageCallback) {
        this.onMessageCallback({ type: 'text', content: data.delta });
      }
    });

    this.task.on('tool.call', (toolCall: any) => {
      if (this.onMessageCallback) {
        this.onMessageCallback({ type: 'tool-call', content: toolCall });
      }
    });

    this.task.on('tool.authorization_required', (authRequest: any) => {
      if (this.onMessageCallback) {
        this.onMessageCallback({ type: 'tool-auth', content: authRequest });
      }
    });
  }

  async sendMessage(message: string) {
    if (!this.task) {
      await this.createTask();
    }
    await this.task?.prompt(message);
  }

  async authorizeTool(authorizationId: string) {
    await this.task?.authorizeTool(authorizationId);
  }

  async denyTool(authorizationId: string) {
    await this.task?.denyTool(authorizationId);
  }

  onMessage(callback: (message: any) => void) {
    this.onMessageCallback = callback;
  }

  onStateChange(callback: (state: State) => void) {
    this.onStateChangeCallback = callback;
  }
}

export const a2aService = new A2AService();
