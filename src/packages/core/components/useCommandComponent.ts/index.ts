import {
  Component,
  ComponentPublicInstance,
  createVNode,
  getCurrentInstance,
  render,
  VNode,
} from 'vue';

import type { ModalProps } from 'ant-design-vue';

export interface CommandComponent {
  (options: ModalProps): VNode;
  close: () => void;
}

export const useCommandComponent = <T extends Component>(Component: T): CommandComponent => {
  // 获取 app 实例它身上的全局属性
  // 比如 pinia $global
  const appContext = getCurrentInstance()!.appContext;

  // 创建一个容器，来放弹窗
  const container = document.createElement('div');

  // 自定义关闭方法
  const cancel = () => {
    render(null, container);
    container.parentNode?.removeChild(container);
  };

  const CommandComponent = (options: ModalProps): VNode => {
    // 参数判断
    if (!Reflect.has(options, 'visible')) {
      options.visible = true;
    }
    if (typeof options.onCancel !== 'function') {
      options.onCancel = cancel;
    } else {
      const originOnCancel = options.onCancel;
      options.onCancel = (e: MouseEvent) => {
        originOnCancel?.(e);
        cancel();
      };
    }

    // 创建虚拟DOM
    const vNode = createVNode(Component, options);
    vNode.appContext = appContext;
    // 渲染虚拟DOM到容器上
    render(vNode, container);
    // 将容器推入body
    document.body.appendChild(container);

    const vm = vNode.component?.proxy as ComponentPublicInstance<ModalProps>;
    // 注入 props
    for (const prop in options) {
      if (Reflect.has(options, prop) && !Reflect.has(vm.$props, prop)) {
        vm[prop as keyof ComponentPublicInstance] = options[prop];
      }
    }
    return vNode;
  };

  CommandComponent.close = close;

  return CommandComponent;
};

export default useCommandComponent;
