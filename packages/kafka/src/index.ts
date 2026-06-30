import { Kafka, Producer, Consumer, KafkaConfig } from 'kafkajs';

export class KafkaClient {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(config: KafkaConfig, groupId?: string) {
    this.kafka = new Kafka(config);
    this.producer = this.kafka.producer();
    if (groupId) {
      this.consumer = this.kafka.consumer({ groupId });
    }
  }

  async connectProducer() {
    await this.producer.connect();
  }

  async disconnectProducer() {
    await this.producer.disconnect();
  }

  async connectConsumer() {
    if (this.consumer) {
      await this.consumer.connect();
    }
  }

  async disconnectConsumer() {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }

  async publish(topic: string, messages: any[]) {
    await this.producer.send({
      topic,
      messages: messages.map((m) => ({ value: JSON.stringify(m) })),
    });
  }

  async subscribe(topic: string, eachMessage: (payload: any) => Promise<void>) {
    if (!this.consumer) throw new Error('Consumer not initialized with groupId');
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const parsed = JSON.parse(message.value.toString());
          await eachMessage(parsed);
        }
      },
    });
  }
}
