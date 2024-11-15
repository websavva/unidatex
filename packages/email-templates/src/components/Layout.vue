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
            :src="logoUrl"
            alt="Logo"
            :style="{
              height: '40px',
              marginBottom: '40px'
            }"
          />
        </Section>

        <Section :style="{ paddingBottom: '20px' }">
          <Heading>
            <slot name="heading" />
          </Heading>

          <Hr
            :style="{
              ...hrStyle,
              margin: '16px 0 16px 0'
            }"
          />

          <slot />
        </Section>

        <Section>
          <Row>
            <Hr :style="hrStyle" />

            <Text :style="footerStyle"> UniDateX, {{ currentYear }} </Text>

            <Link
              :href="browseLinkUrl"
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
import { Heading } from './Heading';

import { fontFamily } from '@/styles';
import { createUrl } from '@/utils/create-link';

defineProps({
  previewText: String,
});

const currentYear = new Date().getFullYear();

const bodyStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  fontFamily,
};

const hrStyle: CSSProperties = {
  borderColor: "#d1d1d1",
  margin: "20px 0",
};

const browseLinkStyle: CSSProperties = {
  fontSize: "14px",
  color: "#9ca299",
  textDecoration: "underline",
};

const footerStyle: CSSProperties = {
  color: "#9ca299",
  fontSize: "14px",
  marginBottom: "10px",
};

const logoUrl = createUrl('/logo.svg');

const browseLinkUrl = import.meta.env.UNDX_BASE_URL;
</script>
