<template>
  <Layout preview-text="Sing Up Confirmation">
    <Row>
      <Text :style="heading">Here's what Savva wrote</Text>
      <!-- <Text :style="review"
        >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam corrupti
        minima nemo id accusantium! Quae cum consequuntur eligendi veritatis error
        voluptatibus, officiis nam doloribus suscipit reiciendis necessitatibus,
        cumque adipisci quam?</Text
      > -->
      <Text :style="paragraph">
        Now that the review period is over, we’ve posted Savva’s review to your
        Airbnb profile.
      </Text>
      <Text :style="{ ...paragraph, paddingBottom: '16px' }">
        While it’s too late to write a review of your own, you can send your
        feedback to Savva using your Airbnb message thread.
      </Text>
      <Button
        :style="button"
        href="https://airbnb.com/"
      >
        Send My Feedback
      </Button>
    </Row>

  </Layout>
</template>

<script lang="ts" setup>
import type { CSSProperties } from "vue";
import {
  Button,
  Row,
  Text,
} from "@vue-email/components";
import Layout from "./components/Layout.vue";


const heading:CSSProperties = {
  fontSize: "27px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};
const paragraph: CSSProperties = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const review:CSSProperties = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
  padding: "24px",
  backgroundColor: "#f2f3f3",
  borderRadius: "4px",
};

const button:CSSProperties = {
  backgroundColor: "#0a6972",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "18px",
  paddingTop: "19px",
  paddingBottom: "19px",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  width: "100%",
}
</script>
