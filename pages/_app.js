import "../styles/globals.css";
import "../styles/globals.css";
import theme from "@/design/theme";
import { ThemeProvider } from "@mui/material/styles";
import { PersistGate } from "redux-persist/integration/react";
import { useStore } from "react-redux";
import { wrapper } from "@/redux/store";
import { DefaultSeo, NextSeo } from "next-seo";

function MyApp({ Component, pageProps }) {
  const store = useStore((state) => state);

  return (
    <>
      {" "}
      <ThemeProvider theme={theme}>
        <PersistGate
          persistor={store._persistor}
          loading={<div>loading...</div>}
        >
          <DefaultSeo
            titleTemplate=" %s | NoCodePsych"
            defaultTitle="NoCodePsych"
            description="No-code solution for web-baesd experiments"
            openGraph={{
              url: "https://nocodepsych.junkwak.com",
              title: "NoCodePsych",
              description: "No-code solution for web-baesd experiments",
              images: [
                // {
                //   url: "/mintandwear.png",
                //   width: 1512,
                //   height: 950,
                //   alt: "Mint & Wear",
                // },
              ],
            }}
          />
          <Component {...pageProps} />
        </PersistGate>
      </ThemeProvider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
