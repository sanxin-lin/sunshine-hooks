import type { Ref, ShallowRef } from 'vue'
import { ref, shallowRef } from 'vue'
import { tryOnScopeDispose } from '../../reactivity'
import { defaultWindow } from '../../../utils'
import { isFunction, isString } from 'lodash'

type PostMessage = typeof Worker.prototype['postMessage']

export interface UseWebWorkerReturn<Data = any> {
  data: Ref<Data>
  post: PostMessage
  terminate: () => void
  worker: ShallowRef<Worker | undefined>
}

type WorkerFn = (...args: unknown[]) => Worker

/**
 * Simple Web Workers registration and communication.
 * @param url
 * @param workerOptions
 * @param options
 */
export function useWebWorker<T = any>(
  url: string,
  workerOptions?: WorkerOptions,
): UseWebWorkerReturn<T>

/**
 * Simple Web Workers registration and communication.
 * @param worker
 */
export function useWebWorker<T = any>(
  worker: Worker | WorkerFn
): UseWebWorkerReturn<T>

export function useWebWorker<Data = any>(
  arg0: string | WorkerFn | Worker,
  workerOptions?: WorkerOptions,
): UseWebWorkerReturn<Data> {

  const _window = defaultWindow

  const data: Ref<any> = ref(null)
  const worker = shallowRef<Worker>()

  const post: PostMessage = (...args) => {
    if (!worker.value)
      return

    worker.value.postMessage(...args as Parameters<PostMessage>)
  }

  const terminate: typeof Worker.prototype['terminate'] = function terminate() {
    if (!worker.value)
      return

    worker.value.terminate()
  }

  if (_window) {
    if (isString(arg0)) {
      worker.value = new Worker(arg0, workerOptions)
    } else if (isFunction(arg0)) {
      worker.value = arg0()
    } else {
      worker.value = arg0
    }

    worker.value.onmessage = (e: MessageEvent) => {
      data.value = e.data
    }

    tryOnScopeDispose(() => {
      if (worker.value)
        worker.value.terminate()
    })
  }

  return {
    data,
    post,
    terminate,
    worker,
  }
}