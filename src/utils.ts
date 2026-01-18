import { TEXT_STYLE_KEYS, BOX_STYLE_KEYS } from './constants';
import type { TextStyleProps, BoxStyleProps } from './types';

export function extractTextProps(
  style: (TextStyleProps & BoxStyleProps) | undefined,
): TextStyleProps {
  if (!style) return {};
  const result: TextStyleProps = {};
  for (const key of TEXT_STYLE_KEYS) {
    if (key in style) {
      (result as Record<string, unknown>)[key] = (
        style as Record<string, unknown>
      )[key];
    }
  }
  return result;
}

export function extractBoxProps(
  style: (TextStyleProps & BoxStyleProps) | undefined,
): BoxStyleProps {
  if (!style) return {};
  const result: BoxStyleProps = {};
  for (const key of BOX_STYLE_KEYS) {
    if (key in style) {
      (result as Record<string, unknown>)[key] = (
        style as Record<string, unknown>
      )[key];
    }
  }
  return result;
}

export function mergeStyles<T>(
  defaultStyle: T | undefined,
  userStyle: T | undefined,
): T {
  if (!defaultStyle && !userStyle) return {} as T;
  if (!defaultStyle) return userStyle as T;
  if (!userStyle) return defaultStyle;
  return { ...defaultStyle, ...userStyle };
}
