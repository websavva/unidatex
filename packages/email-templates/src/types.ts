import type { AllowedComponentProps, VNodeProps } from 'vue';

export type ExtractComponentProps<TComponent> = TComponent extends new () => {
  $props: infer P;
}
  ? Omit<P, keyof VNodeProps | keyof AllowedComponentProps>
  : never;
