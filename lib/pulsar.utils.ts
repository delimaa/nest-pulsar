import { DEFAULT_CLIENT_NAME } from "./pulsar.constants";

export type FeatureType = 'consumer' | 'producer' | 'reader';

export function getClientToken(
  clientName: string = DEFAULT_CLIENT_NAME,
): string {
  return `${clientName}PulsarClient`;
}

export function getClientConfigToken(
  clientName: string = DEFAULT_CLIENT_NAME,
): string {
  return getClientToken(clientName) + 'Config';
}

export function getFeatureToken(type: FeatureType, name: string): string {
  if (type === 'consumer') return `${name}PulsarConsumer`;
  if (type === 'producer') return `${name}PulsarProducer`;
  if (type === 'reader') return `${name}PulsarReader`;
  throw new Error('Invalid feature type');
}

export function getFeatureConfigToken(type: FeatureType, name: string): string {
  return getFeatureToken(type, name) + 'Config';
}
