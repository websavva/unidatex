<template>
  <Layout preview-text="Sing Up Confirmation">
    <template #heading>
      Account confirmation
    </template>

    <Row>
      <Paragraph :style="{
          marginTop: 0,
          workBreak: 'break-word'
        }"
      >
        Hi {{ username  }},
      </Paragraph>

      <Paragraph>
        Thank you for signing up for UniDateX, where connections and love await!
        Please confirm your email address to activate your account and start exploring.
      </Paragraph>

      <Paragraph :style="{
        marginTop: '30px'
      }">
        Click the button below to confirm your account:
      </Paragraph>

      <Button :href="confirmationUrl">
        Confirm account
      </Button>

      <Paragraph :style="{
        margin: '40px 0 8px 0',
      }">
        Or, copy and paste the following link into your browser:
      </Paragraph>

      <Paragraph :style="{
        color: '#898989',
        margin: 0,
        workBreak: 'break-word'
      }">
        {{ confirmationUrl }}
      </Paragraph>
    </Row>
  </Layout>
</template>

<script lang="ts">
import type { ExtractPropTypes } from 'vue'

import { Layout, Button, Pane, Paragraph, Heading, Row } from '@/components';
import { createUrl } from '@/utils/create-link';

const props = {
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
} as const

const defaultProps: ExtractPropTypes<typeof props> = {
  email: 'john125@gmail.com',
  username: 'John',
  confirmationToken: '76fa143aebc14890'
};

export default {
  components: {
    Layout,
    Button,
    Pane,
    Paragraph,
    Heading,
    Row
  },

  props,

  defaultProps,

  computed: {
    confirmationUrl() {
      return createUrl('/sign-up/confirm', {
        query: {
          token: this.confirmationToken
        }
      })
    }
  }
}
</script>
