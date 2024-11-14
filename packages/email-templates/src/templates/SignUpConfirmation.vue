<template>
  <Layout preview-text="Sing Up Confirmation">
    <Row>
      <Heading>Here's what Savva wrote</Heading>

      <Pane
        >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam
        corrupti minima nemo id accusantium! Quae cum consequuntur eligendi
        veritatis error voluptatibus, officiis nam doloribus suscipit reiciendis
        necessitatibus, cumque adipisci quam?
      </Pane>

      <Paragraph>
        Now that the review period is over, we’ve posted Savva’s review to your
        Airbnb profile.
      </Paragraph>

      <Paragraph>
        {{ text }}
      </Paragraph>

      <Paragraph :style="{ paddingBottom: '16px' }">
        While it’s too late to write a review of your own, you can send your
        feedback to Savva using your Airbnb message thread.
      </Paragraph>

      <Button href="https://airbnb.com/"> Send My Feedback </Button>
    </Row>
  </Layout>
</template>

<script lang="ts">
import type { ExtractPropTypes } from 'vue'
import { Layout, Button, Pane, Paragraph, Heading, Row } from '@/components';

const props = {
  text: {
    type: String
  }};


const defaultProps: ExtractPropTypes<typeof props> = {
  text: 'DefaultText'
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
}
</script>
