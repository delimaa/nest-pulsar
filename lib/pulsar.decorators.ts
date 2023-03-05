import { Inject } from '@nestjs/common';
import { FeatureType, getClientToken, getFeatureToken } from './pulsar.utils';

export function InjectPulsar(
  type: 'client',
  name?: string,
): ReturnType<typeof Inject>;
export function InjectPulsar(
  type: FeatureType,
  name: string,
): ReturnType<typeof Inject>;
export function InjectPulsar(
  type: FeatureType | 'client',
  name?: string,
): ReturnType<typeof Inject> {
  if (type === 'client') {
    const token = getClientToken(name);
    return Inject(token);
  }
  if (!name) throw new Error('name required');
  const token = getFeatureToken(type, name);
  return Inject(token);
}
