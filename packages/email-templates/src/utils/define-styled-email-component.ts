import { type CSSProperties, defineComponent, h } from 'vue';

export const defineStyledEmailComponent = <
  T extends new () => {
    $props: any;
  },
>(
  component: T,
  style: CSSProperties,
) => {
  return defineComponent({
    render() {
      return h(
        component,
        {
          ...this.$attrs,
          style,
        },
        this.$slots,
      );
    },
  }) as unknown as T;
};
