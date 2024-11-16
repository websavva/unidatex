<template>
  <Layout
    preview-text="Sing Up Confirmation"
    :username="username"
  >
    <template #heading> Account confirmation </template>

    <Row>
      <Paragraph>
        Thank you for signing up for {{ publicEnv.companyName }}, where
        connections and love await! Please confirm your email address to
        activate your account and start exploring.
      </Paragraph>

      <Paragraph
        :style="{
        marginTop: '30px'
      }"
      >
        Click the button below to confirm your account:
      </Paragraph>

      <Button :href="confirmationUrl">
        Confirm account
      </Button>

      <Paragraph
        :style="{
        margin: '40px 0 8px 0',
      }"
      >
        Or, copy and paste the following link into your browser:
      </Paragraph>

      <Paragraph
        :style="{
        color: '#898989',
        margin: 0,
        workBreak: 'break-word'
      }"
      >
        {{ confirmationUrl }}
      </Paragraph>
    </Row>
  </Layout>
</template>

<script lang="ts" setup>
import { Layout, Button, Paragraph, Row } from '@/components';
import { createUrl } from '@/utils/create-link';
import { publicEnv } from '@/env'

const props = defineProps({
  email: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  confirmationToken: {
    type: String,
    required: true,
  },
})

defineOptions({
  defaultProps: {
  email: 'john125@gmail.com',
  username: 'John',
  confirmationToken: '76fa143aebc14890'
  }
} satisfies { defaultProps: typeof props })

const confirmationUrl = createUrl('/sign-up/confirm', {
  query: {
    token: props.confirmationToken
  }
});
</script>
