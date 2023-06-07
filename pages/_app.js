import { ChakraProvider } from "@chakra-ui/react";
import LayoutWrapper from "../src/components/core/LayoutWrapper";
import { mynewtheme } from "../src/theme";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Airtel</title>
      </Head>
      <ChakraProvider resetCSS theme={mynewtheme}>
        <LayoutWrapper>
          <Component {...pageProps} />
        </LayoutWrapper>
      </ChakraProvider>

    </>
  );
}

export default MyApp;