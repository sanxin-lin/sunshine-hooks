import { computed, ref } from 'vue';
import { tryOnScopeDispose } from '../../reactivity';
import type { MaybeElementRef } from '../../../types';
import { unrefElement } from '../../components';
import { useEventListener } from '../useEventListener';
import { defaultDocument } from '../../../utils';
import { useSupported } from '../../utilities';

export interface UseFullscreenOptions {
  /**
   * Automatically exit fullscreen when component is unmounted
   *
   * @default false
   */
  autoExit?: boolean;
}

const eventHandlers = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'webkitendfullscreen',
  'mozfullscreenchange',
  'MSFullscreenChange',
] as any as 'fullscreenchange'[];

/**
 * Reactive Fullscreen API.
 * @param target
 * @param options
 */
export function useFullscreen(target?: MaybeElementRef, options: UseFullscreenOptions = {}) {
  const { autoExit } = options;
  const _document = defaultDocument;

  const targetRef = computed(() => unrefElement(target) ?? _document?.querySelector('html'));
  const isFullscreen = ref(false);

  const requestMethod = computed<'requestFullscreen' | undefined>(() => {
    return [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'webkitEnterFullscreen',
      'webkitEnterFullScreen',
      'webkitRequestFullScreen',
      'mozRequestFullScreen',
      'msRequestFullscreen',
    ].find(
      (m) => (_document && m in _document) || (targetRef.value && m in targetRef.value),
    ) as any;
  });

  const exitMethod = computed<'exitFullscreen' | undefined>(() => {
    return [
      'exitFullscreen',
      'webkitExitFullscreen',
      'webkitExitFullScreen',
      'webkitCancelFullScreen',
      'mozCancelFullScreen',
      'msExitFullscreen',
    ].find((m) => (document && m in document) || (targetRef.value && m in targetRef.value)) as any;
  });

  const fullscreenEnabled = computed<'fullscreenEnabled' | undefined>(() => {
    return [
      'fullScreen',
      'webkitIsFullScreen',
      'webkitDisplayingFullscreen',
      'mozFullScreen',
      'msFullscreenElement',
    ].find((m) => (document && m in document) || (targetRef.value && m in targetRef.value)) as any;
  });

  const fullscreenElementMethod = [
    'fullscreenElement',
    'webkitFullscreenElement',
    'mozFullScreenElement',
    'msFullscreenElement',
  ].find((m) => document && m in document) as 'fullscreenElement' | undefined;

  const isSupported = useSupported(
    () =>
      targetRef.value &&
      document &&
      requestMethod.value !== undefined &&
      exitMethod.value !== undefined &&
      fullscreenEnabled.value !== undefined,
  );

  const isCurrentElementFullScreen = (): boolean => {
    if (fullscreenElementMethod) return document?.[fullscreenElementMethod] === targetRef.value;
    return false;
  };

  const isElementFullScreen = (): boolean => {
    if (fullscreenEnabled.value) {
      if (document && document[fullscreenEnabled.value] != null) {
        return document[fullscreenEnabled.value];
      } else {
        const target = targetRef.value as any;
        // Fallback for WebKit and iOS Safari browsers
        if (target?.[fullscreenEnabled.value] != null) {
          // Fallback for WebKit and iOS Safari browsers
          return Boolean(target[fullscreenEnabled.value]);
        }
      }
    }
    return false;
  };

  async function exit() {
    if (!isSupported.value || !isFullscreen.value) return;
    if (exitMethod.value) {
      if (document?.[exitMethod.value] != null) {
        await document[exitMethod.value]();
      } else {
        const target = targetRef.value as any;
        // Fallback for Safari iOS
        if (target?.[exitMethod.value] != null)
          // Fallback for Safari iOS
          await target[exitMethod.value]();
      }
    }

    isFullscreen.value = false;
  }

  async function enter() {
    if (!isSupported.value || isFullscreen.value) return;

    if (isElementFullScreen()) await exit();

    const target = targetRef.value;
    if (requestMethod.value && target?.[requestMethod.value] != null) {
      await target[requestMethod.value]();
      isFullscreen.value = true;
    }
  }

  async function toggle() {
    await (isFullscreen.value ? exit() : enter());
  }

  const handlerCallback = () => {
    const isElementFullScreenValue = isElementFullScreen();
    if (!isElementFullScreenValue || (isElementFullScreenValue && isCurrentElementFullScreen()))
      isFullscreen.value = isElementFullScreenValue;
  };

  useEventListener(document, eventHandlers, handlerCallback, false);
  useEventListener(() => unrefElement(targetRef), eventHandlers, handlerCallback, false);

  if (autoExit) tryOnScopeDispose(exit);

  return {
    isSupported,
    isFullscreen,
    enter,
    exit,
    toggle,
  };
}

export type UseFullscreenReturn = ReturnType<typeof useFullscreen>