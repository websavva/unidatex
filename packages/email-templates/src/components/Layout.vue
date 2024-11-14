<template>
  <Html>
    <Head>
      <title>
        {{ previewText }}
      </title>

      <Font
        font-family="Open Sans"
        fallback-font-family="Verdana"
        :web-font="{
          url: 'https://fonts.gstatic.com/s/inter/v18/UcCm3FwrK3iLTcvnUwQT9mI1F54.woff22',
          format: 'woff2',
        }"
        :font-weight="200"
        font-style="normal"
      />
    </Head>

    <Preview>
      {{ previewText }}
    </Preview>

    <Body :style="bodyStyle">
      <Container>
        <Section>
          <Img
            src="/logo.svg"
            alt="Logo"
            :style="{ margin: 'auto' }"
          />
        </Section>

        <Section :style="{ paddingBottom: '20px' }">
          <slot />
        </Section>

        <Section>
          <Row>
            <Hr :style="hrStyle" />

            <Text :style="footerStyle">
              UniDateX, {{ currentYear }}
            </Text>

            <Link
              href="https://airbnb.com"
              :style="browseLinkStyle"
            >
              Browse to the website.
            </Link>
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { Html, Head, Preview, Font, Body, Section, Img, Row, Text, Hr, Link } from '@vue-email/components'

import { Container } from './Container';

import { fontFamily } from '@/styles';

defineProps({
  previewText: String,
});

const currentYear = new Date().getFullYear();

const bodyStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  fontFamily
};

const hrStyle: CSSProperties = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const browseLinkStyle:CSSProperties = {
  fontSize: "14px",
  color: "#9ca299",
  textDecoration: "underline",
};

const footerStyle: CSSProperties = {
  color: "#9ca299",
  fontSize: "14px",
  marginBottom: "10px",
};
</script>
