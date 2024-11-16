<template>
  <Layout
    preview-text="Password Reset Confirmation"
    :username="username"
  >
    <template #heading>
      Password reset
    </template>

    <Row>
      <Paragraph>
        We received a request to reset your password for your account at {{ publicEnv.companyName }}.
        If you made this request, follow the instructions below to set a new password.
      </Paragraph>

      <Paragraph
        :style="{
        marginTop: '30px'
      }"
      >
        Click the button below to reset your password:
      </Paragraph>

      <Button :href="confirmationUrl">
        Reset password
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
    username: 'John',
    confirmationToken: '76fa143aebc14890'
  }
} satisfies { defaultProps: typeof props })

const confirmationUrl = createUrl('/password-reset/confirm', {
  query: {
    token: props.confirmationToken
  }
});
</script>
